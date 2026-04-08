import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Send,
  CheckCircle2,
  MessageSquare,
  Plus,
  PanelLeftClose,
  PanelLeft,
  Trash2,
} from "lucide-react";

// Resolve backend URL at build time (Vite uses import.meta.env)
const backendUrl =
  import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:3000/generate";

const FormattedText = ({ text }) => {
  return (
    <div className="text-[15px] leading-relaxed text-[#d1d5db] space-y-4 font-sans whitespace-pre-wrap">
      {text.split("```").map((block, idx) => {
        if (idx % 2 !== 0) {
          return (
            <div
              key={idx}
              className="bg-[#1e1e1e] rounded-md p-4 overflow-x-auto text-[#9cdcfe] font-mono text-sm"
            >
              <code>{block.replace(/^javascript\n/, "")}</code>
            </div>
          );
        }
        return <span key={idx}>{block}</span>;
      })}
    </div>
  );
};

function App() {
  const [sessions, setSessions] = useState([
    { id: Date.now().toString(), title: "New Chat", history: [] },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState(sessions[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeSession =
    sessions.find((s) => s.id === currentSessionId) || sessions[0];
  const history = activeSession.history;

  const [prompt, setPrompt] = useState("");
  const isCurrentlyLoading =
    history.length > 0 && history[history.length - 1].loading;
  const endOfContentRef = useRef(null);

  const startNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      title: "New Chat",
      history: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    const newSessions = sessions.filter((s) => s.id !== id);
    if (newSessions.length === 0) {
      const newSession = {
        id: Date.now().toString(),
        title: "New Chat",
        history: [],
      };
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
    } else {
      setSessions(newSessions);
      if (currentSessionId === id) {
        setCurrentSessionId(newSessions[0].id);
      }
    }
  };

  const updateSessionHistory = (id, newHistoryUpdater) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updatedHistory =
            typeof newHistoryUpdater === "function"
              ? newHistoryUpdater(s.history)
              : newHistoryUpdater;
          let title = s.title;
          if (s.title === "New Chat" && updatedHistory.length > 0) {
            title =
              updatedHistory[0].prompt.slice(0, 30) +
              (updatedHistory[0].prompt.length > 30 ? "..." : "");
          }
          return { ...s, title, history: updatedHistory };
        }
        return s;
      }),
    );
  };

  const handleRunBattle = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isCurrentlyLoading) return;

    const submittedPrompt = prompt.trim();
    setPrompt("");

    const sessionId = currentSessionId;
    updateSessionHistory(sessionId, (prevHistory) => [
      ...prevHistory,
      { prompt: submittedPrompt, loading: true },
    ]);

    setTimeout(() => {
      endOfContentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    try {
      const response = await axios.post(backendUrl, {
        prompt: submittedPrompt,
      });
      const data = response.data;

      updateSessionHistory(sessionId, (prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1] = {
          prompt: submittedPrompt,
          data: {
            problem: data.problem,
            solution_1: data.solution_1,
            solution_2: data.solution_2,
            judge: data.judge,
          },
          loading: false,
        };
        return newHistory;
      });
    } catch (error) {
      console.error("Error generating response:", error);
      updateSessionHistory(sessionId, (prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1] = {
          prompt: submittedPrompt,
          error: "Failed to generate response. Please try again.",
          loading: false,
        };
        return newHistory;
      });
    }

    setTimeout(() => {
      endOfContentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handlePreferResponse = (
    sessionId,
    interactionIndex,
    responseNumber,
  ) => {
    updateSessionHistory(sessionId, (prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory[interactionIndex] = {
        ...newHistory[interactionIndex],
        preferredResponse: responseNumber,
      };
      return newHistory;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleRunBattle();
    }
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div
        className={`flex-shrink-0 bg-[#090909] border-r border-[#2d2d2d] transition-all duration-300 flex flex-col ${isSidebarOpen ? "w-[260px]" : "w-0 border-none opacity-0 overflow-hidden"}`}
      >
        <div className="p-3">
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#ececec] hover:bg-[#212121] rounded-lg transition-colors border border-[#2d2d2d]"
          >
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full custom-scrollbar py-2">
          <div className="px-3 pb-2 text-xs font-semibold text-[#888]">
            Recent
          </div>
          <div className="px-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setCurrentSessionId(session.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${currentSessionId === session.id ? "bg-[#212121] text-[#ececec]" : "text-[#888] hover:bg-[#1a1a1a] hover:text-[#ececec]"}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare size={16} className="shrink-0" />
                  <span className="truncate">{session.title}</span>
                </div>
                <button
                  onClick={(e) => deleteSession(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        {/* Top Header - Sidebar toggle */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-[#888] hover:text-[#ececec] rounded-lg border border-transparent hover:border-[#2d2d2d] hover:bg-[#212121] transition-colors bg-[#0f0f0f]/80 backdrop-blur-sm"
          >
            {isSidebarOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeft size={20} />
            )}
          </button>
        </div>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto w-full flex flex-col items-center custom-scrollbar">
          {/* Intro Header: Only shows if there's no history */}
          {history.length === 0 && (
            <div className="mt-[20vh] text-center px-4">
              <h1 className="text-2xl font-medium text-[#ececec]">
                Compare AI responses
              </h1>
              <p className="text-base text-[#888] mt-2">
                Which response is better?
              </p>
            </div>
          )}

          <div className="w-full max-w-6xl mx-auto px-4 pt-12 pb-8 flex flex-col gap-16">
            {history.map((interaction, index) => {
              const data = interaction.data;
              const winner = data
                ? data.judge.solution_1_score > data.judge.solution_2_score
                  ? 1
                  : data.judge.solution_2_score > data.judge.solution_1_score
                    ? 2
                    : 0
                : 0;

              return (
                <div
                  key={index}
                  className="flex flex-col animate-in fade-in duration-500 w-full"
                >
                  {/* User Prompt Display */}
                  <div className="flex justify-end mb-8">
                    <div className="bg-[#212121] text-[#ececec] px-5 py-3 rounded-2xl max-w-2xl text-[15px]">
                      {interaction.prompt}
                    </div>
                  </div>

                  {/* Loading Indicator */}
                  {interaction.loading && (
                    <div className="flex justify-start mb-8 text-[#888] text-sm animate-pulse">
                      Thinking... it usually takes a few seconds to compare
                      models.
                    </div>
                  )}

                  {/* Error Message */}
                  {interaction.error && !interaction.loading && (
                    <div className="flex justify-start mb-8">
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 rounded-2xl max-w-2xl text-[15px]">
                        {interaction.error}
                      </div>
                    </div>
                  )}

                  {/* Responses & Judge Area (only when not loading) */}
                  {data && !interaction.loading && (
                    <div className="flex flex-col">
                      <div
                        className={`grid gap-6 w-full mb-12 ${interaction.preferredResponse ? "grid-cols-1 max-w-4xl mx-auto" : "md:grid-cols-2"}`}
                      >
                        {/* Response 1 Panel */}
                        {(!interaction.preferredResponse ||
                          interaction.preferredResponse === 1) && (
                          <div
                            className={`flex flex-col border rounded-xl p-5 bg-[#171717]/50 hover:bg-[#171717] transition-colors ${winner === 1 ? "border-green-500/50" : "border-[#2d2d2d]"}`}
                          >
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
                              {!interaction.preferredResponse && (
                                <button
                                  onClick={() =>
                                    handlePreferResponse(
                                      currentSessionId,
                                      index,
                                      1,
                                    )
                                  }
                                  className="text-xs text-[#888] hover:text-[#ccc] px-3 py-1.5 border border-[#2d2d2d] rounded flex items-center gap-2 transition-colors"
                                >
                                  Prefer this response
                                </button>
                              )}
                            </div>
                            <div className="flex-1">
                              <FormattedText text={data.solution_1} />
                            </div>
                          </div>
                        )}

                        {/* Response 2 Panel */}
                        {(!interaction.preferredResponse ||
                          interaction.preferredResponse === 2) && (
                          <div
                            className={`flex flex-col border rounded-xl p-5 bg-[#171717]/50 hover:bg-[#171717] transition-colors ${winner === 2 ? "border-green-500/50" : "border-[#2d2d2d]"}`}
                          >
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
                              {!interaction.preferredResponse && (
                                <button
                                  onClick={() =>
                                    handlePreferResponse(
                                      currentSessionId,
                                      index,
                                      2,
                                    )
                                  }
                                  className="text-xs text-[#888] hover:text-[#ccc] px-3 py-1.5 border border-[#2d2d2d] rounded flex items-center gap-2 transition-colors"
                                >
                                  Prefer this response
                                </button>
                              )}
                            </div>
                            <div className="flex-1">
                              <FormattedText text={data.solution_2} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Exact Judge Recommendation Layout from Reference Image */}
                      <div
                        className={`w-full ${interaction.preferredResponse ? "max-w-4xl mx-auto" : ""}`}
                      >
                        <h3 className="text-[12px] font-semibold tracking-wider text-[#888] uppercase mb-3 text-left">
                          Judge Recommendation
                        </h3>

                        <div className="bg-[#171717] border border-[#2d2d2d] rounded-xl p-6 flex flex-col">
                          <div className="flex flex-col space-y-2 mb-4">
                            <div className="flex items-center gap-3">
                              <CheckCircle2
                                size={20}
                                className="text-[#3b82f6]"
                                strokeWidth={2}
                              />
                              <span className="text-[15px] font-medium text-[#ececec]">
                                Recommended: Response {winner}
                              </span>
                            </div>

                            <div className="text-[13px] text-[#888]">
                              Score: {data.judge.solution_1_score} vs{" "}
                              {data.judge.solution_2_score}
                            </div>
                          </div>

                          <div className="border-t border-[#2d2d2d] pt-4 mt-1">
                            <p className="text-[14px] text-[#888] mb-1 text-left">
                              Explanation:
                            </p>
                            <p className="text-[14px] text-[#ccc] leading-relaxed text-left">
                              {winner === 1
                                ? data.judge.solution_1_reasoning
                                : data.judge.solution_2_reasoning}
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
          <form
            onSubmit={handleRunBattle}
            className="w-full max-w-3xl px-4 relative"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              style={{ minHeight: "52px", maxHeight: "200px" }}
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
    </div>
  );
}

export default App;
