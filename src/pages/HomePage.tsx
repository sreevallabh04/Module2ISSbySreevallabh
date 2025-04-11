import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Lock, 
  Rocket, 
  Brain, 
  BookOpen, 
  MessageSquare, 
  RefreshCw, 
  Shield, 
  Key,
  Code
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { CipherPlayground } from '../components/CipherPlayground';
import { getConceptExplanation } from '../services/ai';

export const HomePage = () => {
  const [aiQuestion, setAIQuestion] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Handle AI question submission
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
    <>
      <Hero />
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Welcome Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/30 text-purple-300 mb-2">
              <Brain className="w-4 h-4 mr-1" />
              <span>AI-Powered Learning</span>
            </div>
            
            <h2 className="text-3xl font-bold text-purple-400">
              Start Your Cryptography Journey
            </h2>
            
            <p className="text-gray-300">
              Dive into the fascinating world of cryptography, where mathematics
              meets security. Learn how ancient civilizations protected their
              secrets and how modern encryption keeps our digital world safe.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 hover:bg-purple-900/50 transition-colors">
                <Lock className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-bold mb-2">Classical Ciphers</h3>
                <p className="text-sm text-gray-400">
                  Explore historical encryption methods that shaped modern cryptography
                </p>
              </div>
              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 hover:bg-purple-900/50 transition-colors">
                <Shield className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-bold mb-2">Modern Encryption</h3>
                <p className="text-sm text-gray-400">
                  Discover how today's digital security works
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 hover:bg-purple-900/50 transition-colors">
                <Key className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-bold mb-2">DES & AES</h3>
                <p className="text-sm text-gray-400">
                  Learn about block ciphers and symmetric encryption standards
                </p>
              </div>
              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 hover:bg-purple-900/50 transition-colors">
                <Code className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-bold mb-2">Interactive Practice</h3>
                <p className="text-sm text-gray-400">
                  Test your knowledge with hands-on encryption exercises
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-2">
              <Link
                to="/classical-ciphers"
                className="group relative px-6 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center"
              >
                Start Learning
                <Rocket className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => setShowLearnMore(!showLearnMore)}
                className="group px-6 py-3 text-lg font-semibold rounded-full border-2 border-purple-500 text-white hover:bg-purple-500/20 transition-all duration-300 flex items-center justify-center"
              >
                Learn More
                <BookOpen className="inline-block ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col">
            <CipherPlayground />
          </div>
        </div>
        
        {/* Learn More Section */}
        {showLearnMore && (
          <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 mb-16 animate-fade-in">
            <h3 className="text-2xl font-bold text-purple-300 mb-6">Why Study Cryptography?</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-purple-900/20 p-6 rounded-lg">
                <div className="w-12 h-12 bg-purple-800/50 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-300" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Security</h4>
                <p className="text-gray-300">
                  Cryptography is the foundation of digital security, protecting everything from personal messages to financial transactions and sensitive government communications.
                </p>
              </div>
              
              <div className="bg-blue-900/20 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-800/50 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-300" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Mathematics</h4>
                <p className="text-gray-300">
                  Cryptography brings mathematical concepts to life, demonstrating how number theory, probability, and algorithms work together to solve real-world problems.
                </p>
              </div>
              
              <div className="bg-pink-900/20 p-6 rounded-lg">
                <div className="w-12 h-12 bg-pink-800/50 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-pink-300" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Innovation</h4>
                <p className="text-gray-300">
                  From ancient ciphers to quantum cryptography, this field showcases human ingenuity and drives technological advancement in the digital age.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* AI Assistant Section */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl overflow-hidden mb-16">
          <div className="grid md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/30 text-blue-300 mb-4">
                <Brain className="w-4 h-4 mr-1" />
                <span>AI Cryptography Assistant</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Have a Question About Cryptography?
              </h3>
              
              <p className="text-gray-300 mb-6">
                Our AI assistant can answer your questions about ciphers, encryption algorithms, 
                cryptographic protocols, and security concepts. Try it now!
              </p>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAIQuestion(e.target.value)}
                    className="flex-1 px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., How does RSA encryption work?"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAskAI();
                    }}
                  />
                  <button
                    onClick={handleAskAI}
                    disabled={loading}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
                
                <div className="text-xs text-gray-400 flex items-start">
                  <Brain className="w-3 h-3 mr-1 mt-0.5" />
                  <span>
                    Powered by advanced language models to provide accurate, educational responses.
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 p-8">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-blue-400 mx-auto animate-spin mb-4" />
                    <p className="text-gray-300">Processing your question...</p>
                  </div>
                </div>
              ) : aiResponse ? (
                <div className="h-full">
                  <h4 className="font-bold text-blue-300 mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Response
                  </h4>
                  <div className="overflow-y-auto max-h-80 text-gray-300 prose prose-sm prose-invert">
                    {aiResponse.split('\n').map((para, idx) => (
                      <p key={idx} className={para.trim() === '' ? 'mt-4' : ''}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="max-w-xs mx-auto">
                    <Brain className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Ask a question about cryptography to see the AI response here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Feature Links Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-purple-400 mb-8">
            Explore Our Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              to="/practice" 
              className="group p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-purple-500/30 hover:bg-purple-900/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-purple-800/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-purple-300" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Interactive Practice</h4>
              <p className="text-gray-300 mb-4">
                Test your skills with hands-on encryption tools and AI-generated challenges.
              </p>
              <span className="text-purple-400 flex items-center">
                Try it now
                <Rocket className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link 
              to="/classical-ciphers" 
              className="group p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-purple-500/30 hover:bg-purple-900/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-purple-800/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-purple-300" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Classical Ciphers</h4>
              <p className="text-gray-300 mb-4">
                Explore the history of cryptography from ancient times to the early modern era.
              </p>
              <span className="text-purple-400 flex items-center">
                Learn more
                <Rocket className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link 
              to="/modern-encryption" 
              className="group p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-purple-500/30 hover:bg-purple-900/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-purple-800/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-purple-300" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Modern Encryption</h4>
              <p className="text-gray-300 mb-4">
                Discover how algorithms like AES, RSA, and elliptic curve cryptography work.
              </p>
              <span className="text-purple-400 flex items-center">
                Explore now
                <Rocket className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};