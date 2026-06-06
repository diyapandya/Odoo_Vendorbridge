import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Dynamic header setup to trigger stream of PDF content
  return new NextResponse("Mock PDF bytes representation stream", {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${params.id}.pdf"`
    }
  });
}