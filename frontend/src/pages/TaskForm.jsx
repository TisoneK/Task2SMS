import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';
import WebScrapingForm from './WebScrapingForm';
import {
  ArrowLeft, Plus, X, Database, Filter, Smartphone, ArrowRight,
  Clock, Bell, Zap, CheckCircle
} from 'lucide-react';

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

const [currentStep, setCurrentStep] = useState(1);
const [selectedDataSource, setSelectedDataSource] = useState(null);

const [formData, setFormData] = useState({
    name: '',
    description: '',
    source_link: '', // Used for various data source URLs
    web_scraping_keyword: '', // New field for web scraping
    web_scraping_frequency: 'hourly', // New field for web scraping
    schedule_cron: '',
    schedule_human: '',
    recipients: [],
    condition_rules: { type: 'always' },
    message_template: '',
    is_active: true,
  });

// Available data sources with their configurations
const dataSources = [
  {
    id: 'web_scraping',
    name: 'Web Scraping',
    description: 'Monitor any public webpage for content changes',
    icon: Database,
    color: 'blue',
    examples: ['Utility bills', 'Price monitoring', 'Status checks', 'Weather data']
  },
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    description: 'Trigger SMS from spreadsheet changes',
    icon: Filter,
    color: 'green',
    examples: ['Stock alerts', 'School attendance', 'Sales reports', 'Project deadlines'],
    comingSoon: true
  },
  {
    id: 'email_imap',
    name: 'Email Inbox',
    description: 'Monitor Gmail/IMAP for triggers',
    icon: Smartphone,
    color: 'purple',
    examples: ['Bank alerts', 'Form submissions', 'Server notifications'],
    comingSoon: true
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    description: 'Receive data from 1000+ apps via webhooks',
    icon: Zap,
    color: 'yellow',
    examples: ['Payment success', 'IoT sensors', 'E-commerce orders'],
    comingSoon: true
  }
];

  const [recipientInput, setRecipientInput] = useState('');
  const [conditionType, setConditionType] = useState('always');
  const [conditionValue, setConditionValue] = useState('');
  const [conditionField, setConditionField] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    if (isEdit) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await tasksAPI.getById(id);
      const task = response.data;
      setFormData({
        ...task,
        data_source_type: task.data_source_type || 'web_scraping',
        web_scraping_keyword: task.web_scraping_keyword || '',
        web_scraping_frequency: task.web_scraping_frequency || 'hourly',
      });
      
      if (task.condition_rules) {
        setConditionType(task.condition_rules.type || 'always');
        setConditionValue(task.condition_rules.value || '');
        setConditionField(task.condition_rules.field || '');
      }
    } catch (error) {
      toast.error('Failed to fetch task');
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addRecipient = () => {
    if (recipientInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        recipients: [...prev.recipients, recipientInput.trim()],
      }));
      setRecipientInput('');
    }
  };

  const removeRecipient = (index) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index),
    }));
  };

  const buildConditionRules = () => {
    if (conditionType === 'always') {
      return { type: 'always' };
    }

    const rules = { type: conditionType };

    if (['total_over', 'total_under', 'field_greater_than', 'field_less_than'].includes(conditionType)) {
      rules.value = parseFloat(conditionValue) || 0;
    }

    if (['field_equals', 'field_contains', 'field_greater_than', 'field_less_than'].includes(conditionType)) {
      rules.field = conditionField;
      if (conditionType === 'field_equals' || conditionType === 'field_contains') {
        rules.value = conditionValue;
      }
    }

    return rules;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        condition_rules: buildConditionRules(),
      };

      if (isEdit) {
        await tasksAPI.update(id, submitData);
        toast.success('Automation updated successfully');
      } else {
        await tasksAPI.create(submitData);
        toast.success('Automation created successfully');
      }

      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save automation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/dashboard" className={`flex items-center gap-2 hover:transition-colors ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}>
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isEdit ? 'Edit Automation' : 'Create New Automation'}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Set up your SMS automation workflow with triggers, conditions, and actions
          </p>
        </div>

        {/* Workflow Visualization */}
        <div className={`rounded-lg shadow-sm border p-6 mb-8 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
            }`}>
              <Database className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>Data Source</span>
            </div>
            <ArrowRight className={`w-5 h-5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200'
            }`}>
              <Filter className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`font-medium ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>Conditions</span>
            </div>
            <ArrowRight className={`w-5 h-5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'
            }`}>
              <Smartphone className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`font-medium ${isDark ? 'text-green-300' : 'text-green-900'}`}>SMS Action</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Info */}
          <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                isDark ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
              }`}>1</div>
              Basic Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Automation Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Game Score Alerts"
                />
              </div>
            </div>

            {/* Data Source Selection - Card Based */}
            {!selectedDataSource ? (
              <div className="mt-6">
                <label className={`block text-sm font-medium mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Choose Data Source Type
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {dataSources.map((source) => {
                    const IconComponent = source.icon;
                    const colorClasses = {
                      blue: 'border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100',
                      green: 'border-green-300 bg-green-50 text-green-900 hover:bg-green-100',
                      purple: 'border-purple-300 bg-purple-50 text-purple-900 hover:bg-purple-100',
                      yellow: 'border-yellow-300 bg-yellow-50 text-yellow-900 hover:bg-yellow-100'
                    };

                    return (
                      <div
                        key={source.id}
                        onClick={() => {
                          if (!source.comingSoon) {
                            setSelectedDataSource(source.id);
                            handleChange({ target: { name: 'source_type', value: source.id } });
                          }
                        }}
                        className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          source.comingSoon
                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                            : `${colorClasses[source.color]} hover:scale-105`
                        }`}
                      >
                        {source.comingSoon && (
                          <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Coming Soon
                          </div>
                        )}

                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-md ${
                            source.comingSoon
                              ? 'bg-gray-300'
                              : source.color === 'blue' ? 'bg-blue-100' :
                                source.color === 'green' ? 'bg-green-100' :
                                source.color === 'purple' ? 'bg-purple-100' : 'bg-yellow-100'
                          }`}>
                            <IconComponent className={`w-6 h-6 ${
                              source.comingSoon
                                ? 'text-gray-500'
                                : source.color === 'blue' ? 'text-blue-600' :
                                  source.color === 'green' ? 'text-green-600' :
                                  source.color === 'purple' ? 'text-purple-600' : 'text-yellow-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{source.name}</h3>
                            <p className={`text-sm ${
                              source.comingSoon
                                ? 'text-gray-500'
                                : source.color === 'blue' ? 'text-blue-700' :
                                  source.color === 'green' ? 'text-green-700' :
                                  source.color === 'purple' ? 'text-purple-700' : 'text-yellow-700'
                            }`}>
                              {source.description}
                            </p>
                          </div>
                        </div>

                        {!source.comingSoon && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Use for:</span> {source.examples.join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Selected Data Source
                    </label>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const source = dataSources.find(s => s.id === selectedDataSource);
                        if (!source) return null;
                        const IconComponent = source.icon;
                        const colorClasses = {
                          blue: 'text-blue-600',
                          green: 'text-green-600',
                          purple: 'text-purple-600',
                          yellow: 'text-yellow-600'
                        };
                        return (
                          <>
                            <IconComponent className={`w-5 h-5 ${colorClasses[source.color]}`} />
                            <span className="font-medium">{source.name}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDataSource(null);
                      handleChange({ target: { name: 'source_type', value: '' } });
                    }}
                    className={`text-sm px-3 py-1 rounded-md hover:bg-gray-100 ${
                      isDark ? 'text-indigo-400 hover:bg-indigo-900' : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    Change Data Source
                  </button>
                </div>
              </div>
            )}

            {/* Import Data Source Form */}
            {selectedDataSource === 'web_scraping' && (
              <WebScrapingForm formData={formData} onChange={handleChange} isDark={isDark} />
            )}

            {/* API Polling Specific Fields */}
            {formData.data_source_type === 'api_polling' && (
              <div className="mt-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    API Endpoint URL *
                  </label>
                  <input
                    type="url"
                    name="source_link"
                    required
                    value={formData.source_link}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="e.g., https://api.example.com/data"
                  />
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    The API endpoint to poll for data.
                  </p>
                </div>
                {/* Add more API polling specific fields here if needed, e.g., API Key, Headers */}
              </div>
            )}

            <div className="mt-6">
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Describe what this automation does and when it should trigger..."
              />
            </div>
          </div>

          {/* Step 2: Trigger (Schedule) */}
          <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                isDark ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
              }`}>2</div>
              Trigger Schedule
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Human-Readable Schedule
                </label>
                <input
                  type="text"
                  name="schedule_human"
                  value={formData.schedule_human}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., every 1 hour, daily at 9am"
                />
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Describe when this should run in plain language
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Cron Expression
                </label>
                <input
                  type="text"
                  name="schedule_cron"
                  value={formData.schedule_cron}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., 0 * * * *"
                />
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Optional: Use cron format for precise scheduling
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Conditions */}
          <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                isDark ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
              }`}>3</div>
              Trigger Conditions
            </h2>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                When should this automation trigger?
              </label>
              <select
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value)}
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="always">Always trigger when data is fetched</option>
                <option value="total_over">When total score is over a value</option>
                <option value="total_under">When total score is under a value</option>
                <option value="field_equals">When a field equals a specific value</option>
                <option value="field_contains">When a field contains specific text</option>
                <option value="field_greater_than">When a field is greater than a value</option>
                <option value="field_less_than">When a field is less than a value</option>
              </select>

              {conditionType !== 'always' && (
                <div className={`grid md:grid-cols-2 gap-4 p-4 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  {['field_equals', 'field_contains', 'field_greater_than', 'field_less_than'].includes(conditionType) && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Field Name
                      </label>
                      <input
                        type="text"
                        value={conditionField}
                        onChange={(e) => setConditionField(e.target.value)}
                        className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                          isDark
                            ? 'bg-gray-600 border-gray-500 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="e.g., status, score, temperature"
                      />
                    </div>
                  )}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {['total_over', 'total_under', 'field_greater_than', 'field_less_than'].includes(conditionType) ? 'Value' : 'Text/Value'}
                    </label>
                    <input
                      type={['total_over', 'total_under', 'field_greater_than', 'field_less_than'].includes(conditionType) ? 'number' : 'text'}
                      value={conditionValue}
                      onChange={(e) => setConditionValue(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        isDark
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter value to compare against"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 4: Action (SMS) */}
          <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                isDark ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
              }`}>4</div>
              SMS Action
            </h2>
            
            {/* Recipients */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Recipients (Phone Numbers)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="tel"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRecipient())}
                  className={`flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="+254712345678"
                />
                <button
                  type="button"
                  onClick={addRecipient}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.recipients.map((recipient, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                      isDark ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {recipient}
                    <button
                      type="button"
                      onClick={() => removeRecipient(index)}
                      className={`${isDark ? 'hover:text-white' : 'hover:text-indigo-900'}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Message Template */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                SMS Message Template
              </label>
              <textarea
                name="message_template"
                value={formData.message_template}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Use {field_name} for dynamic values, e.g., {home_team} {home_score} - {away_team} {away_score}"
              />
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Use curly braces for dynamic fields from your data source
              </p>
            </div>
          </div>

          {/* Active Status */}
          <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Activation Status</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Control whether this automation is active or paused</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                  }`}
                />
                <label htmlFor="is_active" className={`ml-2 block text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {formData.is_active ? 'Automation is active' : 'Automation is paused'}
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {isEdit ? 'Update Automation' : 'Create Automation'}
                </>
              )}
            </button>
            <Link
              to="/dashboard"
              className={`px-6 py-3 border rounded-md ${
                isDark
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default TaskForm;
