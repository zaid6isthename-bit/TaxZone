import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { TailwindStylesheet } from "@/components/tailwind-stylesheet";
import { GlobalErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export const metadata: Metadata = {
  title: "TaxZone — Tax Filing Platform",
  description: "Streamlined tax filing and compliance management platform for individuals and businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Force loading the generated Tailwind CSS file */}
        <link rel="stylesheet" href="/tailwind.generated.css" />
      </head>
      <body>
        <TailwindStylesheet />
        <GlobalErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
