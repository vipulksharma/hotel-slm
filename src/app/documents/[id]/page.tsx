'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Document {
  id: string
  title: string
  type: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function DocumentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch document')
        }
        const data = await response.json()
        setDocument(data)
      } catch (err) {
        setError('Failed to load document')
        console.error('Error fetching document:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocument()
  }, [params.id])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">Loading...</div>
        </div>
      </main>
    )
  }

  if (error || !document) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
            {error || 'Document not found'}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{document.title}</h1>
              <p className="text-gray-600">
                Type: {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          </div>

          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-800">
              {document.content}
            </pre>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Created: {new Date(document.createdAt).toLocaleString()}</p>
            <p>Last updated: {new Date(document.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </main>
  )
} 