import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ type, message }) => {
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
      type === 'success' ? 'bg-green-500/10 text-green-500' :
      type === 'error' ? 'bg-red-500/10 text-red-500' :
      'bg-yellow-500/10 text-yellow-500'
    }`}>
      {type === 'success' && <CheckCircle size={20} />}
      {type === 'error' && <XCircle size={20} />}
      {type === 'info' && <AlertCircle size={20} />}
      <span>{message}</span>
    </div>
  );
};

export default Notification;