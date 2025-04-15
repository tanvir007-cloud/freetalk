import { auth } from "./auth/auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "./auth/routes";

export default auth((req) => {
  const { nextUrl } = req;

  const userAgent = req.headers.get("user-agent") || "";
  const isBot =
    /googlebot|bingbot|slurp|duckduckbot|facebot|facebookexternalhit|twitterbot|linkedinbot/i.test(
      userAgent
    );

  // ✅ Allow bot access always, regardless of login status
  if (isBot) return;

  const isLoggedIn = !!req.auth;

  const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

  // ✅ Allow all API auth routes
  if (isApiAuthRoutes) return;

  // ✅ Prevent logged in user from accessing login/signup
  if (isAuthRoutes) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // ✅ If user is not logged in, redirect to login
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return;
});

// ✅ Only secure routes
export const config = {
  matcher: ["/", "/profile/:path*", "/friends", "/login", "/signin"],
};
