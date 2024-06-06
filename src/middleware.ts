import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from './lib/routes';

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return undefined;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return undefined;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let redirectTo = nextUrl.pathname;
    if (nextUrl.search) {
      redirectTo += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(redirectTo);

    return Response.redirect(new URL(`/auth/login?redirectTo=${encodedCallbackUrl}`, nextUrl));
  }

  return undefined;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
