"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIChat({ seoReportId }: { seoReportId: string }) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { messages, sendMessage, status } = useChat({
    id: seoReportId,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input, metadata: { seoReportId } });
      setInput("");
    }
  };

  const isTyping = status === "submitted";

  return (
    <>
      {/* Chat Widget */}
      {isExpanded && (
        <div className="fixed bottom-20 right-6 z-50 w-[500px] h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">AI SEO Assistant</h3>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isTyping ? "bg-yellow-300 animate-pulse" : "bg-green-300"
                    )}
                  ></div>
                  <p className="text-xs text-indigo-100">
                    {isTyping ? "Thinking..." : "Online"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                👋 Hi! Ask me anything about your SEO report.
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm",
                    message.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md"
                      : "bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-md"
                  )}
                >
                  {message.parts.map((part, i) => {
                    if (part.type === "tool-web_search") {
                      switch (part.state) {
                        case "input-streaming":
                        case "input-available":
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Searching the web...</span>
                            </div>
                          );
                        case "output-available":
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="text-sm text-green-600 font-medium"
                            >
                              ✓ Finished web search
                            </div>
                          );
                        case "output-error":
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="text-sm text-red-600"
                            >
                              ✗ Web search failed: {part.errorText}
                            </div>
                          );
                      }
                    }
                    if (part.type === "text") {
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="leading-relaxed"
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => (
                                <p className="mb-3 last:mb-0">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="mb-3 pl-4 space-y-1">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="mb-3 pl-4 space-y-1">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-sm">{children}</li>
                              ),
                              a: ({ children, href }) => (
                                <a
                                  href={href}
                                  className="text-indigo-600 underline cursor-pointer"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {children}
                                </a>
                              ),
                              h1: ({ children }) => (
                                <h1 className="text-lg font-semibold mb-2 mt-4 first:mt-0">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">
                                  {children}
                                </h3>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic">{children}</em>
                              ),
                              code: ({ children }) => (
                                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mb-3">
                                  {children}
                                </pre>
                              ),
                            }}
                          >
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span className="text-sm text-gray-600">
                      AI is Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-5 border-t border-gray-100 bg-gray-50/50">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your SEO report..."
                className="flex-1 h-11 bg-white border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                disabled={isTyping}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="h-11 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105"
        >
          {isExpanded ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>
    </>
  );
}
