// Company Data Types
export interface CompanyData {
  name: string;
  slogan: string;
  description: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contacts: {
    phone: string;
    emergency: string;
    email: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  differentials: string[];
}

// Service Types
export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  order: number;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Color Palette Types
export interface ColorPalette {
  primary: {
    main: string;
    light: string;
    dark: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
  };
  tertiary: {
    main: string;
    light: string;
    dark: string;
  };
  whatsapp: string;
}
