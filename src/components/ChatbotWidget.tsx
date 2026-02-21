import { useState, useRef, useEffect } from "react";
import { ProductCard } from "./ProductCard";

type Message = {
  sender: "user" | "bot";
  text: string;
  products?: any[];
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();

      const botMsg: Message = {
        sender: "bot",
        text: data.reply || "No response received.",
        products: data.products || [],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Unable to reach AI server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#4f46e5",
          color: "#fff",
          fontSize: 24,
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        🤖
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 350,
            height: 500,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: 15,
              fontWeight: "bold",
              background: "#4f46e5",
              color: "#fff",
            }}
          >
            AI Assistant
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 15, overflowY: "auto", background: "#f9fafb" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 12,
                  textAlign: m.sender === "user" ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: m.sender === "user" ? "#4f46e5" : "#e5e7eb",
                    color: m.sender === "user" ? "#fff" : "#000",
                    maxWidth: "85%",
                    textAlign: "left",
                    fontSize: "0.95rem",
                  }}
                >
                  {m.text}
                </div>
                {/* Product Cards */}
                {m.products && m.products.length > 0 && (
                  <div style={{ marginTop: 10, display: "flex", gap: 10, overflowX: "auto", paddingBottom: 5 }}>
                    {m.products.map((p) => (
                      <div key={p.id} style={{ minWidth: 200, maxWidth: 220, border: "1px solid #ddd", borderRadius: 8, padding: 8, background: "#fff" }}>
                        <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 6 }} />
                        <div style={{ marginTop: 8, fontWeight: "bold", fontSize: 14 }}>{p.title}</div>
                        <div style={{ fontSize: 13, color: "green" }}>₹{p.price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ color: "#6b7280", fontSize: 14, fontStyle: "italic" }}>
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ display: "flex", borderTop: "1px solid #ddd", padding: 10, background: "#fff" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: 20,
                outline: "none",
                marginRight: 10,
                color: "#000",
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "10px 20px",
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: 20,
                cursor: "pointer",
                fontWeight: "bold"
              }}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
