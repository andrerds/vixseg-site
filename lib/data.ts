import { CompanyData, Service } from './types';

export const companyData: CompanyData = {
  name: 'VixSeg Tecnologia',
  slogan: 'Seu maior bem, bem cuidado.',
  description: 'A VixSeg Tecnologia é uma empresa especializada em instalação e manutenção preventiva e corretiva de sistemas de segurança eletrônica. Com mais de 10 anos de experiência, nossa equipe é formada por profissionais capacitados, comprometidos com o respeito, a dignidade e a qualidade em cada serviço prestado.',
  address: {
    street: 'R. da Aldeia',
    number: '76',
    complement: 'Sala 04',
    neighborhood: 'Parque Residencial Laranjeiras',
    city: 'Serra',
    state: 'ES',
    zipCode: '29165-930',
    coordinates: {
      lat: -20.1289,
      lng: -40.3089,
    },
  },
  contacts: {
    phone: '(27) 3079-0014',
    emergency: '(27) 99973-9028',
    email: 'contato@vixseg.com.br',
  },
  social: {
    facebook: 'https://facebook.com/vixseg',
    instagram: 'https://instagram.com/vixseg',
    linkedin: 'https://linkedin.com/company/vixseg',
  },
  differentials: [
    'Profissionais com mais de 10 anos de experiência',
    'Atendimento 24h',
    'Equipamentos modernos',
    'Soluções personalizadas',
    'Atuação em toda a Grande Vitória',
  ],
};

export const services: Service[] = [
  {
    id: '1',
    slug: 'cftv',
    title: 'Sistema de CFTV',
    shortDescription: 'Monitoramento em tempo real com câmeras de alta resolução',
    icon: 'Camera',
    order: 1,
  },
  {
    id: '2',
    slug: 'alarme',
    title: 'Alarme Residencial e Empresarial',
    shortDescription: 'Proteção inteligente com sensores modernos',
    icon: 'Bell',
    order: 2,
  },
  {
    id: '3',
    slug: 'cerca-eletrica',
    title: 'Cerca Elétrica',
    shortDescription: 'Barreiras físicas e eletrônicas de alta eficiência',
    icon: 'Zap',
    order: 3,
  },
  {
    id: '4',
    slug: 'controle-acesso',
    title: 'Controle de Acesso',
    shortDescription: 'Gestão automatizada de entradas e saídas',
    icon: 'Fingerprint',
    order: 4,
  },
  {
    id: '5',
    slug: 'interfones',
    title: 'Interfones e Videoporteiros',
    shortDescription: 'Comunicação prática e segura',
    icon: 'Phone',
    order: 5,
  },
  {
    id: '6',
    slug: 'manutencao',
    title: 'Manutenção Preventiva e Corretiva',
    shortDescription: 'Garantia de funcionamento contínuo dos equipamentos',
    icon: 'Wrench',
    order: 6,
  },
];
