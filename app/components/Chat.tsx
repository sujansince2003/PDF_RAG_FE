"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { Loader2, Send, Bot, User } from "lucide-react"; // Icons for loading and avatars
import ReactMarkdown from "react-markdown"; // For markdown rendering
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown (tables, task lists, etc.)
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn/ui

// Define types for chat messages
interface Message {
  id: string; // Unique ID for key prop
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the chat history
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]); // Scroll whenever chatHistory updates

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  async function sendQuery() {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user", // Simple unique ID
      sender: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage(""); // Clear input immediately
    setIsLoading(true); // Start loading

    try {
      const res = await fetch(
        `http://localhost:8000/chat?message=${encodeURIComponent(
          userMessage.content
        )}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        sender: "ai",
        content: data.answer || "Sorry, I couldn't get a response.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, aiMessage]);
      console.log("AI Answer:", data.answer);
      // You can also log/display data.docs if you want to show retrieved context
    } catch (error: any) {
      console.error("Chat processing failed:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        sender: "ai", // Display error as if from AI
        content: `Error: Could not fetch response. Please try again. (${error.message})`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // End loading
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && message.trim() && !isLoading) {
      sendQuery();
    }
  };

  return (
    <div className="flex h-screen flex-col p-4 relative">
      {/* Chat History Display */}
      <ScrollArea className="flex-1 pr-4 mb-20" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
          {chatHistory.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              Start a conversation by asking about your PDF!
            </div>
          )}
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender === "ai" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <Bot size={18} />
                </div>
              )}
              <div
                className={cn(
                  "p-3 rounded-lg max-w-[75%]",
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                )}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
                <div
                  className={cn(
                    "text-xs mt-1",
                    msg.sender === "user" ? "text-blue-200" : "text-gray-500"
                  )}
                >
                  {msg.timestamp}
                </div>
              </div>
              {msg.sender === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-start gap-3 mt-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                <Bot size={18} />
              </div>
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none animate-pulse">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="fixed bottom-4 left-[65%] -translate-x-1/2 w-[68%] flex gap-2 p-4 bg-white border-t rounded-lg shadow-lg">
        <Input
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything about the PDF..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <Button
          disabled={!message.trim() || isLoading}
          onClick={sendQuery}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="ml-2">Send</span>
        </Button>
      </div>
    </div>
  );
};

export default Chat;
