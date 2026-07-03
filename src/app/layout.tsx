import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Local Garden Designer",
  description: "Tell us about your garden and we'll match you with the right landscaper.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-sage">{children}</body>
    </html>
  );
}
