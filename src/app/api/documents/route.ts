import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, type, content } = body

    // TODO: Add authentication and get userId
    const userId = '000000000000000000000000' // Temporary MongoDB ObjectId

    const document = await prisma.document.create({
      data: {
        title,
        type,
        content,
        userId,
      },
    })

    return NextResponse.json(document)
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
    // TODO: Add authentication and get userId
    const userId = '000000000000000000000000' // Temporary MongoDB ObjectId

    const documents = await prisma.document.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
} 