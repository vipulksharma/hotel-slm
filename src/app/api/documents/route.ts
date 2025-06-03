import { NextResponse } from 'next/server'
import { getDb, collections, toObjectId } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, type, content } = body

    // TODO: Add authentication and get userId
    const userId = toObjectId('000000000000000000000000') // Temporary MongoDB ObjectId

    const db = await getDb()
    const document = await db.collection(collections.documents).insertOne({
      title,
      type,
      content,
      userId,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id: document.insertedId, title, type, content })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getDb()
    const documents = await db.collection(collections.documents).find({}).toArray()
    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
} 