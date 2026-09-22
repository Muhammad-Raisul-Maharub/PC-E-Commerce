import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConceptSwitcherHUD from "@/components/common/ConceptSwitcherHUD";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoltMatrix // NeonForge // Axiom Pro // SynapseCAD // OmniPulse BD // Krypton Brutalist | Computing Hardware & Omnichannel Maker Depot",
  description:
    "Next-generation computer hardware foundry, cyberpunk liquid-cooling battlestations, minimalist enterprise workstations, blueprint CAD workbench, omnichannel hyper-local retail hub, and brutalist industrial hardware depot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable}`}
      data-theme="voltmatrix"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,600;0,700;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&family=Rajdhani:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-[#f8f9ff] text-[#0d1c2e] min-h-screen flex flex-col font-sans antialiased transition-colors duration-300">
        <Header />
        <div className="flex-1 pt-28">{children}</div>
        <Footer />
        <ConceptSwitcherHUD />
      </body>
    </html>
  );
}
