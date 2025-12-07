import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, TrendingUp, Calendar, Target, Award, Download } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  category: string;
  color: string;
  goal: number; // days per week
  completions: { [date: string]: boolean };
  streak: number;
  bestStreak: number;
}

type Category = 'health' | 'productivity' | 'learning' | 'fitness' | 'mindfulness' | 'other';

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'health' as Category, goal: 7 });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState<'today' | 'week'>('today');

  const categories = [
    { id: 'health' as Category, name: 'Health', color: '#10b981', icon: '💊' },
    { id: 'productivity' as Category, name: 'Productivity', color: '#3b82f6', icon: '⚡' },
    { id: 'learning' as Category, name: 'Learning', color: '#8b5cf6', icon: '📚' },
    { id: 'fitness' as Category, name: 'Fitness', color: '#ef4444', icon: '💪' },
    { id: 'mindfulness' as Category, name: 'Mindfulness', color: '#f59e0b', icon: '🧘' },
    { id: 'other' as Category, name: 'Other', color: '#6b7280', icon: '✨' },
  ];

  const getColorClasses = (hex: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; bgLight: string; textDark: string } } = {
      '#10b981': { bg: 'bg-green-500', text: 'text-green-500', bgLight: 'bg-green-100 dark:bg-green-900/20', textDark: 'text-green-600 dark:text-green-400' },
      '#3b82f6': { bg: 'bg-blue-500', text: 'text-blue-500', bgLight: 'bg-blue-100 dark:bg-blue-900/20', textDark: 'text-blue-600 dark:text-blue-400' },
      '#8b5cf6': { bg: 'bg-purple-500', text: 'text-purple-500', bgLight: 'bg-purple-100 dark:bg-purple-900/20', textDark: 'text-purple-600 dark:text-purple-400' },
      '#ef4444': { bg: 'bg-red-500', text: 'text-red-500', bgLight: 'bg-red-100 dark:bg-red-900/20', textDark: 'text-red-600 dark:text-red-400' },
      '#f59e0b': { bg: 'bg-yellow-500', text: 'text-yellow-500', bgLight: 'bg-yellow-100 dark:bg-yellow-900/20', textDark: 'text-yellow-600 dark:text-yellow-400' },
      '#6b7280': { bg: 'bg-gray-500', text: 'text-gray-500', bgLight: 'bg-gray-100 dark:bg-gray-900/20', textDark: 'text-gray-600 dark:text-gray-400' },
    };
    return colorMap[hex] || { bg: 'bg-gray-500', text: 'text-gray-500', bgLight: 'bg-gray-100 dark:bg-gray-900/20', textDark: 'text-gray-600 dark:text-gray-400' };
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      category: newHabit.category,
      color: categories.find(c => c.id === newHabit.category)!.color,
      goal: newHabit.goal,
      completions: {},
      streak: 0,
      bestStreak: 0,
    };

    setHabits([...habits, habit]);
    setNewHabit({ name: '', category: 'health', goal: 7 });
  };

  const toggleHabit = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompletions = { ...habit.completions };
        newCompletions[date] = !newCompletions[date];

        // Calculate streak
        const streak = calculateStreak(newCompletions);
        const bestStreak = Math.max(habit.bestStreak, streak);

        return { ...habit, completions: newCompletions, streak, bestStreak };
      }
      return habit;
    }));
  };

  const calculateStreak = (completions: { [date: string]: boolean }): number => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      if (completions[dateStr]) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const getWeeklyProgress = (habit: Habit) => {
    const last7 = getLast7Days();
    const completed = last7.filter(date => habit.completions[date]).length;
    return Math.round((completed / habit.goal) * 100);
  };

  const getTotalCompletions = (habit: Habit) => {
    return Object.values(habit.completions).filter(Boolean).length;
  };

  const exportData = () => {
    const data = {
      habits,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDayDate = (dateStr: string) => {
    return new Date(dateStr).getDate();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
            <Target className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Habit Tracker</h1>
        <p className="text-slate-600 dark:text-slate-400">Build better habits, track your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add New Habit */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add New Habit</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Habit name (e.g., Morning Exercise)"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500"
              />
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value as Category })}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
              <select
                value={newHabit.goal}
                onChange={(e) => setNewHabit({ ...newHabit, goal: parseInt(e.target.value) })}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                  <option key={n} value={n}>{n}x/week</option>
                ))}
              </select>
              <button
                onClick={addHabit}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Plus size={20} />Add
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('today')}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${view === 'today'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
            >
              Today
            </button>
            <button
              onClick={() => setView('week')}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${view === 'week'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
            >
              Week View
            </button>
          </div>

          {/* Habits List */}
          {view === 'today' ? (
            <div className="space-y-3">
              {habits.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center">
                  <Target className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-400 dark:text-slate-500 mb-2">No Habits Yet</h3>
                  <p className="text-slate-500 dark:text-slate-400">Add your first habit to start tracking!</p>
                </div>
              ) : (
                habits.map(habit => (
                  <div
                    key={habit.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleHabit(habit.id, selectedDate)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${habit.completions[selectedDate]
                            ? 'bg-green-600 text-white scale-110'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200'
                          }`}
                      >
                        <Check size={24} className={habit.completions[selectedDate] ? 'animate-bounce' : ''} />
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white">{habit.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getColorClasses(habit.color).bgLight} ${getColorClasses(habit.color).textDark}`}>
                            {categories.find(c => c.id === habit.category)?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Award size={14} />
                            {habit.streak} day streak
                          </span>
                          <span>🏆 Best: {habit.bestStreak}</span>
                          <span>✅ Total: {getTotalCompletions(habit)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                        <span>Weekly Goal: {habit.goal}x</span>
                        <span>{getWeeklyProgress(habit)}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getColorClasses(habit.color).bg}`}
                          style={{
                            width: `${Math.min(getWeeklyProgress(habit), 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Last 7 Days</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">Habit</th>
                      {getLast7Days().map(date => (
                        <th key={date} className="text-center py-3 px-2">
                          <div className="text-xs text-slate-500 dark:text-slate-400">{getDayName(date)}</div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{getDayDate(date)}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map(habit => (
                      <tr key={habit.id} className="border-b border-slate-100 dark:border-slate-700/50">
                        <td className="py-3 px-2">
                          <div className="font-semibold text-slate-900 dark:text-white">{habit.name}</div>
                          <div className="text-xs text-slate-500">{habit.streak} day streak</div>
                        </td>
                        {getLast7Days().map(date => (
                          <td key={date} className="text-center py-3 px-2">
                            <button
                              onClick={() => toggleHabit(habit.id, date)}
                              className={`w-10 h-10 rounded-lg transition-all ${habit.completions[date]
                                  ? 'bg-green-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'
                                }`}
                            >
                              {habit.completions[date] && <Check size={18} />}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Date Selector */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Calendar size={18} />
              Select Date
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-6">
            <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              Overall Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-200">Total Habits:</span>
                <span className="font-bold text-green-900 dark:text-green-100">{habits.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-200">Completed Today:</span>
                <span className="font-bold text-green-900 dark:text-green-100">
                  {habits.filter(h => h.completions[selectedDate]).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-200">Best Streak:</span>
                <span className="font-bold text-green-900 dark:text-green-100">
                  {Math.max(...habits.map(h => h.bestStreak), 0)} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-200">Total Completions:</span>
                <span className="font-bold text-green-900 dark:text-green-100">
                  {habits.reduce((sum, h) => sum + getTotalCompletions(h), 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">By Category</h3>
            <div className="space-y-2">
              {categories.map(cat => {
                const count = habits.filter(h => h.category === cat.id).length;
                if (count === 0) return null;
                return (
                  <div key={cat.id} className={`flex items-center justify-between p-2 rounded-lg ${getColorClasses(cat.color).bgLight}`}>
                    <span className={`text-sm font-medium ${getColorClasses(cat.color).textDark}`}>
                      {cat.icon} {cat.name}
                    </span>
                    <span className={`font-bold ${getColorClasses(cat.color).textDark}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export */}
          <button
            onClick={exportData}
            className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Export Data
          </button>

          {/* Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3">💡 Tips</h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1.5">
              <li>• Start with 2-3 habits</li>
              <li>• Be consistent, not perfect</li>
              <li>• Track daily for best results</li>
              <li>• Celebrate small wins</li>
              <li>• Adjust goals as needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;