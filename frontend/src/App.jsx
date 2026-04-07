import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

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
  return (
    <div className="text-[15px] leading-relaxed text-[#d1d5db] space-y-4 font-sans whitespace-pre-wrap">
      {text.split('```').map((block, idx) => {
        if (idx % 2 !== 0) {
          return (
            <div key={idx} className="bg-[#1e1e1e] rounded-md p-4 overflow-x-auto text-[#9cdcfe] font-mono text-sm">
              <code>{block.replace(/^javascript\n/, '')}</code>
            </div>
          );
        }
        return <span key={idx}>{block}</span>;
      })}
    </div>
  );
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]);
  // Determines if any chat interaction is currently loading so we can disable the send button
  const isCurrentlyLoading = history.length > 0 && history[history.length - 1].loading;
  const endOfContentRef = useRef(null);

  const handleRunBattle = (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isCurrentlyLoading) return;
    
    const submittedPrompt = prompt.trim();
    // Clear the input instantly so it turns blank
    setPrompt('');
    
    // Add to history as loading
    setHistory(prev => [...prev, { prompt: submittedPrompt, loading: true }]);

    // Smooth scroll down to current prompt
    setTimeout(() => {
      endOfContentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    // Simulate API resolving
    setTimeout(() => {
      setHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { 
          prompt: submittedPrompt, 
          data: MOCK_DATA, 
          loading: false 
        };
        return newHistory;
      });
      // Smooth scroll exactly to the new result
      setTimeout(() => {
        endOfContentRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRunBattle();
    }
  };

  return (
    <div className="h-screen bg-[#0f0f0f] text-white font-sans flex flex-col overflow-hidden">
      
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center custom-scrollbar">
        
        {/* Intro Header: Only shows if there's no history */}
        {history.length === 0 && (
          <div className="mt-[20vh] text-center px-4">
            <h1 className="text-2xl font-medium text-[#ececec]">Compare AI responses</h1>
            <p className="text-base text-[#888] mt-2">Which response is better?</p>
          </div>
        )}

        <div className="w-full max-w-6xl mx-auto px-4 pt-12 pb-8 flex flex-col gap-16">
          {history.map((interaction, index) => {
            const data = interaction.data;
            const winner = data 
              ? (data.judge.solution_1_score > data.judge.solution_2_score ? 1 : (data.judge.solution_2_score > data.judge.solution_1_score ? 2 : 0)) 
              : 0;

            return (
              <div key={index} className="flex flex-col animate-in fade-in duration-500 w-full">
                
                {/* User Prompt Display */}
                <div className="flex justify-end mb-8">
                  <div className="bg-[#212121] text-[#ececec] px-5 py-3 rounded-2xl max-w-2xl text-[15px]">
                    {interaction.prompt}
                  </div>
                </div>

                {/* Loading Indicator */}
                {interaction.loading && (
                  <div className="flex justify-start mb-8 text-[#888] text-sm animate-pulse">
                    Thinking... it usually takes a few seconds to compare models.
                  </div>
                )}

                {/* Responses & Judge Area (only when not loading) */}
                {data && !interaction.loading && (
                  <div className="flex flex-col">
                    <div className="grid md:grid-cols-2 gap-6 w-full mb-12">
                      {/* Response 1 Panel */}
                      <div className={`flex flex-col border rounded-xl p-5 bg-[#171717]/50 hover:bg-[#171717] transition-colors ${winner === 1 ? 'border-green-500/50' : 'border-[#2d2d2d]'}`}>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2d2d2d]/60">
                          <h2 className="text-sm font-semibold text-[#ccc] flex items-center gap-2">
                            Response 1
                            {winner === 1 && (
                              <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-medium">
                                <CheckCircle2 size={12} />
                                Recommended
                              </span>
                            )}
                          </h2>
                          <button className="text-xs text-[#888] hover:text-[#ccc] px-3 py-1.5 border border-[#2d2d2d] rounded flex items-center gap-2 transition-colors">
                            Prefer this response
                          </button>
                        </div>
                        <div className="flex-1">
                          <FormattedText text={data.solution_1} />
                        </div>
                      </div>

                      {/* Response 2 Panel */}
                      <div className={`flex flex-col border rounded-xl p-5 bg-[#171717]/50 hover:bg-[#171717] transition-colors ${winner === 2 ? 'border-green-500/50' : 'border-[#2d2d2d]'}`}>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2d2d2d]/60">
                          <h2 className="text-sm font-semibold text-[#ccc] flex items-center gap-2">
                            Response 2
                            {winner === 2 && (
                              <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-medium">
                                <CheckCircle2 size={12} />
                                Recommended
                              </span>
                            )}
                          </h2>
                          <button className="text-xs text-[#888] hover:text-[#ccc] px-3 py-1.5 border border-[#2d2d2d] rounded flex items-center gap-2 transition-colors">
                            Prefer this response
                          </button>
                        </div>
                        <div className="flex-1">
                          <FormattedText text={data.solution_2} />
                        </div>
                      </div>
                    </div>

                    {/* Exact Judge Recommendation Layout from Reference Image */}
                    <div className="w-full">
                      <h3 className="text-[12px] font-semibold tracking-wider text-[#888] uppercase mb-3 text-left">Judge Recommendation</h3>
                      
                      <div className="bg-[#171717] border border-[#2d2d2d] rounded-xl p-6 flex flex-col">
                        <div className="flex flex-col space-y-2 mb-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={20} className="text-[#3b82f6]" strokeWidth={2} />
                            <span className="text-[15px] font-medium text-[#ececec]">Recommended: Response {winner}</span>
                          </div>
                          
                          <div className="text-[13px] text-[#888]">
                            Score: {data.judge.solution_1_score} vs {data.judge.solution_2_score}
                          </div>
                        </div>
                        
                        <div className="border-t border-[#2d2d2d] pt-4 mt-1">
                          <p className="text-[14px] text-[#888] mb-1 text-left">Explanation:</p>
                          <p className="text-[14px] text-[#ccc] leading-relaxed text-left">
                            {winner === 1 ? data.judge.solution_1_reasoning : data.judge.solution_2_reasoning}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {/* Empty element to scroll to */}
          <div ref={endOfContentRef} className="h-4" />
        </div>
      </div>

      {/* Fixed Bottom Input Area (ChatGPT Style) */}
      <div className="w-full flex justify-center pb-6 pt-2 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/90 to-transparent">
        <form onSubmit={handleRunBattle} className="w-full max-w-3xl px-4 relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            style={{ minHeight: '52px', maxHeight: '200px' }}
            className="w-full bg-[#212121] border border-[#2d2d2d] focus-visible:border-[#555] rounded-2xl pl-5 pr-14 py-[14px] text-[15px] outline-none text-[#ececec] placeholder-[#888] shadow-sm transition-colors resize-none"
          />
          <button 
            type="submit" 
            disabled={isCurrentlyLoading || !prompt.trim()}
            className="absolute right-7 bottom-4 p-2 bg-[#ececec] text-black rounded-lg hover:bg-white disabled:bg-[#333] disabled:text-[#444] transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
      <div className="text-center pb-4 text-xs text-[#666]">
        AI Battle Arena can make mistakes. Consider verifying responses.
      </div>
    </div>
  );
}

export default App;
