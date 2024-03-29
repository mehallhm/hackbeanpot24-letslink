import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Providers from "@/app/Providers";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Let's Link",
  description: "Link up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={"flex justify-center w-full " + GeistSans.className}>
          <div className="sm:max-w-[700px] w-full">{children}</div>
        </body>
      </html>
    </Providers>
  );
}
