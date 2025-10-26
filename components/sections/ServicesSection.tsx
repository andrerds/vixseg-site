"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { services } from "@/lib/data";
import * as LucideIcons from "lucide-react";

export const ServicesSection: React.FC = () => {
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

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="services-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="services-title"
            className={`text-4xl md:text-5xl font-bold text-[var(--color-secondary)] mb-6 font-[family-name:var(--font-heading)] transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Nossos Serviços
          </h2>
          <p
            className={`text-lg md:text-xl text-[var(--color-tertiary)] leading-relaxed transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Soluções completas em segurança eletrônica com equipamentos de
            última geração e equipe especializada
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            // Dynamically get the icon component from lucide-react
            const IconComponent = (
              LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>
            )[service.icon];

            return (
              <div
                key={service.id}
                className={`transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
                style={{
                  transitionDelay: `${200 + index * 100}ms`,
                }}
              >
                <Card
                  icon={IconComponent}
                  title={service.title}
                  description={service.shortDescription}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-[var(--color-tertiary)] text-lg mb-4">
            Precisa de uma solução personalizada?
          </p>
          <a
            href="#contato"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:text-[var(--color-primary-dark)] transition-colors group"
          >
            Entre em contato conosco
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Placeholder for Unicorn.studio animation */}
      <div
        id="unicorn-services-animation"
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
};

ServicesSection.displayName = "ServicesSection";
