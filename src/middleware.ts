import { auth as middleware } from "@/auth";

export default middleware((req) => {
  console.log("middleware", req.nextUrl.pathname);
});

export const config = {
  matcher: ["/login"],
};
