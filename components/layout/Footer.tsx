"use client";

import React from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToElement } from "@/lib/utils";
import { companyData } from "@/lib/data";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Contato", href: "#contato" },
];

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    href: companyData.social.facebook,
    ariaLabel: "Visite nosso Facebook",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: companyData.social.instagram,
    ariaLabel: "Visite nosso Instagram",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
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
