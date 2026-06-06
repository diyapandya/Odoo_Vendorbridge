import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ id: params.id, price: 11800, vendor: "TechSolutions" });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  return NextResponse.json({ message: "Quotation updated", id: params.id, data: body });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: "Quotation retracted", id: params.id });
}