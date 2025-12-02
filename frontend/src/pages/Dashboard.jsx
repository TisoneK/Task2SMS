import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Plus, LogOut, Bell, Clock, ToggleLeft, ToggleRight, Trash2, Edit, Eye,
  Zap, Activity, AlertCircle, CheckCircle, TrendingUp, Users, BarChart3,
  ArrowRight, Database, Smartphone, Filter, PlayCircle, PauseCircle, Moon, Sun
} from 'lucide-react';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalNotifications: 0
  });
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getAll();
      const tasksData = response.data;
      setTasks(tasksData);
      
      // Calculate stats
      setStats({
        total: tasksData.length,
        active: tasksData.filter(t => t.is_active).length,
        inactive: tasksData.filter(t => !t.is_active).length,
        totalNotifications: tasksData.reduce((sum, task) => sum + (task.recipients?.length || 0), 0)
      });
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (taskId) => {
    try {
      await tasksAPI.toggle(taskId);
      toast.success('Automation status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update automation');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this automation?')) {
      return;
    }

    try {
      await tasksAPI.delete(taskId);
      toast.success('Automation deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete automation');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getConditionIcon = (conditionType) => {
    switch (conditionType?.type) {
      case 'always':
        return <PlayCircle className="w-4 h-4 text-green-600" />;
      case 'total_over':
      case 'total_under':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'field_equals':
      case 'field_contains':
      case 'field_greater_than':
      case 'field_less_than':
        return <Filter className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConditionText = (conditionRules) => {
    if (!conditionRules || conditionRules.type === 'always') {
      return 'Always trigger';
    }
    
    switch (conditionRules.type) {
      case 'total_over':
        return `When total > ${conditionRules.value}`;
      case 'total_under':
        return `When total < ${conditionRules.value}`;
      case 'field_equals':
        return `When ${conditionRules.field} = ${conditionRules.value}`;
      case 'field_contains':
        return `When ${conditionRules.field} contains "${conditionRules.value}"`;
      case 'field_greater_than':
        return `When ${conditionRules.field} > ${conditionRules.value}`;
      case 'field_less_than':
        return `When ${conditionRules.field} < ${conditionRules.value}`;
      default:
        return 'Custom condition';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white shadow-sm border-b'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 sm:mb-0">
              <div className="flex items-center gap-2">
                <Zap className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Task2SMS</h1>
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Automation Platform</span>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 items-center">
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link
                to="/analytics"
                className={`flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-md transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:text-indigo-400'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline">Analytics</span>
              </Link>
              <Link
                to="/notifications"
                className={`flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-md transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:text-indigo-400'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="hidden sm:inline">Notifications</span>
              </Link>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-md transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:text-red-400'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.username}!
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Manage your SMS automations and monitor their performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Automations</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
              </div>
              <div className={`p-3 rounded-full ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                <Zap className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <PlayCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Inactive</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stats.inactive}</p>
              </div>
              <div className={`p-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <PauseCircle className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Recipients</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.totalNotifications}</p>
              </div>
              <div className={`p-3 rounded-full ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                <Users className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Automations Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Automations</h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Create and manage your SMS automation workflows</p>
          </div>
          <Link
            to="/tasks/new"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Create Automation
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading automations...</div>
          </div>
        ) : tasks.length === 0 ? (
          <div className={`text-center py-12 rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="max-w-md mx-auto">
              <Zap className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No automations yet</h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Create your first SMS automation to connect data sources with SMS notifications
              </p>
              <Link
                to="/tasks/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Plus className="w-5 h-5" />
                Create Your First Automation
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div key={task.id} className={`rounded-lg shadow-sm border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Automation Header */}
                <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{task.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          task.is_active
                            ? 'bg-green-100 text-green-800'
                            : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {task.is_active ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <PauseCircle className="w-3 h-3" />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                      {task.description && (
                        <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.description}</p>
                      )}
                       
                      {/* Workflow Visualization */}
                      <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="flex items-center gap-1">
                          <Database className="w-4 h-4" />
                          <span>Data Source</span>
                        </div>
                        <ArrowRight className="w-4 h-4" />
                        <div className="flex items-center gap-1">
                          {getConditionIcon(task.condition_rules)}
                          <span>{getConditionText(task.condition_rules)}</span>
                        </div>
                        <ArrowRight className="w-4 h-4" />
                        <div className="flex items-center gap-1">
                          <Smartphone className="w-4 h-4" />
                          <span>SMS to {task.recipients?.length || 0} recipients</span>
                        </div>
                      </div>
                    </div>
                   
                    <button
                      onClick={() => handleToggle(task.id)}
                      className={`ml-4 ${isDark ? 'text-gray-500 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'}`}
                    >
                      {task.is_active ? (
                        <ToggleRight className="w-8 h-8 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Automation Details */}
                <div className={`px-6 py-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Clock className="w-4 h-4" />
                      <span>Schedule: {task.schedule_human || task.schedule_cron || 'Manual'}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Bell className="w-4 h-4" />
                      <span>{task.recipients?.length || 0} recipients</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Activity className="w-4 h-4" />
                      <span>Last run: {task.last_run ? new Date(task.last_run).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className={`px-6 py-3 border-t ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/tasks/${task.id}`}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:transition-colors ${
                        isDark
                          ? 'bg-gray-600 border-gray-500 text-gray-200 hover:bg-gray-500'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    <Link
                      to={`/tasks/${task.id}/edit`}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

