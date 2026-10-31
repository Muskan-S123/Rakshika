import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { Geist } from "next/font/google";

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});  

export const metadata: Metadata = {
  title: "Rakshika - Travel Safety",
  description: "SOS alerts, live location sharing and AI threat reports for women who travel alone.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Nav />
        {children}
      </body>
    </html>
  );
}