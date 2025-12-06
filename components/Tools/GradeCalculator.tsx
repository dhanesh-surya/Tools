import React, { useState } from 'react';
import { Plus, Trash2, Calculator, TrendingUp, Award, BookOpen, Download, BarChart3 } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

interface Assignment {
  id: string;
  name: string;
  score: number;
  totalPoints: number;
  weight: number;
}

const GRADE_SCALE: { [key: string]: number } = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

const GradeCalculator: React.FC = () => {
  const [mode, setMode] = useState<'gpa' | 'course'>('gpa');

  // GPA Calculator State
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({
    name: '',
    credits: 3,
    grade: 'A',
    gradePoint: 4.0,
  });

  // Course Grade Calculator State
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentAssignment, setCurrentAssignment] = useState<Partial<Assignment>>({
    name: '',
    score: 0,
    totalPoints: 100,
    weight: 20,
  });
  const [desiredGrade, setDesiredGrade] = useState(90);

  // GPA Calculator Functions
  const addCourse = () => {
    if (!currentCourse.name) {
      alert('Please enter a course name');
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      name: currentCourse.name,
      credits: currentCourse.credits || 3,
      grade: currentCourse.grade || 'A',
      gradePoint: currentCourse.gradePoint || 4.0,
    };

    setCourses([...courses, newCourse]);
    setCurrentCourse({ name: '', credits: 3, grade: 'A', gradePoint: 4.0 });
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateGradePoint = (grade: string) => {
    setCurrentCourse({
      ...currentCourse,
      grade,
      gradePoint: GRADE_SCALE[grade] || 0,
    });
  };

  const calculateGPA = () => {
    if (courses.length === 0) return { gpa: 0, totalCredits: 0 };

    const totalPoints = courses.reduce((sum, course) => sum + (course.gradePoint * course.credits), 0);
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

    return {
      gpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
      totalCredits,
    };
  };

  // Course Grade Calculator Functions
  const addAssignment = () => {
    if (!currentAssignment.name) {
      alert('Please enter an assignment name');
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      name: currentAssignment.name,
      score: currentAssignment.score || 0,
      totalPoints: currentAssignment.totalPoints || 100,
      weight: currentAssignment.weight || 20,
    };

    setAssignments([...assignments, newAssignment]);
    setCurrentAssignment({ name: '', score: 0, totalPoints: 100, weight: 20 });
  };

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const calculateCurrentGrade = () => {
    if (assignments.length === 0) return { grade: 0, totalWeight: 0 };

    const weightedScore = assignments.reduce((sum, assignment) => {
      const percentage = (assignment.score / assignment.totalPoints) * 100;
      return sum + (percentage * assignment.weight / 100);
    }, 0);

    const totalWeight = assignments.reduce((sum, assignment) => sum + assignment.weight, 0);

    return {
      grade: totalWeight > 0 ? weightedScore : 0,
      totalWeight,
    };
  };

  const calculateRequiredScore = () => {
    const current = calculateCurrentGrade();
    const remainingWeight = 100 - current.totalWeight;

    if (remainingWeight <= 0) {
      return { required: 0, possible: false, message: 'All assignments completed' };
    }

    const requiredPoints = desiredGrade - current.grade;
    const requiredPercentage = (requiredPoints / remainingWeight) * 100;

    return {
      required: Math.max(0, requiredPercentage),
      possible: requiredPercentage <= 100,
      message: requiredPercentage <= 100
        ? `You need to score ${requiredPercentage.toFixed(1)}% on remaining assignments`
        : 'Target grade is not achievable with current scores',
    };
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  };

  const exportGrades = () => {
    const data = mode === 'gpa'
      ? { type: 'GPA', courses, gpa: calculateGPA() }
      : { type: 'Course', assignments, currentGrade: calculateCurrentGrade() };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const gpaData = calculateGPA();
  const currentGrade = calculateCurrentGrade();
  const requiredScore = calculateRequiredScore();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
            <Calculator className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Grade Calculator</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Calculate GPA and course grades with precision
        </p>
      </div>

      {/* Mode Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('gpa')}
            className={`px-6 py-4 rounded-xl font-bold transition-all ${mode === 'gpa'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            GPA Calculator
          </button>
          <button
            onClick={() => setMode('course')}
            className={`px-6 py-4 rounded-xl font-bold transition-all ${mode === 'course'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
          >
            <BookOpen className="w-6 h-6 mx-auto mb-2" />
            Course Grade
          </button>
        </div>
      </div>

      {mode === 'gpa' ? (
        /* GPA Calculator */
        <>
          {/* GPA Display */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-sm text-green-700 dark:text-green-300 font-semibold mb-2">Your GPA</div>
                <div className="text-6xl font-bold text-green-900 dark:text-green-100">
                  {gpaData.gpa.toFixed(2)}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 mt-2">/ 4.00</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-green-700 dark:text-green-300 font-semibold mb-2">Total Credits</div>
                <div className="text-6xl font-bold text-green-900 dark:text-green-100">
                  {gpaData.totalCredits}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-green-700 dark:text-green-300 font-semibold mb-2">Status</div>
                <div className="flex items-center justify-center mt-4">
                  {gpaData.gpa >= 3.5 ? (
                    <div className="px-4 py-2 bg-green-600 text-white rounded-full font-bold flex items-center gap-2">
                      <Award size={20} />
                      Excellent
                    </div>
                  ) : gpaData.gpa >= 3.0 ? (
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold">
                      Good
                    </div>
                  ) : gpaData.gpa >= 2.0 ? (
                    <div className="px-4 py-2 bg-yellow-600 text-white rounded-full font-bold">
                      Fair
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-red-600 text-white rounded-full font-bold">
                      Needs Improvement
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Add Course */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Plus size={24} />
              Add Course
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  value={currentCourse.name}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Calculus I"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Credits
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={currentCourse.credits}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, credits: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Grade
                </label>
                <select
                  value={currentCourse.grade}
                  onChange={(e) => updateGradePoint(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {Object.keys(GRADE_SCALE).map(grade => (
                    <option key={grade} value={grade}>{grade} ({GRADE_SCALE[grade].toFixed(1)})</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={addCourse}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Course
            </button>
          </div>

          {/* Courses List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Courses ({courses.length})
              </h2>
              <button
                onClick={exportGrades}
                disabled={courses.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No courses added yet. Add your first course above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Course</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Credits</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Grade</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Points</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{course.name}</td>
                        <td className="py-3 px-4 text-center text-slate-700 dark:text-slate-300">{course.credits}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full font-bold text-sm ${course.gradePoint >= 3.7 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                              course.gradePoint >= 3.0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                course.gradePoint >= 2.0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            }`}>
                            {course.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-700 dark:text-slate-300">{course.gradePoint.toFixed(1)}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Course Grade Calculator */
        <>
          {/* Current Grade Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-8">
              <div className="text-center">
                <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold mb-2">Current Grade</div>
                <div className="text-6xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                  {currentGrade.grade.toFixed(1)}%
                </div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {getLetterGrade(currentGrade.grade)}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  Based on {currentGrade.totalWeight}% of total grade
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                  Desired Final Grade (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={desiredGrade}
                  onChange={(e) => setDesiredGrade(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-purple-300 dark:border-purple-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-bold text-2xl text-center"
                />
              </div>
              <div className={`p-4 rounded-xl ${requiredScore.possible
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                <div className="font-bold mb-1">Required Score:</div>
                <div className="text-3xl font-bold">{requiredScore.required.toFixed(1)}%</div>
                <div className="text-sm mt-2">{requiredScore.message}</div>
              </div>
            </div>
          </div>

          {/* Add Assignment */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Plus size={24} />
              Add Assignment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Assignment Name
                </label>
                <input
                  type="text"
                  value={currentAssignment.name}
                  onChange={(e) => setCurrentAssignment({ ...currentAssignment, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Midterm Exam"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Score / Total
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={currentAssignment.score}
                    onChange={(e) => setCurrentAssignment({ ...currentAssignment, score: parseFloat(e.target.value) || 0 })}
                    className="w-1/2 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    min="1"
                    value={currentAssignment.totalPoints}
                    onChange={(e) => setCurrentAssignment({ ...currentAssignment, totalPoints: parseFloat(e.target.value) || 100 })}
                    className="w-1/2 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Weight (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={currentAssignment.weight}
                  onChange={(e) => setCurrentAssignment({ ...currentAssignment, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={addAssignment}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Assignment
            </button>
          </div>

          {/* Assignments List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Assignments ({assignments.length})
              </h2>
              <button
                onClick={exportGrades}
                disabled={assignments.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
            </div>

            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No assignments added yet. Add your first assignment above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Assignment</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Percentage</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Weight</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Contribution</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map(assignment => {
                      const percentage = (assignment.score / assignment.totalPoints) * 100;
                      const contribution = (percentage * assignment.weight) / 100;
                      return (
                        <tr key={assignment.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{assignment.name}</td>
                          <td className="py-3 px-4 text-center text-slate-700 dark:text-slate-300">
                            {assignment.score}/{assignment.totalPoints}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full font-bold text-sm ${percentage >= 90 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                percentage >= 80 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                  percentage >= 70 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              }`}>
                              {percentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-slate-700 dark:text-slate-300">{assignment.weight}%</td>
                          <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                            {contribution.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => deleteAssignment(assignment.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GradeCalculator;