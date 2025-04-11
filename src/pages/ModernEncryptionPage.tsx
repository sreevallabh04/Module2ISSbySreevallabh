import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  Database, 
  Cpu, 
  Network, 
  Brain, 
  Code, 
  RefreshCw, 
  ArrowRight, 
  MessageSquare, 
  Eye
} from 'lucide-react';
import { getConceptExplanation } from '../services/ai';

export const ModernEncryptionPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [aiQuestion, setAIQuestion] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAESVisualizer, setShowAESVisualizer] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(false);

  // Function to handle AI explanations
  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    
    try {
      setLoading(true);
      const response = await getConceptExplanation(
        `Explain this modern cryptography concept in detail: ${aiQuestion}`
      );
      setAIResponse(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAIResponse('Sorry, I encountered an error while processing your question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get algorithm-specific explanation
  const getAlgorithmExplanation = async (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
    setLoading(true);
    
    try {
      const response = await getConceptExplanation(
        `Explain how the ${algorithm} encryption algorithm works. Include details about its structure, security features, and practical applications. Make the explanation educational and informative.`
      );
      setAIResponse(response);
    } catch (error) {
      console.error('Error getting algorithm explanation:', error);
      setAIResponse('Sorry, I could not generate an explanation for this algorithm right now.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle AES visualizer
  const toggleAESVisualizer = () => {
    setShowAESVisualizer(!showAESVisualizer);
  };

  // Toggle comparison table
  const toggleComparisonTable = () => {
    setShowComparisonTable(!showComparisonTable);
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center mb-4">
          <h1 className="text-4xl font-bold text-purple-400 mr-4">Modern Encryption</h1>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/30 text-blue-300">
            <Brain className="w-4 h-4 mr-1" />
            <span>AI-Enhanced</span>
          </div>
        </div>
        
        {/* AI Assistant Section */}
        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30 mb-8">
          <div className="flex items-start md:items-center gap-4 mb-4">
            <Brain className="w-8 h-8 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-blue-300">AI Cryptography Assistant</h2>
              <p className="text-gray-300">
                Ask questions about modern encryption concepts, algorithms, or applications
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAIQuestion(e.target.value)}
                className="flex-1 px-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., How does RSA encryption work?"
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
            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
              <div className="flex items-center mb-2">
                <Brain className="w-5 h-5 text-blue-400 mr-2" />
                <h3 className="text-lg font-medium text-blue-300">
                  {selectedAlgorithm ? `${selectedAlgorithm} Explanation` : 'Response'}
                </h3>
              </div>
              <div className="text-sm text-gray-300 prose prose-sm prose-invert prose-cryptography max-w-none">
                {aiResponse.split('\n').map((para, idx) => (
                  <p key={idx} className={para.trim() === '' ? 'mt-4' : ''}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}
          
          {/* Algorithm Quick Select */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-300 mb-3">
              Get AI Explanations for Popular Algorithms:
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => getAlgorithmExplanation('AES (Advanced Encryption Standard)')}
                className="px-3 py-2 bg-purple-900/50 hover:bg-purple-800 rounded-lg text-white text-sm transition-colors"
              >
                AES
              </button>
              <button
                onClick={() => getAlgorithmExplanation('RSA')}
                className="px-3 py-2 bg-purple-900/50 hover:bg-purple-800 rounded-lg text-white text-sm transition-colors"
              >
                RSA
              </button>
              <button
                onClick={() => getAlgorithmExplanation('ECC (Elliptic Curve Cryptography)')}
                className="px-3 py-2 bg-purple-900/50 hover:bg-purple-800 rounded-lg text-white text-sm transition-colors"
              >
                ECC
              </button>
              <button
                onClick={() => getAlgorithmExplanation('SHA-256')}
                className="px-3 py-2 bg-purple-900/50 hover:bg-purple-800 rounded-lg text-white text-sm transition-colors"
              >
                SHA-256
              </button>
              <button
                onClick={() => getAlgorithmExplanation('Diffie-Hellman Key Exchange')}
                className="px-3 py-2 bg-purple-900/50 hover:bg-purple-800 rounded-lg text-white text-sm transition-colors"
              >
                Diffie-Hellman
              </button>
            </div>
          </div>
        </section>
        
        {/* Introduction */}
        <section className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 mb-8">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-purple-400 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Modern Cryptography Overview</h2>
              <p className="text-gray-300 mb-4">
                Modern cryptography combines advanced mathematics with computer science to provide secure communication in the digital age. 
                Unlike classical ciphers, modern encryption algorithms are designed to be secure against computational attacks and are 
                essential for today's interconnected world.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 text-center">
                  <h3 className="font-bold mb-1">Confidentiality</h3>
                  <p className="text-xs text-gray-400">Keeping information secret</p>
                </div>
                <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 text-center">
                  <h3 className="font-bold mb-1">Integrity</h3>
                  <p className="text-xs text-gray-400">Preventing data alteration</p>
                </div>
                <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 text-center">
                  <h3 className="font-bold mb-1">Authentication</h3>
                  <p className="text-xs text-gray-400">Verifying identity</p>
                </div>
                <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 text-center">
                  <h3 className="font-bold mb-1">Non-repudiation</h3>
                  <p className="text-xs text-gray-400">Cannot deny actions</p>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={toggleAESVisualizer}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showAESVisualizer ? 'Hide AES Visualizer' : 'Show AES Visualizer'}
                </button>
                
                <button
                  onClick={toggleComparisonTable}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {showComparisonTable ? 'Hide Comparison' : 'Compare Algorithms'}
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* AES Visualizer */}
        {showAESVisualizer && (
          <section className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">AES Encryption Process Visualizer</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-3">
                <p className="text-gray-300 mb-4">
                  The Advanced Encryption Standard (AES) processes data in blocks through multiple rounds of transformations.
                  Each round includes substitution, permutation, mixing, and key addition operations.
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-purple-300">1. SubBytes</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {Array(16).fill(0).map((_, i) => (
                    <div key={i} className="aspect-square bg-purple-900/30 rounded flex items-center justify-center text-purple-300 text-xs">
                      {i.toString(16).toUpperCase()}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Each byte is replaced with another according to a substitution box (S-box).
                  This provides non-linearity.
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-purple-300">2. ShiftRows</h3>
                <div className="space-y-2 mb-4">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="flex space-x-2">
                      {[0, 1, 2, 3].map((col) => {
                        const value = row * 4 + ((col + row) % 4);
                        return (
                          <div 
                            key={col} 
                            className="w-10 h-10 bg-purple-900/30 rounded flex items-center justify-center text-purple-300 text-xs"
                          >
                            {value.toString(16).toUpperCase()}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Rows are shifted cyclically to the left by different offsets.
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-purple-300">3. MixColumns</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {Array(16).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className="aspect-square bg-purple-900/30 rounded flex items-center justify-center text-purple-300 text-xs"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Each column is multiplied by a fixed polynomial, providing diffusion.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-black/30 rounded-lg">
              <h3 className="text-lg font-bold mb-4 text-purple-300">AES Round Structure</h3>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full max-w-md h-16 bg-purple-900/30 rounded flex items-center justify-center text-purple-300">
                  Initial Round Key Addition
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400 transform rotate-90" />
                {[1, 2, 3, 4].map((round) => (
                  <React.Fragment key={round}>
                    <div className="w-full max-w-md bg-purple-900/50 rounded p-4">
                      <h4 className="text-center font-bold mb-2">Round {round}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-black/30 p-2 rounded text-center text-sm">SubBytes</div>
                        <div className="bg-black/30 p-2 rounded text-center text-sm">ShiftRows</div>
                        <div className="bg-black/30 p-2 rounded text-center text-sm">MixColumns</div>
                        <div className="bg-black/30 p-2 rounded text-center text-sm">AddRoundKey</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-400 transform rotate-90" />
                  </React.Fragment>
                ))}
                <div className="w-full max-w-md bg-purple-900/50 rounded p-4">
                  <h4 className="text-center font-bold mb-2">Final Round</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-black/30 p-2 rounded text-center text-sm">SubBytes</div>
                    <div className="bg-black/30 p-2 rounded text-center text-sm">ShiftRows</div>
                    <div className="bg-black/30 p-2 rounded text-center text-sm">AddRoundKey</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400 transform rotate-90" />
                <div className="w-full max-w-md h-16 bg-purple-900/30 rounded flex items-center justify-center text-purple-300">
                  Ciphertext Output
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Algorithm Comparison */}
        {showComparisonTable && (
          <section className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Encryption Algorithm Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-900/30">
                    <th className="border border-purple-500/30 p-3 text-left">Algorithm</th>
                    <th className="border border-purple-500/30 p-3 text-left">Type</th>
                    <th className="border border-purple-500/30 p-3 text-left">Key Size</th>
                    <th className="border border-purple-500/30 p-3 text-left">Block Size</th>
                    <th className="border border-purple-500/30 p-3 text-left">Security Level</th>
                    <th className="border border-purple-500/30 p-3 text-left">Performance</th>
                    <th className="border border-purple-500/30 p-3 text-left">Applications</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-purple-900/20">
                    <td className="border border-purple-500/30 p-3 font-bold">AES</td>
                    <td className="border border-purple-500/30 p-3">Symmetric Block</td>
                    <td className="border border-purple-500/30 p-3">128, 192, or 256 bits</td>
                    <td className="border border-purple-500/30 p-3">128 bits</td>
                    <td className="border border-purple-500/30 p-3">Very High</td>
                    <td className="border border-purple-500/30 p-3">Excellent</td>
                    <td className="border border-purple-500/30 p-3">TLS, VPNs, File Encryption</td>
                  </tr>
                  <tr className="hover:bg-purple-900/20">
                    <td className="border border-purple-500/30 p-3 font-bold">DES</td>
                    <td className="border border-purple-500/30 p-3">Symmetric Block</td>
                    <td className="border border-purple-500/30 p-3">56 bits</td>
                    <td className="border border-purple-500/30 p-3">64 bits</td>
                    <td className="border border-purple-500/30 p-3">Low (Broken)</td>
                    <td className="border border-purple-500/30 p-3">Good</td>
                    <td className="border border-purple-500/30 p-3">Historical, Legacy Systems</td>
                  </tr>
                  <tr className="hover:bg-purple-900/20">
                    <td className="border border-purple-500/30 p-3 font-bold">3DES</td>
                    <td className="border border-purple-500/30 p-3">Symmetric Block</td>
                    <td className="border border-purple-500/30 p-3">168 bits</td>
                    <td className="border border-purple-500/30 p-3">64 bits</td>
                    <td className="border border-purple-500/30 p-3">Moderate</td>
                    <td className="border border-purple-500/30 p-3">Poor</td>
                    <td className="border border-purple-500/30 p-3">Legacy Financial Systems</td>
                  </tr>
                  <tr className="hover:bg-purple-900/20">
                    <td className="border border-purple-500/30 p-3 font-bold">RSA</td>
                    <td className="border border-purple-500/30 p-3">Asymmetric</td>
                    <td className="border border-purple-500/30 p-3">2048+ bits</td>
                    <td className="border border-purple-500/30 p-3">Variable</td>
                    <td className="border border-purple-500/30 p-3">High</td>
                    <td className="border border-purple-500/30 p-3">Slow</td>
                    <td className="border border-purple-500/30 p-3">Digital Signatures, Key Exchange</td>
                  </tr>
                  <tr className="hover:bg-purple-900/20">
                    <td className="border border-purple-500/30 p-3 font-bold">ECC</td>
                    <td className="border border-purple-500/30 p-3">Asymmetric</td>
                    <td className="border border-purple-500/30 p-3">256 bits</td>
                    <td className="border border-purple-500/30 p-3">Variable</td>
                    <td className="border border-purple-500/30 p-3">Very High</td>
                    <td className="border border-purple-500/30 p-3">Moderate</td>
                    <td className="border border-purple-500/30 p-3">Mobile Devices, IoT</td>
                  </tr>
                  <tr className="hover:bg-purple-900/20">
                    <td className="border border-purple-500/30 p-3 font-bold">ChaCha20</td>
                    <td className="border border-purple-500/30 p-3">Symmetric Stream</td>
                    <td className="border border-purple-500/30 p-3">256 bits</td>
                    <td className="border border-purple-500/30 p-3">N/A (Stream)</td>
                    <td className="border border-purple-500/30 p-3">High</td>
                    <td className="border border-purple-500/30 p-3">Very Good</td>
                    <td className="border border-purple-500/30 p-3">TLS, Mobile Encryption</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="grid gap-8">
          {/* Block Ciphers */}
          <section className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-start gap-4">
              <Cpu className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Block Ciphers</h2>
                
                {/* DES */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-purple-300">DES (Data Encryption Standard)</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-300 mb-4">
                        DES was the first widely-used block cipher standard, operating on 64-bit blocks with a 56-bit key.
                        While now considered insecure due to its short key length, it laid the foundation for modern cryptography.
                      </p>
                      <div className="bg-black/30 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Key Features:</h4>
                        <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                          <li>16 rounds of processing</li>
                          <li>Feistel network structure</li>
                          <li>56-bit key (considered insecure today)</li>
                          <li>64-bit block size</li>
                        </ul>
                        <div className="mt-4">
                          <p className="font-bold mb-2">Key Scheduling</p>
                          <img 
                            src="./src/images/Key Scheduling.png"
                            alt="DES Key Scheduling"
                            className="rounded-lg w-full mb-4"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <div className="mt-2">
                        <p className="font-bold mb-2">Data Encryption Standard Structure</p>
                        <img 
                          src="./src/images/des.jpg"
                          alt="DES Structure"
                          className="rounded-lg w-full mb-4"
                        />
                        <p className="font-bold mb-2">Round Function</p>
                        <img 
                          src="./src/images/RoundFunction.png"
                          alt="DES Round Function"
                          className="rounded-lg w-full mb-4"
                        />
                      </div>
                      <p className="text-sm text-gray-400 italic">DES encryption process visualization</p>
                    </div>
                  </div>
                  
                  {/* DES Code Example */}
                  <div className="mt-6 bg-black/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Code className="w-5 h-5 text-purple-400 mr-2" />
                      <h4 className="font-bold">Implementation Example (Python):</h4>
                    </div>
                    <pre className="text-sm text-gray-300 overflow-x-auto">
{`from Crypto.Cipher import DES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

# Create a key (8 bytes, but only 7 bytes are used - 56 bits)
key = get_random_bytes(8)

# Create cipher
cipher = DES.new(key, DES.MODE_ECB)

# Message to encrypt
message = b"Secret message"

# Pad and encrypt
padded_message = pad(message, DES.block_size)
ciphertext = cipher.encrypt(padded_message)

# Decrypt and unpad
decipher = DES.new(key, DES.MODE_ECB)
decrypted = unpad(decipher.decrypt(ciphertext), DES.block_size)

print("Original:", message)
print("Encrypted:", ciphertext.hex())
print("Decrypted:", decrypted)`}
                    </pre>
                  </div>
                </div>

                {/* AES */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-purple-300">AES (Advanced Encryption Standard)</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-300 mb-4">
                        AES (Rijndael) is the global standard for symmetric encryption, selected by NIST in 2001. 
                        Designed by cryptographers Joan Daemen and Vincent Rijmen, it processes data in 128-bit blocks 
                        through multiple rounds of substitution and permutation operations.
                      </p>
                      <div className="bg-black/30 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Specifications:</h4>
                        <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                          <li>Key sizes: 128 bits (10 rounds), 192 bits (12 rounds), or 256 bits (14 rounds)</li>
                          <li>128-bit block size processed in 4×4 byte matrix</li>
                          <li>Four operations per round: SubBytes, ShiftRows, MixColumns, AddRoundKey</li>
                          <li>Highly efficient in both hardware and software implementations</li>
                          <li>Approved for top-secret information by the NSA</li>
                          <li>Resistant to known attacks including differential and linear cryptanalysis</li>
                        </ul>
                        <div className="mt-4">
                          <img 
                            src="./src/images/aes_structure.jpg"
                            alt="AES Structure"
                            className="rounded-lg w-full mb-4"
                          />
                        </div>
                      </div>
                      
                      {/* AES Code Example */}
                      <div className="mt-6 bg-black/30 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Code className="w-5 h-5 text-purple-400 mr-2" />
                          <h4 className="font-bold">Implementation Example (Python):</h4>
                        </div>
                        <pre className="text-sm text-gray-300 overflow-x-auto">
{`from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

# Generate a random 256-bit key (32 bytes)
key = get_random_bytes(32)

# Generate a random IV (Initialization Vector)
iv = get_random_bytes(16)

# Create cipher object in CBC mode
cipher = AES.new(key, AES.MODE_CBC, iv)

# Message to encrypt
message = b"This is a secret AES message"

# Pad and encrypt
padded_message = pad(message, AES.block_size)
ciphertext = cipher.encrypt(padded_message)

# Create a new cipher for decryption (with same key/iv)
decipher = AES.new(key, AES.MODE_CBC, iv)

# Decrypt and unpad
decrypted = unpad(decipher.decrypt(ciphertext), AES.block_size)

print("Original:", message)
print("Encrypted:", ciphertext.hex())
print("Decrypted:", decrypted)`}
                        </pre>
                      </div>
                    </div>
                    <div>
                      <div className="bg-black/30 p-4 rounded-lg mb-6">
                        <h4 className="font-bold mb-2">AES State Matrix (4×4 bytes)</h4>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {Array(16).fill(0).map((_, i) => (
                            <div key={i} className="aspect-square bg-purple-900/30 rounded flex items-center justify-center text-purple-300 text-xs">
                              {i.toString(16).toUpperCase()}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-400 italic">AES state matrix representation</p>
                      </div>
                      
                      <div className="bg-black/30 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">AES vs. DES Comparison</h4>
                        <table className="w-full text-sm">
                          <thead className="bg-purple-900/30">
                            <tr>
                              <th className="p-2 text-left">Feature</th>
                              <th className="p-2 text-left">AES</th>
                              <th className="p-2 text-left">DES</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-purple-500/20">
                              <td className="p-2">Key Size</td>
                              <td className="p-2">128, 192, 256 bits</td>
                              <td className="p-2">56 bits</td>
                            </tr>
                            <tr className="border-b border-purple-500/20">
                              <td className="p-2">Block Size</td>
                              <td className="p-2">128 bits</td>
                              <td className="p-2">64 bits</td>
                            </tr>
                            <tr className="border-b border-purple-500/20">
                              <td className="p-2">Structure</td>
                              <td className="p-2">Substitution-permutation</td>
                              <td className="p-2">Feistel network</td>
                            </tr>
                            <tr className="border-b border-purple-500/20">
                              <td className="p-2">Rounds</td>
                              <td className="p-2">10, 12, or 14</td>
                              <td className="p-2">16</td>
                            </tr>
                            <tr>
                              <td className="p-2">Security</td>
                              <td className="p-2">Very secure</td>
                              <td className="p-2">Vulnerable</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Public Key Cryptography */}
          <section className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-start gap-4">
              <Key className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Public Key Cryptography</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-300 mb-4">
                      Public key cryptography uses key pairs for encryption and decryption, enabling secure 
                      communication without sharing secret keys. This asymmetric approach revolutionized secure 
                      communication and digital signatures.
                    </p>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <h4 className="font-bold mb-2">Common Algorithms:</h4>
                      <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                        <li>RSA (Rivest-Shamir-Adleman) - Based on factoring large primes</li>
                        <li>ECC (Elliptic Curve Cryptography) - Based on elliptic curve discrete logarithm</li>
                        <li>Diffie-Hellman Key Exchange - Enables secure key exchange over insecure channels</li>
                      </ul>
                    </div>
                    
                    <div className="mt-6 bg-black/30 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Code className="w-5 h-5 text-purple-400 mr-2" />
                        <h4 className="font-bold">RSA Example (Python):</h4>
                      </div>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
{`from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

# Generate an RSA key pair
key = RSA.generate(2048)
private_key = key
public_key = key.publickey()

# Encrypt with public key
cipher = PKCS1_OAEP.new(public_key)
message = b"RSA encryption example"
ciphertext = cipher.encrypt(message)

# Decrypt with private key
cipher = PKCS1_OAEP.new(private_key)
decrypted = cipher.decrypt(ciphertext)

print("Original:", message)
print("Decrypted:", decrypted)`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <div className="bg-black/30 p-4 rounded-lg mb-6">
                      <h4 className="font-bold mb-4 text-purple-300">How Public Key Encryption Works</h4>
                      <div className="flex flex-col space-y-6">
                        <div className="flex justify-between items-center">
                          <div className="w-16 h-16 rounded-full bg-purple-500/30 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-purple-300" />
                          </div>
                          <div className="flex-1 h-1 bg-purple-500/30 mx-4"></div>
                          <div className="w-16 h-16 rounded-full bg-pink-500/30 flex items-center justify-center">
                            <Key className="w-8 h-8 text-pink-300" />
                          </div>
                        </div>
                        <ol className="space-y-4 pl-4">
                          <li className="text-sm text-gray-300">
                            <span className="font-bold">Step 1:</span> The recipient generates a public and private key pair
                          </li>
                          <li className="text-sm text-gray-300">
                            <span className="font-bold">Step 2:</span> The recipient shares their public key with the sender
                          </li>
                          <li className="text-sm text-gray-300">
                            <span className="font-bold">Step 3:</span> The sender encrypts the message using the recipient's public key
                          </li>
                          <li className="text-sm text-gray-300">
                            <span className="font-bold">Step 4:</span> The recipient decrypts the message using their private key
                          </li>
                        </ol>
                      </div>
                      <p className="text-sm text-gray-400 italic text-center mt-4">Public key encryption flow</p>
                    </div>
                    
                    <div className="bg-black/30 p-4 rounded-lg">
                      <h4 className="font-bold mb-2 text-purple-300">Applications of Public Key Cryptography</h4>
                      <div className="space-y-3 mt-4">
                        <div className="p-3 bg-purple-900/20 rounded-lg">
                          <h5 className="font-bold">Digital Signatures</h5>
                          <p className="text-sm text-gray-400">
                            Verifies the authenticity and integrity of messages, documents, and software.
                          </p>
                        </div>
                        <div className="p-3 bg-purple-900/20 rounded-lg">
                          <h5 className="font-bold">Secure Communication</h5>
                          <p className="text-sm text-gray-400">
                            Enables secure messaging and data transfer over insecure channels like the internet.
                          </p>
                        </div>
                        <div className="p-3 bg-purple-900/20 rounded-lg">
                          <h5 className="font-bold">Public Key Infrastructure (PKI)</h5>
                          <p className="text-sm text-gray-400">
                            Forms the foundation of security in HTTPS, VPNs, and secure email.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <img 
                    src="./src/images/publickeycryptography.png"
                    alt="Public Key Cryptography"
                    className="rounded-lg w-full mb-4"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Hash Functions */}
          <section className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-start gap-4">
              <Network className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Hash Functions</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-300 mb-4">
                      Cryptographic hash functions create fixed-size outputs from any input, used for 
                      digital signatures, data integrity verification, and password storage. These one-way 
                      functions should be collision-resistant and computationally infeasible to reverse.
                    </p>
                    <div className="bg-black/30 p-4 rounded-lg">
                      <h4 className="font-bold mb-2">Popular Hash Functions:</h4>
                      <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                        <li>SHA-256 - Used in blockchain, digital signatures</li>
                        <li>SHA-3 - Newer, more secure SHA variant</li>
                        <li>BLAKE2 - Fast and secure alternative to SHA</li>
                        <li>Argon2 - For password hashing with tunable parameters</li>
                      </ul>
                    </div>
                    
                    <div className="mt-6 bg-black/30 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Code className="w-5 h-5 text-purple-400 mr-2" />
                        <h4 className="font-bold">Hash Function Example (Python):</h4>
                      </div>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
{`import hashlib

# Input data
data = "Hash function example"

# Generate hashes
md5 = hashlib.md5(data.encode()).hexdigest()
sha1 = hashlib.sha1(data.encode()).hexdigest()
sha256 = hashlib.sha256(data.encode()).hexdigest()
sha3_256 = hashlib.sha3_256(data.encode()).hexdigest()

print(f"Input: {data}")
print(f"MD5: {md5}")
print(f"SHA-1: {sha1}")
print(f"SHA-256: {sha256}")
print(f"SHA3-256: {sha3_256}")

# Same hash for same input
data2 = "Hash function example"
sha256_2 = hashlib.sha256(data2.encode()).hexdigest()
print(f"SHA-256 again: {sha256_2}")

# Different hash for different input
data3 = "Hash function example."  # Added period
sha256_3 = hashlib.sha256(data3.encode()).hexdigest()
print(f"SHA-256 modified: {sha256_3}")`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <div className="bg-black/30 p-4 rounded-lg mb-6">
                      <h4 className="font-bold mb-2 text-purple-300">Hash Function Properties</h4>
                      <div className="space-y-3 mt-4">
                        <div className="p-3 bg-purple-900/20 rounded-lg">
                          <h5 className="font-bold">One-way (Pre-image resistance)</h5>
                          <p className="text-sm text-gray-400">
                            Given a hash, it should be computationally infeasible to find any input that hashes to that value.
                          </p>
                        </div>
                        <div className="p-3 bg-purple-900/20 rounded-lg">
                          <h5 className="font-bold">Collision resistance</h5>
                          <p className="text-sm text-gray-400">
                            It should be computationally infeasible to find two different inputs that hash to the same output.
                          </p>
                        </div>
                        <div className="p-3 bg-purple-900/20 rounded-lg">
                          <h5 className="font-bold">Avalanche effect</h5>
                          <p className="text-sm text-gray-400">
                            A small change in input produces a completely different hash output.
                          </p>
                        </div>
                        <div className="p-3 bg-purple-900/20 rounded-lg">
                          <h5 className="font-bold">Fixed size output</h5>
                          <p className="text-sm text-gray-400">
                            Regardless of input size, the output hash is always the same length.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 p-4 rounded-lg">
                      <h4 className="font-bold mb-2 text-purple-300">Hash Function Examples</h4>
                      <div className="space-y-2">
                        <div className="p-2 border border-purple-500/30 rounded">
                          <p className="text-sm font-mono text-purple-300 break-all">
                            Input: "Hello"
                            <br />
                            SHA-256: 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969
                          </p>
                        </div>
                        <div className="p-2 border border-purple-500/30 rounded">
                          <p className="text-sm font-mono text-purple-300 break-all">
                            Input: "hello" (lowercase)
                            <br />
                            SHA-256: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Notice how a small change (uppercase to lowercase) completely changes the output hash.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Modern Applications */}
          <section className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 shadow-lg">
            <div className="flex items-start gap-4">
              <Database className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4 text-purple-200">Modern Applications</h2>
                <p className="text-gray-300 mb-6">
                  Modern cryptography is fundamental to digital security and powers many of the services and technologies we use daily.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-black/40 p-6 rounded-lg border border-gray-700 hover:scale-105 transition-transform">
                    <h3 className="font-bold mb-3 text-purple-300 text-lg">HTTPS/TLS</h3>
                    <img 
                      src="./src/images/s-boxes.png"
                      alt="Web Security"
                      className="rounded-lg w-full mb-4 shadow-md"
                    />
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Secures web communication using certificates and encryption, combining both symmetric and asymmetric techniques.
                    </p>
                  </div>
                  <div className="bg-black/40 p-6 rounded-lg border border-gray-700 hover:scale-105 transition-transform">
                    <h3 className="font-bold mb-3 text-purple-300 text-lg">Digital Signatures</h3>
                    <img 
                      src="./src/images/pkc.jpg"
                      alt="Digital Signatures"
                      className="rounded-lg w-full mb-4 shadow-md"
                    />
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Ensures authenticity and non-repudiation of digital documents, using public key cryptography and hash functions.
                    </p>
                  </div>
                  <div className="bg-black/40 p-6 rounded-lg border border-gray-700 hover:scale-105 transition-transform">
                    <h3 className="font-bold mb-3 text-purple-300 text-lg">Blockchain</h3>
                    <img 
                      src="./src/images/random.jpg"
                      alt="Blockchain Technology"
                      className="rounded-lg w-full mb-4 shadow-md"
                    />
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Uses cryptographic hash functions and digital signatures to create secure, immutable ledgers for decentralized applications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};