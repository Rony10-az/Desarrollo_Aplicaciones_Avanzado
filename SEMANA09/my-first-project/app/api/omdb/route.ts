import { NextRequest, NextResponse } from 'next/server'
import { fetchOmdb } from '@/lib/omdb'

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  try {
    const data = await fetchOmdb(params)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        Response: 'False',
        Error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
