import { NextResponse } from "next/server";

export function middleware(req: any) {
  if (!req.nextUrl.pathname.startsWith("/api/")) return NextResponse.next();
  
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "");
  
  if (token !== process.env.API_BEARER_TOKEN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  
  return NextResponse.next();
}

export const config = { matcher: ["/api/:path*"] };
