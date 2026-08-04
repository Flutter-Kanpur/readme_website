import { NextResponse } from "next/server";

/**
 * App Links / Universal Links must be served at the domain root:
 *   https://readme.flutterkanpur.in/.well-known/assetlinks.json
 *   https://readme.flutterkanpur.in/.well-known/apple-app-site-association
 *
 * Next basePath (/blogs) only exposes public/ files under /blogs/.well-known/*.
 * Keep payloads in sync with public/.well-known/*.
 */

const ASSETLINKS = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "com.drishtant.readme",
      sha256_cert_fingerprints: [
        "BE:D6:4C:87:2F:9E:1F:BF:3F:9E:79:26:8C:50:E6:FB:78:14:7B:27:A6:03:53:6D:A7:4E:11:F9:AA:79:90:A7",
      ],
    },
  },
];

const APPLE_APP_SITE_ASSOCIATION = {
  applinks: {
    apps: [],
    details: [
      {
        appID: "REPLACE_TEAM_ID.com.drishtant.readme",
        paths: ["/blogs/articles/*"],
      },
    ],
  },
};

function wellKnownFile(pathname) {
  const paths = [pathname];
  // With basePath, some Next versions strip /blogs before proxy runs.
  if (pathname.startsWith("/blogs/")) {
    paths.push(pathname.slice("/blogs".length));
  }

  for (const path of paths) {
    if (path === "/.well-known/assetlinks.json") return "assetlinks";
    if (path === "/.well-known/apple-app-site-association") return "aasa";
  }
  return null;
}

export function proxy(request) {
  const file = wellKnownFile(request.nextUrl.pathname);
  if (!file) return NextResponse.next();

  if (file === "assetlinks") {
    return new NextResponse(JSON.stringify(ASSETLINKS), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  return new NextResponse(JSON.stringify(APPLE_APP_SITE_ASSOCIATION), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
}

export const config = {
  matcher: ["/.well-known/:path*", "/blogs/.well-known/:path*"],
};
