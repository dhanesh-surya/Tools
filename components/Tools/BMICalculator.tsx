import React, { useState } from 'react';
import { Calculator, User, Ruler, Weight } from 'lucide-react';

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      alert('Please enter valid height and weight values');
      return;
    }

    let bmiValue: number;

    if (unit === 'metric') {
      // Height in cm, weight in kg
      const heightInMeters = h / 100;
      bmiValue = w / (heightInMeters * heightInMeters);
    } else {
      // Height in inches, weight in pounds
      bmiValue = (w / (h * h)) * 703;
    }

    setBmi(Math.round(bmiValue * 10) / 10);

    // Determine category
    if (bmiValue < 18.5) {
      setCategory('Underweight');
    } else if (bmiValue < 25) {
      setCategory('Normal weight');
    } else if (bmiValue < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Underweight': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'Normal weight': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'Overweight': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'Obese': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-900/20';
    }
  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setCategory('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">BMI Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400">Calculate your Body Mass Index and health metrics</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        {/* Unit Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setUnit('metric')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              unit === 'metric'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Metric (cm/kg)
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              unit === 'imperial'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Imperial (in/lbs)
          </button>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Ruler size={16} />
              Height ({unit === 'metric' ? 'cm' : 'inches'})
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === 'metric' ? '170' : '68'}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Weight size={16} />
              Weight ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === 'metric' ? '70' : '150'}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={calculateBMI}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Calculator size={20} />
            Calculate BMI
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Results */}
        {bmi !== null && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {bmi}
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                {category}
              </div>
            </div>

            {/* BMI Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-semibold text-blue-600 dark:text-blue-400">Underweight</div>
                <div className="text-slate-600 dark:text-slate-400">&lt; 18.5</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-semibold text-green-600 dark:text-green-400">Normal</div>
                <div className="text-slate-600 dark:text-slate-400">18.5 - 24.9</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="font-semibold text-yellow-600 dark:text-yellow-400">Overweight</div>
                <div className="text-slate-600 dark:text-slate-400">25 - 29.9</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="font-semibold text-red-600 dark:text-red-400">Obese</div>
                <div className="text-slate-600 dark:text-slate-400">≥ 30</div>
              </div>
            </div>
          </div>
        )}

        {/* Health Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Health Tips:</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• BMI is a screening tool, not a diagnostic tool</li>
            <li>• Consult healthcare professionals for personalized advice</li>
            <li>• Focus on overall health, not just BMI numbers</li>
            <li>• Regular exercise and balanced diet are key to wellness</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;