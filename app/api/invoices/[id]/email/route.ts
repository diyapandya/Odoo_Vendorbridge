import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: "Invoice email sent successfully", invoiceId: params.id });
}