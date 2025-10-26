"use client";

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToElement } from "@/lib/utils";
import { companyData } from "@/lib/data";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Contato", href: "#contato" },
];

// Custom SVG icons for social media
const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const socialLinks = [
  {
    name: "Facebook",
    icon: FacebookIcon,
    href: companyData.social.facebook,
    ariaLabel: "Visite nosso Facebook",
  },
  {
    name: "Instagram",
    icon: InstagramIcon,
    href: companyData.social.instagram,
    ariaLabel: "Visite nosso Instagram",
  },
  {
    name: "LinkedIn",
    icon: LinkedInIcon,
    href: companyData.social.linkedin,
    ariaLabel: "Visite nosso LinkedIn",
  },
];

export const Footer: React.FC = () => {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const elementId = href.replace("#", "");
    scrollToElement(elementId);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-secondary)] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-[var(--color-primary)] font-[family-name:var(--font-heading)]">
                VixSeg
              </div>
              <div className="text-sm text-white/90 font-medium">
                Tecnologia
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              {companyData.slogan}
            </p>
            <p className="text-white/70 text-sm">
              Especialistas em segurança eletrônica com mais de 10 anos de
              experiência.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-heading)]">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      "text-white/80 hover:text-[var(--color-primary)] transition-colors text-sm",
                      "focus:outline-none focus:text-[var(--color-primary)] focus:underline"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Social */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-heading)]">
              Contato
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-3 text-sm">
                <Phone
                  className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <a
                    href={`tel:${companyData.contacts.phone.replace(
                      /\D/g,
                      ""
                    )}`}
                    className="text-white/80 hover:text-[var(--color-primary)] transition-colors block"
                  >
                    {companyData.contacts.phone}
                  </a>
                  <a
                    href={`tel:${companyData.contacts.emergency.replace(
                      /\D/g,
                      ""
                    )}`}
                    className="text-white/80 hover:text-[var(--color-primary)] transition-colors block"
                  >
                    Plantão: {companyData.contacts.emergency}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Mail
                  className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${companyData.contacts.email}`}
                  className="text-white/80 hover:text-[var(--color-primary)] transition-colors"
                >
                  {companyData.contacts.email}
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <MapPin
                  className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-white/80">
                  {companyData.address.street}, {companyData.address.number}
                  <br />
                  {companyData.address.neighborhood}
                  <br />
                  {companyData.address.city} - {companyData.address.state}
                </span>
              </li>
            </ul>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Redes Sociais</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "w-10 h-10 rounded-full bg-white/10 flex items-center justify-center",
                        "hover:bg-[var(--color-primary)] transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-secondary)]"
                      )}
                      aria-label={social.ariaLabel}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-white/70 text-sm">
            © {currentYear} VixSeg Tecnologia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
