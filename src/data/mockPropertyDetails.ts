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
        level: "baixo",
        title: "Risco de Mercado",
        description: "Localização privilegiada com alta demanda histórica",
      },
      {
        level: "médio",
        title: "Risco de Construção",
        description: "Construtora experiente com histórico sólido",
      },
      {
        level: "baixo",
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
        level: "baixo",
        title: "Risco de Localização",
        description: "Região de alta valorização e demanda constante",
      },
      {
        level: "baixo",
        title: "Risco de Ocupação",
        description: "Alta demanda por espaços comerciais na região",
      },
    ],
  },

  3: {
    id: 3,
    title: "Loft Studios Downtown",
    type: "Residencial",
    roi: 10.8,
    quotaValue: 35000,
    totalQuotas: 150,
    soldQuotas: 120,
    status: "Finalizado",
    completionDate: "Concluído",
    image: "/placeholder.svg?height=400&width=600",
    description: "Lofts modernos no coração do centro histórico",
    expectedReturn: "R$ 3.780/ano",

    gallery: [
      "/placeholder.svg?height=400&width=600&text=Loft+Modelo",
      "/placeholder.svg?height=400&width=600&text=Área+Comum",
      "/placeholder.svg?height=400&width=600&text=Vista+Urbana",
    ],

    videos: [
      {
        title: "Tour dos Lofts",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop&crop=center",
      },
    ],

    floorPlans: [
      {
        title: "Loft Studio - 35m²",
        image: "/placeholder.svg?height=400&width=500&text=Loft+35m2",
        area: "35m²",
        rooms: 1,
        bathrooms: 1,
      },
    ],

    financialProjection: {
      investmentValue: 35000,
      monthlyReturn: 315,
      annualReturn: 3780,
      roi: 10.8,
      paybackPeriod: 111,
      projectedAppreciation: 25,
      timeline: [
        { year: 2024, value: 35000, return: 3780 },
        { year: 2025, value: 36750, return: 3969 },
        { year: 2026, value: 38588, return: 4167 },
        { year: 2027, value: 40517, return: 4375 },
      ],
    },

    milestones: [
      {
        title: "Projeto Aprovado",
        date: "Jan 2023",
        status: "completed",
        description: "Projeto aprovado pela prefeitura",
      },
      {
        title: "Obras Iniciadas",
        date: "Mar 2023",
        status: "completed",
        description: "Início da construção",
      },
      {
        title: "Estrutura Concluída",
        date: "Set 2023",
        status: "completed",
        description: "Estrutura principal finalizada",
      },
      {
        title: "Acabamento",
        date: "Mar 2024",
        status: "completed",
        description: "Acabamento finalizado",
      },
      {
        title: "Entrega",
        date: "Jun 2024",
        status: "completed",
        description: "Empreendimento entregue",
      },
    ],

    documents: [
      {
        title: "Habite-se",
        type: "pdf",
        size: "1.2 MB",
        url: "#",
        category: "legal",
      },
      {
        title: "Registro de Imóveis",
        type: "pdf",
        size: "0.8 MB",
        url: "#",
        category: "legal",
      },
    ],

    amenities: [
      "Portaria 24h",
      "Academia",
      "Lavanderia",
      "Wi-Fi nas Áreas Comuns",
      "Bicicletário",
    ],

    location: {
      address: "Centro, RJ",
      coordinates: { lat: -22.9068, lng: -43.1729 },
      nearbyPlaces: [
        { name: "Teatro Municipal", distance: "300m", type: "culture" },
        { name: "Estação Carioca", distance: "400m", type: "transport" },
        { name: "Centro Comercial", distance: "200m", type: "shopping" },
      ],
    },

    developer: {
      name: "Downtown Developments",
      logo: "/placeholder.svg?height=100&width=100&text=DD",
      description: "Especialista em revitalização urbana",
      projects: 25,
      rating: 4.7,
    },

    risks: [
      {
        title: "Risco de Mercado",
        level: "baixo",
        description: "Empreendimento já entregue e funcionando",
      },
    ],
  },

  4: {
    id: 4,
    title: "Resort Tropical Paradise",
    type: "Hoteleiro",
    roi: 18.5,
    quotaValue: 100000,
    totalQuotas: 60,
    soldQuotas: 25,
    status: "Em construção",
    completionDate: "Mar 2026",
    image: "/placeholder.svg?height=400&width=600",
    description: "Resort de luxo em uma das praias mais belas do Brasil",
    expectedReturn: "R$ 18.500/ano",

    gallery: [
      "/placeholder.svg?height=400&width=600&text=Vista+Mar",
      "/placeholder.svg?height=400&width=600&text=Piscina",
      "/placeholder.svg?height=400&width=600&text=Suíte+Luxo",
    ],

    videos: [
      {
        title: "Apresentação do Resort",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop&crop=center",
      },
    ],

    floorPlans: [
      {
        title: "Suíte Standard - 45m²",
        image: "/placeholder.svg?height=400&width=500&text=Suite+45m2",
        area: "45m²",
        rooms: 1,
        bathrooms: 1,
      },
      {
        title: "Suíte Luxo - 80m²",
        image: "/placeholder.svg?height=400&width=500&text=Suite+Luxo",
        area: "80m²",
        rooms: 2,
        bathrooms: 2,
      },
    ],

    financialProjection: {
      investmentValue: 100000,
      monthlyReturn: 1542,
      annualReturn: 18500,
      roi: 18.5,
      paybackPeriod: 65,
      projectedAppreciation: 50,
      timeline: [
        { year: 2024, value: 100000, return: 0 },
        { year: 2025, value: 105000, return: 18500 },
        { year: 2026, value: 110250, return: 19425 },
        { year: 2027, value: 115763, return: 20396 },
        { year: 2028, value: 121551, return: 21416 },
      ],
    },

    milestones: [
      {
        title: "Licenciamento",
        date: "Jan 2024",
        status: "completed",
        description: "Licenças ambientais aprovadas",
      },
      {
        title: "Início das Obras",
        date: "Mar 2024",
        status: "in-progress",
        description: "Início da construção",
      },
      {
        title: "Estrutura",
        date: "Set 2024",
        status: "pending",
        description: "Conclusão da estrutura",
      },
      {
        title: "Acabamento",
        date: "Jan 2025",
        status: "pending",
        description: "Fase de acabamento",
      },
      {
        title: "Entrega",
        date: "Mar 2026",
        status: "pending",
        description: "Inauguração do resort",
      },
    ],

    documents: [
      {
        title: "Licença Ambiental",
        type: "pdf",
        size: "4.2 MB",
        url: "#",
        category: "legal",
      },
      {
        title: "Projeto Arquitetônico",
        type: "pdf",
        size: "5.1 MB",
        url: "#",
        category: "projeto",
      },
    ],

    amenities: [
      "Piscina Infinita",
      "Spa e Wellness",
      "Restaurante Gourmet",
      "Praia Privativa",
      "Concierge 24h",
      "Heliporto",
    ],

    location: {
      address: "Porto de Galinhas, PE",
      coordinates: { lat: -8.5014, lng: -35.0042 },
      nearbyPlaces: [
        { name: "Praia de Porto de Galinhas", distance: "100m", type: "beach" },
        { name: "Centro de Porto de Galinhas", distance: "500m", type: "commerce" },
        { name: "Aeroporto", distance: "15km", type: "transport" },
      ],
    },

    developer: {
      name: "Tropical Resorts Group",
      logo: "/placeholder.svg?height=100&width=100&text=TRG",
      description: "Especialista em resorts de luxo",
      projects: 15,
      rating: 4.9,
    },

    risks: [
      {
        title: "Risco Sazonal",
        level: "médio",
        description: "Demanda varia conforme a temporada",
      },
      {
        title: "Risco Climático",
        level: "baixo",
        description: "Região com clima estável",
      },
    ],
  },

  5: {
    id: 5,
    title: "Condomínio Família Feliz",
    type: "Residencial",
    roi: 11.3,
    quotaValue: 60000,
    totalQuotas: 90,
    soldQuotas: 78,
    status: "Em construção",
    completionDate: "Set 2025",
    image: "/placeholder.svg?height=400&width=600",
    description: "Condomínio familiar com área de lazer completa",
    expectedReturn: "R$ 6.780/ano",

    gallery: [
      "/placeholder.svg?height=400&width=600&text=Área+Infantil",
      "/placeholder.svg?height=400&width=600&text=Quadra+Esportes",
      "/placeholder.svg?height=400&width=600&text=Churrasqueira",
    ],

    videos: [
      {
        title: "Tour do Condomínio",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=200&fit=crop&crop=center",
      },
    ],

    floorPlans: [
      {
        title: "Apartamento 2Q - 70m²",
        image: "/placeholder.svg?height=400&width=500&text=Apto+2Q+70m2",
        area: "70m²",
        rooms: 2,
        bathrooms: 2,
      },
      {
        title: "Apartamento 3Q - 90m²",
        image: "/placeholder.svg?height=400&width=500&text=Apto+3Q+90m2",
        area: "90m²",
        rooms: 3,
        bathrooms: 2,
      },
    ],

    financialProjection: {
      investmentValue: 60000,
      monthlyReturn: 565,
      annualReturn: 6780,
      roi: 11.3,
      paybackPeriod: 106,
      projectedAppreciation: 30,
      timeline: [
        { year: 2024, value: 60000, return: 0 },
        { year: 2025, value: 63000, return: 6780 },
        { year: 2026, value: 66150, return: 7119 },
        { year: 2027, value: 69458, return: 7475 },
        { year: 2028, value: 72931, return: 7849 },
      ],
    },

    milestones: [
      {
        title: "Aprovação",
        date: "Jan 2024",
        status: "completed",
        description: "Projeto aprovado",
      },
      {
        title: "Fundação",
        date: "Mar 2024",
        status: "completed",
        description: "Fundação concluída",
      },
      {
        title: "Estrutura",
        date: "Jun 2024",
        status: "in-progress",
        description: "Estrutura em andamento",
      },
      {
        title: "Acabamento",
        date: "Mar 2025",
        status: "pending",
        description: "Fase de acabamento",
      },
      {
        title: "Entrega",
        date: "Set 2025",
        status: "pending",
        description: "Entrega das chaves",
      },
    ],

    documents: [
      {
        title: "Projeto Residencial",
        type: "pdf",
        size: "2.8 MB",
        url: "#",
        category: "projeto",
      },
      {
        title: "Laudo Técnico",
        type: "pdf",
        size: "1.9 MB",
        url: "#",
        category: "legal",
      },
    ],

    amenities: [
      "Playground",
      "Quadra Poliesportiva",
      "Churrasqueira",
      "Salão de Festas",
      "Piscina Infantil",
      "Portaria 24h",
    ],

    location: {
      address: "Alphaville, SP",
      coordinates: { lat: -23.518, lng: -46.845 },
      nearbyPlaces: [
        { name: "Shopping Iguatemi Alphaville", distance: "1km", type: "shopping" },
        { name: "Escola Internacional", distance: "800m", type: "education" },
        { name: "Parque", distance: "500m", type: "leisure" },
      ],
    },

    developer: {
      name: "Família Feliz Construtora",
      logo: "/placeholder.svg?height=100&width=100&text=FFC",
      description: "Especialista em condomínios familiares",
      projects: 35,
      rating: 4.6,
    },

    risks: [
      {
        title: "Risco de Atraso",
        level: "baixo",
        description: "Construtora experiente no segmento",
      },
      {
        title: "Risco de Mercado",
        level: "médio",
        description: "Demanda familiar estável",
      },
    ],
  },

  6: {
    id: 6,
    title: "Shopping Mall Premium",
    type: "Comercial",
    roi: 14.7,
    quotaValue: 85000,
    totalQuotas: 70,
    soldQuotas: 30,
    status: "Lançamento",
    completionDate: "Nov 2026",
    image: "/placeholder.svg?height=400&width=600",
    description: "Shopping center de última geração em área nobre",
    expectedReturn: "R$ 12.495/ano",

    gallery: [
      "/placeholder.svg?height=400&width=600&text=Entrada+Principal",
      "/placeholder.svg?height=400&width=600&text=Área+Comercial",
      "/placeholder.svg?height=400&width=600&text=Estacionamento",
    ],

    videos: [
      {
        title: "Apresentação do Shopping",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop&crop=center",
      },
    ],

    floorPlans: [
      {
        title: "Loja Comercial - 150m²",
        image: "/placeholder.svg?height=400&width=500&text=Loja+150m2",
        area: "150m²",
        rooms: 1,
        bathrooms: 1,
      },
      {
        title: "Quiosque - 30m²",
        image: "/placeholder.svg?height=400&width=500&text=Quiosque+30m2",
        area: "30m²",
        rooms: 1,
        bathrooms: 0,
      },
    ],

    financialProjection: {
      investmentValue: 85000,
      monthlyReturn: 1041,
      annualReturn: 12495,
      roi: 14.7,
      paybackPeriod: 82,
      projectedAppreciation: 40,
      timeline: [
        { year: 2024, value: 85000, return: 0 },
        { year: 2025, value: 89250, return: 12495 },
        { year: 2026, value: 93713, return: 13120 },
        { year: 2027, value: 98398, return: 13776 },
        { year: 2028, value: 103318, return: 14465 },
      ],
    },

    milestones: [
      {
        title: "Lançamento",
        date: "Jan 2024",
        status: "completed",
        description: "Lançamento oficial",
      },
      {
        title: "Início das Obras",
        date: "Mar 2024",
        status: "in-progress",
        description: "Início da construção",
      },
      {
        title: "Estrutura",
        date: "Set 2024",
        status: "pending",
        description: "Conclusão da estrutura",
      },
      {
        title: "Acabamento",
        date: "Jun 2025",
        status: "pending",
        description: "Fase de acabamento",
      },
      {
        title: "Inauguração",
        date: "Nov 2026",
        status: "pending",
        description: "Inauguração do shopping",
      },
    ],

    documents: [
      {
        title: "Projeto Comercial",
        type: "pdf",
        size: "4.5 MB",
        url: "#",
        category: "projeto",
      },
      {
        title: "Estudo de Viabilidade",
        type: "pdf",
        size: "3.2 MB",
        url: "#",
        category: "financeiro",
      },
    ],

    amenities: [
      "Estacionamento Coberto",
      "Sistema de Ar Condicionado",
      "Segurança 24h",
      "Elevadores Panorâmicos",
      "Área de Alimentação",
      "Cinema",
    ],

    location: {
      address: "Boa Viagem, PE",
      coordinates: { lat: -8.1137, lng: -34.8986 },
      nearbyPlaces: [
        { name: "Praia de Boa Viagem", distance: "300m", type: "beach" },
        { name: "Shopping Recife", distance: "2km", type: "shopping" },
        { name: "Aeroporto", distance: "8km", type: "transport" },
      ],
    },

    developer: {
      name: "Premium Shopping Group",
      logo: "/placeholder.svg?height=100&width=100&text=PSG",
      description: "Especialista em shopping centers premium",
      projects: 20,
      rating: 4.8,
    },

    risks: [
      {
        title: "Risco de Ocupação",
        level: "médio",
        description: "Dependência de lojistas",
      },
      {
        title: "Risco de Concorrência",
        level: "baixo",
        description: "Localização estratégica",
      },
    ],
  },
};
