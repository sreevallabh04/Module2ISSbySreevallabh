// AI service using Groq API
const GROQ_API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIRequest = {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
};

export type AIResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: string;
};

/**
 * Sends a request to the Groq API
 */
export const sendToAI = async (
  prompt: string,
  context?: string,
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }
): Promise<string> => {
  try {
    const messages: AIMessage[] = [];
    
    // Add system message if context is provided
    if (context) {
      messages.push({
        role: "system",
        content: context,
      });
    }
    
    // Add user prompt
    messages.push({
      role: "user",
      content: prompt,
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: options?.model || "llama3-70b-8192",
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.max_tokens || 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get AI response");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI service error:", error);
    return "Sorry, I couldn't generate a response. Please try again later.";
  }
};

/**
 * Gets an explanation for a cryptography concept
 */
export const getConceptExplanation = async (
  concept: string
): Promise<string> => {
  const context = `
    You are an expert in cryptography education. 
    Provide clear, concise explanations about cryptography concepts.
    Include historical context, practical applications, and mathematical principles if relevant.
    Explain in a way that is accessible to beginners but includes enough depth for more advanced students.
    Keep your explanations focused on educational value.
  `;
  
  return sendToAI(`Explain the following cryptography concept: ${concept}`, context);
};

/**
 * Generates a challenge for a specific cipher type
 */
export const generateCipherChallenge = async (
  cipherType: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<{
  plaintext: string;
  ciphertext: string;
  key: string;
  hint: string;
}> => {
  const context = `
    You are a cryptography challenge generator.
    Create engaging, educational challenges for students learning about different ciphers.
    For each challenge, provide the plaintext, ciphertext, encryption key, and a helpful hint.
    Tailor the difficulty level as requested (easy, medium, hard).
    Ensure all challenges are solvable and educational.
  `;

  const prompt = `Generate a ${difficulty} difficulty challenge for ${cipherType}. 
    Provide the plaintext, ciphertext, key used for encryption, and a hint that would help solve it.
    Format your response as JSON with keys: plaintext, ciphertext, key, and hint.`;

  const response = await sendToAI(prompt, context);
  
  try {
    // Try to parse the response as JSON
    return JSON.parse(response);
  } catch (e) {
    // If parsing fails, return a default challenge
    console.error("Failed to parse AI challenge response:", e);
    return {
      plaintext: "HELLO",
      ciphertext: "KHOOR",
      key: "3",
      hint: "Shift each letter by the key amount in the alphabet."
    };
  }
};

/**
 * Gets a step-by-step explanation of how to solve a cipher
 */
export const getStepByStepSolution = async (
  cipherType: string,
  ciphertext: string,
  key: string
): Promise<string> => {
  const context = `
    You are a cryptography tutor providing step-by-step explanations.
    Break down the decryption process into clear, logical steps that a student can follow.
    Include examples and visualizations where helpful (use ASCII art if needed).
    Explain the mathematical or logical principles behind each step.
  `;

  const prompt = `Provide a step-by-step explanation of how to decrypt the following ${cipherType} ciphertext: "${ciphertext}" using the key: "${key}".`;
  
  return sendToAI(prompt, context);
};

/**
 * Analyzes user's solution and provides feedback
 */
export const analyzeUserSolution = async (
  cipherType: string,
  challenge: string,
  userSolution: string,
  correctSolution: string
): Promise<{
  isCorrect: boolean;
  feedback: string;
}> => {
  const context = `
    You are a cryptography teacher providing feedback on student solutions.
    Be encouraging and constructive in your feedback.
    If the solution is incorrect, identify where the student went wrong and suggest improvements.
    If the solution is correct, acknowledge their success and offer additional insights or challenges.
  `;

  const prompt = `
    Analyze this student's solution to a ${cipherType} cipher challenge.
    
    Challenge: ${challenge}
    Correct solution: ${correctSolution}
    Student's solution: ${userSolution}
    
    Determine if the solution is correct and provide helpful feedback.
    Format your response as JSON with keys: isCorrect (boolean) and feedback (string).
  `;

  const response = await sendToAI(prompt, context);
  
  try {
    // Try to parse the response as JSON
    return JSON.parse(response);
  } catch (e) {
    // If parsing fails, provide a default response
    console.error("Failed to parse AI analysis response:", e);
    const isCorrect = userSolution.trim().toUpperCase() === correctSolution.trim().toUpperCase();
    return {
      isCorrect,
      feedback: isCorrect 
        ? "Great job! Your solution is correct." 
        : "Your solution doesn't match the expected answer. Try again."
    };
  }
};