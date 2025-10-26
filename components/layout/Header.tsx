"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToElement } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Contato", href: "#contato" },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const elementId = href.replace("#", "");
    scrollToElement(elementId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      )}
    >
      <nav
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Navegação principal"
      >
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg"
            aria-label="VixSeg Tecnologia - Ir para o início"
          >
            <div className="text-2xl font-bold text-[var(--color-primary)] font-[family-name:var(--font-heading)]">
              VixSeg
            </div>
            <div className="hidden sm:block text-sm text-[var(--color-secondary)] font-medium">
              Tecnologia
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
                  isScrolled ? "text-[var(--color-secondary)]" : "text-white"
                )}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]",
              isScrolled
                ? "text-[var(--color-secondary)] hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            )}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden py-4 border-t border-gray-200 bg-white"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    "text-[var(--color-secondary)]",
                    "hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-inset"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

Header.displayName = "Header";
