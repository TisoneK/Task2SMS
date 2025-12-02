import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { tasksAPI, notificationsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, BarChart3, TrendingUp, TrendingDown, Bell, Smartphone,
  Clock, CheckCircle, XCircle, AlertCircle, Users, Activity, Zap,
  Calendar, Filter, Download
} from 'lucide-react';

function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    activeTasks: 0,
    totalNotifications: 0,
    successRate: 0,
    recentActivity: [],
    notificationsByProvider: {},
    notificationsByStatus: {},
    dailyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Fetch tasks and notifications to calculate analytics
      const [tasksResponse, notificationsResponse] = await Promise.all([
        tasksAPI.getAll(),
        notificationsAPI.getAll()
      ]);
      
      const tasks = tasksResponse.data;
      const notifications = notificationsResponse.data;
      
      // Calculate analytics
      const totalTasks = tasks.length;
      const activeTasks = tasks.filter(t => t.is_active).length;
      const totalNotifications = notifications.length;
      const successfulNotifications = notifications.filter(n => n.status === 'sent').length;
      const successRate = totalNotifications > 0 ? (successfulNotifications / totalNotifications * 100).toFixed(1) : 0;
      
      // Group notifications by provider
      const notificationsByProvider = notifications.reduce((acc, notification) => {
        acc[notification.provider] = (acc[notification.provider] || 0) + 1;
        return acc;
      }, {});
      
      // Group notifications by status
      const notificationsByStatus = notifications.reduce((acc, notification) => {
        acc[notification.status] = (acc[notification.status] || 0) + 1;
        return acc;
      }, {});
      
      // Recent activity (last 10 notifications)
      const recentActivity = notifications
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);
      
      // Generate daily stats for the last 7 days
      const dailyStats = generateDailyStats(notifications, timeRange);
      
      setAnalytics({
        totalTasks,
        activeTasks,
        totalNotifications,
        successRate,
        recentActivity,
        notificationsByProvider,
        notificationsByStatus,
        dailyStats
      });
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const generateDailyStats = (notifications, range) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 1;
    const stats = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayNotifications = notifications.filter(n => 
        n.created_at.startsWith(dateStr)
      );
      
      stats.push({
        date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        total: dayNotifications.length,
        successful: dayNotifications.filter(n => n.status === 'sent').length,
        failed: dayNotifications.filter(n => n.status === 'failed').length
      });
    }
    
    return stats;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'queued':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white shadow-sm border-b'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className={`flex items-center gap-2 ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <BarChart3 className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isDark ? 'text-gray-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'}`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Automations</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{analytics.totalTasks}</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {analytics.activeTasks} active
                </p>
              </div>
              <div className={`p-3 rounded-full ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                <Zap className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Notifications</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{analytics.totalNotifications}</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {timeRange === '1d' ? 'Last 24 hours' : timeRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{analytics.successRate}%</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {analytics.totalNotifications > 0 ?
                    `${Math.round(analytics.totalNotifications * analytics.successRate / 100)} successful` :
                    'No data'
                  }
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Failed Rate</p>
                <p className="text-2xl font-bold text-red-600">{(100 - analytics.successRate).toFixed(1)}%</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {analytics.totalNotifications > 0 ?
                    `${Math.round(analytics.totalNotifications * (100 - analytics.successRate) / 100)} failed` :
                    'No data'
                  }
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Activity Chart */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow p-6`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Daily Activity</h2>
            <div className="space-y-3">
              {analytics.dailyStats.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-16 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{day.date}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className={`flex-1 rounded-full h-6 relative ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="absolute left-0 top-0 h-full bg-green-500 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${day.total > 0 ? (day.successful / day.total * 100) : 0}%` }}
                      >
                        {day.successful > 0 && (
                          <span className="text-xs text-white font-medium">{day.successful}</span>
                        )}
                      </div>
                      {day.failed > 0 && (
                        <div
                          className="absolute right-0 top-0 h-full bg-red-500 rounded-full flex items-center pl-2"
                          style={{ width: `${day.total > 0 ? (day.failed / day.total * 100) : 0}%` }}
                        >
                          <span className="text-xs text-white font-medium">{day.failed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`w-12 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{day.total}</div>
                </div>
              ))}
            </div>
            <div className={`flex items-center gap-4 mt-4 pt-4 ${isDark ? 'border-t border-gray-700' : 'border-t'}`}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Successful</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Failed</span>
              </div>
            </div>
          </div>

          {/* Provider Distribution */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow p-6`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Provider Distribution</h2>
            <div className="space-y-3">
              {Object.entries(analytics.notificationsByProvider).map(([provider, count]) => (
                <div key={provider} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} capitalize`}>{provider.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-24 rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(count / analytics.totalNotifications * 100)}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm w-12 text-right ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow`}>
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
          </div>
          <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {analytics.recentActivity.length === 0 ? (
              <div className={`p-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No recent activity
              </div>
            ) : (
              analytics.recentActivity.map((notification) => (
                <div key={notification.id} className={`p-4 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(notification.status)}
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{notification.recipient}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{notification.message.substring(0, 100)}...</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} capitalize`}>{notification.provider.replace('_', ' ')}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Analytics;