// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Define your protected routes here
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isAdmin = token?.role == 'Super Admin' || token?.role == 'Admin'

  console.log("isAdmin", isAdmin);
  
  
  if (isAuthPage) {
    console.log(request.nextUrl.pathname, isAuthPage, token);
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return null;
  }

  if(isAdmin){
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }
}

export const config = {
  matcher: ["/auth/:path*","/dashboard"],
};
