import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ quotations: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: "Quotation submitted", quotation: body });
}