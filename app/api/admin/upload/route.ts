import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/service'

const supabase = createClient()

async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return false
  }
  return true
}

export async function POST(request: NextRequest) {
  if (!await checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'
      }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${type}-${timestamp}-${randomString}.${fileExtension}`
    const filePath = `uploads/${type}/${fileName}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        duplex: 'half'
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({
        error: 'Failed to upload file to storage'
      }, { status: 500 })
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      path: filePath
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown upload error'
    }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}