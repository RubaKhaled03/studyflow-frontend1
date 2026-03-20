import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    template: "%s | StudyFlow",
    default: "StudyFlow | Organize your courses, tasks, and productivity",
  },
  description:
    "Organize your courses, tasks, and productivity in one smart platform built for students.",
  keywords: [
    "StudyFlow",
    "student organization",
    "academic planner",
    "study tools",
    "task management",
    "university courses",
    "productivity app"
  ],
  applicationName: "StudyFlow",
  authors: [{ name: "StudyFlow Team" }],
  creator: "StudyFlow Team",
  publisher: "StudyFlow Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "StudyFlow",
    title: "StudyFlow | Organize your courses, tasks, and productivity",
    description:
      "Organize your courses, tasks, and productivity in one smart platform built for students.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 627,
        alt: "StudyFlow - Student Organization Platform",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ scrollBehavior: "smooth" }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
