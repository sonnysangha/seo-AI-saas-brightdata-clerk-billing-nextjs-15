"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ChatInterfaceProps {
  jobId: Id<"scrapingJobs">;
  sessionId?: Id<"chatSessions">;
  onSessionCreated?: (sessionId: Id<"chatSessions">) => void;
}

export function ChatInterface({ jobId, sessionId, onSessionCreated }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<Id<"chatSessions"> | undefined>(sessionId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Get messages for the current session
  const messages = useQuery(
    api.chatMessages.getMessagesBySession,
    currentSessionId ? { sessionId: currentSessionId } : "skip"
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const currentMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          sessionId: currentSessionId,
          jobId: jobId,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("Chat error:", data.error);
        return;
      }

      // If a new session was created, update our state
      if (data.sessionId && !currentSessionId) {
        setCurrentSessionId(data.sessionId);
        onSessionCreated?.(data.sessionId);
      }

    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Chat with your SEO Report</h3>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {!messages?.length && !isLoading && (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Start a conversation</p>
              <p className="text-sm">
                Ask questions about your SEO report, get insights, and receive actionable recommendations.
              </p>
            </div>
          )}
          
          {messages?.map((msg) => (
            <ChatMessage
              key={msg._id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.createdAt}
            />
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 p-4 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>SEO Assistant is thinking...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your SEO report..."
            className="flex-1 min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!message.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}