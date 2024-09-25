import { useEffect } from 'react';
import PropTypes from 'prop-types';
import '/src/Components/css/notification.css';

const Notification = ({ message, onClose, type }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getNotificationClass = () => {
        switch (type) {
            case 'success':
                return 'NotificationSuccess';
            case 'info':
                return 'NotificationInfo';
            case 'warning':
                return 'NotificationWarning';
            case 'error':
                return 'NotificationError';
            default:
                return '';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <i className="ri-check-line"></i>;
            case 'info':
                return <i className="ri-information-line"></i>;
            case 'warning':
                return <i className="ri-warning-line"></i>;
            case 'error':
                return <i className="ri-close-line"></i>;
            default:
                return null;
        }
    };

    return (
        <div className={`NotificationContainer ${getNotificationClass()}`}>
            {getIcon()}
            <p className="NotificationMessage">{message}</p>
        </div>
    );
};

Notification.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    type: PropTypes.string
};

export default Notification;