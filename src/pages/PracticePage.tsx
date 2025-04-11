import React, { useState } from 'react';
import { Brain, Target, Trophy, Puzzle, RefreshCw, Lock, Shield, Key, BookOpen, MessageSquare } from 'lucide-react';
import { CipherPlayground } from '../components/CipherPlayground';
import { AIChallenge } from '../components/AIChallenge';
import { getConceptExplanation } from '../services/ai';

// Define available cipher types
const cipherTypes = [
  { id: 'caesar', name: 'Caesar Cipher', icon: Lock },
  { id: 'vigenere', name: 'Vigenère Cipher', icon: Key },
  { id: 'playfair', name: 'Playfair Cipher', icon: Puzzle },
  { id: 'railfence', name: 'Rail Fence Cipher', icon: Shield },
  { id: 'atbash', name: 'Atbash Cipher', icon: RefreshCw }
];

export const PracticePage = () => {
  // State for selected options
  const [selectedCipherType, setSelectedCipherType] = useState(cipherTypes[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiQuestion, setAIQuestion] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'playground' | 'challenge'>('playground');

  // Handle AI assistant questions
  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    
    try {
      setLoading(true);
      const response = await getConceptExplanation(aiQuestion);
      setAIResponse(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAIResponse('Sorry, I encountered an error while processing your question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-purple-400 mb-2">Cryptography Practice</h1>
            <p className="text-gray-300 max-w-2xl">
              Master cryptography through hands-on practice with various encryption techniques.
              Try the interactive tools, solve AI-generated challenges, and test your skills.
            </p>
          </div>
          <button
            className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            onClick={() => setShowAIAssistant(!showAIAssistant)}
          >
            <Brain className="w-5 h-5" />
            <span>{showAIAssistant ? 'Hide AI Assistant' : 'AI Assistant'}</span>
          </button>
        </div>

        {/* AI Assistant Panel */}
        {showAIAssistant && (
          <div className="mb-8 p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-blue-500/30">
            <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              AI Cryptography Assistant
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ask about any cryptography concept or technique
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAIQuestion(e.target.value)}
                  className="flex-1 px-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., How does public key cryptography work?"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAskAI();
                  }}
                />
                <button
                  onClick={handleAskAI}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <MessageSquare className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {aiResponse && (
              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <h3 className="text-lg font-medium text-blue-300 mb-2 flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  Response
                </h3>
                <div className="text-sm text-gray-300 prose prose-sm prose-invert max-w-none">
                  {aiResponse.split('\n').map((para, idx) => (
                    <p key={idx} className={para.trim() === '' ? 'mt-4' : ''}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Practice Mode Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-purple-500/30">
            <button
              className={`flex items-center space-x-2 px-6 py-3 font-medium ${
                activeTab === 'playground'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('playground')}
            >
              <Lock className="w-4 h-4" />
              <span>Cipher Playground</span>
            </button>
            <button
              className={`flex items-center space-x-2 px-6 py-3 font-medium ${
                activeTab === 'challenge'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('challenge')}
            >
              <Trophy className="w-4 h-4" />
              <span>Challenges</span>
            </button>
          </div>
        </div>

        {/* Practice Area */}
        {activeTab === 'playground' ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-purple-500/30">
                <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Encryption Practice Guide
                </h2>
                <p className="text-gray-300 mb-4">
                  Use the interactive cipher playground to experiment with different encryption
                  techniques. Enter your message, select cipher parameters, and see the results in real-time.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {cipherTypes.map(type => (
                    <div key={type.id} className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
                      <type.icon className="w-6 h-6 text-purple-400 mb-2" />
                      <h3 className="font-bold mb-1">{type.name}</h3>
                      <p className="text-xs text-gray-400">
                        Try it in the playground
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-blue-300 flex items-start">
                    <Brain className="w-4 h-4 mr-2 mt-1 shrink-0" />
                    <span>
                      Use the AI Explain button to get detailed explanations about how each 
                      cipher works, powered by advanced language models!
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <CipherPlayground />
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-purple-300 flex items-center">
                  <Trophy className="w-6 h-6 mr-2" />
                  Practice Challenges
                </h2>
                <div className="flex space-x-2">
                  <div className="flex bg-gray-800 rounded-lg overflow-hidden">
                    {['easy', 'medium', 'hard'].map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty as 'easy' | 'medium' | 'hard')}
                        className={`px-4 py-2 capitalize ${
                          selectedDifficulty === difficulty
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-300 hover:bg-purple-900/30'
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mt-2">
                Test your skills with AI-generated challenges at different difficulty levels.
                The AI will provide personalized feedback on your solutions.
              </p>
              
              <div className="mt-6 grid grid-cols-5 gap-2 mb-8">
                {cipherTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCipherType(type.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                      selectedCipherType === type.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <type.icon className="w-6 h-6 mb-2" />
                    <span className="text-sm text-center">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <AIChallenge 
              cipherType={cipherTypes.find(c => c.id === selectedCipherType)?.name || 'Caesar Cipher'} 
              difficulty={selectedDifficulty} 
            />
          </div>
        )}
      </div>
    </div>
  );
};