import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import "@/styles/globals.css";
import Provider from "./provider";
import { cn } from "@/lib/utils";

const geist = Manrope({subsets:['latin'],variable:'--font-sans'});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sloogle",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme') || 'system';
                  if (t === 'system') {
                    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(t);
                  document.documentElement.style.colorScheme = t;
                } catch(e) {}
              })();
            `,
          }}
        />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
