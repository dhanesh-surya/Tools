import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Target, TrendingUp, Settings as SettingsIcon, BarChart3, Plus } from 'lucide-react';

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  completedAt: Date;
}

interface Settings {
  studyDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartStudy: boolean;
  soundEnabled: boolean;
}

type TimerMode = 'study' | 'shortBreak' | 'longBreak';

const StudyTimer: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    studyDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartStudy: false,
    soundEnabled: true,
  });

  const [mode, setMode] = useState<TimerMode>('study');
  const [timeLeft, setTimeLeft] = useState(settings.studyDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentSubject, setCurrentSubject] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (settings.soundEnabled) {
      // Play notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAy2Ezv/poVYZ');
      audio.play().catch(() => { });
    }

    if (mode === 'study') {
      // Save completed study session
      if (currentSubject) {
        const newSession: StudySession = {
          id: Date.now().toString(),
          subject: currentSubject,
          duration: settings.studyDuration,
          completedAt: new Date(),
        };
        setSessions([newSession, ...sessions]);
      }

      setCompletedSessions(prev => prev + 1);

      // Determine next mode
      const nextMode = (completedSessions + 1) % settings.sessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(nextMode === 'longBreak' ? settings.longBreakDuration * 60 : settings.shortBreakDuration * 60);

      if (settings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      // Break completed, return to study mode
      setMode('study');
      setTimeLeft(settings.studyDuration * 60);

      if (settings.autoStartStudy) {
        setIsRunning(true);
      }
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const duration = mode === 'study'
      ? settings.studyDuration
      : mode === 'shortBreak'
        ? settings.shortBreakDuration
        : settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    const duration = newMode === 'study'
      ? settings.studyDuration
      : newMode === 'shortBreak'
        ? settings.shortBreakDuration
        : settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    // Reset timer with new settings
    const duration = mode === 'study'
      ? newSettings.studyDuration
      : mode === 'shortBreak'
        ? newSettings.shortBreakDuration
        : newSettings.longBreakDuration;
    setTimeLeft(duration * 60);
    setShowSettings(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => new Date(s.completedAt).toDateString() === today);
    const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    return { sessions: todaySessions.length, minutes: totalMinutes };
  };

  const getSubjectBreakdown = () => {
    const breakdown: { [key: string]: number } = {};
    sessions.forEach(s => {
      breakdown[s.subject] = (breakdown[s.subject] || 0) + s.duration;
    });
    return Object.entries(breakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const progress = mode === 'study'
    ? ((settings.studyDuration * 60 - timeLeft) / (settings.studyDuration * 60)) * 100
    : mode === 'shortBreak'
      ? ((settings.shortBreakDuration * 60 - timeLeft) / (settings.shortBreakDuration * 60)) * 100
      : ((settings.longBreakDuration * 60 - timeLeft) / (settings.longBreakDuration * 60)) * 100;

  const todayStats = getTodayStats();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
            <Clock className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Study Timer</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Pomodoro technique timer to boost your study productivity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mode Selector */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => switchMode('study')}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${mode === 'study'
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                <Target className="w-5 h-5 mx-auto mb-1" />
                Study
              </button>
              <button
                onClick={() => switchMode('shortBreak')}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${mode === 'shortBreak'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                <Coffee className="w-5 h-5 mx-auto mb-1" />
                Short Break
              </button>
              <button
                onClick={() => switchMode('longBreak')}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${mode === 'longBreak'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                <Coffee className="w-5 h-5 mx-auto mb-1" />
                Long Break
              </button>
            </div>
          </div>

          {/* Timer Display */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            {/* Subject Input */}
            {mode === 'study' && (
              <div className="mb-6">
                <input
                  type="text"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  placeholder="What are you studying?"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center font-semibold"
                />
              </div>
            )}

            {/* Circular Progress */}
            <div className="relative w-80 h-80 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 140}`}
                  strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
                  className={`transition-all duration-1000 ${mode === 'study'
                      ? 'text-orange-600'
                      : mode === 'shortBreak'
                        ? 'text-green-600'
                        : 'text-blue-600'
                    }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-7xl font-bold ${mode === 'study'
                    ? 'text-orange-600'
                    : mode === 'shortBreak'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                  {mode === 'study' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleTimer}
                className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-105 flex items-center gap-2 ${mode === 'study'
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                    : mode === 'shortBreak'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  }`}
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="px-6 py-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>

            {/* Session Counter */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                <span className="text-sm text-slate-600 dark:text-slate-400">Sessions completed:</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {completedSessions} / {settings.sessionsBeforeLongBreak}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Settings Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-4 py-3 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <BarChart3 size={18} />
                Stats
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-3 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <SettingsIcon size={18} />
                Settings
              </button>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-6">
            <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Today's Progress
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-orange-700 dark:text-orange-300 mb-1">Study Sessions</div>
                <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{todayStats.sessions}</div>
              </div>
              <div>
                <div className="text-sm text-orange-700 dark:text-orange-300 mb-1">Total Minutes</div>
                <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{todayStats.minutes}</div>
              </div>
            </div>
          </div>

          {/* Subject Breakdown */}
          {showStats && sessions.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Top Subjects</h3>
              <div className="space-y-2">
                {getSubjectBreakdown().map(([subject, minutes], index) => (
                  <div key={subject} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{subject}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{minutes}m</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Study Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.studyDuration}
                    onChange={(e) => setSettings({ ...settings, studyDuration: parseInt(e.target.value) || 25 })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.shortBreakDuration}
                    onChange={(e) => setSettings({ ...settings, shortBreakDuration: parseInt(e.target.value) || 5 })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.longBreakDuration}
                    onChange={(e) => setSettings({ ...settings, longBreakDuration: parseInt(e.target.value) || 15 })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Sessions before long break
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={settings.sessionsBeforeLongBreak}
                    onChange={(e) => setSettings({ ...settings, sessionsBeforeLongBreak: parseInt(e.target.value) || 4 })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Auto-start breaks</span>
                  <input
                    type="checkbox"
                    checked={settings.autoStartBreaks}
                    onChange={(e) => setSettings({ ...settings, autoStartBreaks: e.target.checked })}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Auto-start study</span>
                  <input
                    type="checkbox"
                    checked={settings.autoStartStudy}
                    onChange={(e) => setSettings({ ...settings, autoStartStudy: e.target.checked })}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sound notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;