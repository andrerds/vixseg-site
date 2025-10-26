"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import { scrollToElement } from "@/lib/utils";

export const HeroSection: React.FC = () => {
  const [videoError, setVideoError] = useState(false);

  const handleCTAClick = () => {
    scrollToElement("contato");
  };

  const handleScrollDown = () => {
    scrollToElement("sobre");
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Seção principal"
    >
      {/* Video Background */}
      {!videoError && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setVideoError(true)}
          aria-hidden="true"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          <source src="/videos/hero-video.webm" type="video/webm" />
        </video>
      )}

      {/* Fallback Image */}
      {videoError && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/hero-fallback.jpg)",
          }}
          role="img"
          aria-label="Vista da Grande Vitória"
        />
      )}

      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-[family-name:var(--font-heading)]">
            Segurança com{" "}
            <span className="text-[var(--color-primary)]">Tecnologia</span> e
            Confiança
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-[family-name:var(--font-body)]">
            Instalação e manutenção de sistemas eletrônicos com os melhores
            equipamentos do mercado
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleCTAClick}
              className="text-lg px-10 py-5 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,168,89,0.4)] transform hover:scale-105"
            >
              Solicite um orçamento
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-white/80 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-[var(--color-primary)] rounded-full"
                aria-hidden="true"
              />
              <span>+10 anos de experiência</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-[var(--color-primary)] rounded-full"
                aria-hidden="true"
              />
              <span>Atendimento 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-[var(--color-primary)] rounded-full"
                aria-hidden="true"
              />
              <span>Grande Vitória</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/80 hover:text-white transition-all duration-300 animate-bounce focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-2"
        aria-label="Rolar para baixo"
      >
        <ChevronDown className="w-8 h-8" aria-hidden="true" />
      </button>

      {/* Placeholder for Unicorn.studio animation */}
      <div
        id="unicorn-hero-animation"
        className="absolute inset-0 pointer-events-none z-5"
        aria-hidden="true"
      />
    </section>
  );
};

HeroSection.displayName = "HeroSection";
