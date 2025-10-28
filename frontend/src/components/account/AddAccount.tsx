import React, { useState } from 'react';
import { X, Mail, Lock, Server, Eye, EyeOff, Plus, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';

interface AddAccountProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface EmailProvider {
  name: string;
  host: string;
  port: number;
  icon: string;
}

const EMAIL_PROVIDERS: Record<string, EmailProvider> = {
  gmail: {
    name: 'Gmail',
    host: 'imap.gmail.com',
    port: 993,
    icon: '📧'
  },
  outlook: {
    name: 'Outlook',
    host: 'outlook.office365.com',
    port: 993,
    icon: '📨'
  },
  yahoo: {
    name: 'Yahoo',
    host: 'imap.mail.yahoo.com',
    port: 993,
    icon: '📬'
  },
  icloud: {
    name: 'iCloud',
    host: 'imap.mail.me.com',
    port: 993,
    icon: '☁️'
  },
  custom: {
    name: 'Custom IMAP',
    host: '',
    port: 993,
    icon: '⚙️'
  }
};

export const AddAccount: React.FC<AddAccountProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    host: '',
    port: 993,
    displayName: ''
  });

  const handleProviderSelect = (provider: string) => {
    setSelectedProvider(provider);
    const providerData = EMAIL_PROVIDERS[provider];
    setFormData(prev => ({
      ...prev,
      host: providerData.host,
      port: providerData.port
    }));
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) : value
    }));
    setError('');
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (selectedProvider === 'custom' && (!formData.host || !formData.port)) {
      setError('IMAP host and port are required for custom configuration');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to add account
      // In production, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success
      console.log('Account added:', formData);
      
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add account. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedProvider('');
    setFormData({
      email: '',
      password: '',
      host: '',
      port: 993,
      displayName: ''
    });
    setError('');
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Email Account" size="md">
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Select your email provider to get started
          </p>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(EMAIL_PROVIDERS).map(([key, provider]) => (
              <button
                key={key}
                onClick={() => handleProviderSelect(key)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{provider.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{provider.name}</p>
                    {key !== 'custom' && (
                      <p className="text-xs text-gray-500">{provider.host}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Important Security Note</p>
                <p>
                  For Gmail and Outlook, you'll need to use an{' '}
                  <strong>App Password</strong> instead of your regular password.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{EMAIL_PROVIDERS[selectedProvider].icon}</span>
              <span className="font-semibold text-gray-900">
                {EMAIL_PROVIDERS[selectedProvider].name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Change Provider
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Input
            label="Display Name (Optional)"
            name="displayName"
            type="text"
            placeholder="My Work Email"
            value={formData.displayName}
            onChange={handleInputChange}
            icon={<Mail size={20} className="text-gray-400" />}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="your-email@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            icon={<Mail size={20} className="text-gray-400" />}
          />

          <div className="relative">
            <Input
              label="Password / App Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              icon={<Lock size={20} className="text-gray-400" />}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {selectedProvider === 'custom' && (
            <>
              <Input
                label="IMAP Host"
                name="host"
                type="text"
                placeholder="imap.example.com"
                value={formData.host}
                onChange={handleInputChange}
                required
                icon={<Server size={20} className="text-gray-400" />}
              />

              <Input
                label="IMAP Port"
                name="port"
                type="number"
                placeholder="993"
                value={formData.port}
                onChange={handleInputChange}
                required
              />
            </>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How to get App Password:</strong>
            </p>
            <ul className="mt-2 text-sm text-blue-700 space-y-1 list-disc list-inside">
              {selectedProvider === 'gmail' && (
                <>
                  <li>Go to Google Account settings</li>
                  <li>Enable 2-Step Verification</li>
                  <li>Generate App Password under Security</li>
                </>
              )}
              {selectedProvider === 'outlook' && (
                <>
                  <li>Go to Microsoft Account security</li>
                  <li>Select "Advanced security options"</li>
                  <li>Generate App Password</li>
                </>
              )}
              {selectedProvider !== 'gmail' && selectedProvider !== 'outlook' && (
                <li>Check your email provider's security settings</li>
              )}
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Add Account'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
