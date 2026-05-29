import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { TailwindStylesheet } from "@/components/tailwind-stylesheet";
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '/tailwind.generated.css';
                document.head.appendChild(link);
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=IBM+Plex+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <TailwindStylesheet />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
