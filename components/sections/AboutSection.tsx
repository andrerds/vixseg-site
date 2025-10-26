"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import { companyData } from "@/lib/data";
import { formatPhone } from "@/lib/utils";

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="py-20 md:py-28 bg-gray-50"
      aria-labelledby="about-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left Column - Text Content (60%) */}
          <div className="lg:col-span-3">
            <h2
              id="about-title"
              className={`text-4xl md:text-5xl font-bold text-[var(--color-secondary)] mb-6 font-[family-name:var(--font-heading)] transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              Sobre Nós
            </h2>

            <div
              className={`space-y-6 text-lg text-[var(--color-tertiary)] leading-relaxed transition-all duration-700 delay-100 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <p>{companyData.description}</p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 text-[var(--color-primary)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-secondary)]">
                      +10 anos
                    </div>
                    <div className="text-sm text-[var(--color-tertiary)]">
                      de experiência
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[var(--color-primary)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-secondary)]">
                      24 horas
                    </div>
                    <div className="text-sm text-[var(--color-tertiary)]">
                      de atendimento
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[var(--color-primary)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-secondary)]">
                      Grande Vitória
                    </div>
                    <div className="text-sm text-[var(--color-tertiary)]">
                      área de atuação
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info Box (40%) */}
          <div
            className={`lg:col-span-2 transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)] rounded-2xl p-8 shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div
                className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-primary)]/10 rounded-full -translate-y-1/2 translate-x-1/2"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full translate-y-1/2 -translate-x-1/2"
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-6 text-white">
                <h3 className="text-2xl font-bold mb-6 font-[family-name:var(--font-heading)]">
                  Entre em Contato
                </h3>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Localização</div>
                    <address className="not-italic text-white/90 text-sm leading-relaxed">
                      {companyData.address.street}, {companyData.address.number}
                      <br />
                      {companyData.address.complement}
                      <br />
                      {companyData.address.neighborhood}
                      <br />
                      {companyData.address.city} - {companyData.address.state}
                    </address>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Telefones</div>
                    <div className="space-y-1 text-sm">
                      <a
                        href={`tel:${companyData.contacts.phone.replace(
                          /\D/g,
                          ""
                        )}`}
                        className="block text-white/90 hover:text-white transition-colors"
                      >
                        {formatPhone(companyData.contacts.phone)}
                      </a>
                      <a
                        href={`tel:${companyData.contacts.emergency.replace(
                          /\D/g,
                          ""
                        )}`}
                        className="block text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors font-semibold"
                      >
                        Plantão: {formatPhone(companyData.contacts.emergency)}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Horário</div>
                    <div className="text-white/90 text-sm">
                      Atendimento 24 horas
                      <br />
                      <span className="text-[var(--color-primary)]">
                        7 dias por semana
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

AboutSection.displayName = "AboutSection";
