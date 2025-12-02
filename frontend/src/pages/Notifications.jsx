import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationsAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'queued':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'queued':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${isDark ? 'bg-gray-800 shadow-sm border-b border-gray-700' : 'bg-white shadow'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/dashboard" className={`flex items-center gap-2 ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>All Notifications</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading notifications...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-12 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No notifications yet</p>
          </div>
        ) : (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-6 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(notification.status)}
                      <div>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{notification.recipient}</div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(notification.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(notification.status)}`}>
                      {notification.status}
                    </span>
                  </div>

                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded p-3 mb-3`}>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>{notification.message}</p>
                  </div>

                  {notification.error_message && (
                    <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded p-3 mb-3">
                      <p className="text-red-400 text-sm">
                        <strong>Error:</strong> {notification.error_message}
                      </p>
                    </div>
                  )}

                  <div className={`flex flex-wrap gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>Provider: <strong>{notification.provider}</strong></span>
                    {notification.sent_at && (
                      <span>Sent: {new Date(notification.sent_at).toLocaleString()}</span>
                    )}
                    {notification.retry_count > 0 && (
                      <span>Retries: <strong>{notification.retry_count}</strong></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;

