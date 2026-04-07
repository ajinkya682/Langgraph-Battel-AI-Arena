import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Bot, Scale, RefreshCw, Copy, Check } from 'lucide-react';

const MOCK_DATA = {
  problem: "Write an code for Factorial function in js",
  solution_1: "Here's a simple implementation of a factorial function in JavaScript using both **iterative** and **recursive** approaches:\n\n### 1. **Iterative Approach (Using a Loop)**\n```javascript\nfunction factorialIterative(n) {\n    if (n < 0) return NaN; // Factorial of negative numbers is undefined\n    let result = 1;\n    for (let i = 2; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\nconsole.log(factorialIterative(5)); // Output: 120\n```\n\n### 2. **Recursive Approach (Function calls itself)**\n```javascript\nfunction factorialRecursive(n) {\n    if (n < 0) return NaN; // Factorial of negative numbers is undefined\n    if (n === 0 || n === 1) return 1; // Base case\n    return n * factorialRecursive(n - 1);\n}\n\nconsole.log(factorialRecursive(5)); // Output: 120\n```\n\n### **Key Notes:**\n- **Factorial of 0 (`0!`)** is `1`.\n- **Factorial of negative numbers** is undefined (`NaN`).\n- **Recursive approach** is elegant but may cause a stack overflow for very large `n` (due to call stack limits).\n- **Iterative approach** is more efficient for large numbers.\n\nWould you like an optimized version (e.g., using memoization)? 😊",
  solution_2: "Certainly! Below is a simple implementation of a factorial function in JavaScript. This function calculates the factorial of a given non-negative integer `n`.\n\n```javascript\nfunction factorial(n) {\n    if (n < 0) {\n        throw new Error(\"Factorial is not defined for negative numbers.\");\n    }\n    if (n === 0 || n === 1) {\n        return 1;\n    }\n    let result = 1;\n    for (let i = 2; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\n// Example usage:\nconsole.log(factorial(5)); // Output: 120\nconsole.log(factorial(0)); // Output: 1\nconsole.log(factorial(10)); // Output: 3628800\n```\n\n### Explanation:\n- **Input Validation**: The function first checks if the input `n` is negative. If it is, an error is thrown because the factorial is not defined for negative numbers.\n- **Base Case**: If `n` is 0 or 1, the function returns 1, as the factorial of 0 and 1 is defined to be 1.\n- **Iterative Calculation**: For `n > 1`, the function initializes `result` to 1 and then iterates from 2 to `n`, multiplying `result` by each integer in this range.\n\n### Recursive Version:\nIf you prefer a recursive implementation, here it is:\n\n```javascript\nfunction factorialRecursive(n) {\n    if (n < 0) {\n        throw new Error(\"Factorial is not defined for negative numbers.\");\n    }\n    if (n === 0 || n === 1) {\n        return 1;\n    }\n    return n * factorialRecursive(n - 1);\n}\n\n// Example usage:\nconsole.log(factorialRecursive(5)); // Output: 120\nconsole.log(factorialRecursive(0)); // Output: 1\nconsole.log(factorialRecursive(10)); // Output: 3628800\n```\n\nBoth versions will correctly compute the factorial of a non-negative integer. Choose the one that best fits your needs or preferences!",
  judge: {
    solution_1_score: 9,
    solution_2_score: 10,
    solution_1_reasoning: "Solution 1 provides both iterative and recursive implementations, which is great for educational purposes. It correctly identifies the base cases and includes a check for negative numbers by returning NaN. The explanation is concise and accurately points out the trade-offs regarding stack overflow in recursion.",
    solution_2_reasoning: "Solution 2 is slightly superior because it uses structured error handling (`throw new Error`) for negative inputs, which is generally better practice in JavaScript than returning NaN, as it prevents silent failures. It also provides more example use cases (like n=0 and n=10) and follows a logical structure that makes it very easy to follow."
  }
};

const FormattedText = ({ text }) => {
  // Ultra simple markdown formatter for mock display purposes
  return (
    <div className="text-sm leading-relaxed text-gray-300 space-y-4 font-mono whitespace-pre-wrap">
      {text.split('```').map((block, idx) => {
        if (idx % 2 !== 0) {
          return (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto text-blue-200">
              <code>{block.replace(/^javascript\n/, '')}</code>
            </div>
          );
        }
        return <span key={idx}>{block}</span>;
      })}
    </div>
  );
};

const SolutionColumn = ({ title, icon: Icon, time, solution, colorClass, borderClass, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`glass-panel rounded-2xl p-6 flex flex-col h-full border-t-4 shadow-xl ${borderClass} transition-transform duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gray-800/80 ${colorClass}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-100">{title}</h3>
            <span className="text-xs text-gray-500 opacity-80">{time}ms response time</span>
          </div>
        </div>
        <button 
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
          title="Copy Response"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{maxHeight: '500px'}}>
        <FormattedText text={solution} />
      </div>
    </div>
  );
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRunBattle = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-white selection:bg-purple-500/30 font-sans">
      
      {/* Top Section: Prompt Input */}
      <div className="sticky top-0 z-50 glass-panel border-b-0 border-b-[var(--color-border-subtle)] bg-[#030712]/80 pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 inline-flex items-center gap-2">
            <Sparkles size={28} className="text-purple-400" />
            AI Battle Arena
          </h1>
          
          <form onSubmit={handleRunBattle} className="relative group max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-gray-900 border border-gray-700 focus-within:border-gray-500 rounded-2xl overflow-hidden shadow-2xl transition-all">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your question or problem..."
                className="w-full bg-transparent px-6 py-5 text-lg outline-none text-gray-100 placeholder-gray-500"
              />
              <button 
                type="submit" 
                disabled={loading || !prompt.trim()}
                className="mr-3 px-6 py-3 bg-white text-black font-semibold rounded-xl flex items-center gap-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                Run Battle
              </button>
            </div>
          </form>

          {/* Example Chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {["Write a Factorial function in JS", "Explain Quantum Computing", "Next.js vs React"].map((chip, idx) => (
              <button 
                key={idx} 
                onClick={() => setPrompt(chip)}
                className="px-4 py-2 text-sm text-gray-400 bg-gray-800/50 hover:bg-gray-800 hover:text-gray-200 border border-gray-700/50 rounded-full transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-70 animate-pulse">
            <Bot size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400">Models are generating responses...</p>
          </div>
        ) : data ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            
            {/* AI Response Comparison */}
            <div className="grid md:grid-cols-2 gap-8 align-start items-start">
              <SolutionColumn 
                title="AI Model 1" 
                icon={Bot} 
                time={845}
                solution={data.solution_1} 
                colorClass="text-blue-400"
                borderClass="border-blue-500/50 hover:border-blue-500"
                onCopy={() => navigator.clipboard.writeText(data.solution_1)}
              />
              <SolutionColumn 
                title="AI Model 2" 
                icon={Bot} 
                time={912}
                solution={data.solution_2} 
                colorClass="text-purple-400"
                borderClass="border-purple-500/50 hover:border-purple-500"
                onCopy={() => navigator.clipboard.writeText(data.solution_2)}
              />
            </div>

            {/* Judge Section */}
            <div className="relative p-1">
              {/* Glowing Border Wrap */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/40 via-emerald-500/40 to-teal-500/40 rounded-3xl blur-md opacity-30"></div>
              
              <div className="relative glass-panel rounded-3xl p-8 md:p-10 border border-green-500/20 shadow-2xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-gray-800">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                      <Scale size={28} className="text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-100">Judge Recommendation</h2>
                      <p className="text-gray-400 text-sm mt-1">Evaluated based on Accuracy, Clarity, & Depth</p>
                    </div>
                  </div>
                  <div className="bg-green-500/10 text-green-400 px-6 py-2 rounded-full border border-green-500/20 font-semibold flex items-center gap-2">
                    <Check size={18} /> Winner: AI Model 2
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                      <span className="font-semibold text-gray-300">Model 1 Score</span>
                      <span className="text-2xl font-bold text-blue-400">{data.judge.solution_1_score}<span className="text-lg text-gray-600">/10</span></span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-900/80 p-4 rounded-xl border border-green-900/40 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                      <span className="font-semibold text-gray-100">Model 2 Score</span>
                      <span className="text-2xl font-bold text-green-400">{data.judge.solution_2_score}<span className="text-lg text-gray-600">/10</span></span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Model 1 Review</h4>
                      <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-blue-500/30 pl-4">{data.judge.solution_1_reasoning}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Model 2 Review</h4>
                      <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-green-500/50 pl-4">{data.judge.solution_2_reasoning}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
            <Bot size={64} className="text-gray-700 mb-6" />
            <h3 className="text-xl text-gray-400 font-medium">Ready for Battle</h3>
            <p className="text-gray-500 max-w-md mt-2">Enter a prompt above to see how different AI models tackle the exact same problem.</p>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;
