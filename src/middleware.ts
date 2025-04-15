import { auth } from "./auth/auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "./auth/routes";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

  // ✅ Allow all API auth routes without auth
  if (isApiAuthRoutes) return;

  // ✅ If trying to access /login or /signin while logged in, redirect to home
  if (isAuthRoutes) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // ✅ 🧠 SEO Bot Detection
  const userAgent = req.headers.get("user-agent") || "";
  const isBot =
    userAgent.includes("Googlebot") ||
    userAgent.includes("bingbot") ||
    userAgent.includes("Slurp") || // Yahoo
    userAgent.includes("DuckDuckBot") ||
    userAgent.includes("facebot") ||
    userAgent.includes("facebookexternalhit") ||
    userAgent.includes("Twitterbot") ||
    userAgent.includes("LinkedInBot");

  // ✅ Allow bot access even if not logged in
  if (!isLoggedIn && isBot) {
    return;
  }

  // ✅ Redirect logged-out human users to /login
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
