import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ poNumber: params.id, status: "Pending" });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  return NextResponse.json({ message: "PO status updated", id: params.id, data: body });
}