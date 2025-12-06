import React from 'react';

const PackingListGenerator: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PackingListGenerator</h2>
        <p className="text-slate-600 dark:text-slate-400">Tool coming soon!</p>
      </div>
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
        </div>
        <p className="text-slate-500">This tool is under development</p>
      </div>
    </div>
  );
};

export default PackingListGenerator;