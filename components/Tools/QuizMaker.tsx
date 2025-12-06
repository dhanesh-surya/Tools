import React, { useState } from 'react';
import { Plus, Trash2, Copy, Download, Play, Check, X, HelpCircle, Edit2, Save, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category?: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: { questionId: string; correct: boolean; selectedAnswer: number }[];
}

const QuizMaker: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    category: 'General',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizTitle, setQuizTitle] = useState('My Quiz');

  const addQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options?.some(opt => !opt.trim())) {
      alert('Please fill in the question and all options');
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      question: currentQuestion.question,
      options: currentQuestion.options as string[],
      correctAnswer: currentQuestion.correctAnswer || 0,
      explanation: currentQuestion.explanation,
      category: currentQuestion.category,
    };

    setQuestions([...questions, newQuestion]);
    resetForm();
  };

  const updateQuestion = () => {
    if (!editingId) return;

    setQuestions(questions.map(q =>
      q.id === editingId
        ? {
          ...q,
          question: currentQuestion.question || q.question,
          options: currentQuestion.options || q.options,
          correctAnswer: currentQuestion.correctAnswer ?? q.correctAnswer,
          explanation: currentQuestion.explanation,
          category: currentQuestion.category,
        }
        : q
    ));
    resetForm();
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const editQuestion = (question: Question) => {
    setCurrentQuestion(question);
    setIsEditing(true);
    setEditingId(question.id);
  };

  const resetForm = () => {
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      category: 'General',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const startQuiz = () => {
    setIsPreview(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizResult(null);
  };

  const submitAnswer = (answer: number) => {
    const currentQ = questions[currentQuestionIndex];
    setUserAnswers({ ...userAnswers, [currentQ.id]: answer });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults({ ...userAnswers, [currentQ.id]: answer });
    }
  };

  const calculateResults = (answers: { [key: string]: number }) => {
    let correct = 0;
    const detailedAnswers = questions.map(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correct++;
      return { questionId: q.id, correct: isCorrect, selectedAnswer: userAnswer };
    });

    setQuizResult({
      score: correct,
      totalQuestions: questions.length,
      answers: detailedAnswers,
    });
  };

  const exportQuiz = () => {
    const quizData = {
      title: quizTitle,
      questions: questions,
      createdAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(quizData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quizTitle.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importQuiz = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const quizData = JSON.parse(e.target?.result as string);
        setQuizTitle(quizData.title || 'Imported Quiz');
        setQuestions(quizData.questions || []);
      } catch (error) {
        alert('Invalid quiz file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Quiz Maker</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Create interactive quizzes and tests with multiple choice questions
        </p>
      </div>

      {!isPreview ? (
        <>
          {/* Quiz Title */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Quiz Title
            </label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter quiz title..."
            />
          </div>

          {/* Question Builder */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Edit2 size={24} />
              {isEditing ? 'Edit Question' : 'Add New Question'}
            </h2>

            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={currentQuestion.category}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="General">General</option>
                  <option value="Science">Science</option>
                  <option value="Math">Math</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Literature">Literature</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Question */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-24 resize-none"
                  placeholder="Enter your question..."
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Answer Options <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                        className="w-5 h-5 text-purple-600"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(currentQuestion.options || [])];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion({ ...currentQuestion, options: newOptions });
                        }}
                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={`Option ${index + 1}`}
                      />
                      {currentQuestion.correctAnswer === index && (
                        <span className="text-green-600 dark:text-green-400 font-semibold text-sm">✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">Select the radio button for the correct answer</p>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-20 resize-none"
                  placeholder="Explain why this is the correct answer..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={updateQuestion}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      Update Question
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={addQuestion}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add Question
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Questions ({questions.length})
              </h2>
              <div className="flex gap-2">
                <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center gap-2">
                  <Download size={16} className="rotate-180" />
                  Import
                  <input type="file" accept=".json" onChange={importQuiz} className="hidden" />
                </label>
                <button
                  onClick={exportQuiz}
                  disabled={questions.length === 0}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Download size={16} />
                  Export
                </button>
                <button
                  onClick={startQuiz}
                  disabled={questions.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-lg font-bold shadow-lg transition-all flex items-center gap-2"
                >
                  <Play size={16} />
                  Preview Quiz
                </button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No questions added yet. Create your first question above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded">
                            Q{index + 1}
                          </span>
                          {q.category && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                              {q.category}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">{q.question}</h3>
                        <div className="space-y-1">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`text-sm px-3 py-2 rounded-lg ${i === q.correctAnswer
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold'
                                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                            >
                              {String.fromCharCode(65 + i)}. {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editQuestion(q)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Quiz Preview */
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {!quizResult ? (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{quizTitle}</h2>
                  <button
                    onClick={() => setIsPreview(false)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-all"
                  >
                    Exit Preview
                  </button>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {questions[currentQuestionIndex].question}
                </h3>

                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => submitAnswer(index)}
                      className="w-full text-left px-6 py-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 rounded-xl transition-all font-medium text-slate-900 dark:text-white"
                    >
                      <span className="inline-block w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-center leading-8 mr-3">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Results */
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4">
                  <span className="text-4xl font-bold text-white">
                    {Math.round((quizResult.score / quizResult.totalQuestions) * 100)}%
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Quiz Completed!</h2>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  You scored {quizResult.score} out of {quizResult.totalQuestions}
                </p>
              </div>

              <div className="space-y-4">
                {questions.map((q, index) => {
                  const result = quizResult.answers.find(a => a.questionId === q.id);
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border-2 ${result?.correct
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                        }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {result?.correct ? (
                          <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white mb-2">{q.question}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Your answer: <strong>{q.options[result?.selectedAnswer || 0]}</strong>
                          </p>
                          {!result?.correct && (
                            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                              Correct answer: <strong>{q.options[q.correctAnswer]}</strong>
                            </p>
                          )}
                          {q.explanation && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 italic">
                              💡 {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={startQuiz}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  Retake Quiz
                </button>
                <button
                  onClick={() => setIsPreview(false)}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all"
                >
                  Back to Editor
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizMaker;