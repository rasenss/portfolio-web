import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Rasendriya Khansa Jolankarfyan | Portfolio",
  description:
    "Personal portfolio of Rasendriya Khansa Jolankarfyan, a Project Management Enthusiast and Computer Science student interested in Design & Programming Enthusiast",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className={inter.className + " min-h-screen w-full antialiased"}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="rasendriya-theme"
        >
          <div className="w-full min-h-screen flex flex-col">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
