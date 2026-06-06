import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    logs: [
      { id: "1", action: "RFQ Created", timestamp: new Date() },
      { id: "2", action: "Bid Submitted", timestamp: new Date() }
    ]
  });
}