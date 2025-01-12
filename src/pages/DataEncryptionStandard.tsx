import React, { useState } from 'react';
import { Shield, Key, Lock, Database, Cpu, Network, ArrowRight, Play, RefreshCw } from 'lucide-react';

const SDESImplementation = () => {
  const [input, setInput] = useState('01110010');
  const [key, setKey] = useState('1010000010');
  const [result, setResult] = useState('01110111');
  const [activeTab, setActiveTab] = useState('sdes');
  const [showPermutations, setShowPermutations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const permutations = {
    P10: [3, 5, 2, 7, 4, 10, 1, 9, 8, 6],
    P8: [6, 3, 7, 4, 8, 5, 10, 9],
    P4: [2, 4, 3, 1],
    IP: [2, 6, 3, 1, 4, 8, 5, 7]
  };

  const handleEncrypt = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-purple-400 mb-4">Data Encryption Standards</h1>
          <p className="text-gray-400">Comprehensive Guide to DES and AES Implementation</p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          {['sdes', 'des', 'aes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Theory */}
          <div className="space-y-6">
            <section className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">
                {activeTab === 'sdes' ? 'Simple DES Overview' : 
                 activeTab === 'des' ? 'DES Algorithm' : 'AES Structure'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="text-purple-400" />
                  <h3 className="text-xl font-semibold">Key Features</h3>
                </div>
                
                <ul className="space-y-2 text-gray-300">
                  {activeTab === 'sdes' && (
                    <>
                      <li>• 8-bit block size</li>
                      <li>• 10-bit key length</li>
                      <li>• 2 rounds of encryption</li>
                      <li>• Feistel network structure</li>
                    </>
                  )}
                  {activeTab === 'des' && (
                    <>
                      <li>• 64-bit block size</li>
                      <li>• 56-bit effective key length</li>
                      <li>• 16 rounds of encryption</li>
                      <li>• Complex key schedule</li>
                    </>
                  )}
                  {activeTab === 'aes' && (
                    <>
                      <li>• 128-bit block size</li>
                      <li>• 128/192/256-bit key sizes</li>
                      <li>• 10/12/14 rounds</li>
                      <li>• Substitution-permutation network</li>
                    </>
                  )}
                </ul>
              </div>
            </section>

            {/* Permutation Tables */}
            <section className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-purple-400">Permutation Tables</h3>
                <button
                  onClick={() => setShowPermutations(!showPermutations)}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  {showPermutations ? 'Hide' : 'Show'} Tables
                </button>
              </div>
              
              {showPermutations && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(permutations).map(([name, perm]) => (
                    <div key={name} className="bg-gray-900 p-4 rounded-lg">
                      <h4 className="text-purple-400 mb-2">{name}</h4>
                      <div className="grid grid-cols-5 gap-1">
                        {perm.map((num, i) => (
                          <div key={i} className="bg-purple-900/30 p-1 rounded text-center text-sm">
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Interactive Demo */}
          <div className="space-y-6">
            <section className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-6">Interactive Demo</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Plaintext</label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-gray-900 border border-purple-500/30 rounded p-2 text-purple-300"
                    placeholder="Enter 8-bit binary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Key</label>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full bg-gray-900 border border-purple-500/30 rounded p-2 text-purple-300"
                    placeholder="Enter 10-bit key"
                  />
                </div>

                <button
                  onClick={handleEncrypt}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Encrypt
                </button>

                <div className="bg-gray-900 p-4 rounded-lg">
                  <h4 className="font-bold mb-2 text-purple-300">Result:</h4>
                  <code className="text-purple-300">{result}</code>
                </div>
              </div>
            </section>

            {/* Visualization */}
            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Process Visualization</h3>
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Encryption process visualization</p>
              </div>
            </section>
          </div>
        </div>

        {/* Additional Information */}
        <section className="mt-12 bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">Implementation Details</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="font-bold text-purple-300">S-Boxes</h3>
              <div className="bg-gray-900 p-4 rounded-lg">
              <div className="bg-black/30 p-4 rounded-lg">
                      <img 
                        src="https://i.postimg.cc/59m5MTVT/s-boxes.png"
                        alt="Key-Scheduling"
                        className="rounded-lg w-full mb-4"
                      />
                      <p className="text-sm text-gray-400 italic">Key-Scheduling</p>
                    </div>
                <p className="text-sm text-gray-400">
                  Non-linear substitution tables used in the F function
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-purple-300">Key Schedule</h3>
              <div className="bg-gray-900 p-4 rounded-lg">
              <div className="bg-black/30 p-4 rounded-lg">
                      <img 
                        src="https://i.postimg.cc/kG7xbFxT/Key-Scheduling.png"
                        alt="Key-Scheduling"
                        className="rounded-lg w-full mb-4"
                      />
                      <p className="text-sm text-gray-400 italic">Key-Scheduling</p>
                    </div>
                  
                <p className="text-sm text-gray-400">
                  Process of generating subkeys for each round
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-purple-300">Round Function</h3>
              <div className="bg-gray-900 p-4 rounded-lg">
              <div className="bg-black/30 p-4 rounded-lg">
                      <img 
                        src="https://i.postimg.cc/QCSck9mh/Round-Function.png"
                        alt="Key-Scheduling"
                        className="rounded-lg w-full mb-4"
                      />
                      <p className="text-sm text-gray-400 italic">Key-Scheduling</p>
                    </div>
                <p className="text-sm text-gray-400">
                  Core transformation applied in each round
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SDESImplementation;