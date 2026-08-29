import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData(); const file = formData.get('photo')
    if (!(file instanceof File) || !file.type.startsWith('image/') || file.size > 5_000_000) return NextResponse.json({ error: 'Photo invalide (image de 5 Mo maximum).' }, { status: 400 })
    const blob = await put(`station-contributions/${crypto.randomUUID()}-${file.name}`, file, { access: 'private' })
    return NextResponse.json({ pathname: blob.pathname })
  } catch (error) { console.error('[v0] contribution photo upload failed', error); return NextResponse.json({ error: 'Upload impossible.' }, { status: 500 }) }
}
