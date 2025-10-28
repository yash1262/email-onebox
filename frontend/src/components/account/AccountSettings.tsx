import React, { useState } from 'react';
import {
  Settings,
  Mail,
  RefreshCw,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { useAccounts, useAccountSync } from '../../hooks/useAccounts';
import { Loader } from '../common/Loader';

interface AccountSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ isOpen, onClose }) => {
  const { data: accounts, isLoading } = useAccounts();
  const syncMutation = useAccountSync();
  
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    displayName: '',
    syncInterval: 5
  });

  const handleEdit = (email: string) => {
    setEditingAccount(email);
    // Load current data
    setEditData({
      displayName: email.split('@')[0],
      syncInterval: 5
    });
  };

  const handleSaveEdit = (email: string) => {
    // Save changes (API call would go here)
    console.log('Saving account settings:', email, editData);
    setEditingAccount(null);
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
    setEditData({
      displayName: '',
      syncInterval: 5
    });
  };

  const handleSync = (email: string) => {
    syncMutation.mutate({ email });
  };

  const handleDelete = (email: string) => {
    setDeleteConfirm(email);
  };

  const confirmDelete = (email: string) => {
    // Delete account (API call would go here)
    console.log('Deleting account:', email);
    setDeleteConfirm(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'syncing':
        return <RefreshCw size={20} className="text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle size={20} className="text-red-500" />;
      default:
        return <AlertTriangle size={20} className="text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'syncing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Account Settings" size="lg">
        <Loader />
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Settings" size="lg">
      <div className="space-y-4">
        {accounts && accounts.length > 0 ? (
          accounts.map((account) => (
            <div
              key={account.email}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {editingAccount === account.email ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Mail size={20} />
                      {account.email}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(account.email)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  <Input
                    label="Display Name"
                    value={editData.displayName}
                    onChange={(e) =>
                      setEditData({ ...editData, displayName: e.target.value })
                    }
                    placeholder="My Work Email"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sync Interval (minutes)
                    </label>
                    <select
                      value={editData.syncInterval}
                      onChange={(e) =>
                        setEditData({ ...editData, syncInterval: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>Every minute</option>
                      <option value={5}>Every 5 minutes</option>
                      <option value={15}>Every 15 minutes</option>
                      <option value={30}>Every 30 minutes</option>
                      <option value={60}>Every hour</option>
                    </select>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail size={20} className="text-gray-600" />
                        <h3 className="font-semibold text-gray-900">{account.email}</h3>
                      </div>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(
                          account.status
                        )}`}
                      >
                        {getStatusIcon(account.status)}
                        <span className="font-medium">{getStatusText(account.status)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(account.email)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit settings"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleSync(account.email)}
                        disabled={syncMutation.isPending}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Sync now"
                      >
                        <RefreshCw
                          size={18}
                          className={syncMutation.isPending ? 'animate-spin' : ''}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(account.email)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove account"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {account.lastSync && (
                    <div className="text-sm text-gray-500 mt-2">
                      Last synced: {new Date(account.lastSync).toLocaleString()}
                    </div>
                  )}

                  {account.totalEmails !== undefined && (
                    <div className="text-sm text-gray-500">
                      Total emails: {account.totalEmails.toLocaleString()}
                    </div>
                  )}

                  {/* Delete Confirmation */}
                  {deleteConfirm === account.email && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-red-900 mb-2">
                            Remove this account?
                          </p>
                          <p className="text-sm text-red-700 mb-3">
                            This will stop syncing emails from {account.email}. Your existing
                            emails will not be deleted.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => confirmDelete(account.email)}
                            >
                              Yes, Remove
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Mail size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">No email accounts configured</p>
            <Button onClick={onClose}>Add Your First Account</Button>
          </div>
        )}

        {accounts && accounts.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Account Management Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Use app-specific passwords for better security</li>
                <li>Regularly sync to keep emails up to date</li>
                <li>Remove unused accounts to improve performance</li>
                <li>Check connection status if emails stop syncing</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
