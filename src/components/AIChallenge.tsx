import React, { useState, useEffect } from 'react';
import { Brain, Check, X, RefreshCw, ArrowRight, HelpCircle, MessageSquare } from 'lucide-react';
import { generateCipherChallenge, analyzeUserSolution, getStepByStepSolution } from '../services/ai';

interface ChallengeData {
  plaintext: string;
  ciphertext: string;
  key: string;
  hint: string;
}

interface Props {
  cipherType: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const AIChallenge: React.FC<Props> = ({ cipherType, difficulty }) => {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [userSolution, setUserSolution] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [generatingChallenge, setGeneratingChallenge] = useState(false);

  // Generate a new challenge when component mounts or when cipherType/difficulty changes
  useEffect(() => {
    generateNewChallenge();
  }, [cipherType, difficulty]);

  // Generate a new challenge
  const generateNewChallenge = async () => {
    try {
      setGeneratingChallenge(true);
      setUserSolution('');
      setFeedback(null);
      setShowSolution(false);
      setSolution('');
      
      const newChallenge = await generateCipherChallenge(cipherType, difficulty);
      setChallenge(newChallenge);
    } catch (error) {
      console.error('Error generating challenge:', error);
    } finally {
      setGeneratingChallenge(false);
    }
  };

  // Check the user's solution
  const checkSolution = async () => {
    if (!challenge || !userSolution) return;

    try {
      setLoading(true);
      const result = await analyzeUserSolution(
        cipherType,
        `Decrypt "${challenge.ciphertext}" using key "${challenge.key}"`,
        userSolution,
        challenge.plaintext
      );
      setFeedback(result);
    } catch (error) {
      console.error('Error analyzing solution:', error);
      setFeedback({
        isCorrect: false,
        feedback: 'Sorry, there was an error analyzing your solution. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get the solution with explanation
  const getDetailedSolution = async () => {
    if (!challenge) return;

    try {
      setLoading(true);
      const explanation = await getStepByStepSolution(
        cipherType,
        challenge.ciphertext,
        challenge.key
      );
      setSolution(explanation);
      setShowSolution(true);
    } catch (error) {
      console.error('Error getting solution:', error);
      setSolution('Sorry, there was an error retrieving the solution explanation.');
      setShowSolution(true);
    } finally {
      setLoading(false);
    }
  };

  if (generatingChallenge) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-400 mx-auto animate-spin mb-4" />
          <p className="text-gray-300">Generating {cipherType} challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 mb-4">Failed to generate challenge.</p>
          <button
            onClick={generateNewChallenge}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-bold text-purple-300">
          {cipherType} Challenge ({difficulty})
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={generateNewChallenge}
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
            disabled={loading || generatingChallenge}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={getDetailedSolution}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            disabled={loading || showSolution}
          >
            <Brain className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Challenge Information */}
        <div className="bg-black/30 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold mb-2 text-gray-300 flex items-center">
                <ArrowRight className="w-4 h-4 mr-1" />
                Task
              </h4>
              <p className="text-gray-400">
                Decrypt the following {cipherType} ciphertext:
              </p>
              <div className="mt-2 font-mono bg-gray-800/50 p-2 rounded">
                {challenge.ciphertext}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-gray-300 flex items-center">
                <HelpCircle className="w-4 h-4 mr-1" />
                Key Information
              </h4>
              <p className="text-gray-400">
                Key: <span className="font-mono">{challenge.key}</span>
              </p>
              <div className="mt-2 p-2 border border-purple-500/30 rounded">
                <p className="text-xs text-gray-400">{challenge.hint}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Solution */}
        <div>
          <label className="block font-bold mb-2 text-gray-300">Your Solution</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={userSolution}
              onChange={(e) => setUserSolution(e.target.value)}
              className="flex-1 px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your decrypted message..."
              disabled={loading}
            />
            <button
              onClick={checkSolution}
              disabled={loading || !userSolution}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors flex items-center"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Check
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-lg border ${
            feedback.isCorrect 
              ? 'bg-green-900/20 border-green-500/30 text-green-300' 
              : 'bg-red-900/20 border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-start">
              {feedback.isCorrect ? (
                <Check className="w-5 h-5 mr-2 mt-0.5" />
              ) : (
                <X className="w-5 h-5 mr-2 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold mb-1">
                  {feedback.isCorrect ? 'Correct!' : 'Not quite right...'}
                </h4>
                <p className="text-sm">
                  {feedback.feedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Solution */}
        {showSolution && (
          <div className="bg-blue-900/20 p-4 border border-blue-500/30 rounded-lg">
            <h4 className="font-bold mb-2 text-blue-300 flex items-center">
              <Brain className="w-4 h-4 mr-1" />
              Step-by-Step Solution
            </h4>
            <div className="text-sm text-gray-300 prose prose-sm prose-invert max-w-none">
              {solution.split('\n').map((para, idx) => (
                <p key={idx} className={para.trim() === '' ? 'mt-4' : ''}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};