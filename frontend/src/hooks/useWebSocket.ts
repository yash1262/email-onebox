import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useEmailStore } from '../store/emailStore';

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    url = `ws://${window.location.hostname}:3000/ws`,
    autoConnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  
  const queryClient = useQueryClient();
  const { setEmails, emails } = useEmailStore();

  // Handle incoming messages
  const handleMessage = useCallback((message: WebSocketMessage) => {
    setLastMessage(message);

    switch (message.type) {
      case 'connected':
        console.log('✅ WebSocket connected:', message.payload.message);
        break;

      case 'new_email':
        console.log('📧 New email received:', message.payload);
        // Add new email to the store
        setEmails([message.payload, ...emails]);
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['emails'] });
        queryClient.invalidateQueries({ queryKey: ['emailStats'] });
        // Show notification (optional)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Email', {
            body: `From: ${message.payload.from}\nSubject: ${message.payload.subject}`,
            icon: '/email-icon.png'
          });
        }
        break;

      case 'email_update':
        console.log('🔄 Email updated:', message.payload);
        // Update email in store
        const updatedEmails = emails.map(email =>
          email.id === message.payload.emailId
            ? { ...email, ...message.payload.updates }
            : email
        );
        setEmails(updatedEmails);
        queryClient.invalidateQueries({ queryKey: ['emails'] });
        break;

      case 'sync_status':
        console.log('🔄 Sync status:', message.payload);
        // Update sync status in UI
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        break;

      case 'sync_complete':
        console.log('✅ Sync completed:', message.payload);
        // Refresh emails after sync
        queryClient.invalidateQueries({ queryKey: ['emails'] });
        queryClient.invalidateQueries({ queryKey: ['emailStats'] });
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        break;

      case 'email_categorized':
        console.log('🏷️ Email categorized:', message.payload);
        // Update email category
        const categorizedEmails = emails.map(email =>
          email.id === message.payload.emailId
            ? { ...email, category: message.payload.category }
            : email
        );
        setEmails(categorizedEmails);
        break;

      case 'heartbeat':
        // Silent heartbeat to keep connection alive
        break;

      case 'pong':
        // Response to ping
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }, [emails, setEmails, queryClient]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    console.log('Connecting to WebSocket:', url);
    setConnectionStatus('connecting');

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connection established');
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;

        // Send initial ping
        sendMessage({ type: 'ping', payload: {} });
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionStatus('error');
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        wsRef.current = null;

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`
          );
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, [url, reconnectInterval, maxReconnectAttempts, handleMessage]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      console.log('Disconnecting WebSocket...');
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  // Send message to WebSocket server
  const sendMessage = useCallback((message: Partial<WebSocketMessage>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        type: message.type || 'message',
        payload: message.payload || {},
        timestamp: new Date().toISOString()
      };
      wsRef.current.send(JSON.stringify(fullMessage));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  // Subscribe to specific events
  const subscribe = useCallback((channel: string) => {
    sendMessage({
      type: 'subscribe',
      payload: { channel }
    });
  }, [sendMessage]);

  // Unsubscribe from events
  const unsubscribe = useCallback((channel: string) => {
    sendMessage({
      type: 'unsubscribe',
      payload: { channel }
    });
  }, [sendMessage]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    connect,
    disconnect,
    sendMessage,
    subscribe,
    unsubscribe
  };
};

// Hook for specific WebSocket features
export const useEmailUpdates = () => {
  const { isConnected, subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    if (isConnected) {
      subscribe('emails');
      subscribe('sync');
    }

    return () => {
      unsubscribe('emails');
      unsubscribe('sync');
    };
  }, [isConnected, subscribe, unsubscribe]);

  return { isConnected };
};

// Hook for real-time sync status
export const useSyncStatus = () => {
  const [syncingAccounts, setSyncingAccounts] = useState<Set<string>>(new Set());
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type === 'sync_status') {
      const { accountEmail, status } = lastMessage.payload;
      
      setSyncingAccounts(prev => {
        const newSet = new Set(prev);
        if (status === 'syncing') {
          newSet.add(accountEmail);
        } else {
          newSet.delete(accountEmail);
        }
        return newSet;
      });
    }
  }, [lastMessage]);

  return { syncingAccounts };
};
