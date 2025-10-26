import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface CardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  icon: Icon,
  title,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl p-8 border border-gray-200",
        "transition-all duration-300 ease-out",
        "hover:shadow-2xl hover:-translate-y-2",
        "hover:border-[var(--color-primary)]",
        "focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-2",
        className
      )}
      role="article"
      aria-labelledby={`card-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0, 168, 89, 0.1) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
          aria-hidden="true"
        >
          <Icon className="w-8 h-8" strokeWidth={2} />
        </div>

        {/* Title */}
        <h3
          id={`card-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
          className="text-xl font-bold text-[var(--color-secondary)] mb-3 font-[family-name:var(--font-heading)]"
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-[var(--color-tertiary)] leading-relaxed font-[family-name:var(--font-body)]">
          {description}
        </p>
      </div>
    </div>
  );
};

Card.displayName = "Card";
