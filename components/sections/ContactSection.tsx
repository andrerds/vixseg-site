"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import { companyData } from "@/lib/data";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations";

export const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  });

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

  const onSubmit = async (data: ContactFormInput) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Implement actual form submission to backend
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
      console.log("Form data:", data); // Will be used when API is implemented

      setSubmitSuccess(true);
      reset();

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      // Log error for debugging in development
      if (process.env.NODE_ENV === "development") {
        console.error("Error submitting form:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contato"
      className="py-20 md:py-28 bg-white"
      aria-labelledby="contact-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="contact-title"
            className={`text-4xl md:text-5xl font-bold text-[var(--color-secondary)] mb-6 font-[family-name:var(--font-heading)] transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Entre em Contato
          </h2>
          <p
            className={`text-lg md:text-xl text-[var(--color-tertiary)] leading-relaxed transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Solicite um orçamento sem compromisso ou tire suas dúvidas com nossa
            equipe
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {submitSuccess ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-700 mb-2 font-[family-name:var(--font-heading)]">
                  Mensagem Enviada!
                </h3>
                <p className="text-green-600">
                  Obrigado pelo contato. Retornaremos em breve!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Nome completo"
                  {...register("name")}
                  error={errors.name?.message}
                  disabled={isSubmitting}
                />

                <Input
                  label="E-mail"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                  disabled={isSubmitting}
                />

                <Input
                  label="Telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  {...register("phone")}
                  error={errors.phone?.message}
                  disabled={isSubmitting}
                />

                <Textarea
                  label="Mensagem"
                  rows={5}
                  {...register("message")}
                  error={errors.message?.message}
                  disabled={isSubmitting}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensagem"}
                </Button>
              </form>
            )}

            {/* Contact Info */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 text-[var(--color-tertiary)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Phone
                    className="w-5 h-5 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className="font-semibold text-[var(--color-secondary)]">
                    Telefones
                  </div>
                  <div className="text-sm">
                    {companyData.contacts.phone} | Plantão:{" "}
                    {companyData.contacts.emergency}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[var(--color-tertiary)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Mail
                    className="w-5 h-5 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className="font-semibold text-[var(--color-secondary)]">
                    E-mail
                  </div>
                  <div className="text-sm">{companyData.contacts.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[var(--color-tertiary)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin
                    className="w-5 h-5 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className="font-semibold text-[var(--color-secondary)]">
                    Endereço
                  </div>
                  <div className="text-sm">
                    {companyData.address.street}, {companyData.address.number} -{" "}
                    {companyData.address.neighborhood},{" "}
                    {companyData.address.city} - {companyData.address.state}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Google Maps */}
          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="h-full min-h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.8!2d${companyData.address.coordinates.lng}!3d${companyData.address.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDA3JzQ0LjAiUyA0MMKwMTgnMzIuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da VixSeg Tecnologia no Google Maps"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for Unicorn.studio animation */}
      <div
        id="unicorn-contact-animation"
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
};

ContactSection.displayName = "ContactSection";
