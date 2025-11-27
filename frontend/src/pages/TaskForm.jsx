import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, X } from 'lucide-react';

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    source_link: '',
    schedule_cron: '',
    schedule_human: '',
    recipients: [],
    condition_rules: { type: 'always' },
    message_template: '',
    is_active: true,
  });

  const [recipientInput, setRecipientInput] = useState('');
  const [conditionType, setConditionType] = useState('always');
  const [conditionValue, setConditionValue] = useState('');
  const [conditionField, setConditionField] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await tasksAPI.getById(id);
      const task = response.data;
      setFormData(task);
      
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
        toast.success('Task updated successfully');
      } else {
        await tasksAPI.create(submitData);
        toast.success('Task created successfully');
      }

      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Task' : 'Create New Task'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Lakers vs Bulls"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Task description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Link (API URL)
            </label>
            <input
              type="url"
              name="source_link"
              value={formData.source_link}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://api.example.com/data"
            />
          </div>

          {/* Schedule */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule (Human Readable)
              </label>
              <input
                type="text"
                name="schedule_human"
                value={formData.schedule_human}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., every 1 hour"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule (Cron Expression)
              </label>
              <input
                type="text"
                name="schedule_cron"
                value={formData.schedule_cron}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 0 * * * *"
              />
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipients (Phone Numbers)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="tel"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRecipient())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full"
                >
                  {recipient}
                  <button
                    type="button"
                    onClick={() => removeRecipient(index)}
                    className="hover:text-indigo-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Condition Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Condition
            </label>
            <select
              value={conditionType}
              onChange={(e) => setConditionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
            >
              <option value="always">Always send</option>
              <option value="total_over">Total score over</option>
              <option value="total_under">Total score under</option>
              <option value="field_equals">Field equals value</option>
              <option value="field_contains">Field contains text</option>
              <option value="field_greater_than">Field greater than</option>
              <option value="field_less_than">Field less than</option>
            </select>

            {conditionType !== 'always' && (
              <div className="grid md:grid-cols-2 gap-4">
                {['field_equals', 'field_contains', 'field_greater_than', 'field_less_than'].includes(conditionType) && (
                  <input
                    type="text"
                    value={conditionField}
                    onChange={(e) => setConditionField(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Field name (e.g., status)"
                  />
                )}
                <input
                  type={['total_over', 'total_under', 'field_greater_than', 'field_less_than'].includes(conditionType) ? 'number' : 'text'}
                  value={conditionValue}
                  onChange={(e) => setConditionValue(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Value"
                />
              </div>
            )}
          </div>

          {/* Message Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Template
            </label>
            <textarea
              name="message_template"
              value={formData.message_template}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Use {field_name} for dynamic values, e.g., {home_team} {home_score} - {away_team} {away_score}"
            />
            <p className="text-sm text-gray-500 mt-1">
              Use curly braces for dynamic fields from your data source
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Task is active
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
            </button>
            <Link
              to="/dashboard"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
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

