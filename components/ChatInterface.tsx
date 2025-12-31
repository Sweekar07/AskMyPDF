"use client"
import { useState, useRef, useEffect } from "react"
import { useAppContext } from './AppProvider'


export default function ChatInterface() {
  const { fileId } = useAppContext() // Gets fileId from shared context!
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{
    question: string
    answer: string
    isLoading?: boolean
  }>>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  async function askQuestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!fileId || !question.trim()) return

    const currentQuestion = question
    setQuestion("")
    setLoading(true)

    // Add question with loading state immediately
    setChatHistory(prev => [...prev, {
      question: currentQuestion,
      answer: "🤔 Thinking...",
      isLoading: true
    }])

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify({ fileId, question: currentQuestion }),
      })

      const json = await res.json()

      // Update the last message with the actual answer
      setChatHistory(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          question: currentQuestion,
          answer: res.ok ? json.answer : `❌ Error: ${json.error}`,
          isLoading: false
        }
        return updated
      })

    } catch {
      // Update with error message
      setChatHistory(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          question: currentQuestion,
          answer: "❌ Failed to get answer",
          isLoading: false
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lg:col-span-3 h-full min-h-0">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700
                h-[calc(100vh-8rem)] flex flex-col">
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.447L3 21l2.447-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
            AI Assistant
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {fileId ? "Ask questions about your PDF" : "Upload a PDF to start chatting"}
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!fileId ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.447L3 21l2.447-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Upload a PDF to start the conversation</p>
            </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <div key={index} className="space-y-4">
                  {/* User Question */}
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-2 max-w-xs lg:max-w-md">
                      <p className="text-sm">{chat.question}</p>
                    </div>
                  </div>
                  {/* AI Answer */}
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs lg:max-w-md">
                      <div className="flex items-start space-x-2">
                        {chat.isLoading && (
                          <svg className="animate-spin w-4 h-4 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{chat.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Chat Input - Now shows when fileId exists */}
        {fileId && (
          <div className="p-6 border-t sticky bottom-0 bg-white dark:bg-gray-800">
            <form onSubmit={askQuestion} className="flex space-x-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about your PDF..."
                disabled={loading}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
