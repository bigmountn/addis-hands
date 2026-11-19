import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { isLearnLocale, routing } from "./i18n/routing";
import { ADMIN_COOKIE, verifyAdminSessionToken } from "./lib/admin-auth";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Learn is EN + Amharic only — send other locales to English.
  const learnLocaleMatch = pathname.match(
    /^\/(en|am|ko|ja|zh)(\/learn(?:\/.*)?)\/?$/,
  );
  if (learnLocaleMatch && !isLearnLocale(learnLocaleMatch[1])) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${learnLocaleMatch[2]}`;
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login";
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const authed = await verifyAdminSessionToken(token);

    if (!authed && !isLogin) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }

    if (authed && isLogin) {
      const dashboard = request.nextUrl.clone();
      dashboard.pathname = "/admin";
      dashboard.search = "";
      return NextResponse.redirect(dashboard);
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|am|ko|ja|zh)/:path*",
    "/admin",
    "/admin/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
