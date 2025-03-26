import { auth as middleware } from "@/auth";
import { NextResponse } from "next/server";
import { authRoutes, defaultLoginRedirect, protectedRoutes } from "@/routes";

export default middleware((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isUserLoggedIn: boolean = Boolean(req.auth);

  if (authRoutes.includes(path) && isUserLoggedIn)
    return NextResponse.redirect(new URL(defaultLoginRedirect, nextUrl));

  if (protectedRoutes.includes(path) && !isUserLoggedIn)
    return NextResponse.redirect(new URL("/login", nextUrl));
});

export const config = {
  matcher: ["/login", "/register", "/profile"],
};
