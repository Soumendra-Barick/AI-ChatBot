import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    const userInput = input;
    socket.emit("ai-message", input);
    setInput("");

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: `✨ AI Response`,
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    let socketInstance = io("https://ai-chatbot-k6r6.onrender.com");
    setSocket(socketInstance);

    socketInstance.on("ai-message-response", (response) => {
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        timestamp: new Date().toLocaleTimeString(),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    });
  }, []);

  return (
    <div className="app">
      <div className="chat-box">
        {/* Header */}
        <div className="header">
          <div>
            <h1>Nova AI</h1>
            <p>Your Smart Assistant</p>
          </div>

          <div className="status">
            <span></span>
            Online
          </div>
        </div>

        {/* Messages */}
        <div className="messages">
          {messages.length === 0 ? (
            <div className="welcome">
              <h2>👋 Welcome</h2>
              <p>Start chatting with your AI assistant</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-row ${
                  msg.sender === "user" ? "user-row" : "bot-row"
                }`}
              >
                <div
                  className={`message ${
                    msg.sender === "user" ? "user-message" : "bot-message"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span>{msg.time}</span>
                </div>
              </div>
            ))
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="input-area">
          <textarea
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="2"
          />

          <button onClick={handleSendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

export default App;
