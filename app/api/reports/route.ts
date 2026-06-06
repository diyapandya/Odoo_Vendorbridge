import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    monthlySpend: [
      { month: "Jan", spend: 12000 },
      { month: "Feb", spend: 18500 },
      { month: "Mar", spend: 14200 },
      { month: "Apr", spend: 22000 }
    ],
    topVendors: [
      { name: "Acme Industrial", rating: 4.8 },
      { name: "Globex Corp", rating: 4.5 }
    ]
  });
}