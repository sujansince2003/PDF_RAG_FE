"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import React, { useState } from "react";

const Chat = () => {
  const [message, setMessage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  async function sendQuery() {
    const res = await fetch(`http://localhost:8000/chat?message=${message}`);
    const data = await res.json();
    console.log(data.answer);
  }

  return (
    <div className="p-4">
      <div className="fixed bottom-4 w-200 flex gap-2  ">
        <Input onChange={handleChange} placeholder="Ask me anything" />
        <Button
          disabled={!message.trim()}
          onClick={sendQuery}
          className="bg-blue-500 text-white cursor-pointer"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
