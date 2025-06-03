import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import pdfParse from 'pdf-parse'
import Tesseract from 'tesseract.js'
import sharp from 'sharp'

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  console.log('OPTIONS request received')
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// Handle POST request
export async function POST(request: NextRequest) {
  console.log('POST request received')
  console.log('Request method:', request.method)
  console.log('Request headers:', Object.fromEntries(request.headers.entries()))

  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      console.log('No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Session found:', session.user.id)

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      console.log('No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('File received:', file.name, file.type)

    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    if (file.type === 'application/pdf') {
      console.log('Processing PDF file')
      // Process PDF
      const pdfData = await pdfParse(buffer)
      text = pdfData.text
    } else if (file.type.startsWith('image/')) {
      console.log('Processing image file')
      // Process image
      // First, optimize the image
      const optimizedImage = await sharp(buffer)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .toBuffer()

      // Then perform OCR
      const result = await Tesseract.recognize(
        optimizedImage,
        'eng',
        { logger: m => console.log(m) }
      )
      text = result.data.text
    } else {
      console.log('Unsupported file type:', file.type)
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      )
    }

    console.log('Text extracted, creating document')

    // Create a new document in MongoDB
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: file.name,
        content: text,
        userId: session.user.id,
      }),
    })

    if (!response.ok) {
      console.log('Failed to create document in MongoDB')
      throw new Error('Failed to create document')
    }

    const document = await response.json()
    console.log('Document created successfully')
    return NextResponse.json(document)
  } catch (error) {
    console.error('Document processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
} 