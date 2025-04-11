import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Lock, 
  Unlock, 
  Brain, 
  MessageSquare, 
  Layers, 
  HelpCircle,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { getConceptExplanation, getStepByStepSolution } from '../services/ai';

type CipherType = 'caesar' | 'atbash' | 'vigenere' | 'railfence' | 'playfair';

interface CipherInfo {
  name: string;
  description: string;
  hasKey: boolean;
  keyType: 'number' | 'text' | 'matrix';
  defaultKey: string;
  keyConstraints?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

const cipherTypes: Record<CipherType, CipherInfo> = {
  caesar: {
    name: 'Caesar Cipher',
    description: 'Shifts each letter by a fixed number of positions in the alphabet.',
    hasKey: true,
    keyType: 'number',
    defaultKey: '3',
    keyConstraints: {
      min: 0,
      max: 25
    }
  },
  atbash: {
    name: 'Atbash Cipher',
    description: 'Substitutes each letter with its reverse position in the alphabet (A→Z, B→Y, etc).',
    hasKey: false,
    keyType: 'number',
    defaultKey: ''
  },
  vigenere: {
    name: 'Vigenère Cipher',
    description: 'Uses a keyword to determine shift values, making it more secure than Caesar cipher.',
    hasKey: true,
    keyType: 'text',
    defaultKey: 'KEY',
    keyConstraints: {
      pattern: '^[A-Za-z]+$'
    }
  },
  railfence: {
    name: 'Rail Fence Cipher',
    description: 'A transposition cipher that arranges plaintext in a zigzag pattern across "rails".',
    hasKey: true,
    keyType: 'number',
    defaultKey: '3',
    keyConstraints: {
      min: 2,
      max: 10
    }
  },
  playfair: {
    name: 'Playfair Cipher',
    description: 'Encrypts pairs of letters using a 5×5 grid derived from a keyword.',
    hasKey: true,
    keyType: 'text',
    defaultKey: 'KEYWORD',
    keyConstraints: {
      pattern: '^[A-Za-z]+$'
    }
  }
};

export const CipherPlayground: React.FC = () => {
  // State for the cipher playground
  const [cipherType, setCipherType] = useState<CipherType>('caesar');
  const [input, setInput] = useState('');
  const [key, setKey] = useState(cipherTypes.caesar.defaultKey);
  const [output, setOutput] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Update key when cipher type changes
  useEffect(() => {
    setKey(cipherTypes[cipherType].defaultKey);
    setOutput('');
    setSteps([]);
    setShowSteps(false);
    setShowExplanation(false);
    setShowVisualizer(false);
  }, [cipherType]);

  // Caesar cipher implementation
  const caesarCipher = (text: string, shift: number, decrypt = false): string => {
    const shiftAmount = decrypt ? -shift : shift;
    
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        // Ensure positive modulo result
        const shifted = ((code - base + shiftAmount) % 26 + 26) % 26;
        return String.fromCharCode(shifted + base);
      }
      return char;
    }).join('');
  };

  // Atbash cipher implementation
  const atbashCipher = (text: string): string => {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        return String.fromCharCode(base + 25 - (code - base));
      }
      return char;
    }).join('');
  };

  // Vigenère cipher implementation
  const vigenereCipher = (text: string, keyword: string, decrypt = false): string => {
    const normalized = keyword.toUpperCase().replace(/[^A-Z]/g, '');
    if (!normalized) return text; // Return original if no valid key
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-z]/i)) {
        const isUpperCase = char === char.toUpperCase();
        const plainChar = char.toUpperCase();
        const keyChar = normalized[keyIndex % normalized.length];
        const shift = keyChar.charCodeAt(0) - 65;
        
        // Apply shift
        let code;
        if (decrypt) {
          code = ((plainChar.charCodeAt(0) - 65) - shift + 26) % 26;
        } else {
          code = ((plainChar.charCodeAt(0) - 65) + shift) % 26;
        }
        
        const resultChar = String.fromCharCode(code + 65);
        result += isUpperCase ? resultChar : resultChar.toLowerCase();
        keyIndex++;
      } else {
        result += char;
      }
    }
    
    return result;
  };

  // Rail Fence cipher implementation
  const railFenceCipher = (text: string, rails: number, decrypt = false): string => {
    if (rails < 2 || rails >= text.length) {
      return text;
    }
    
    if (decrypt) {
      // Decryption
      const fence = Array(rails).fill('').map(() => Array(text.length).fill(''));
      let rail = 0;
      let direction = 1;
      
      // Mark fence positions
      for (let i = 0; i < text.length; i++) {
        fence[rail][i] = '*';
        rail += direction;
        if (rail === 0 || rail === rails - 1) {
          direction = -direction;
        }
      }
      
      // Fill in the fence with ciphertext
      let index = 0;
      for (let i = 0; i < rails; i++) {
        for (let j = 0; j < text.length; j++) {
          if (fence[i][j] === '*' && index < text.length) {
            fence[i][j] = text[index++];
          }
        }
      }
      
      // Read off the rails in zigzag pattern
      let result = '';
      rail = 0;
      direction = 1;
      for (let i = 0; i < text.length; i++) {
        result += fence[rail][i];
        rail += direction;
        if (rail === 0 || rail === rails - 1) {
          direction = -direction;
        }
      }
      
      return result;
    } else {
      // Encryption
      const fence = Array(rails).fill('').map(() => Array(text.length).fill(''));
      let rail = 0;
      let direction = 1;
      
      // Fill the fence with plaintext
      for (let i = 0; i < text.length; i++) {
        fence[rail][i] = text[i];
        rail += direction;
        if (rail === 0 || rail === rails - 1) {
          direction = -direction;
        }
      }
      
      // Read off the fence row by row
      return fence.flat().filter(char => char !== '').join('');
    }
  };

  // Playfair cipher helper functions
  const createPlayfairMatrix = (keyword: string): string[][] => {
    const normalized = keyword.toUpperCase().replace(/[^A-Z]/g, '') + 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    const matrix: string[][] = Array(5).fill(null).map(() => Array(5).fill(''));
    const used = new Set<string>();
    
    let row = 0;
    let col = 0;
    
    for (let i = 0; i < normalized.length; i++) {
      let char = normalized[i];
      
      // Replace J with I
      if (char === 'J') char = 'I';
      
      if (!used.has(char)) {
        matrix[row][col] = char;
        used.add(char);
        
        col++;
        if (col === 5) {
          col = 0;
          row++;
          if (row === 5) break;
        }
      }
    }
    
    return matrix;
  };
  
  const findPosition = (matrix: string[][], char: string): [number, number] => {
    if (char === 'J') char = 'I';
    
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (matrix[i][j] === char) {
          return [i, j];
        }
      }
    }
    
    return [0, 0]; // Fallback, should never happen
  };
  
  // Playfair cipher implementation
  const playfairCipher = (text: string, keyword: string, decrypt = false): string => {
    const normalized = text.toUpperCase().replace(/[^A-Z]/g, '');
    const matrix = createPlayfairMatrix(keyword);
    let result = '';
    
    // Prepare text by splitting into digraphs, adding X between doubles
    const digraphs: string[] = [];
    let i = 0;
    
    while (i < normalized.length) {
      if (i === normalized.length - 1) {
        // Last character alone, add X
        digraphs.push(normalized[i] + 'X');
        break;
      }
      
      if (normalized[i] === normalized[i + 1]) {
        digraphs.push(normalized[i] + 'X');
        i++;
      } else {
        digraphs.push(normalized[i] + normalized[i + 1]);
        i += 2;
      }
    }
    
    // Process each digraph
    for (const digraph of digraphs) {
      const [row1, col1] = findPosition(matrix, digraph[0]);
      const [row2, col2] = findPosition(matrix, digraph[1]);
      
      let newChar1: string, newChar2: string;
      
      if (row1 === row2) {
        // Same row
        const colShift = decrypt ? -1 : 1;
        newChar1 = matrix[row1][(col1 + colShift + 5) % 5];
        newChar2 = matrix[row2][(col2 + colShift + 5) % 5];
      } else if (col1 === col2) {
        // Same column
        const rowShift = decrypt ? -1 : 1;
        newChar1 = matrix[(row1 + rowShift + 5) % 5][col1];
        newChar2 = matrix[(row2 + rowShift + 5) % 5][col2];
      } else {
        // Rectangle
        newChar1 = matrix[row1][col2];
        newChar2 = matrix[row2][col1];
      }
      
      result += newChar1 + newChar2;
    }
    
    return result;
  };
  
  // Generic encrypt function that calls the appropriate cipher
  const encrypt = async () => {
    if (!input) return;
    
    let result = '';
    const steps: string[] = [];
    
    switch (cipherType) {
      case 'caesar':
        const shift = parseInt(key) || 0;
        steps.push(`Step 1: Convert each letter by shifting ${shift} positions in the alphabet.`);
        steps.push(`Example: 'A' → '${String.fromCharCode(65 + shift % 26)}'`);
        result = caesarCipher(input, shift);
        break;
        
      case 'atbash':
        steps.push(`Step 1: Replace each letter with its mirror position in the alphabet.`);
        steps.push(`Example: 'A' → 'Z', 'B' → 'Y', etc.`);
        result = atbashCipher(input);
        break;
        
      case 'vigenere':
        if (!key) {
          setKey('KEY');
          return;
        }
        steps.push(`Step 1: For each letter in plaintext, use the corresponding letter in the key to determine shift.`);
        steps.push(`Step 2: Key '${key.toUpperCase()}' repeats as needed to match plaintext length.`);
        steps.push(`Example: Plaintext 'A' with key letter 'K' (shift 10) → '${String.fromCharCode(65 + 10)}'`);
        result = vigenereCipher(input, key, false);
        break;
        
      case 'railfence':
        const rails = parseInt(key) || 3;
        steps.push(`Step 1: Write text in zigzag pattern across ${rails} rails.`);
        steps.push(`Step 2: Read off each rail from top to bottom.`);
        result = railFenceCipher(input, rails, false);
        break;
        
      case 'playfair':
        if (!key) {
          setKey('KEYWORD');
          return;
        }
        steps.push(`Step 1: Create 5x5 matrix from key '${key.toUpperCase()}' (I/J share position).`);
        steps.push(`Step 2: Split plaintext into digraphs (pairs of letters).`);
        steps.push(`Step 3: Apply Playfair rules: same row → shift right, same column → shift down, otherwise → swap columns.`);
        result = playfairCipher(input, key, false);
        break;
    }
    
    setOutput(result);
    setSteps(steps);
    setShowSteps(true);
    
    // Get AI step-by-step explanation if not already showing
    if (!showExplanation) {
      try {
        setLoading(true);
        const aiSteps = await getStepByStepSolution(
          cipherTypes[cipherType].name,
          result,
          key
        );
        setExplanation(aiSteps);
        setShowExplanation(true);
      } catch (error) {
        console.error('Error getting AI explanation:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Generic decrypt function
  const decrypt = () => {
    if (!input) return;
    
    let result = '';
    
    switch (cipherType) {
      case 'caesar':
        const shift = parseInt(key) || 0;
        result = caesarCipher(input, shift, true);
        break;
        
      case 'atbash':
        // Atbash is its own inverse
        result = atbashCipher(input);
        break;
        
      case 'vigenere':
        if (!key) {
          setKey('KEY');
          return;
        }
        result = vigenereCipher(input, key, true);
        break;
        
      case 'railfence':
        const rails = parseInt(key) || 3;
        result = railFenceCipher(input, rails, true);
        break;
        
      case 'playfair':
        if (!key) {
          setKey('KEYWORD');
          return;
        }
        result = playfairCipher(input, key, true);
        break;
    }
    
    setOutput(result);
  };
  
  // Get explanation for the current cipher
  const getExplanation = async () => {
    try {
      setLoading(true);
      const aiExplanation = await getConceptExplanation(cipherTypes[cipherType].name);
      setExplanation(aiExplanation);
      setShowExplanation(true);
    } catch (error) {
      console.error('Error getting cipher explanation:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle the visualizer
  const toggleVisualizer = () => {
    setShowVisualizer(!showVisualizer);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 flex flex-col h-full">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Lock className="w-5 h-5 mr-2 text-purple-400" />
        Cipher Playground
      </h3>
      
      {/* Cipher Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Cipher Type
        </label>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:space-x-2">
          {Object.entries(cipherTypes).map(([type, info]) => (
            <button
              key={type}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                cipherType === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setCipherType(type as CipherType)}
            >
              {info.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4 flex-grow">
        {/* Description */}
        <div className="p-3 bg-gray-800/50 rounded-lg flex items-start">
          <BookOpen className="w-5 h-5 text-purple-400 mr-2 mt-0.5" />
          <p className="text-sm text-gray-300">{cipherTypes[cipherType].description}</p>
        </div>
        
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter your message
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Type something..."
          />
        </div>
        
        {/* Key Input (if applicable) */}
        {cipherTypes[cipherType].hasKey && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {cipherTypes[cipherType].keyType === 'number' ? 'Shift/Rails' : 'Keyword'}
            </label>
            {cipherTypes[cipherType].keyType === 'number' ? (
              <input
                type="number"
                min={cipherTypes[cipherType].keyConstraints?.min || 0}
                max={cipherTypes[cipherType].keyConstraints?.max || 25}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter keyword..."
              />
            )}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-6">
        <button
          onClick={encrypt}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
        >
          <Lock className="w-4 h-4" />
          <span>Encrypt</span>
        </button>
        <button
          onClick={decrypt}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-white transition-colors"
        >
          <Unlock className="w-4 h-4" />
          <span>Decrypt</span>
        </button>
        <button
          onClick={getExplanation}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          disabled={loading}
        >
          <Brain className="w-4 h-4" />
          <span>AI Explain</span>
        </button>
        <button
          onClick={toggleVisualizer}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
        >
          <Layers className="w-4 h-4" />
          <span>Visualize</span>
        </button>
      </div>
      
      {/* Result */}
      {output && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Result
          </label>
          <div className="p-4 bg-black/30 rounded-lg text-purple-400 font-mono break-all">
            {output}
          </div>
        </div>
      )}
      
      {/* Visualization */}
      {showVisualizer && input && cipherType === 'railfence' && (
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-lg font-medium text-purple-300 mb-2 flex items-center">
            <Layers className="w-4 h-4 mr-1" />
            Rail Fence Visualization
          </h4>
          <div className="font-mono text-sm">
            {(() => {
              const rails = parseInt(key) || 3;
              const fence = Array(rails).fill('').map(() => Array(input.length).fill(' '));
              let rail = 0;
              let direction = 1;
              
              // Fill the fence
              for (let i = 0; i < input.length; i++) {
                fence[rail][i] = input[i];
                rail += direction;
                if (rail === 0 || rail === rails - 1) {
                  direction = -direction;
                }
              }
              
              // Render the fence
              return fence.map((row, i) => (
                <div key={i} className="flex">
                  <span className="w-8 text-right pr-2 text-gray-500">{i+1}:</span>
                  <div className="flex space-x-1">
                    {row.map((char, j) => (
                      <span 
                        key={j} 
                        className={`w-6 h-6 flex items-center justify-center rounded ${
                          char !== ' ' ? 'bg-purple-900/50 text-purple-300' : ''
                        }`}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
      
      {/* Playfair Matrix Visualization */}
      {showVisualizer && cipherType === 'playfair' && (
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-lg font-medium text-purple-300 mb-2 flex items-center">
            <Layers className="w-4 h-4 mr-1" />
            Playfair Matrix
          </h4>
          <div className="grid grid-cols-5 gap-1">
            {createPlayfairMatrix(key).flat().map((char, index) => (
              <div 
                key={index} 
                className="w-10 h-10 bg-purple-900/50 rounded flex items-center justify-center text-purple-300 font-mono"
              >
                {char}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Note: I and J share the same position in the matrix.</p>
        </div>
      )}
      
      {/* Steps */}
      {showSteps && steps.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-lg font-medium text-purple-300 mb-2 flex items-center">
            <Lightbulb className="w-4 h-4 mr-1" />
            How It Works
          </h4>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <p key={index} className="text-sm text-gray-300">
                {step}
              </p>
            ))}
          </div>
        </div>
      )}
      
      {/* AI Explanation */}
      {showExplanation && (
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-lg font-medium text-purple-300 mb-2 flex items-center">
            <Brain className="w-4 h-4 mr-1" />
            AI Explanation
          </h4>
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
              <span className="ml-2 text-gray-300">Loading explanation...</span>
            </div>
          ) : (
            <div className="text-sm text-gray-300 prose prose-sm prose-invert max-w-none">
              {explanation.split('\n').map((para, idx) => (
                <p key={idx} className={para.trim() === '' ? 'mt-4' : ''}>
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};