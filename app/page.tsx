import AppProvider, { ChatInterfaceWithContext, PdfUploaderWithContext } from '@/components/AppProvider'

// Server Component - renders instantly
export default function Home() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Static Header - Server Rendered */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📄 PDF Q&A with Gemini AI
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
              Upload your PDF and start asking questions powered by AI
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-5 gap-8 h-[calc(100vh-200px)]">
            {/* Components now share state through context */}
            <PdfUploaderWithContext />
            <ChatInterfaceWithContext />
          </div>
        </main>

        {/* Static Footer - Server Rendered */}
        <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-8">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                Built with 🔥 using{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">Next.js</span>,{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">MongoDB Atlas</span>, and{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">Gemini AI</span>
              </p>
              <p>Upload your PDF documents and get intelligent answers to your questions instantly.</p>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  )
}
