import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"

import { languagesSupported } from "./lib/i18n"
import { isAuthPage, isLandingPage } from "./utils/pages"

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl
    const browserLanguage = req.headers.get("accept-language")?.split(",")[0]
    let shortBrowserLanguage = browserLanguage

    if (shortBrowserLanguage && shortBrowserLanguage.indexOf("-") !== -1) {
      ;[shortBrowserLanguage] = shortBrowserLanguage.split("-")
    }

    if (shortBrowserLanguage && shortBrowserLanguage.indexOf("_") !== -1) {
      ;[shortBrowserLanguage] = shortBrowserLanguage.split("_")
    }

    let shortLanguage: string = shortBrowserLanguage || "en"

    const pathnameHasLocale = languagesSupported.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (!pathnameHasLocale) {
      // Redirect if there is no locale
      req.nextUrl.pathname = `/${shortLanguage}/${pathname}`
      // e.g. incoming request is /products
      // The new URL is now /en-US/products
      return NextResponse.redirect(req.nextUrl)
    }

    const token = await getToken({ req })
    const isAuth = !!token
    const isLandingPageValue = isLandingPage(req.nextUrl.pathname)
    const isAuthPageValue = isAuthPage(req.nextUrl.pathname)

    if (isAuthPageValue) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }

      return NextResponse.next()
    }

    if (!isAuth && !isLandingPageValue) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      const response = NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
      return response
    }

    const res = NextResponse.next()

    // add the CORS headers to the response
    res.headers.append("Access-Control-Allow-Credentials", "true")
    res.headers.append("Access-Control-Allow-Origin", "*") // replace this your actual origin
    res.headers.append(
      "Access-Control-Allow-Methods",
      "GET,DELETE,PATCH,POST,PUT"
    )
    res.headers.append(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    )

    return res
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/((?!_next|images).*)"],
}
