import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ purchaseOrders: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: "Purchase Order created", po: body });
}