import { NextResponse } from 'next/server';

export async function GET() {
  const xml = `

  
    https://doorway.media
    ${new Date().toISOString()}
    monthly
    1.0
  
`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}