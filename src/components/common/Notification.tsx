import React, { useEffect } from 'react';
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md';
import './Notification.css';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  isVisible,
  onClose,
  duration = 5000
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <MdCheckCircle size={20} />;
      case 'error':
        return <MdError size={20} />;
      case 'warning':
        return <MdWarning size={20} />;
      case 'info':
        return <MdInfo size={20} />;
      default:
        return <MdInfo size={20} />;
    }
  };

  return (
    <div className={`notification notification-${type} ${isVisible ? 'show' : 'hide'}`}>
      <div className="notification-icon">
        {getIcon()}
      </div>
      <div className="notification-content">
        <h4 className="notification-title">{title}</h4>
        <p className="notification-message">{message}</p>
      </div>
      <button className="notification-close" onClick={onClose}>
        <MdClose size={18} />
      </button>
    </div>
  );
}; 