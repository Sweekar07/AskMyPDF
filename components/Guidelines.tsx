// No "use client" - this is static content rendered on server
export default function Guidelines() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Guidelines
      </h3>
      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <li className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          Only PDF files are supported
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          Maximum file size: 10MB
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          Text-based PDFs work best
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          Ask specific questions for better results
        </li>
      </ul>
    </div>
  )
}
