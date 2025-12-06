import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(breakDuration * 60);
        setCycles(cycles + 1);
      } else {
        setIsBreak(false);
        setTimeLeft(workDuration * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, workDuration, breakDuration, cycles]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workDuration * 60);
  };

  const startTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Pomodoro Timer</h2>
        <p className="text-slate-600 dark:text-slate-400">Boost your productivity with focused work sessions</p>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-center text-white mb-6">
        <div className="text-6xl font-bold mb-4">{formatTime(timeLeft)}</div>
        <div className="text-xl opacity-90">
          {isBreak ? 'Break Time' : 'Work Session'}
        </div>
        <div className="text-sm opacity-75 mt-2">
          Completed Cycles: {cycles}
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={startTimer}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center gap-2 px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Work Duration (minutes)
          </label>
          <input
            type="number"
            value={workDuration}
            onChange={(e) => setWorkDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
            min="1"
            max="60"
          />
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Break Duration (minutes)
          </label>
          <input
            type="number"
            value={breakDuration}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
            min="1"
            max="30"
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How to Use:</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Set your work and break durations</li>
          <li>• Click Start to begin a work session</li>
          <li>• Take a break when the timer ends</li>
          <li>• Repeat for maximum productivity!</li>
        </ul>
      </div>
    </div>
  );
};

export default PomodoroTimer;