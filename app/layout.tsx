import type { Metadata } from "next";
import { Archivo, Fragment_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

const fragment = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
});

export const metadata: Metadata = {
  title: "Project Q — the AI-native medical-imaging data platform",
  description:
    "Project Q reads every study before annotation begins. Agent Q turns an unstructured imaging repository into an explorable, curatable, export-ready dataset — while raw images stay in your storage.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${fragment.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
