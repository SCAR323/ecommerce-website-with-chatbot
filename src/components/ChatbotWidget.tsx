import { useState } from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
            width: 320,
            height: 420,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: 10,
              fontWeight: "bold",
              borderBottom: "1px solid #ddd",
              color: "#000",
            }}
          >
            AI Assistant
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 10, overflowY: "auto" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 8,
                  textAlign: m.sender === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: 8,
                    borderRadius: 8,
                    background: m.sender === "user" ? "#4f46e5" : "#e5e7eb",
                    color: m.sender === "user" ? "#fff" : "#000",
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}

            {loading && (
              <div style={{ color: "#000", fontSize: 14 }}>
                Searching the website...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: 8,
                border: "none",
                color: "#000",
                backgroundColor: "#fff",
                outline: "none",
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} style={{ padding: 8 }}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
