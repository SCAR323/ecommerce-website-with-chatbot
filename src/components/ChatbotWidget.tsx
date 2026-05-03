import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Message = {
  sender: "user" | "bot";
  text: string;
  products?: Product[];
  timestamp?: Date;
};

type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  images: string[];
  description?: string;
};

const WELCOME_MESSAGE: Message = {
  sender: "bot",
  text: "👋 Hi! I'm your SonicHub AI assistant.\n\nAsk me anything about our products, prices, features, or store policies!",
  products: [],
  timestamp: new Date(),
};

type ChatbotWidgetProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ChatbotWidget({ open, setOpen }: ChatbotWidgetProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Show welcome message once
      if (!hasOpened) {
        setMessages([WELCOME_MESSAGE]);
        setHasOpened(true);
      }
    }
  }, [open]);

  // Keep focus in the input after the bot finishes replying
  useEffect(() => {
    if (open && !loading) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, loading, messages.length]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      sender: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Add thinking message
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "🤔 Thinking...",
        timestamp: new Date(),
      },
    ]);

    try {
      // Add a small delay before fetching
      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      const botMsg: Message = {
        sender: "bot",
        text: data.reply || "No response received.",
        products: (data.products || []).filter(
          (p: any) => p && p.images && p.images.length > 0
        ),
        timestamp: new Date(),
      };

      // Replace the thinking message with the actual response
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = botMsg;
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: "⚠️ Unable to reach the AI server. Please make sure the backend is running on port 5000.",
          timestamp: new Date(),
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function formatTime(date?: Date) {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Render newlines in bot messages
  function renderText(text: string) {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  }

  return (
    <>
      {/* ── Floating Toggle Button ─────────────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        title="Chat with SonicHub AI"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: open
            ? "#374151"
            : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          color: "#fff",
          fontSize: 26,
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(79,70,229,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.25s ease",
          transform: open ? "rotate(0deg)" : "rotate(0deg)",
        }}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* ── Chat Window ────────────────────────────────────────── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 96,
            right: 24,
            width: 370,
            height: 560,
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            animation: "slideUp 0.2s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>SonicHub Assistant</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#4ade80",
                    marginRight: 5,
                  }}
                />
                Online · Powered by product database
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              padding: "14px 14px 8px",
              overflowY: "auto",
              background: "#f8f9fb",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                {/* Bubble */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "10px 14px",
                      borderRadius:
                        m.sender === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      background:
                        m.sender === "user"
                          ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                          : "#fff",
                      color: m.sender === "user" ? "#fff" : "#1f2937",
                      fontSize: 13.5,
                      lineHeight: 1.55,
                      boxShadow:
                        m.sender === "user"
                          ? "0 2px 8px rgba(79,70,229,0.3)"
                          : "0 1px 6px rgba(0,0,0,0.08)",
                      wordBreak: "break-word",
                    }}
                  >
                    {renderText(m.text)}
                  </div>
                </div>

                {/* Timestamp */}
                <div
                  style={{
                    textAlign: m.sender === "user" ? "right" : "left",
                    fontSize: 10,
                    color: "#9ca3af",
                    marginTop: 3,
                    paddingLeft: m.sender === "bot" ? 4 : 0,
                    paddingRight: m.sender === "user" ? 4 : 0,
                  }}
                >
                  {formatTime(m.timestamp)}
                </div>

                {/* Product Cards */}
                {m.products && m.products.length > 0 && (
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      gap: 10,
                      overflowX: "auto",
                      paddingBottom: 6,
                      paddingLeft: 2,
                      scrollbarWidth: "thin",
                    }}
                  >
                    {m.products.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/product/${p.id}`)}
                        style={{
                          minWidth: 160,
                          maxWidth: 175,
                          border: "1px solid #e5e7eb",
                          borderRadius: 12,
                          overflow: "hidden",
                          background: "#fff",
                          flexShrink: 0,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          transition: "transform 0.15s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLDivElement).style.transform =
                            "translateY(-2px)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLDivElement).style.transform =
                            "translateY(0)")
                        }
                      >
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          style={{
                            width: "100%",
                            height: 110,
                            objectFit: "contain",
                            background: "#f9fafb",
                            padding: 8,
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <div style={{ padding: "8px 10px 10px" }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 12,
                              color: "#111827",
                              marginBottom: 3,
                              lineHeight: 1.3,
                            }}
                          >
                            {p.title}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#4f46e5",
                              }}
                            >
                              ₹{p.price?.toLocaleString("en-IN")}
                            </span>
                            <span style={{ fontSize: 11, color: "#f59e0b" }}>
                              ⭐ {p.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading animation */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: "18px 18px 18px 4px",
                    background: "#fff",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                    display: "flex",
                    gap: 5,
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((j) => (
                    <span
                      key={j}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#6366f1",
                        display: "inline-block",
                        animation: `bounce 1.2s ease-in-out ${j * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #e5e7eb",
              padding: "10px 12px",
              background: "#fff",
              gap: 8,
              alignItems: "center",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, prices, shipping…"
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1.5px solid #e5e7eb",
                borderRadius: 24,
                outline: "none",
                fontSize: 13,
                color: "#111827",
                background: "#f9fafb",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background:
                  loading || !input.trim()
                    ? "#e5e7eb"
                    : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: loading || !input.trim() ? "#9ca3af" : "#fff",
                border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                fontSize: 17,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* ── Keyframe animations (injected once) ────────────────── */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-6px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
