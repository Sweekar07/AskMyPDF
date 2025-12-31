"use client"
import { useState } from "react"
import { useAppContext } from './AppProvider'
import Guidelines from './Guidelines'

export default function PdfUploader() {
  const {
    fileId,
    setFileId,
    fileName,
    setFileName,
    fileSize,
    setFileSize,
    chunks,
    setChunks
  } = useAppContext()

  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  async function uploadPdf(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fileInput = form.file as HTMLInputElement
    const file = fileInput.files?.[0]

    if (!file) return

    setFileName(file.name)
    setFileSize((file.size / 1024 / 1024).toFixed(2))

    const formData = new FormData()
    formData.append("file", file)

    setStatus("processing")
    setLoading(true)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: formData,
      })

      const json = await res.json()

      if (res.ok) {
        setFileId(json.fileId)
        setChunks(json.chunks)
        setStatus("success")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  function resetUpload() {
    setFileId("")
    setFileName("")
    setFileSize("")
    setChunks(0)
    setStatus("")
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload PDF
        </h2>

        {!fileId ? (
          <form onSubmit={uploadPdf} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <input
                    type="file"
                    name="file"
                    accept="application/pdf"
                    disabled={loading}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Upload & Process PDF"
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-700 dark:text-green-300 font-medium">PDF Successfully Processed!</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">File Name:</span>
                <span className="font-medium text-gray-800 dark:text-white truncate ml-2">{fileName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                <span className="font-medium text-gray-800 dark:text-white">{fileSize} MB</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Text Chunks:</span>
                <span className="font-medium text-gray-800 dark:text-white">{chunks}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">File ID:</span>
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-white">{fileId}</span>
              </div>
            </div>

            <button
              onClick={resetUpload}
              className="w-full mt-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Upload New PDF
            </button>
          </div>
        )}

        {/* Status Messages */}
        {status === "processing" && (
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center">
              <svg className="animate-spin w-4 h-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-blue-700 dark:text-blue-300 text-sm">Processing your PDF...</span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 dark:text-red-300 text-sm">Upload failed. Please try again.</span>
            </div>
          </div>
        )}
      </div>

      <Guidelines />
    </div>
  )
}
