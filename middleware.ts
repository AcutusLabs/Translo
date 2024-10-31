import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"

import { languagesSupported } from "./lib/i18n"
import { isAuthPage, isLandingPage } from "./utils/pages"

const PUBLIC_FILE = /\.(.*)$/

export default withAuth(
  async function middleware(req) {
    if (
      req.nextUrl.pathname.startsWith("/_next") ||
      req.nextUrl.pathname.startsWith("/global-error") ||
      req.nextUrl.pathname.startsWith("/robots") ||
      req.nextUrl.pathname.startsWith("/api/") ||
      req.nextUrl.pathname.startsWith("/sitemap") ||
      PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
      return NextResponse.next()
    }

    const { pathname } = req.nextUrl
    const browserLanguage = req.headers.get("accept-language")?.split(",")[0]
    let shortBrowserLanguage = browserLanguage

    if (shortBrowserLanguage && shortBrowserLanguage.indexOf("-") !== -1) {
      ;[shortBrowserLanguage] = shortBrowserLanguage.split("-")
    }

    if (shortBrowserLanguage && shortBrowserLanguage.indexOf("_") !== -1) {
      ;[shortBrowserLanguage] = shortBrowserLanguage.split("_")
    }

    const token = await getToken({ req })
    let shortLanguage: string = token?.lang || shortBrowserLanguage || "en"

    const pathnameHasLocale = languagesSupported.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (!pathnameHasLocale) {
      req.nextUrl.pathname = `/${shortLanguage}/${pathname}`
      return NextResponse.redirect(req.nextUrl)
    }

    const pathnameHasDifferentLocale = token?.lang
      ? !pathname.startsWith(`/${token.lang}`)
      : false

    if (pathnameHasDifferentLocale && token) {
      const newPath = `${pathname}`
      req.nextUrl.pathname = `/${shortLanguage}/${newPath.replace(/^\/\w+\//, "")}`
      return NextResponse.redirect(req.nextUrl)
    }

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
