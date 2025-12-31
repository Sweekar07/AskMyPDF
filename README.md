# 📄 AskMyPDF - AI-Powered PDF Question & Answer Assistant

> Transform your PDFs into interactive knowledge bases with AI-powered conversations

## ✨ Features

- 🔄 **Smart PDF Processing** - Advanced text extraction and intelligent chunking
- 🧠 **Google Gemini AI** - Powered by cutting-edge language models for accurate answers
- 🗄️ **Vector Database** - MongoDB Atlas Vector Search for lightning-fast similarity matching
- ⚡ **Next.js 14** - Server-side rendering with modern React components
- 🎨 **Beautiful UI** - Clean, responsive interface with Tailwind CSS
- 💬 **Real-time Chat** - WhatsApp-style conversation interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **AI/ML**: Google Gemini API (text-embedding-004, gemini-1.5-flash)
- **Database**: MongoDB Atlas with Vector Search
- **File Processing**: PDF-parse, Smart text chunking
- **Authentication**: Bearer token middleware

### File Structure Tree
```
next-pdf-qa/
├── 🎯 BACKEND (Server-Side)
│   ├── app/api/                    # API Routes (Backend Endpoints)
│   │   ├── upload/
│   │   │   └── route.tsx          # POST /api/upload (Server-only)
│   │   └── ask/
│   │       └── route.tsx          # POST /api/ask (Server-only)
│   ├── lib/                       # Utility Functions (Server-side)
│   │   ├── pdf.tsx               # PDF text extraction
│   │   ├── chunk.tsx             # Text chunking logic
│   │   ├── embeddings.tsx        # Gemini AI embeddings
│   │   └── vector_mongo.tsx      # MongoDB operations
│   └── middleware.ts             # Request interceptor (Server-only)
│
├── 🖥️ FRONTEND (Client-Side)
│   ├── app/
│   │   ├── page.tsx              # Main page (Server Component)
│   │   └── layout.tsx            # Root layout (Server Component)
│   │   └── globals.css           # Global styles 
│   └── components/               # UI Components
│       ├── AppProvider.tsx       # State management (Client Component)
│       ├── PdfUploader.tsx       # Upload UI (Client Component)
│       ├── ChatInterface.tsx     # Chat UI (Client Component)
│       └── Guidelines.tsx        # Static content (Server Component)
│
├── ⚙️ CONFIGURATION
│   ├── .env.local               # Environment variables
│   ├── next.config.js           # Next.js configuration
│   ├── package.json             # Dependencies
│   └── tailwind.config.js       # Styling configuration
│
└── 📄 PROJECT FILES
    ├── README.md                # Documentation
```


### 🔄 Application Flow Explanation

#### 1. Backend Flow (Server-Side)
```
graph TD
    A[Client Upload] --> B[app/api/upload/route.tsx]
    B --> C[lib/pdf.tsx - Extract Text]
    C --> D[lib/chunk.tsx - Split Text]
    D --> E[lib/embeddings.tsx - Generate Embeddings]
    E --> F[lib/vector_mongo.tsx - Store in MongoDB]
    F --> G[Return FileID to Client]
    
    H[Client Question] --> I[app/api/ask/route.tsx]
    I --> J[lib/embeddings.tsx - Embed Question]
    J --> K[lib/vector_mongo.tsx - Vector Search]
    K --> L[Google Gemini - Generate Answer]
    L --> M[Return Answer to Client]
```

#### 2. Frontend Flow (Client-Side)

```
graph TD
    A[User Opens Page] --> B[app/page.tsx - Server Rendered]
    B --> C[Static Header/Footer Rendered]
    C --> D[AppProvider.tsx - Client State]
    D --> E[PdfUploader.tsx - Client Component]
    D --> F[ChatInterface.tsx - Client Component]
    
    G[User Uploads PDF] --> H[PdfUploader calls /api/upload]
    H --> I[Update Shared State]
    I --> J[ChatInterface receives FileID]
    J --> K[Show Chat Input]
    
    L[User Asks Question] --> M[ChatInterface calls /api/ask]
    M --> N[Display Answer]
```

### 🚀 Request-Response Flow

#### Upload flow

```
1. User selects PDF (Client) 
   ↓
2. PdfUploader.tsx → POST /api/upload (Client → Server)
   ↓
3. route.tsx → lib/pdf.tsx → lib/chunk.tsx → lib/embeddings.tsx → lib/vector_mongo.tsx
   ↓
4. MongoDB stores embeddings (Server)
   ↓
5. Return fileId (Server → Client)
   ↓
6. AppProvider updates shared state (Client)
   ↓
7. ChatInterface shows input box (Client)
```

#### Question Flow:
```
1. User types question (Client)
   ↓
2. ChatInterface.tsx → POST /api/ask (Client → Server)
   ↓
3. route.tsx → lib/embeddings.tsx (embed question) → lib/vector_mongo.tsx (search) → Gemini AI (answer)
   ↓
4. Return AI answer (Server → Client)
   ↓
5. Display in chat bubble (Client)

```

## 🚀 Quick Start

1. **Clone & Install**
```
[git clone https://github.com/yourusername/AskMyPDF](https://github.com/Sweekar07/PDF_QA.git)
cd PDF_QA
npm install
```

2. **Environment Setup**
```
GEMINI_API_KEY=your_gemini_api_key
MONGODB_ATLAS_URI=your_mongodb_connection_string
MONGODB_ATLAS_DB_NAME=pdfqa
MONGODB_ATLAS_COLLECTION_NAME=chunks
MONGODB_ATLAS_INDEX=vector_index
API_BEARER_TOKEN=dev-secret
NEXT_PUBLIC_API_TOKEN=dev-secret
```

3. **Run Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### UI Images:

#### Home Screen
<img width="1054" height="548" alt="image" src="https://github.com/user-attachments/assets/61d5ca8d-4344-49b6-aef9-89a3874b91ee" />

#### User Interaction with PDF Data
<img width="1054" height="567" alt="image" src="https://github.com/user-attachments/assets/5522793d-6d3e-4883-a48b-2bd56a51b18e" />



## 🙏 Acknowledgments

- Google Gemini AI for powerful language models
- MongoDB Atlas for vector search capabilities
- Next.js team for the amazing framework

---

**Built with ❤️ using Next.js, MongoDB Atlas, and Google Gemini AI**
