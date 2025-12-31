"use client"
import { createContext, useContext, useState, ReactNode } from 'react'
import PdfUploader from './PdfUploader'
import ChatInterface from './ChatInterface'

// Shared state context
const AppContext = createContext<{
  fileId: string
  setFileId: (id: string) => void
  fileName: string
  setFileName: (name: string) => void
  fileSize: string
  setFileSize: (size: string) => void
  chunks: number
  setChunks: (chunks: number) => void
}>({
  fileId: "",
  setFileId: () => {},
  fileName: "",
  setFileName: () => {},
  fileSize: "",
  setFileSize: () => {},
  chunks: 0,
  setChunks: () => {},
})

export const useAppContext = () => useContext(AppContext)

export default function AppProvider({ children }: { children: ReactNode }) {
  const [fileId, setFileId] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState("")
  const [chunks, setChunks] = useState(0)

  return (
    <AppContext.Provider value={{
      fileId,
      setFileId,
      fileName,
      setFileName,
      fileSize,
      setFileSize,
      chunks,
      setChunks,
    }}>
      {children}
    </AppContext.Provider>
  )
}

// Connected Components
export function PdfUploaderWithContext() {
  return <PdfUploader />
}

export function ChatInterfaceWithContext() {
  return <ChatInterface />
}
