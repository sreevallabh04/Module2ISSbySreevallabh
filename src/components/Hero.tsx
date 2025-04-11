import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Lock, Rocket, Brain, Key, Shield, Code } from 'lucide-react';

// Typewriter effect component
const TypewriterText: React.FC<{ phrases: string[]; typingSpeed?: number; deletingSpeed?: number; pauseTime?: number }> = ({
  phrases,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseTime = 2000
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPaused) {
      timer = setTimeout(() => {
        setIsPaused(false);
        setIsTyping(false);
      }, pauseTime);
      return () => clearTimeout(timer);
    }
    
    const currentFullPhrase = phrases[currentPhrase];
    
    if (isTyping) {
      if (displayedText === currentFullPhrase) {
        setIsPaused(true);
        return () => clearTimeout(timer);
      }
      
      timer = setTimeout(() => {
        setDisplayedText(currentFullPhrase.substring(0, displayedText.length + 1));
      }, typingSpeed);
    } else {
      if (displayedText === '') {
        setCurrentPhrase((currentPhrase + 1) % phrases.length);
        setIsTyping(true);
        return () => clearTimeout(timer);
      }
      
      timer = setTimeout(() => {
        setDisplayedText(displayedText.substring(0, displayedText.length - 1));
      }, deletingSpeed);
    }
    
    return () => clearTimeout(timer);
  }, [displayedText, currentPhrase, isTyping, isPaused, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="inline-block min-h-[1.5em]">
      {displayedText}
      <span className="animate-pulse ml-0.5">|</span>
    </span>
  );
};

// Binary background animation
const BinaryBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <div className="binary-rain"></div>
    </div>
  );
};

// Floating icons component
const FloatingIcons: React.FC = () => {
  const icons = [
    { icon: Lock, delay: '0s', duration: '15s', positionX: '10%', positionY: '20%' },
    { icon: Key, delay: '2s', duration: '18s', positionX: '85%', positionY: '15%' },
    { icon: Shield, delay: '4s', duration: '20s', positionX: '75%', positionY: '75%' },
    { icon: Code, delay: '1s', duration: '17s', positionX: '20%', positionY: '85%' },
    { icon: Brain, delay: '3s', duration: '22s', positionX: '50%', positionY: '35%' },
  ];
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {icons.map((item, index) => {
        const Icon = item.icon;
        return (
          <div 
            key={index}
            className="absolute opacity-10 animate-float-random"
            style={{
              left: item.positionX,
              top: item.positionY,
              animationDelay: item.delay,
              animationDuration: item.duration
            }}
          >
            <Icon className="w-16 h-16 text-purple-300" />
          </div>
        );
      })}
    </div>
  );
};

export const Hero: React.FC = () => {
  const cryptoPhases = [
    "Journey through the evolution of cipher systems",
    "Discover how modern encryption secures our digital world",
    "Explore classical and modern cryptographic techniques",
    "Learn with AI-powered interactive tutorials",
    "Master the mathematics behind secure communications"
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-purple-900 to-black">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="stars"></div>
      </div>
      <BinaryBackground />
      <FloatingIcons />
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* AI Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 mb-8 animate-pulse-slow">
          <Brain className="w-5 h-5 mr-2" />
          <span className="font-semibold">AI-Powered Learning Experience</span>
        </div>
        
        {/* Logo Icon */}
        <div className="animate-float">
          <Lock className="w-20 h-20 mx-auto mb-6 text-purple-400" />
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Explore the Secrets of Cryptography
        </h1>
        
        {/* Animated Subheading */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in h-12">
          <TypewriterText phrases={cryptoPhases} typingSpeed={60} deletingSpeed={20} pauseTime={3000} />
        </p>
        
        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="px-4 py-2 rounded-full bg-purple-900/50 text-purple-300 text-sm flex items-center">
            <Lock className="w-4 h-4 mr-1" />
            <span>Classical Ciphers</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-purple-900/50 text-purple-300 text-sm flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            <span>Modern Encryption</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-blue-900/50 text-blue-300 text-sm flex items-center">
            <Brain className="w-4 h-4 mr-1" />
            <span>AI Assistance</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-purple-900/50 text-purple-300 text-sm flex items-center">
            <Sparkles className="w-4 h-4 mr-1" />
            <span>Interactive Challenges</span>
          </div>
        </div>
        
        {/* Call to Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/classical-ciphers"
            className="group relative px-6 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Start Learning
            <Rocket className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/practice"
            className="group px-6 py-3 text-lg font-semibold rounded-full border-2 border-purple-500 text-white hover:bg-purple-500/20 transition-all duration-300"
          >
            Interactive Tools
            <Sparkles className="inline-block ml-2 w-5 h-5" />
          </Link>
        </div>
        
        {/* AI Teaser */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-blue-500/20">
            <div className="flex items-center mb-2">
              <Brain className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-blue-300 font-semibold">AI Cryptography Assistant</span>
            </div>
            <p className="text-sm text-gray-400">
              Our AI assistant can answer your questions, provide explanations, and generate personalized challenges as you learn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};