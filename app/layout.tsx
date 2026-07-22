import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Display + body face. The `wdth` axis lets us push headlines to an
// expanded ultra-bold cut while keeping normal-width body copy.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// Serif italic used for accent words inside display headlines.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KADRAJ — Creative Production Studio",
  description:
    "KADRAJ is a creative production and digital media studio framing stories through film, brand, CGI and sound. Istanbul — worldwide.",
  openGraph: {
    title: "KADRAJ — Creative Production Studio",
    description:
      "A production studio framing stories since 2016. Film, brand, post, CGI, sound, digital.",
    type: "website",
    locale: "en_US",
    siteName: "KADRAJ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrument.variable} antialiased`}
    >
      <body>
        {children}
        {/* Fixed film-grain overlay, non-interactive, above content */}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
