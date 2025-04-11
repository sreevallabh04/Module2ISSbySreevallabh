import React, { useState } from "react";

type KeyDetails = {
  permutedKey: number[];
  K1: number[];
  K2: number[];
};

type Step = {
  step: string;
  details?: KeyDetails;
  ciphertext?: number[];
};

const SDESEncryption = () => {
  const [input, setInput] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [k1, setK1] = useState<number[]>([]);
  const [k2, setK2] = useState<number[]>([]);
  const [output, setOutput] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [error, setError] = useState<string>("");
  const [showSteps, setShowSteps] = useState<boolean>(false);

  const tables = {
    P10: [3, 5, 2, 7, 4, 10, 1, 9, 8, 6],
    P8: [6, 3, 7, 4, 8, 5, 10, 9],
    IP: [2, 6, 3, 1, 4, 8, 5, 7],
    IP_INV: [4, 1, 3, 5, 7, 2, 8, 6],
    EP: [4, 1, 2, 3, 2, 3, 4, 1],
    P4: [2, 4, 3, 1],
  };

  const validateBinary = (str: string, length: number): boolean => {
    const regex = new RegExp(`^[0-1]{${length}}$`);
    return regex.test(str);
  };

  // Utility functions for encryption
  const permute = (bits: number[], table: number[]): number[] => table.map((i) => bits[i - 1]);
  const leftShift = (bits: number[], shifts: number): number[] => [...bits.slice(shifts), ...bits.slice(0, shifts)];
  const xor = (bits1: number[], bits2: number[]): number[] => bits1.map((bit, i) => bit ^ bits2[i]);

  const generateKeys = (): void => {
    // Clear previous error and results
    setError("");
    setK1([]);
    setK2([]);
    setSteps([]);

    // Validate key input
    if (!key) {
      setError("Please enter a key");
      return;
    }
    if (!validateBinary(key, 10)) {
      setError("Key must be 10 bits of binary (0s and 1s only)");
      return;
    }

    const P10 = tables.P10;
    const P8 = tables.P8;

    // Convert key string to array of numbers and apply P10
    const permutedKey = permute(key.split("").map(Number), P10);
    
    // Split into left and right halves
    const left = permutedKey.slice(0, 5);
    const right = permutedKey.slice(5);

    // Generate K1
    const leftLS1 = leftShift(left, 1);
    const rightLS1 = leftShift(right, 1);
    const combinedLS1 = [...leftLS1, ...rightLS1];
    const K1 = permute(combinedLS1, P8);

    // Generate K2
    const leftLS2 = leftShift(leftLS1, 2);
    const rightLS2 = leftShift(rightLS1, 2);
    const combinedLS2 = [...leftLS2, ...rightLS2];
    const K2 = permute(combinedLS2, P8);

    // Update state with generated keys
    setK1(K1);
    setK2(K2);
    setSteps((prev) => [
      ...prev,
      {
        step: "Key Generation",
        details: {
          permutedKey,
          K1,
          K2,
        },
      },
    ]);
    
    setShowSteps(true);
  };

  const encrypt = (): void => {
    // Validate input before encryption
    if (!input) {
      setError("Please enter input text");
      return;
    }
    if (!validateBinary(input, 8)) {
      setError("Input must be 8 bits of binary (0s and 1s only)");
      return;
    }
    if (k1.length === 0 || k2.length === 0) {
      setError("Please generate keys first");
      return;
    }

    const IP = tables.IP;
    const IP_INV = tables.IP_INV;

    const plaintext = input.split("").map(Number);
    const permutedInput = permute(plaintext, IP);

    let left = permutedInput.slice(0, 4);
    let right = permutedInput.slice(4);

    const round = (left: number[], right: number[], subKey: number[]): [number[], number[]] => {
      const EP = tables.EP;
      const P4 = tables.P4;

      const expandedRight = permute(right, EP);
      const xorResult = xor(expandedRight, subKey);

      const leftXor = xorResult.slice(0, 4);
      const rightXor = xorResult.slice(4);

      const sboxSubstitution = (bits: number[], sbox: number[][]): number[] => {
        const row = (bits[0] << 1) | bits[3];
        const col = (bits[1] << 1) | bits[2];
        const value = sbox[row][col];
        return value.toString(2).padStart(2, "0").split("").map(Number);
      };

      const S0 = [
        [1, 0, 3, 2],
        [3, 2, 1, 0],
        [0, 2, 1, 3],
        [3, 1, 3, 2],
      ];

      const S1 = [
        [0, 1, 2, 3],
        [2, 0, 1, 3],
        [3, 0, 1, 0],
        [2, 1, 0, 3],
      ];

      const sboxLeft = sboxSubstitution(leftXor, S0);
      const sboxRight = sboxSubstitution(rightXor, S1);

      const combinedSBox = [...sboxLeft, ...sboxRight];
      const p4Result = permute(combinedSBox, P4);

      const newLeft = xor(left, p4Result);

      return [newLeft, right];
    };

    [left, right] = round(left, right, k1);
    [left, right] = [right, left];
    [left, right] = round(left, right, k2);

    const combined = [...left, ...right];
    const ciphertext = permute(combined, IP_INV);

    setOutput(ciphertext.join(""));
    setSteps((prev) => [...prev, { step: "Final Permutation", ciphertext }]);
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-purple-400">
          Simplified DES Encryption
        </h1>

        <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block font-semibold">Input (8-bit binary):</label>
            <input
              type="text"
              className="border p-2 rounded w-full text-black"
              value={input}
              onChange={(e) => {
                setError("");
                setInput(e.target.value);
              }}
              placeholder="e.g., 10101010"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Key (10-bit binary):</label>
            <input
              type="text"
              className="border p-2 rounded w-full text-black"
              value={key}
              onChange={(e) => {
                setError("");
                setKey(e.target.value);
              }}
              placeholder="e.g., 1010101010"
            />
          </div>

          <div className="space-x-4 mb-6">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
              onClick={generateKeys}
            >
              Generate Keys
            </button>

            <button 
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded" 
              onClick={encrypt}
            >
              Encrypt
            </button>
          </div>

          {k1.length > 0 && k2.length > 0 && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-bold text-purple-400 mb-2">Generated Keys:</h2>
              <p className="mb-2">K1: {k1.join("")}</p>
              <p>K2: {k2.join("")}</p>
            </div>
          )}

          {output && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-purple-400">Encrypted Output:</h2>
              <p className="text-lg">{output}</p>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-bold text-purple-400">Permutation Tables:</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(tables).map(([tableName, tableValues], index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-lg shadow-md border border-purple-400"
                >
                  <h3 className="text-lg font-semibold text-purple-300">{tableName}</h3>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {tableValues.map((value, i) => (
                      <div
                        key={i}
                        className="bg-purple-500 text-white text-center rounded-lg p-2"
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDESEncryption;