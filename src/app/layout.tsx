import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import BackToTop from "@/components/shared/BackToTop";
import PageLoader from "@/components/shared/PageLoader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XYZ Chambers | Rooted in Strength. Driven by Justice.",
  description: "Secure, scalable, modern legal workspace for XYZ Chambers. Premium legal services in Litigation, Corporate Law, Property Law, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var savedTheme = localStorage.getItem('theme');
              if (savedTheme === 'light' || savedTheme === 'dark') {
                document.documentElement.className = savedTheme;
              } else {
                var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.className = systemPrefersDark ? 'dark' : 'light';
              }
            } catch (e) {}
          })()
        ` }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <PageLoader />
            {children}
            <BackToTop />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

