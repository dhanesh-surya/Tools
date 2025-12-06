import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, RotateCcw, BookOpen, Download, Upload, ChevronLeft, ChevronRight, Shuffle, Check, X } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  mastered: boolean;
}

const FlashcardGenerator: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Partial<Flashcard>>({
    front: '',
    back: '',
    category: 'General',
    mastered: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isStudying, setIsStudying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<'all' | 'unmastered'>('all');
  const [deckName, setDeckName] = useState('My Flashcard Deck');

  const addFlashcard = () => {
    if (!currentCard.front || !currentCard.back) {
      alert('Please fill in both front and back of the card');
      return;
    }

    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: currentCard.front,
      back: currentCard.back,
      category: currentCard.category || 'General',
      mastered: false,
    };

    setFlashcards([...flashcards, newCard]);
    resetForm();
  };

  const updateFlashcard = () => {
    if (!editingId) return;

    setFlashcards(flashcards.map(c =>
      c.id === editingId
        ? {
          ...c,
          front: currentCard.front || c.front,
          back: currentCard.back || c.back,
          category: currentCard.category || c.category,
        }
        : c
    ));
    resetForm();
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards(flashcards.filter(c => c.id !== id));
  };

  const editFlashcard = (card: Flashcard) => {
    setCurrentCard(card);
    setIsEditing(true);
    setEditingId(card.id);
  };

  const resetForm = () => {
    setCurrentCard({
      front: '',
      back: '',
      category: 'General',
      mastered: false,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const toggleMastered = (id: string) => {
    setFlashcards(flashcards.map(c =>
      c.id === id ? { ...c, mastered: !c.mastered } : c
    ));
  };

  const getStudyCards = () => {
    if (studyMode === 'unmastered') {
      return flashcards.filter(c => !c.mastered);
    }
    return flashcards;
  };

  const startStudying = () => {
    const cards = getStudyCards();
    if (cards.length === 0) {
      alert('No cards to study!');
      return;
    }
    setIsStudying(true);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
  };

  const nextCard = () => {
    const cards = getStudyCards();
    setCurrentIndex((currentIndex + 1) % cards.length);
    setIsFlipped(false);
  };

  const previousCard = () => {
    const cards = getStudyCards();
    setCurrentIndex((currentIndex - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  const exportDeck = () => {
    const deckData = {
      name: deckName,
      flashcards: flashcards,
      createdAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(deckData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deckName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDeck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const deckData = JSON.parse(e.target?.result as string);
        setDeckName(deckData.name || 'Imported Deck');
        setFlashcards(deckData.flashcards || []);
      } catch (error) {
        alert('Invalid deck file');
      }
    };
    reader.readAsText(file);
  };

  const studyCards = getStudyCards();
  const masteredCount = flashcards.filter(c => c.mastered).length;
  const progressPercent = flashcards.length > 0 ? Math.round((masteredCount / flashcards.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Flashcard Generator</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Create and study digital flashcards for effective learning
        </p>
      </div>

      {!isStudying ? (
        <>
          {/* Deck Info & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                placeholder="Deck name..."
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
              <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold mb-1">Total Cards</div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{flashcards.length}</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-6">
              <div className="text-sm text-green-700 dark:text-green-300 font-semibold mb-1">Mastered</div>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {masteredCount} <span className="text-xl">({progressPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Card Creator */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              {isEditing ? <Edit2 size={24} /> : <Plus size={24} />}
              {isEditing ? 'Edit Flashcard' : 'Create Flashcard'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={currentCard.category}
                  onChange={(e) => setCurrentCard({ ...currentCard, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="General">General</option>
                  <option value="Language">Language</option>
                  <option value="Science">Science</option>
                  <option value="Math">Math</option>
                  <option value="History">History</option>
                  <option value="Vocabulary">Vocabulary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Front (Question/Term) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={currentCard.front}
                    onChange={(e) => setCurrentCard({ ...currentCard, front: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                    placeholder="Enter question or term..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Back (Answer/Definition) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={currentCard.back}
                    onChange={(e) => setCurrentCard({ ...currentCard, back: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                    placeholder="Enter answer or definition..."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={updateFlashcard}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      Update Flashcard
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
                    onClick={addFlashcard}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add Flashcard
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Flashcards List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Your Flashcards ({flashcards.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={shuffleCards}
                  disabled={flashcards.length === 0}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Shuffle size={16} />
                  Shuffle
                </button>
                <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center gap-2">
                  <Upload size={16} />
                  Import
                  <input type="file" accept=".json" onChange={importDeck} className="hidden" />
                </label>
                <button
                  onClick={exportDeck}
                  disabled={flashcards.length === 0}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Download size={16} />
                  Export
                </button>
                <button
                  onClick={startStudying}
                  disabled={flashcards.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-lg font-bold shadow-lg transition-all flex items-center gap-2"
                >
                  <BookOpen size={16} />
                  Start Studying
                </button>
              </div>
            </div>

            {/* Study Mode Filter */}
            {flashcards.length > 0 && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setStudyMode('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${studyMode === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                >
                  All Cards ({flashcards.length})
                </button>
                <button
                  onClick={() => setStudyMode('unmastered')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${studyMode === 'unmastered'
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                >
                  Unmastered ({flashcards.filter(c => !c.mastered).length})
                </button>
              </div>
            )}

            {flashcards.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No flashcards yet. Create your first card above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flashcards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                        {card.category}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleMastered(card.id)}
                          className={`p-1.5 rounded-lg transition-all ${card.mastered
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                            }`}
                          title={card.mastered ? 'Mastered' : 'Not mastered'}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => editFlashcard(card)}
                          className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteFlashcard(card.id)}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Front</div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                          {card.front}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Back</div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                          {card.back}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Study Mode */
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{deckName}</h2>
              <button
                onClick={() => setIsStudying(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-all"
              >
                Exit Study Mode
              </button>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / studyCards.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Card {currentIndex + 1} of {studyCards.length}
            </p>
          </div>

          {/* Flashcard */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative h-96 mb-6 cursor-pointer"
            style={{ perspective: '1000px' }}
          >
            <div
              className={`absolute inset-0 transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''
                }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-8 flex flex-col items-center justify-center backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-4">
                  Question
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                  {studyCards[currentIndex]?.front}
                </div>
                <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                  Click to reveal answer
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800 p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="text-xs uppercase tracking-wider text-green-600 dark:text-green-400 font-semibold mb-4">
                  Answer
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                  {studyCards[currentIndex]?.back}
                </div>
                <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                  Click to go back
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={previousCard}
              className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <button
              onClick={() => toggleMastered(studyCards[currentIndex].id)}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${studyCards[currentIndex]?.mastered
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
            >
              {studyCards[currentIndex]?.mastered ? (
                <>
                  <Check size={20} />
                  Mastered
                </>
              ) : (
                <>
                  <X size={20} />
                  Not Mastered
                </>
              )}
            </button>

            <button
              onClick={nextCard}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all flex items-center gap-2"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerator;