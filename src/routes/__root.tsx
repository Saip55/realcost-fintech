import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import Velaris from "@/components/ui/velaris";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background/90 backdrop-blur-md px-4 relative z-10 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm opacity-80">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background/90 backdrop-blur-md px-4 relative z-10 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm opacity-80">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RealCost — See What Your Money Really Costs You" },
      {
        name: "description",
        content: "RealCost shows the hidden hours and future value behind every purchase",
      },
      { name: "author", content: "RealCost" },
      { property: "og:title", content: "RealCost — See What Your Money Really Costs You" },
      {
        property: "og:description",
        content: "RealCost shows the hidden hours and future value behind every purchase",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "RealCost — See What Your Money Really Costs You" },
      {
        name: "twitter:description",
        content: "RealCost shows the hidden hours and future value behind every purchase",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen w-full overflow-x-hidden">
        {/* Full-screen Velaris WebGL background for all pages */}
        <div className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
          <Velaris
            height="100vh"
            bg="#090f08"
            colors={["#83db28", "#2c4e16", "#059669", "#121910"]}
            speed={1.5}
            grain={0.25}
            className="w-full h-full"
          />
        </div>

        {/* Page Content Layer */}
        <div className="relative z-10 min-h-screen">
          <Outlet />
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
