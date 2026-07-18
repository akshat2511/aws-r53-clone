import type { Metadata } from "next";
import "./globals.css";
import fs from "fs";
import path from "path";

// Copy logo image from artifacts on server startup
try {
  const src = "C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\d7b320d6-0187-4396-8c6a-325317a8f600\\media__1784361244163.png";
  if (fs.existsSync(src)) {
    const destDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, path.join(destDir, "logo.png"));
  }
} catch (e) {
  console.error("Failed to copy logo:", e);
}

export const metadata: Metadata = {
  title: "Route 53 - AWS Console",
  description: "Amazon Route 53 DNS Management Console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
