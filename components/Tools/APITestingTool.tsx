import React, { useState } from 'react';
import { Send, Play, Code, Clock, CheckCircle, XCircle, Copy } from 'lucide-react';

const APITestingTool: React.FC = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const sendRequest = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const startTime = Date.now();

      // Prepare headers
      const requestHeaders: { [key: string]: string } = {};
      headers.forEach(header => {
        if (header.key.trim() && header.value.trim()) {
          requestHeaders[header.key.trim()] = header.value.trim();
        }
      });

      // Prepare request options
      const options: RequestInit = {
        method,
        headers: requestHeaders,
      };

      // Add body for non-GET requests
      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        options.body = body;
        if (!requestHeaders['Content-Type']) {
          requestHeaders['Content-Type'] = 'application/json';
        }
      }

      const response = await fetch(url, options);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let responseBody;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }

      const responseData = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseBody,
        responseTime,
        size: JSON.stringify(responseBody).length,
        timestamp: new Date().toISOString()
      };

      setResponse(responseData);

      // Add to history
      const historyItem = {
        id: Date.now(),
        method,
        url,
        status: response.status,
        responseTime,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10

    } catch (error: any) {
      setResponse({
        error: true,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponseBody = (body: any) => {
    if (typeof body === 'string') return body;
    return JSON.stringify(body, null, 2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const loadFromHistory = (item: any) => {
    setMethod(item.method);
    setUrl(item.url);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">API Testing Tool</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Method and URL */}
            <div className="flex gap-3 mb-4">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium"
              >
                {methods.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
              <button
                onClick={sendRequest}
                disabled={isLoading || !url.trim()}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Clock size={18} className="animate-spin" /> : <Send size={18} />}
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>

            {/* Headers */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-800 dark:text-slate-200">Headers</h4>
                <button
                  onClick={addHeader}
                  className="text-primary hover:text-blue-700 text-sm font-medium"
                >
                  + Add Header
                </button>
              </div>
              <div className="space-y-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Header name"
                      value={header.key}
                      onChange={(e) => updateHeader(index, 'key', e.target.value)}
                      className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Header value"
                      value={header.value}
                      onChange={(e) => updateHeader(index, 'value', e.target.value)}
                      className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                    />
                    {headers.length > 1 && (
                      <button
                        onClick={() => removeHeader(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Request Body */}
            {['POST', 'PUT', 'PATCH'].includes(method) && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-800 dark:text-slate-200">Request Body</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBody(JSON.stringify({ key: 'value' }, null, 2))}
                      className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      JSON Template
                    </button>
                    <button
                      onClick={() => setBody('')}
                      className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter request body (JSON, XML, etc.)"
                  rows={8}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-mono text-sm"
                />
              </div>
            )}
          </div>

          {/* Request History */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <h4 className="font-medium mb-3 text-slate-800 dark:text-slate-200">Recent Requests</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status >= 200 && item.status < 300 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        item.status >= 400 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {item.method}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-48">
                        {item.url}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${
                        item.status >= 200 && item.status < 300 ? 'text-green-600' :
                        item.status >= 400 ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-slate-400">{item.responseTime}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Response Panel */}
        <div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 min-h-96">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-800 dark:text-slate-200">Response</h4>
                {response && !response.error && (
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-sm ${
                      response.status >= 200 && response.status < 300 ? 'text-green-600' :
                      response.status >= 400 ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {response.status >= 200 && response.status < 300 ? <CheckCircle size={16} /> :
                       response.status >= 400 ? <XCircle size={16} /> : <Clock size={16} />}
                      {response.status} {response.statusText}
                    </span>
                    <span className="text-xs text-slate-400">{response.responseTime}ms</span>
                    <span className="text-xs text-slate-400">{response.size} bytes</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4">
              {!response ? (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                  <Code size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Send a request to see the response</p>
                </div>
              ) : response.error ? (
                <div className="text-center py-8">
                  <XCircle size={48} className="mx-auto mb-4 text-red-500" />
                  <p className="text-red-600 dark:text-red-400 font-medium">Request Failed</p>
                  <p className="text-red-500 dark:text-red-300 text-sm mt-2">{response.message}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Response Headers */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-slate-700 dark:text-slate-300">Headers</h5>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(response.headers, null, 2))}
                        className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-1"
                      >
                        <Copy size={12} />
                        Copy
                      </button>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm font-mono max-h-32 overflow-y-auto">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="mb-1">
                          <span className="text-blue-600 dark:text-blue-400">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Response Body */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-slate-700 dark:text-slate-300">Body</h5>
                      <button
                        onClick={() => copyToClipboard(formatResponseBody(response.body))}
                        className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-1"
                      >
                        <Copy size={12} />
                        Copy
                      </button>
                    </div>
                    <pre className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm font-mono max-h-64 overflow-y-auto whitespace-pre-wrap">
                      {formatResponseBody(response.body)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITestingTool;