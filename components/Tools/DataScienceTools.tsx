import React, { useState } from 'react';
import { Database, BarChart3, Calculator, TrendingUp, Copy } from 'lucide-react';

const DataScienceTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stats');

  const tabs = [
    { id: 'stats', label: 'Statistics', icon: Calculator },
    { id: 'correlation', label: 'Correlation', icon: TrendingUp },
    { id: 'visualizer', label: 'Visualizer', icon: BarChart3 },
    { id: 'sample', label: 'Sample Size', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white border-b-2 border-primary'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        {activeTab === 'stats' && <StatisticalCalculator />}
        {activeTab === 'correlation' && <CorrelationCalculator />}
        {activeTab === 'visualizer' && <DataVisualizer />}
        {activeTab === 'sample' && <SampleSizeCalculator />}
      </div>
    </div>
  );
};

const StatisticalCalculator: React.FC = () => {
  const [data, setData] = useState('');
  const [results, setResults] = useState<any>(null);

  const calculateStats = () => {
    const numbers = data.split(/[\s,]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    
    if (numbers.length === 0) {
      setResults({ error: 'No valid numbers found' });
      return;
    }

    // Sort for median and quartiles
    const sorted = [...numbers].sort((a, b) => a - b);
    
    // Mean
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    
    // Median
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    
    // Mode
    const frequency: { [key: number]: number } = {};
    numbers.forEach(n => frequency[n] = (frequency[n] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency).filter(n => frequency[parseFloat(n)] === maxFreq).map(n => parseFloat(n));
    
    // Standard Deviation
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    const stdDev = Math.sqrt(variance);
    
    // Range
    const range = sorted[sorted.length - 1] - sorted[0];
    
    // Quartiles
    const q1Index = Math.floor(sorted.length / 4);
    const q3Index = Math.floor(3 * sorted.length / 4);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;
    
    // Min/Max
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    setResults({
      count: numbers.length,
      mean: mean.toFixed(4),
      median: median.toFixed(4),
      mode: mode.length === numbers.length ? 'No mode' : mode.join(', '),
      stdDev: stdDev.toFixed(4),
      variance: variance.toFixed(4),
      range: range.toFixed(4),
      min: min.toFixed(4),
      max: max.toFixed(4),
      q1: q1.toFixed(4),
      q3: q3.toFixed(4),
      iqr: iqr.toFixed(4)
    });
  };

  const copyResults = () => {
    if (results) {
      const text = Object.entries(results).map(([key, value]) => `${key}: ${value}`).join('\n');
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Statistical Calculator</h3>
      <div className="space-y-4">
        <textarea
          placeholder="Enter numbers separated by spaces or commas (e.g., 1 2 3, 4.5 6)"
          value={data}
          onChange={(e) => setData(e.target.value)}
          rows={6}
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
        />
        <button
          onClick={calculateStats}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Calculate Statistics
        </button>
        
        {results && (
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Statistical Results</h4>
              <button
                onClick={copyResults}
                className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <Copy size={16} />
                Copy
              </button>
            </div>
            {results.error ? (
              <p className="text-red-600 dark:text-red-400">{results.error}</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Count: {results.count}</div>
                <div>Mean: {results.mean}</div>
                <div>Median: {results.median}</div>
                <div>Mode: {results.mode}</div>
                <div>Std Deviation: {results.stdDev}</div>
                <div>Variance: {results.variance}</div>
                <div>Range: {results.range}</div>
                <div>Min: {results.min}</div>
                <div>Max: {results.max}</div>
                <div>Q1 (25%): {results.q1}</div>
                <div>Q3 (75%): {results.q3}</div>
                <div>IQR: {results.iqr}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CorrelationCalculator: React.FC = () => {
  const [dataX, setDataX] = useState('');
  const [dataY, setDataY] = useState('');
  const [results, setResults] = useState<any>(null);

  const calculateCorrelation = () => {
    const xValues = dataX.split(/[\s,]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    const yValues = dataY.split(/[\s,]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    
    if (xValues.length !== yValues.length || xValues.length < 2) {
      setResults({ error: 'Both datasets must have the same number of values (minimum 2)' });
      return;
    }

    const n = xValues.length;
    
    // Calculate means
    const meanX = xValues.reduce((sum, val) => sum + val, 0) / n;
    const meanY = yValues.reduce((sum, val) => sum + val, 0) / n;
    
    // Calculate Pearson correlation coefficient
    let numerator = 0;
    let sumX2 = 0;
    let sumY2 = 0;
    
    for (let i = 0; i < n; i++) {
      const diffX = xValues[i] - meanX;
      const diffY = yValues[i] - meanY;
      numerator += diffX * diffY;
      sumX2 += diffX * diffX;
      sumY2 += diffY * diffY;
    }
    
    const denominator = Math.sqrt(sumX2 * sumY2);
    const correlation = denominator === 0 ? 0 : numerator / denominator;
    
    // Determine strength
    let strength = 'No correlation';
    if (Math.abs(correlation) >= 0.8) strength = 'Strong correlation';
    else if (Math.abs(correlation) >= 0.6) strength = 'Moderate correlation';
    else if (Math.abs(correlation) >= 0.3) strength = 'Weak correlation';
    
    // Determine direction
    const direction = correlation > 0 ? 'positive' : correlation < 0 ? 'negative' : 'no';
    
    setResults({
      correlation: correlation.toFixed(4),
      strength,
      direction,
      n,
      meanX: meanX.toFixed(4),
      meanY: meanY.toFixed(4)
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Correlation Calculator</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Dataset X</label>
          <textarea
            placeholder="Enter X values separated by spaces or commas"
            value={dataX}
            onChange={(e) => setDataX(e.target.value)}
            rows={3}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Dataset Y</label>
          <textarea
            placeholder="Enter Y values separated by spaces or commas"
            value={dataY}
            onChange={(e) => setDataY(e.target.value)}
            rows={3}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>
        <button
          onClick={calculateCorrelation}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Calculate Correlation
        </button>
        
        {results && (
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-200">Correlation Results</h4>
            {results.error ? (
              <p className="text-red-600 dark:text-red-400">{results.error}</p>
            ) : (
              <div className="space-y-3">
                <div className="text-lg">
                  <span className="font-medium">Pearson Correlation: </span>
                  <span className={`font-bold ${results.correlation > 0 ? 'text-green-600' : results.correlation < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                    {results.correlation}
                  </span>
                </div>
                <div>Strength: {results.strength}</div>
                <div>Direction: {results.direction}</div>
                <div>Sample Size: {results.n}</div>
                <div>Mean X: {results.meanX}</div>
                <div>Mean Y: {results.meanY}</div>
                <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded border">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Interpretation: {results.strength.toLowerCase()} ({results.direction})
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DataVisualizer: React.FC = () => {
  const [data, setData] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState<any>(null);

  const generateChart = () => {
    const values = data.split(/[\s,]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    
    if (values.length === 0) {
      setChartData({ error: 'No valid numbers found' });
      return;
    }

    // For simplicity, create a simple ASCII chart
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;
    
    let chart = '';
    const height = 10;
    
    for (let i = height; i >= 0; i--) {
      const threshold = min + (range * i / height);
      let line = `${threshold.toFixed(1).padStart(6)} | `;
      
      values.forEach((value, index) => {
        if (value >= threshold) {
          line += '█ ';
        } else {
          line += '  ';
        }
      });
      
      chart += line + '\n';
    }
    
    // X-axis labels
    chart += '       ';
    values.forEach((_, index) => {
      chart += ` ${index + 1}`;
    });
    
    setChartData({
      values,
      count: values.length,
      max: max.toFixed(2),
      min: min.toFixed(2),
      mean: (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2),
      chart
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Data Visualizer</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Data Values</label>
          <textarea
            placeholder="Enter values separated by spaces or commas"
            value={data}
            onChange={(e) => setData(e.target.value)}
            rows={4}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="scatter">Scatter Plot</option>
          </select>
        </div>
        <button
          onClick={generateChart}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Chart
        </button>
        
        {chartData && (
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-200">Visualization Results</h4>
            {chartData.error ? (
              <p className="text-red-600 dark:text-red-400">{chartData.error}</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>Count: {chartData.count}</div>
                  <div>Max: {chartData.max}</div>
                  <div>Min: {chartData.min}</div>
                  <div>Mean: {chartData.mean}</div>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-slate-800 dark:text-slate-200">ASCII Chart:</h5>
                  <pre className="bg-white dark:bg-slate-800 p-3 rounded border font-mono text-xs overflow-x-auto">
                    {chartData.chart}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SampleSizeCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    confidence: 95,
    margin: 5,
    population: '',
    proportion: 50
  });
  const [results, setResults] = useState<any>(null);

  const calculateSampleSize = () => {
    const confidence = inputs.confidence / 100;
    const margin = inputs.margin / 100;
    const population = inputs.population ? parseInt(inputs.population) : null;
    const proportion = inputs.proportion / 100;

    // Z-score for confidence level
    const zScores: { [key: number]: number } = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    };
    
    const z = zScores[confidence] || 1.96;
    
    // Sample size formula for proportion
    const p = proportion;
    const q = 1 - p;
    const e = margin;
    
    let sampleSize = (z * z * p * q) / (e * e);
    
    // Finite population correction
    if (population && population > 0 && sampleSize > 0.05 * population) {
      sampleSize = sampleSize / (1 + (sampleSize - 1) / population);
    }
    
    // Round up
    const finalSampleSize = Math.ceil(sampleSize);
    
    setResults({
      sampleSize: finalSampleSize,
      z,
      confidence: (confidence * 100).toFixed(0),
      margin: (margin * 100).toFixed(1),
      proportion: (proportion * 100).toFixed(0),
      population: population || 'Infinite'
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Sample Size Calculator</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Confidence Level (%)</label>
            <select
              value={inputs.confidence}
              onChange={(e) => setInputs({...inputs, confidence: parseInt(e.target.value)})}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value={90}>90%</option>
              <option value={95}>95%</option>
              <option value={99}>99%</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Margin of Error (%)</label>
            <input
              type="number"
              value={inputs.margin}
              onChange={(e) => setInputs({...inputs, margin: parseFloat(e.target.value)})}
              min="0.1"
              max="20"
              step="0.1"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Population Size (optional)</label>
            <input
              type="number"
              value={inputs.population}
              onChange={(e) => setInputs({...inputs, population: e.target.value})}
              placeholder="Leave empty for infinite population"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Expected Proportion (%)</label>
            <input
              type="number"
              value={inputs.proportion}
              onChange={(e) => setInputs({...inputs, proportion: parseFloat(e.target.value)})}
              min="1"
              max="99"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            onClick={calculateSampleSize}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calculate Sample Size
          </button>
        </div>
        <div className="space-y-4">
          {results && (
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-200">Sample Size Results</h4>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-primary">{results.sampleSize.toLocaleString()}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Required sample size</div>
                <div className="border-t pt-3 space-y-2 text-sm">
                  <div>Confidence Level: {results.confidence}%</div>
                  <div>Margin of Error: ±{results.margin}%</div>
                  <div>Expected Proportion: {results.proportion}%</div>
                  <div>Population Size: {results.population}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataScienceTools;