import React, { useState, useEffect } from 'react';
import { Brain, Target, Trophy, Puzzle, RefreshCw, Lock, Shield, Key } from 'lucide-react';

// Simple cipher playground component
const SimpleCipherPlayground = () => {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('3');
  const [output, setOutput] = useState('');

  const handleEncrypt = () => {
    const shift = parseInt(key) || 0;
    const result = input.split('').map(char => {
      if (char.match(/[A-Z]/)) {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      if (char.match(/[a-z]/)) {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
      }
      return char;
    }).join('');
    setOutput(result);
  };

  return (
    <div className="p-6 bg-purple-900/30 rounded-lg border border-purple-500/30">
      <h3 className="text-lg font-bold mb-4">Caesar Cipher Tool</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Input Text</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 bg-gray-900/50 rounded border border-purple-500/30"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Shift Key (0-25)</label>
          <input
            type="number"
            min="0"
            max="25"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full p-2 bg-gray-900/50 rounded border border-purple-500/30"
          />
        </div>
        <button
          onClick={handleEncrypt}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
        >
          Encrypt/Decrypt
        </button>
        <div>
          <label className="block text-sm mb-1">Output</label>
          <div className="p-2 bg-gray-900/50 rounded border border-purple-500/30 font-mono">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PracticePage = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [currentChallenges, setCurrentChallenges] = useState([]);

  // Challenge templates with simplified cipher implementations
  const challengeTemplates = {
    easy: [
      {
        title: "Caesar's Cipher",
        generateChallenge: () => {
          const words = ['HELLO', 'WORLD', 'CRYPTO', 'CIPHER', 'SECRET'];
          const word = words[Math.floor(Math.random() * words.length)];
          const shift = Math.floor(Math.random() * 25) + 1;
          const encrypted = caesarEncrypt(word, shift);
          return {
            description: `Decrypt: '${encrypted}' with shift ${shift}`,
            hint: "Shift each letter back by the given number",
            solution: word,
            context: "Caesar cipher shifts each letter by a fixed number"
          };
        }
      },
      {
        title: "Atbash Cipher",
        generateChallenge: () => {
          const words = ['HELLO', 'WORLD', 'LEARN', 'STUDY'];
          const word = words[Math.floor(Math.random() * words.length)];
          const encrypted = atbashEncrypt(word);
          return {
            description: `Decrypt using Atbash: '${encrypted}'`,
            hint: "Replace A with Z, B with Y, etc.",
            solution: word,
            context: "Atbash reverses the alphabet: A→Z, B→Y, etc."
          };
        }
      }
    ],
    medium: [
      {
        title: "Rail Fence",
        generateChallenge: () => {
          const phrases = ['HELLO WORLD', 'CRYPTOGRAPHY', 'SECRET MESSAGE'];
          const phrase = phrases[Math.floor(Math.random() * phrases.length)];
          const rails = 3;
          const encrypted = railFenceEncrypt(phrase, rails);
          return {
            description: `Decrypt rail fence (${rails} rails): ${encrypted}`,
            hint: "Visualize text zigzagging across rails",
            solution: phrase,
            context: "Rail fence arranges text in a zigzag pattern"
          };
        }
      },
      {
        title: "Columnar Transposition",
        generateChallenge: () => {
          const messages = ['HELLO WORLD', 'SECURE MESSAGE', 'CRYPTO TEXT'];
          const message = messages[Math.floor(Math.random() * messages.length)];
          const key = 'KEY';
          const encrypted = columnarEncrypt(message, key);
          return {
            description: `Decrypt using key '${key}': ${encrypted}`,
            hint: "Arrange letters in columns by key order",
            solution: message,
            context: "Rearranges text in columns based on key letters"
          };
        }
      }
    ],
    hard: [
      {
        title: "Vigenère Cipher",
        generateChallenge: () => {
          const messages = ['HELLO', 'SECURE', 'CIPHER'];
          const message = messages[Math.floor(Math.random() * messages.length)];
          const key = 'KEY';
          const encrypted = vigenereEncrypt(message, key);
          return {
            description: `Decrypt using key '${key}': ${encrypted}`,
            hint: "Use Vigenère square with repeating key",
            solution: message,
            context: "Uses a keyword to shift each letter differently"
          };
        }
      },
      {
        title: "Combined Ciphers",
        generateChallenge: () => {
          const messages = ['SECURE', 'CIPHER', 'CRYPTO'];
          const message = messages[Math.floor(Math.random() * messages.length)];
          const shift = 3;
          const encrypted = railFenceEncrypt(caesarEncrypt(message, shift), 2);
          return {
            description: `Decrypt text encrypted with Caesar (shift ${shift}) then rail fence: ${encrypted}`,
            hint: "First undo rail fence, then Caesar shift",
            solution: message,
            context: "Multiple encryption layers increase complexity"
          };
        }
      }
    ]
  };

  // Utility functions
  const caesarEncrypt = (text, shift) => {
    return text.split('').map(char => {
      if (char.match(/[A-Z]/)) {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      return char;
    }).join('');
  };

  const atbashEncrypt = (text) => {
    return text.split('').map(char => {
      if (char.match(/[A-Z]/)) {
        return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
      }
      return char;
    }).join('');
  };

  const railFenceEncrypt = (text, rails) => {
    const fence = Array(rails).fill('').map(() => []);
    let rail = 0;
    let direction = 1;

    text.split('').forEach((char) => {
      fence[rail].push(char);
      if (rail === 0) direction = 1;
      if (rail === rails - 1) direction = -1;
      rail += direction;
    });

    return fence.flat().join('');
  };

  const columnarEncrypt = (text, key) => {
    const cols = key.length;
    const rows = Math.ceil(text.length / cols);
    const grid = Array(rows).fill('').map(() => Array(cols).fill(''));
    
    // Fill grid
    let pos = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (pos < text.length) {
          grid[i][j] = text[pos++];
        }
      }
    }
    
    // Read by columns
    const keyOrder = [...key].map((char, i) => ({ char, i }))
      .sort((a, b) => a.char.localeCompare(b.char))
      .map(x => x.i);
    
    return keyOrder.map(col => 
      grid.map(row => row[col]).join('')
    ).join('');
  };

  const vigenereEncrypt = (text, key) => {
    return text.split('').map((char, i) => {
      if (char.match(/[A-Z]/)) {
        const shift = key[i % key.length].charCodeAt(0) - 65;
        return caesarEncrypt(char, shift);
      }
      return char;
    }).join('');
  };

  // Generate new challenges
  const generateChallenges = () => {
    const templates = challengeTemplates[selectedDifficulty];
    const newChallenges = templates.map(template => ({
      title: template.title,
      ...template.generateChallenge()
    }));
    setCurrentChallenges(newChallenges);
  };

  useEffect(() => {
    generateChallenges();
  }, [selectedDifficulty]);

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-purple-400 mb-8">Cryptography Practice</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <p className="text-gray-300">
              Master classical cryptography through hands-on practice with various 
              substitution and transposition ciphers.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
                <Lock className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-bold mb-2">Basic</h3>
                <p className="text-sm text-gray-400">
                  Simple substitution
                </p>
              </div>
              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
                <Shield className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-bold mb-2">Intermediate</h3>
                <p className="text-sm text-gray-400">
                  Transposition
                </p>
              </div>
              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
                <Key className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-bold mb-2">Advanced</h3>
                <p className="text-sm text-gray-400">
                  Combined methods
                </p>
              </div>
            </div>
          </div>
          <SimpleCipherPlayground />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-purple-300">Practice Challenges</h2>
            <button
              onClick={generateChallenges}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              New Challenges
            </button>
          </div>
          <div className="flex space-x-4 mt-4">
            {['easy', 'medium', 'hard'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  selectedDifficulty === difficulty
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900/30 text-gray-300 hover:bg-purple-800/30'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentChallenges.map((challenge, index) => (
            <div key={index} className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-300">{challenge.title}</h3>
                <Puzzle className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-gray-300 mb-4">{challenge.description}</p>
              <p className="text-sm text-gray-400 mb-4">{challenge.context}</p>
              <details className="text-sm text-gray-400">
                <summary className="cursor-pointer hover:text-purple-400 transition-colors">
                  Need a hint?
                </summary>
                <p className="mt-2 pl-4 border-l-2 border-purple-500/30">
                  {challenge.hint}
                </p>
              </details>
              <details className="text-sm text-gray-400 mt-4">
                <summary className="cursor-pointer hover:text-purple-400 transition-colors">
                  View Solution
                </summary>
                <p className="mt-2 pl-4 border-l-2 border-purple-500/30 font-mono">
                  {challenge.solution}
                </p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};  