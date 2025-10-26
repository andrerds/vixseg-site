# Implementation Plan

- [x] 1. Setup project foundation and design system





  - Install required dependencies: lucide-react, react-hook-form, zod, sharp
  - Extract colors from docs/exemplos/favicon.png using sharp library
  - Generate CSS variables for primary, secondary, tertiary colors with light/dark variations
  - Configure Tailwind with custom colors, Poppins and Inter fonts
  - Create base layout structure in app/layout.tsx with proper metadata



  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 11.1, 11.2, 11.3_



- [ ] 2. Implement core UI components

  - [ ] 2.1 Create Button component with variants (primary, secondary, outline) and loading state



    - Implement TypeScript interface with variant, size, loading props
    - Add hover, active, disabled states with Tailwind classes
    - Include accessibility attributes (aria-label, aria-disabled)
    - _Requirements: 1.3, 5.2, 11.1, 11.2_



  - [ ] 2.2 Create Card component for services with hover effects

    - Implement base card structure with padding, border-radius, shadow
    - Add hover animation with elevation and subtle glow effect
    - Include icon, title, and description slots


    - _Requirements: 3.1, 3.2, 3.3, 11.1_

  - [ ] 2.3 Create form Input and Textarea components with validation states

    - Implement controlled inputs with floating labels

    - Add error state styling and message display

    - Include focus animations and accessibility labels
    - _Requirements: 5.1, 5.5, 11.1, 11.2_

  - [ ] 2.4 Create WhatsApp floating button component
    - Implement fixed position button (bottom-right corner)
    - Add WhatsApp green background (#25D366) with white icon
    - Create link to WhatsApp with phone number (27) 99973-9028 and pre-filled message
    - Add pulse animation to attract attention
    - Include hover effect with scale and shadow
    - Ensure z-index 9999 to stay above all content
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 3. Build Header and Footer layout components

  - [ ] 3.1 Implement Header with navigation and mobile menu

    - Create sticky header with blur background on scroll
    - Add smooth scroll navigation to sections (Home, Sobre, Serviços, Diferenciais, Contato)
    - Implement responsive hamburger menu for mobile
    - Add VixSeg logo with proper sizing
    - _Requirements: 6.1, 6.2, 6.4, 11.1, 11.4_

  - [ ] 3.2 Implement Footer with company info and links

    - Create 3-column layout (logo/description, quick links, contact/social)
    - Add responsive stack layout for mobile
    - Include social media icons (Facebook, Instagram, LinkedIn) with lucide-react
    - Display copyright "© 2025 VixSeg Tecnologia"
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 11.1_

  - [ ] 3.3 Add WhatsApp button to main layout
    - Import and render WhatsAppButton component in root layout
    - Ensure button is visible on all pages
    - Test button functionality on mobile and desktop
    - _Requirements: 10.1, 10.4, 11.1_

- [ ] 4. Create Hero Section with video background

  - Implement full viewport height hero section
  - Add video background with dark overlay (opacity 0.6)
  - Include fallback image for video loading/errors
  - Display headline "Segurança com Tecnologia e Confiança" with Poppins Bold
  - Add subheadline "Instalação e manutenção de sistemas eletrônicos com os melhores equipamentos do mercado"
  - Implement CTA button "Solicite um orçamento" linking to contact section
  - Add scroll indicator animation at bottom
  - Integrate Unicorn.studio animation placeholder for future enhancement
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.4, 6.3, 6.5_

- [ ] 5. Build About Section with company information

  - Create 2-column grid layout (60% text, 40% info box)
  - Display company description from docs/vixseg.md
  - Implement info box with gradient background showing address and contacts
  - Add location icon with full address: "Centro Comercial Aldeia - R. da Aldeia, 76 - Sala 04, Parque Residencial Laranjeiras, Serra - ES"
  - Display phone "(27) 3079-0014" and emergency "(27) 99973-9028"
  - Add fade-up animation on scroll into viewport
  - Implement responsive stack layout for mobile
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2, 6.3_

- [ ] 6. Implement Services Section with animated cards

  - [ ] 6.1 Create services data structure with all 6 services

    - Define TypeScript interface for Service (id, title, description, icon)
    - Create services array: CFTV, Alarme, Cerca Elétrica, Controle de Acesso, Interfones, Manutenção
    - Map appropriate lucide-react icons to each service
    - _Requirements: 3.2, 11.2, 11.3_

  - [ ] 6.2 Build responsive grid layout for service cards

    - Implement 3-column grid for desktop, 2 for tablet, 1 for mobile
    - Add 2rem gap between cards
    - Render ServiceCard components with data mapping
    - _Requirements: 3.1, 3.5, 6.1, 6.2_

  - [ ] 6.3 Add hover animations and Unicorn.studio integration
    - Implement CSS hover effects with elevation and glow
    - Add Unicorn.studio animation placeholder for card interactions
    - Include icon rotation animation on hover
    - _Requirements: 3.3, 3.4, 11.1_

- [ ] 7. Create Differentials Section with icons

  - Define differentials array with 5 items from requirements
  - Implement 5-column grid for desktop, 2 for tablet, 1 for mobile
  - Add gradient background to section
  - Display large centered icons with lucide-react
  - Add text below each icon
  - Implement slide-in animation with staggered delay using Unicorn.studio placeholder
  - Add bounce effect to icons on appearance
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2_

- [ ] 8. Build Contact Section with form and map

  - [ ] 8.1 Implement contact form with validation

    - Create form with fields: Nome, E-mail, Telefone, Mensagem
    - Integrate react-hook-form for form state management
    - Add Zod validation schemas for all fields
    - Implement email validation with RFC 5322 regex
    - Add Brazilian phone format validation (XX) XXXXX-XXXX
    - Display error messages below fields with icons
    - _Requirements: 5.1, 5.5, 11.2, 11.3_

  - [ ] 8.2 Add form submission handling and animations

    - Implement form submit handler with loading state
    - Add Unicorn.studio pulse animation to submit button
    - Include ripple effect on button click
    - Show success/error toast notifications
    - _Requirements: 5.2, 11.1_

  - [ ] 8.3 Integrate Google Maps embed
    - Add Google Maps iframe with company location coordinates
    - Implement 2-column layout: form (50%) + map (50%)
    - Create responsive stack layout for mobile
    - Display contact information (phone, emergency, address) above or beside map
    - _Requirements: 5.3, 5.4, 6.1, 6.2_

- [ ] 9. Implement SEO optimization and metadata

  - Configure Next.js Metadata API in layout.tsx
  - Add title: "VixSeg Tecnologia | Segurança Eletrônica em Serra ES"
  - Add meta description with company services and location
  - Include keywords for local SEO (segurança eletrônica serra es, cftv vitória)
  - Add Open Graph tags for social sharing
  - Generate favicon from docs/exemplos/favicon.png
  - Implement structured data with LocalBusiness schema.org JSON-LD
  - Add alt text to all images
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.1_

- [ ] 10. Add responsive design and accessibility features

  - Implement mobile-first responsive breakpoints (320px, 768px, 1024px)
  - Ensure all text maintains minimum 16px font size
  - Add proper ARIA labels to interactive elements
  - Implement keyboard navigation support with visible focus indicators
  - Ensure color contrast meets WCAG AA standards (4.5:1 minimum)
  - Add touch targets minimum 44x44px for mobile
  - Implement smooth scroll behavior for anchor navigation
  - Add skip-to-content link for accessibility
  - Test with prefers-reduced-motion for animation preferences
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 11.1, 11.5_

- [ ] 11. Optimize performance and prepare for deployment

  - Configure Next.js Image component for all images with WebP format
  - Implement lazy loading for below-the-fold images
  - Add blur placeholders during image loading
  - Configure static export in next.config.ts
  - Optimize bundle size with tree shaking
  - Generate sitemap.xml for SEO
  - Add robots.txt file
  - Configure caching headers for static assets
  - Run Lighthouse audit and ensure score above 90
  - Verify Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
  - _Requirements: 1.5, 7.4, 7.5, 11.1_

- [ ]\* 12. Setup Unicorn.studio animations (optional enhancement)

  - [ ]\* 12.1 Create Unicorn.studio account and project

    - Sign up at unicorn.studio
    - Create new project for VixSeg website
    - _Requirements: 1.4_

  - [ ]\* 12.2 Design and export Hero Section animation

    - Create floating security particles (locks, shields) animation
    - Add parallax scroll behavior
    - Export animation embed code
    - _Requirements: 1.4_

  - [ ]\* 12.3 Design and export Service Cards hover animation

    - Create glow pulse effect for card hover
    - Add icon rotation animation
    - Export animation code
    - _Requirements: 3.3_

  - [ ]\* 12.4 Design and export Differentials entrance animation

    - Create slide-in sequential animation with delay
    - Add bounce effect for icons
    - Export animation code
    - _Requirements: 4.3_

  - [ ]\* 12.5 Design and export Contact Button animation

    - Create continuous pulse effect
    - Add ripple effect on click
    - Export animation code
    - _Requirements: 5.2_

  - [ ]\* 12.6 Integrate all Unicorn.studio animations into components
    - Add animation scripts to respective components
    - Implement lazy loading for animation scripts
    - Add fallback CSS animations if Unicorn fails to load
    - Test performance impact and optimize
    - _Requirements: 1.4, 3.3, 4.3, 5.2_
