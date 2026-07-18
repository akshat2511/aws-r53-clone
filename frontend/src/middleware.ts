import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const apiHost = process.env.BACKEND_API_URL || "http://localhost:8000";

  // If the request is for the API, rewrite it to the backend host
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Clean any accidental trailing slashes from the host URL
    const cleanedApiHost = apiHost.replace(/\/$/, "");
    const destUrl = new URL(`${cleanedApiHost}${request.nextUrl.pathname}${request.nextUrl.search}`);
    
    return NextResponse.rewrite(destUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
