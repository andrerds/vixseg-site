"use client";

import React, { useEffect, useRef, useState } from "react";
import { Award, Clock, Wrench, Users, MapPin } from "lucide-react";
import { companyData } from "@/lib/data";

const differentialIcons = [Award, Clock, Wrench, Users, MapPin];

export const DifferentialsSection: React.FC = () => {
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
      id="diferenciais"
      className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      aria-labelledby="differentials-title"
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="differentials-title"
            className={`text-4xl md:text-5xl font-bold text-[var(--color-secondary)] mb-6 font-[family-name:var(--font-heading)] transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Nossos Diferenciais
          </h2>
          <p
            className={`text-lg md:text-xl text-[var(--color-tertiary)] leading-relaxed transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            O que nos torna a melhor escolha em segurança eletrônica
          </p>
        </div>

        {/* Differentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {companyData.differentials.map((differential, index) => {
            const Icon = differentialIcons[index];

            return (
              <div
                key={index}
                className={`group text-center transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
                style={{
                  transitionDelay: `${200 + index * 100}ms`,
                }}
              >
                {/* Icon Container */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  {/* Animated background circle */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full opacity-10 group-hover:opacity-20 transition-all duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />

                  {/* Icon */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <Icon
                      className="w-10 h-10 text-[var(--color-primary)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Pulse effect */}
                  <div
                    className="absolute inset-0 bg-[var(--color-primary)] rounded-full opacity-0 group-hover:opacity-20 group-hover:animate-ping"
                    aria-hidden="true"
                  />
                </div>

                {/* Text */}
                <h3 className="text-base md:text-lg font-semibold text-[var(--color-secondary)] leading-tight px-2 font-[family-name:var(--font-heading)] group-hover:text-[var(--color-primary)] transition-colors duration-300">
                  {differential}
                </h3>
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
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white px-8 py-6 rounded-2xl shadow-xl">
            <div className="text-left">
              <div className="text-2xl font-bold mb-1 font-[family-name:var(--font-heading)]">
                Pronto para proteger seu patrimônio?
              </div>
              <div className="text-white/90">
                Entre em contato e solicite um orçamento sem compromisso
              </div>
            </div>
            <a
              href="#contato"
              className="flex-shrink-0 bg-white text-[var(--color-primary)] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Falar com especialista
            </a>
          </div>
        </div>
      </div>

      {/* Placeholder for Unicorn.studio animation */}
      <div
        id="unicorn-differentials-animation"
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
};

DifferentialsSection.displayName = "DifferentialsSection";
