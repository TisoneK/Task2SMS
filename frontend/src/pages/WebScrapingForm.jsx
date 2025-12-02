import React from 'react';
import { Info, Zap } from 'lucide-react';

function WebScrapingForm({ formData, onChange, isDark }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({ target: { name, value: type === 'checkbox' ? checked : value } });
  };

  // Use case examples for inspiration
  const useCaseExamples = [
    { icon: '⚡', title: 'Utility Balance', desc: 'Monitor KPLC token balance' },
    { icon: '📦', title: 'Shipment Tracking', desc: 'Track courier deliveries' },
    { icon: '💰', title: 'Price Alerts', desc: 'Watch product prices drop' },
    { icon: '🌤️', title: 'Weather Data', desc: 'Rainfall alerts for farms' },
    { icon: '📊', title: 'Exam Results', desc: 'Auto-check portal updates' },
    { icon: '💼', title: 'Job Postings', desc: 'New openings on career pages' },
  ];

  return (
    <div className="mt-6 space-y-6">
      {/* Inspiration Section */}
      <div className={`rounded-lg p-5 border ${
        isDark ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-700' 
              : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
      }`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
          isDark ? 'text-indigo-300' : 'text-indigo-900'
        }`}>
          <Info className="w-4 h-4" />
          Popular Web Scraping Use Cases
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {useCaseExamples.map((example, idx) => (
            <div 
              key={idx} 
              className={`rounded-lg p-2.5 ${
                isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-indigo-100'
              }`}
            >
              <div className="text-xl mb-0.5">{example.icon}</div>
              <div className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {example.title}
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {example.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Web Scraping Configuration
      </h3>

      {/* Basic Settings */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Target URL *
          </label>
          <input
            type="url"
            name="source_link"
            required
            value={formData.source_link || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="https://example.com/status"
          />
          <p className={`text-xs mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            The webpage you want to monitor
          </p>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Check Frequency *
          </label>
          <select
            name="web_scraping_frequency"
            required
            value={formData.web_scraping_frequency || 'hourly'}
            onChange={handleChange}
            className={`w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="every_5_minutes">Every 5 minutes ⚡ Premium</option>
            <option value="every_15_minutes">Every 15 minutes</option>
            <option value="every_30_minutes">Every 30 minutes</option>
            <option value="hourly">Every hour</option>
            <option value="every_6_hours">Every 6 hours</option>
            <option value="daily">Once daily</option>
          </select>
          <p className={`text-xs mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            More frequent checks use more credits
          </p>
        </div>
      </div>

      {/* Monitoring Mode */}
      <div>
        <label className={`block text-sm font-medium mb-3 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Monitoring Mode
        </label>
        <div className="grid md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onChange({ target: { name: 'web_scraping_mode', value: 'simple_text' } })}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              (formData.web_scraping_mode || 'simple_text') === 'simple_text'
                ? isDark 
                  ? 'border-indigo-500 bg-indigo-900/30' 
                  : 'border-indigo-500 bg-indigo-50'
                : isDark 
                  ? 'border-gray-600 bg-gray-700 hover:border-gray-500' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              <div className={`w-4 h-4 rounded-full mt-0.5 border-2 flex items-center justify-center ${
                (formData.web_scraping_mode || 'simple_text') === 'simple_text'
                  ? 'border-indigo-500 bg-indigo-500'
                  : isDark ? 'border-gray-500' : 'border-gray-300'
              }`}>
                {(formData.web_scraping_mode || 'simple_text') === 'simple_text' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className={`text-sm font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Simple Text</span>
            </div>
            <p className={`text-xs ml-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Best for beginners - monitor keywords anywhere on page
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChange({ target: { name: 'web_scraping_mode', value: 'css_selector' } })}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              formData.web_scraping_mode === 'css_selector'
                ? isDark 
                  ? 'border-indigo-500 bg-indigo-900/30' 
                  : 'border-indigo-500 bg-indigo-50'
                : isDark 
                  ? 'border-gray-600 bg-gray-700 hover:border-gray-500' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              <div className={`w-4 h-4 rounded-full mt-0.5 border-2 flex items-center justify-center ${
                formData.web_scraping_mode === 'css_selector'
                  ? 'border-indigo-500 bg-indigo-500'
                  : isDark ? 'border-gray-500' : 'border-gray-300'
              }`}>
                {formData.web_scraping_mode === 'css_selector' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className={`text-sm font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>CSS Selector</span>
            </div>
            <p className={`text-xs ml-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Target specific page elements with precision
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChange({ target: { name: 'web_scraping_mode', value: 'xpath' } })}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              formData.web_scraping_mode === 'xpath'
                ? isDark 
                  ? 'border-indigo-500 bg-indigo-900/30' 
                  : 'border-indigo-500 bg-indigo-50'
                : isDark 
                  ? 'border-gray-600 bg-gray-700 hover:border-gray-500' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              <div className={`w-4 h-4 rounded-full mt-0.5 border-2 flex items-center justify-center ${
                formData.web_scraping_mode === 'xpath'
                  ? 'border-indigo-500 bg-indigo-500'
                  : isDark ? 'border-gray-500' : 'border-gray-300'
              }`}>
                {formData.web_scraping_mode === 'xpath' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className={`text-sm font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>XPath</span>
            </div>
            <p className={`text-xs ml-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Advanced precision targeting
            </p>
          </button>
        </div>
      </div>

      {/* Mode-specific fields */}
      {(formData.web_scraping_mode || 'simple_text') === 'simple_text' && (
        <div className={`p-4 rounded-lg border ${
          isDark ? 'border-blue-700 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
        }`}>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Keyword/Phrase to Watch (Optional)
          </label>
          <input
            type="text"
            name="web_scraping_keyword"
            value={formData.web_scraping_keyword || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="e.g., 'Balance: ' or 'Out of Stock'"
          />
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Leave empty to monitor any page change, or specify text to watch for
          </p>
        </div>
      )}

      {formData.web_scraping_mode === 'css_selector' && (
        <div className={`p-4 rounded-lg border space-y-4 ${
          isDark ? 'border-blue-700 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
        }`}>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              CSS Selector *
            </label>
            <input
              type="text"
              name="web_scraping_selector"
              value={formData.web_scraping_selector || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder=".price, #balance, .status-text"
            />
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Examples: <span className={`font-mono px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-700' : 'bg-white'}`}>.price</span>, <span className={`font-mono px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-700' : 'bg-white'}`}>#status</span>, <span className={`font-mono px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-700' : 'bg-white'}`}>.notification:first-child</span>
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Specific Text (Optional)
            </label>
            <input
              type="text"
              name="web_scraping_keyword"
              value={formData.web_scraping_keyword || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Leave empty to monitor any change"
            />
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor specific text within selected element, or leave empty for any change
            </p>
          </div>
        </div>
      )}

      {formData.web_scraping_mode === 'xpath' && (
        <div className={`p-4 rounded-lg border space-y-4 ${
          isDark ? 'border-blue-700 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
        }`}>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              XPath Expression *
            </label>
            <input
              type="text"
              name="web_scraping_xpath"
              value={formData.web_scraping_xpath || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="//div[@class='price']/span"
            />
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Example: <span className={`font-mono px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-700' : 'bg-white'}`}>//div[@class='balance']</span>
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Specific Text (Optional)
            </label>
            <input
              type="text"
              name="web_scraping_keyword"
              value={formData.web_scraping_keyword || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Leave empty to monitor any change"
            />
          </div>
        </div>
      )}

      {/* Number Extraction & Threshold Settings */}
      <div className={`border-t pt-5 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`p-4 rounded-lg border ${
          isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-start gap-3 mb-3">
            <input
              type="checkbox"
              name="web_scraping_extract_numbers"
              id="extract_numbers"
              checked={formData.web_scraping_extract_numbers || false}
              onChange={handleChange}
              className={`mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
              }`}
            />
            <label htmlFor="extract_numbers" className="flex-1 cursor-pointer">
              <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                Monitor Numeric Values
              </div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Extract numbers to set threshold alerts (prices, balances, stock levels, temps)
              </div>
            </label>
          </div>

          {formData.web_scraping_extract_numbers && (
            <div className={`mt-4 pt-4 border-t space-y-4 ${
              isDark ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Alert When
                  </label>
                  <select
                    name="web_scraping_threshold_type"
                    value={formData.web_scraping_threshold_type || ''}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select condition...</option>
                    <option value="less_than">Number is less than</option>
                    <option value="greater_than">Number is greater than</option>
                    <option value="equals">Number equals</option>
                    <option value="changes">Number changes (any change)</option>
                  </select>
                </div>
                {formData.web_scraping_threshold_type && 
                 formData.web_scraping_threshold_type !== 'changes' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Threshold Value
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="web_scraping_threshold_value"
                      value={formData.web_scraping_threshold_value || ''}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="e.g., 100"
                    />
                  </div>
                )}
              </div>
              {formData.web_scraping_threshold_type && (
                <div className={`text-xs p-3 rounded ${
                  isDark ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-800'
                }`}>
                  <Zap className="w-3.5 h-3.5 inline mr-1" />
                  Example: Alert when balance falls below 100 KES or when price drops under 5000
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className={`rounded-lg p-4 border ${
        isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
      }`}>
        <h4 className={`text-sm font-semibold mb-2 ${
          isDark ? 'text-blue-300' : 'text-blue-900'
        }`}>
          💡 Quick Tips
        </h4>
        <ul className={`space-y-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <li>• <strong>Simple Text:</strong> Perfect for beginners - just enter a keyword or leave blank</li>
          <li>• <strong>CSS Selectors:</strong> Right-click element → Inspect → Copy selector</li>
          <li>• <strong>Numeric Monitoring:</strong> Great for prices, balances, temperatures, stock levels</li>
          <li>• <strong>Check Frequency:</strong> More frequent checks = faster alerts but uses more credits</li>
        </ul>
      </div>
    </div>
  );
}

export default WebScrapingForm;
