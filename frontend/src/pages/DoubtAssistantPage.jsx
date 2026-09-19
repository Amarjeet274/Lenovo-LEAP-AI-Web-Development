import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const DoubtAssistantPage = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [conversationId, setConversationId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  const loadConversations = async () => {
    try {
      setHistoryLoading(true);

      const response = await api.get("/ai/conversations");

      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadConversations);
  }, []);

  const askQuestion = async (event) => {
    event.preventDefault();

    if (!question.trim() || loading) {
      return;
    }

    const currentQuestion = question.trim();

    setQuestion("");
    setLoading(true);

    try {
      const response = await api.post("/ai/doubt", {
        question: currentQuestion,
        conversationId,
      });

      const conversation = response.data.conversation;

      setConversationId(conversation._id);

      setMessages(conversation.messages || []);

      await loadConversations();
    } catch (error) {
      console.error("AI Doubt Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to get AI response"
      );

      setQuestion(currentQuestion);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (id) => {
    try {
      const response = await api.get(
        `/ai/conversations/${id}`
      );

      const conversation = response.data.conversation;

      setConversationId(conversation._id);
      setMessages(conversation.messages || []);
    } catch (error) {
      console.error("Failed to open conversation:", error);
    }
  };

  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setQuestion("");
  };

  const deleteConversation = async (id) => {
    try {
      await api.delete(`/ai/conversations/${id}`);

      if (conversationId === id) {
        startNewChat();
      }

      await loadConversations();
    } catch (error) {
      console.error("Delete conversation error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-slate-900/70 p-5">

          <button
            onClick={() => navigate("/dashboard")}
            className="mb-6 text-left text-sm text-slate-400 hover:text-white"
          >
            ← Back to Dashboard
          </button>

          <div className="mb-6">
            <h1 className="text-xl font-bold">
              🤖 AI Doubt Assistant
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Ask questions and learn with AI.
            </p>
          </div>

          <button
            onClick={startNewChat}
            className="mb-6 rounded-xl bg-indigo-600 px-4 py-3 font-semibold transition hover:bg-indigo-500"
          >
            + New Doubt
          </button>

          <div className="flex-1 overflow-y-auto">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              History
            </h2>

            {historyLoading ? (
              <p className="text-sm text-slate-500">
                Loading...
              </p>
            ) : conversations.length === 0 ? (
              <p className="text-sm text-slate-500">
                No previous questions.
              </p>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    className={`group rounded-xl border p-3 transition ${
                      conversationId === conversation._id
                        ? "border-indigo-500/50 bg-indigo-500/10"
                        : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <button
                      onClick={() =>
                        openConversation(conversation._id)
                      }
                      className="w-full text-left"
                    >
                      <p className="truncate text-sm font-medium">
                        {conversation.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {conversation.messages?.length || 0} messages
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        deleteConversation(conversation._id)
                      }
                      className="mt-2 text-xs text-red-400 opacity-0 transition group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex flex-1 flex-col">

          {/* Header */}
          <header className="border-b border-white/10 px-5 py-4 md:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">
                  AI Learning Assistant
                </h2>

                <p className="text-sm text-slate-400">
                  Understand concepts instead of memorizing them.
                </p>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 md:hidden"
              >
                Dashboard
              </button>
            </div>
          </header>

          {/* Messages */}
          <section className="flex-1 overflow-y-auto px-5 py-8 md:px-12">

            {messages.length === 0 ? (
              <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">

                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-4xl">
                  🤖
                </div>

                <h2 className="text-3xl font-bold">
                  What do you want to learn?
                </h2>

                <p className="mt-3 max-w-xl text-slate-400">
                  Ask about JavaScript, React, Node.js,
                  databases, algorithms, career preparation,
                  or any other learning topic.
                </p>

                <div className="mt-8 grid w-full max-w-2xl gap-3 md:grid-cols-2">
                  {[
                    "Explain React hooks",
                    "What is REST API?",
                    "How does MongoDB work?",
                    "Explain binary search",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuestion(suggestion)}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-sm text-slate-300 transition hover:border-indigo-500/40 hover:bg-indigo-500/5"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-4xl space-y-6">

                {messages.map((message, index) => (
                  <div
                    key={message._id || index}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                        message.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "border border-white/10 bg-white/[0.04] text-slate-200"
                      }`}
                    >
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-60">
                        {message.role === "user"
                          ? "You"
                          : "SkillPath AI"}
                      </div>

                      <div className="whitespace-pre-wrap text-sm leading-7">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                      <div className="flex gap-2">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Input */}
          <div className="border-t border-white/10 bg-slate-950/90 p-4 md:p-6">
            <form
              onSubmit={askQuestion}
              className="mx-auto flex max-w-4xl gap-3"
            >
              <textarea
                value={question}
                onChange={(event) =>
                  setQuestion(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Ask your learning doubt..."
                rows={2}
                className="flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />

              <button
                type="submit"
                disabled={!question.trim() || loading}
                className="self-end rounded-2xl bg-indigo-600 px-5 py-4 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "..." : "Ask"}
              </button>
            </form>

            <p className="mx-auto mt-2 max-w-4xl text-xs text-slate-600">
              AI responses can contain mistakes. Verify important
              technical information with official documentation.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
};

export default DoubtAssistantPage;