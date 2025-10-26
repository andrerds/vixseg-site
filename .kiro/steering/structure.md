# Project Structure

## Directory Organization

```
/app                 # Next.js App Router pages and layouts
  layout.tsx         # Root layout with global styles
  page.tsx           # Home page component
  globals.css        # Global styles and Tailwind directives
  favicon.ico        # Site favicon

/docs                # Project documentation
  vixseg.md          # Company information and business details
  development-guid.md # Development guidelines and best practices

/public              # Static assets (images, SVGs)
  *.svg              # Icon and logo files

/node_modules        # Dependencies (not tracked)
/.next               # Next.js build output (not tracked)
/.kiro               # Kiro AI configuration and steering rules
```

## Key Conventions

- **App Router**: All routes defined in `/app` directory
- **TypeScript**: All components use `.tsx` extension
- **Styling**: Tailwind utility classes with BEM for complex components
- **Assets**: Static files in `/public`, referenced with `/filename.ext`
- **Documentation**: Technical and business docs in `/docs`

## Component Patterns

- Use functional components with TypeScript
- Export default for page components
- Use Next.js Image component for optimized images
- Implement responsive design with mobile-first approach
