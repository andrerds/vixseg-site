"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "Olá! Gostaria de solicitar um orçamento.",
  className,
}) => {
  const whatsappUrl = getWhatsAppLink(phoneNumber, message);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-[9999]",
        "flex items-center justify-center",
        "w-[60px] h-[60px] md:w-[70px] md:h-[70px]",
        "bg-[var(--color-whatsapp)] text-white",
        "rounded-full shadow-2xl",
        "transition-all duration-300 ease-out",
        "hover:scale-110 hover:shadow-[0_10px_40px_rgba(37,211,102,0.5)]",
        "focus:outline-none focus:ring-4 focus:ring-[var(--color-whatsapp)]/50 focus:ring-offset-2",
        "active:scale-95",
        "animate-pulse-subtle",
        className
      )}
      aria-label="Falar no WhatsApp"
      title="Fale conosco pelo WhatsApp"
    >
      <MessageCircle
        className="w-7 h-7 md:w-8 md:h-8"
        strokeWidth={2}
        aria-hidden="true"
      />

      {/* Ripple effect */}
      <span
        className="absolute inset-0 rounded-full bg-[var(--color-whatsapp)] animate-ping opacity-20"
        aria-hidden="true"
      />
    </a>
  );
};

WhatsAppButton.displayName = "WhatsAppButton";
