import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { companyData } from "@/lib/data";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00a859" />

        {/* Structured Data - LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://vixseg.com.br",
              name: companyData.name,
              description: companyData.description,
              url: "https://vixseg.com.br",
              telephone: companyData.contacts.phone,
              email: companyData.contacts.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: `${companyData.address.street}, ${companyData.address.number}`,
                addressLocality: companyData.address.city,
                addressRegion: companyData.address.state,
                postalCode: companyData.address.zipCode,
                addressCountry: "BR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: companyData.address.coordinates.lat,
                longitude: companyData.address.coordinates.lng,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
              priceRange: "$$",
              areaServed: {
                "@type": "City",
                name: "Grande Vitória",
              },
            }),
          }}
        />
      </head>
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        <a href="#main-content" className="skip-to-content">
          Pular para o conteúdo principal
        </a>
        {children}
        <WhatsAppButton
          phoneNumber={companyData.contacts.emergency}
          message="Olá! Gostaria de solicitar um orçamento."
        />
      </body>
    </html>
  );
}
