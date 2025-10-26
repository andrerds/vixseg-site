import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VixSeg Tecnologia | Segurança Eletrônica em Serra ES",
  description:
    "Instalação e manutenção de sistemas de segurança eletrônica. CFTV, alarmes, cercas elétricas, controle de acesso. +10 anos de experiência. Atendimento 24h na Grande Vitória.",
  keywords: [
    "segurança eletrônica",
    "serra es",
    "cftv vitória",
    "alarme residencial",
    "cerca elétrica",
    "controle de acesso",
    "interfone",
    "videoporteiro",
    "grande vitória",
  ],
  authors: [{ name: "VixSeg Tecnologia" }],
  creator: "VixSeg Tecnologia",
  publisher: "VixSeg Tecnologia",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://vixseg.com.br",
    title: "VixSeg Tecnologia | Segurança Eletrônica em Serra ES",
    description:
      "Instalação e manutenção de sistemas de segurança eletrônica. +10 anos de experiência. Atendimento 24h.",
    siteName: "VixSeg Tecnologia",
  },
  twitter: {
    card: "summary_large_image",
    title: "VixSeg Tecnologia | Segurança Eletrônica em Serra ES",
    description:
      "Instalação e manutenção de sistemas de segurança eletrônica. +10 anos de experiência.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00a859" />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="skip-to-content">
          Pular para o conteúdo principal
        </a>
        {children}
      </body>
    </html>
  );
}
