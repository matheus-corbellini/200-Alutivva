import type { PropertyDetails } from "../types/propertyDetails";

export const mockPropertyDetails: Record<number, PropertyDetails> = {
  1: {
    id: 1,
    title: "Residencial Vista Verde",
    type: "Residencial",
    roi: 12.5,
    quotaValue: 50000,
    totalQuotas: 100,
    soldQuotas: 65,
    status: "Em construção",
    completionDate: "Dez 2025",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Empreendimento residencial de alto padrão com vista para o mar",
    expectedReturn: "R$ 6.250/ano",

    // Detalhes expandidos
    gallery: [
      "/placeholder.svg?height=400&width=600&text=Vista+Aérea",
      "/placeholder.svg?height=400&width=600&text=Planta+Baixa",
      "/placeholder.svg?height=400&width=600&text=Área+Comum",
      "/placeholder.svg?height=400&width=600&text=Apartamento+Modelo",
    ],

    videos: [
      {
        title: "Tour Virtual do Empreendimento",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop&crop=center",
      },
      {
        title: "Apresentação do Projeto",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=200&fit=crop&crop=center",
      },
    ],

    floorPlans: [
      {
        title: "Planta Tipo - 2 Quartos",
        image: "/placeholder.svg?height=400&width=500&text=Planta+2Q",
        area: "65m²",
        rooms: 2,
        bathrooms: 2,
      },
      {
        title: "Planta Tipo - 3 Quartos",
        image: "/placeholder.svg?height=400&width=500&text=Planta+3Q",
        area: "85m²",
        rooms: 3,
        bathrooms: 2,
      },
    ],

    financialProjection: {
      investmentValue: 50000,
      monthlyReturn: 520,
      annualReturn: 6250,
      roi: 12.5,
      paybackPeriod: 96,
      projectedAppreciation: 35,
      timeline: [
        { year: 2024, value: 50000, return: 0 },
        { year: 2025, value: 52500, return: 6250 },
        { year: 2026, value: 55125, return: 6563 },
        { year: 2027, value: 57881, return: 6891 },
        { year: 2028, value: 60775, return: 7235 },
        { year: 2029, value: 63814, return: 7597 },
      ],
    },

    milestones: [
      {
        title: "Aprovação do Projeto",
        date: "Jan 2024",
        status: "completed",
        description: "Projeto aprovado pelos órgãos competentes",
      },
      {
        title: "Início das Obras",
        date: "Mar 2024",
        status: "completed",
        description: "Início da construção da fundação",
      },
      {
        title: "Estrutura Concluída",
        date: "Set 2024",
        status: "in-progress",
        description: "Conclusão da estrutura principal",
      },
      {
        title: "Acabamento",
        date: "Jun 2025",
        status: "pending",
        description: "Fase de acabamento e instalações",
      },
      {
        title: "Entrega",
        date: "Dez 2025",
        status: "pending",
        description: "Entrega das unidades aos proprietários",
      },
    ],

    documents: [
      {
        title: "Memorial Descritivo",
        type: "PDF",
        size: "2.5 MB",
        url: "#",
        category: "projeto",
      },
      {
        title: "Contrato de Investimento",
        type: "PDF",
        size: "1.8 MB",
        url: "#",
        category: "legal",
      },
      {
        title: "Licenças e Aprovações",
        type: "PDF",
        size: "3.2 MB",
        url: "#",
        category: "legal",
      },
      {
        title: "Planta Baixa Técnica",
        type: "PDF",
        size: "5.1 MB",
        url: "#",
        category: "projeto",
      },
      {
        title: "Relatório de Viabilidade",
        type: "PDF",
        size: "4.3 MB",
        url: "#",
        category: "financeiro",
      },
    ],

    amenities: [
      "Piscina adulto e infantil",
      "Academia completa",
      "Salão de festas",
      "Playground",
      "Quadra poliesportiva",
      "Sauna",
      "Espaço gourmet",
      "Portaria 24h",
      "Estacionamento coberto",
      "Área verde preservada",
    ],

    location: {
      address: "Av. das Américas, 3000 - Barra da Tijuca, Rio de Janeiro - RJ",
      coordinates: { lat: -23.0045, lng: -43.3647 },
      nearbyPlaces: [
        { name: "Shopping Barra", distance: "500m", type: "shopping" },
        { name: "Praia da Barra", distance: "800m", type: "beach" },
        { name: "Metro Jardim Oceânico", distance: "1.2km", type: "transport" },
        { name: "Hospital Barra D'Or", distance: "1.5km", type: "hospital" },
        { name: "PUC-Rio", distance: "2km", type: "education" },
      ],
    },

    developer: {
      name: "Construtora Vista Verde Ltda",
      logo: "/placeholder.svg?height=80&width=120&text=Logo",
      description:
        "Construtora com mais de 20 anos de experiência no mercado imobiliário",
      projects: 45,
      rating: 4.8,
    },

    risks: [
      {
        type: "Baixo",
        title: "Risco de Mercado",
        description: "Localização privilegiada com alta demanda histórica",
      },
      {
        type: "Médio",
        title: "Risco de Construção",
        description: "Construtora experiente com histórico sólido",
      },
      {
        type: "Baixo",
        title: "Risco Regulatório",
        description: "Todas as licenças aprovadas e documentação em dia",
      },
    ],
  },

  2: {
    id: 2,
    title: "Comercial Business Center",
    type: "Comercial",
    roi: 15.2,
    quotaValue: 75000,
    totalQuotas: 80,
    soldQuotas: 45,
    status: "Lançamento",
    completionDate: "Jun 2026",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Centro comercial premium na região mais valorizada de São Paulo",
    expectedReturn: "R$ 11.400/ano",

    gallery: [
      "/placeholder.svg?height=400&width=600&text=Fachada+Principal",
      "/placeholder.svg?height=400&width=600&text=Hall+de+Entrada",
      "/placeholder.svg?height=400&width=600&text=Sala+Comercial",
      "/placeholder.svg?height=400&width=600&text=Vista+Faria+Lima",
    ],

    videos: [
      {
        title: "Localização Privilegiada",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop&crop=center",
      },
    ],

    floorPlans: [
      {
        title: "Sala Comercial - Tipo A",
        image: "/placeholder.svg?height=400&width=500&text=Sala+Tipo+A",
        area: "45m²",
        rooms: 1,
        bathrooms: 1,
      },
      {
        title: "Sala Comercial - Tipo B",
        image: "/placeholder.svg?height=400&width=500&text=Sala+Tipo+B",
        area: "65m²",
        rooms: 2,
        bathrooms: 1,
      },
    ],

    financialProjection: {
      investmentValue: 75000,
      monthlyReturn: 950,
      annualReturn: 11400,
      roi: 15.2,
      paybackPeriod: 79,
      projectedAppreciation: 45,
      timeline: [
        { year: 2024, value: 75000, return: 0 },
        { year: 2025, value: 78750, return: 11400 },
        { year: 2026, value: 82688, return: 11970 },
        { year: 2027, value: 86822, return: 12568 },
        { year: 2028, value: 91163, return: 13197 },
        { year: 2029, value: 95721, return: 13856 },
      ],
    },

    milestones: [
      {
        title: "Lançamento do Projeto",
        date: "Nov 2024",
        status: "completed",
        description: "Projeto lançado oficialmente no mercado",
      },
      {
        title: "Início das Vendas",
        date: "Dez 2024",
        status: "in-progress",
        description: "Abertura das vendas das cotas",
      },
      {
        title: "Início das Obras",
        date: "Mar 2025",
        status: "pending",
        description: "Início da construção",
      },
      {
        title: "Entrega",
        date: "Jun 2026",
        status: "pending",
        description: "Entrega do empreendimento",
      },
    ],

    documents: [
      {
        title: "Prospecto de Investimento",
        type: "PDF",
        size: "3.1 MB",
        url: "#",
        category: "financeiro",
      },
      {
        title: "Contrato de Cota",
        type: "PDF",
        size: "2.2 MB",
        url: "#",
        category: "legal",
      },
    ],

    amenities: [
      "Recepção 24h",
      "Estacionamento rotativo",
      "Sistema de ar condicionado central",
      "Elevadores de alta velocidade",
      "Gerador de emergência",
      "Sistema de segurança",
      "Praça de alimentação",
      "Auditório",
    ],

    location: {
      address: "Av. Faria Lima, 2500 - Itaim Bibi, São Paulo - SP",
      coordinates: { lat: -23.5733, lng: -46.6892 },
      nearbyPlaces: [
        { name: "Estação Faria Lima", distance: "200m", type: "transport" },
        { name: "Shopping Iguatemi", distance: "600m", type: "shopping" },
        { name: "Parque do Povo", distance: "800m", type: "park" },
        { name: "Hospital Albert Einstein", distance: "1km", type: "hospital" },
      ],
    },

    developer: {
      name: "Business Center Desenvolvimento",
      logo: "/placeholder.svg?height=80&width=120&text=BCD+Logo",
      description: "Especializada em empreendimentos comerciais de alto padrão",
      projects: 28,
      rating: 4.9,
    },

    risks: [
      {
        type: "Baixo",
        title: "Risco de Localização",
        description: "Região de alta valorização e demanda constante",
      },
      {
        type: "Baixo",
        title: "Risco de Ocupação",
        description: "Alta demanda por espaços comerciais na região",
      },
    ],
  },
};
