import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tasksAPI, notificationsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Trash2, Clock, Bell, Link as LinkIcon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const [taskResponse, notificationsResponse] = await Promise.all([
        tasksAPI.getById(id),
        notificationsAPI.getByTaskId(id),
      ]);
      setTask(taskResponse.data);
      setNotifications(notificationsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch task details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(id);
      toast.success('Task deleted');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete task');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{task.name}</h1>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                task.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {task.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/tasks/${id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {task.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Description</h3>
                <p className="text-gray-900 mt-1">{task.description}</p>
              </div>
            )}

            {task.source_link && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Source Link
                </h3>
                <a
                  href={task.source_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 mt-1 block"
                >
                  {task.source_link}
                </a>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Schedule
                </h3>
                <p className="text-gray-900 mt-1">
                  {task.schedule_human || task.schedule_cron || 'No schedule set'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Recipients
                </h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {task.recipients?.map((recipient, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm">
                      {recipient}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {task.message_template && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Message Template</h3>
                <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded">{task.message_template}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Last Run:</span>{' '}
                <span className="text-gray-900">
                  {task.last_run ? new Date(task.last_run).toLocaleString() : 'Never'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Next Run:</span>{' '}
                <span className="text-gray-900">
                  {task.next_run ? new Date(task.next_run).toLocaleString() : 'Not scheduled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification History</h2>

          {notifications.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No notifications sent yet</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(notification.status)}
                      <span className="font-medium text-gray-900">{notification.recipient}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{notification.message}</p>
                  {notification.error_message && (
                    <p className="text-red-600 text-sm mt-2">Error: {notification.error_message}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>Provider: {notification.provider}</span>
                    <span>Status: {notification.status}</span>
                    {notification.retry_count > 0 && (
                      <span>Retries: {notification.retry_count}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TaskDetails;

