import React, { useState } from 'react';
import { ChefHat, Clock, Users, Star, Shuffle } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  rating: number;
}

const RecipeGenerator: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('Any');
  const [dietary, setDietary] = useState('None');
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  const cuisines = ['Any', 'Italian', 'Mexican', 'Indian', 'Chinese', 'Thai', 'Japanese', 'French', 'Mediterranean'];
  const dietaryOptions = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo'];

  const generateRecipe = () => {
    // Mock recipe generation - in a real app, this would call an API
    const mockRecipes: Recipe[] = [
      {
        id: '1',
        title: 'Creamy Mushroom Risotto',
        description: 'A rich and creamy Italian rice dish with mushrooms and Parmesan cheese.',
        ingredients: [
          '200g Arborio rice',
          '300g mixed mushrooms',
          '1 onion, finely chopped',
          '2 cloves garlic, minced',
          '1L vegetable stock',
          '100ml white wine',
          '50g Parmesan cheese',
          '2 tbsp butter',
          'Fresh parsley, chopped'
        ],
        instructions: [
          'Heat stock in a saucepan and keep warm.',
          'Sauté onion and garlic in butter until soft.',
          'Add mushrooms and cook until golden.',
          'Stir in rice and cook for 2 minutes.',
          'Add wine and stir until absorbed.',
          'Gradually add stock, stirring constantly.',
          'Continue until rice is creamy (18-20 mins).',
          'Stir in Parmesan and parsley. Serve immediately.'
        ],
        prepTime: 15,
        cookTime: 25,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'Italian',
        rating: 4.5
      },
      {
        id: '2',
        title: 'Thai Green Curry',
        description: 'Aromatic and spicy Thai curry with coconut milk and fresh herbs.',
        ingredients: [
          '400ml coconut milk',
          '2-3 tbsp green curry paste',
          '400g chicken breast, sliced',
          '200g eggplant, cubed',
          '100g green beans',
          '1 red bell pepper, sliced',
          '2 tbsp fish sauce',
          '1 tbsp palm sugar',
          'Thai basil leaves',
          'Jasmine rice for serving'
        ],
        instructions: [
          'Heat 200ml coconut milk in a wok.',
          'Add curry paste and fry for 2 minutes.',
          'Add chicken and cook until sealed.',
          'Add remaining coconut milk and vegetables.',
          'Simmer for 10-15 minutes until cooked.',
          'Season with fish sauce and palm sugar.',
          'Garnish with Thai basil and serve with rice.'
        ],
        prepTime: 20,
        cookTime: 20,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'Thai',
        rating: 4.7
      }
    ];

    // Simple logic to select recipe based on inputs
    const selectedRecipe = mockRecipes[Math.floor(Math.random() * mockRecipes.length)];
    setGeneratedRecipe(selectedRecipe);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Recipe Generator</h2>
        <p className="text-slate-600 dark:text-slate-400">Generate delicious recipes based on your ingredients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recipe Preferences</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Available Ingredients (optional)
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter ingredients you have (e.g., chicken, rice, tomatoes, onions)"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 resize-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Cuisine Type
                </label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                >
                  {cuisines.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Dietary Preference
                </label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                >
                  {dietaryOptions.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={generateRecipe}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <Shuffle size={20} />
              Generate Recipe
            </button>
          </div>
        </div>

        {/* Recipe Display */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          {generatedRecipe ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {generatedRecipe.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {generatedRecipe.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-medium">{generatedRecipe.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-center">
                  <Clock size={20} className="mx-auto mb-1 text-slate-500" />
                  <div className="text-sm font-medium">{generatedRecipe.prepTime + generatedRecipe.cookTime}m</div>
                  <div className="text-xs text-slate-500">Total Time</div>
                </div>
                <div className="text-center">
                  <Users size={20} className="mx-auto mb-1 text-slate-500" />
                  <div className="text-sm font-medium">{generatedRecipe.servings}</div>
                  <div className="text-xs text-slate-500">Servings</div>
                </div>
                <div className="text-center">
                  <ChefHat size={20} className="mx-auto mb-1 text-slate-500" />
                  <div className="text-sm font-medium">{generatedRecipe.difficulty}</div>
                  <div className="text-xs text-slate-500">Difficulty</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{generatedRecipe.cuisine}</div>
                  <div className="text-xs text-slate-500">Cuisine</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Ingredients</h4>
                <ul className="space-y-2">
                  {generatedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Instructions</h4>
                <ol className="space-y-3">
                  {generatedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3 text-slate-700 dark:text-slate-300">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat size={48} className="mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Ready to Cook?
              </h3>
              <p className="text-slate-500 dark:text-slate-500">
                Enter your preferences and generate a delicious recipe!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;