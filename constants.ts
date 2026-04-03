import { MapCategory, MapPoint, Post, Trend, Notification, User, ActionEvent, Petition, UniversityEntity, SocialAidInfo, Poll, FactCheck } from './types';

// Users
export const USERS: Record<string, User> = {
  CURRENT: {
    id: 'u1',
    name: 'Militante Betim',
    handle: '@militantebetim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    banner: 'https://pbs.twimg.com/profile_banners/1306065666/1602724888/1500x500', 
    bio: 'Militante ativo em Betim/MG. Lutando por um Brasil mais justo. Filiado desde 2010. 🚩⭐',
    joinedDate: 'setembro de 2010',
    following: 540,
    followers: '1.2M',
    isVerified: true,
  },
  LULA: {
    id: 'u2',
    name: 'Lula',
    handle: '@LulaOficial',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Lula_official_photo_jan_2023.jpg/800px-Lula_official_photo_jan_2023.jpg',
    isVerified: true,
  },
  PT_MG: {
    id: 'u3',
    name: 'PT Minas Gerais',
    handle: '@ptminas',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_n4q1qj2b-aXGkC5q-2K4wG4_g2r-4X7y-2g4_X=s900-c-k-c0x00ffffff-no-rj',
    isVerified: true,
  },
  MST: {
    id: 'u4',
    name: 'MST Oficial',
    handle: '@mst_oficial',
    avatar: 'https://pbs.twimg.com/profile_images/1628766576856981506/M-5v-6e__400x400.jpg',
    isVerified: true,
  },
  GLEISI: {
    id: 'u5',
    name: 'Gleisi Hoffmann',
    handle: '@gleisi',
    avatar: 'https://pbs.twimg.com/profile_images/1612470650907525121/v7w_yW_Q_400x400.jpg',
    isVerified: true,
  },
  MARILIA: {
    id: 'u6',
    name: 'Marília Campos',
    handle: '@mariliacampos',
    avatar: 'https://pbs.twimg.com/profile_images/1328470533502906371/P_1d0-yV_400x400.jpg',
    isVerified: true,
  }
};

export const CURRENT_USER = USERS.CURRENT;

// Posts
export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    user: USERS.LULA,
    content: 'O Brasil voltou a sorrir! Em Minas Gerais, retomamos as obras do Minha Casa Minha Vida. São mais de 2 mil chaves entregues só essa semana. O povo mineiro merece dignidade! 🇧🇷🏠 #MinasGerais #BrasilDaEsperança',
    timestamp: '2h',
    likes: '152K',
    comments: '4.2K',
    retweets: '12K',
    views: '1.5M',
    image: 'https://agenciabrasil.ebc.com.br/sites/default/files/atoms/image/lula_minha_casa_minha_vida.jpg',
    hasLiked: true
  },
  {
    id: 'p2',
    user: USERS.MST,
    content: 'URGENTE: Grande feira da reforma agrária acontecendo agora na Praça da Estação em BH. Venham comprar alimentos saudáveis e livres de agrotóxicos! 🌽🍅🥕',
    timestamp: '4h',
    likes: '8.5K',
    comments: '230',
    retweets: '1.5K',
    views: '45K',
    image: 'https://mst.org.br/wp-content/uploads/2022/05/Feira-Nacional-da-Reforma-Agraria-2022-Foto-Wellington-Lenon-MST-1.jpg'
  },
  {
    id: 'p3',
    user: USERS.PT_MG,
    content: 'Atenção militância de Betim! Reunião extraordinária hoje às 19h no diretório municipal. Pauta: Eleições municipais e organização de base. Contamos com todos! ✊🚩',
    timestamp: '5h',
    likes: '560',
    comments: '45',
    retweets: '120',
    views: '5K',
  },
  {
    id: 'p4',
    user: USERS.MARILIA,
    content: 'Betim avança! Hoje assinamos a ordem de serviço para a reforma de 3 escolas no bairro Citrolândia. Educação é prioridade absoluta do nosso mandato.',
    timestamp: '7h',
    likes: '2.1K',
    comments: '180',
    retweets: '400',
    views: '12K',
  },
  {
    id: 'p5',
    user: USERS.GLEISI,
    isRepost: true,
    repostUser: 'Você repostou',
    content: 'A extrema direita tenta mentir, mas os dados não mentem: O desemprego caiu para o menor nível desde 2014! Faz o L! ❤️',
    timestamp: '10h',
    likes: '45K',
    comments: '3K',
    retweets: '8K',
    views: '500K',
  }
];

// Map Points (Betim Context)
export const MAP_POINTS: MapPoint[] = [
  {
    id: 'm1',
    title: 'Diretório Municipal PT Betim',
    description: 'Sede oficial. Reuniões todas as terças às 19h.',
    category: MapCategory.LEADERSHIP,
    lat: -19.9675,
    lng: -44.1982,
    address: 'Av. Amazonas, 123 - Centro',
    region: 'Centro'
  },
  {
    id: 'm2',
    title: 'Assentamento 26 de Outubro',
    description: 'Produção agroecológica e centro de formação.',
    category: MapCategory.MST_COMMUNITY,
    lat: -19.9320,
    lng: -44.2450,
    address: 'Zona Rural - Vianópolis',
    region: 'Vianópolis'
  },
  {
    id: 'm3',
    title: 'Comitê Popular de Luta',
    description: 'Ponto de distribuição de materiais e bandeiras.',
    category: MapCategory.MEETING_POINT,
    lat: -19.9720,
    lng: -44.1920,
    address: 'Rua da União, 45 - Brasileia',
    region: 'Brasileia'
  },
  {
    id: 'm4',
    title: 'Coleta Solidária',
    description: 'Recebimento de alimentos para o Natal Sem Fome.',
    category: MapCategory.DONATION,
    lat: -19.9550,
    lng: -44.2020,
    address: 'Praça Milton Campos',
    region: 'Centro'
  },
  {
    id: 'm5',
    title: 'Gabinete Vereador Zé da Classe',
    description: 'Atendimento jurídico e apoio à comunidade.',
    category: MapCategory.LEADERSHIP,
    lat: -19.9820,
    lng: -44.1850,
    address: 'Bairro Angola',
    region: 'Angola'
  },
  {
    id: 'm6',
    title: 'Acampamento Marielle Franco',
    description: 'Ocupação urbana e cozinha comunitária.',
    category: MapCategory.MST_COMMUNITY,
    lat: -19.9910,
    lng: -44.1550,
    address: 'Jardim Teresópolis',
    region: 'Teresópolis'
  },
  {
    id: 'm_event_now',
    title: 'Ato pela Democracia - AO VIVO',
    description: 'Concentração acontecendo agora! Venha fortalecer.',
    category: MapCategory.EVENT,
    lat: -19.9240, 
    lng: -43.9400,
    address: 'Praça 7 - BH',
    isLive: true,
    region: 'Belo Horizonte'
  }
];

// Trends
export const TRENDS: Trend[] = [
  { id: 't1', category: 'Política • Assuntos do Momento', topic: 'Piso da Enfermagem', postsCount: '125 mil posts' },
  { id: 't2', category: 'Brasil • Tendências', topic: 'Faz o L', postsCount: '540 mil posts' },
  { id: 't3', category: 'Minas Gerais • Política', topic: '#ZemaNao', postsCount: '82 mil posts' },
  { id: 't4', category: 'Música • Assuntos do Momento', topic: 'Chico Buarque', postsCount: '15 mil posts' },
  { id: 't5', category: 'Esportes • Tendências', topic: 'Galo', postsCount: '22 mil posts' },
];

// Notifications
export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    user: USERS.LULA,
    postContent: 'Grande ato em Betim neste fim de semana! A força da estrela...',
    timestamp: '2 min',
  },
  {
    id: 'n2',
    type: 'mention',
    user: USERS.PT_MG,
    content: 'Parabéns pela mobilização @militantebetim! O trabalho de base é fundamental.',
    timestamp: '45 min',
  },
  {
    id: 'n3',
    type: 'follow',
    user: USERS.GLEISI,
    timestamp: '2h',
  },
  {
    id: 'n4',
    type: 'retweet',
    user: USERS.MST,
    postContent: 'Organizando as doações para a comunidade do Citrolândia...',
    timestamp: '5h',
  }
];

// Who to Follow (General)
export const WHO_TO_FOLLOW = [
  USERS.PT_MG,
  USERS.MST,
  {...USERS.CURRENT, id: 'u_sug1', name: 'Deputado Rogério', handle: '@rogerio.pt', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rogerio'}
];

// Main Leaders
export const LEADERS_LIST = [
  USERS.LULA,
  USERS.GLEISI,
  USERS.MARILIA
];

// NEW MOCK DATA

export const ACTIONS_DATA: ActionEvent[] = [
  {
    id: 'a1',
    title: 'Ato pela Democracia - Fora Extremistas',
    location: 'Av. Afonso Pena, Centro - BH',
    region: 'Centro',
    date: 'AGORA!',
    timestamp: '2024-10-25T14:00:00',
    organizer: 'PT Estadual',
    confirmedCount: 5430,
    type: 'PROTEST',
    image: 'https://images.unsplash.com/photo-1572916294749-d7790b793740?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1572916294749-d7790b793740?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532629345422-7515f4d16335?q=80&w=600&auto=format&fit=crop'
    ],
    lat: -19.9240, 
    lng: -43.9400
  },
  {
    id: 'a2',
    title: 'Mutirão de Cadastro Bolsa Família',
    location: 'CRAS Betim / Teresópolis',
    region: 'Teresópolis',
    date: 'Segunda, 08:00',
    timestamp: '2024-10-27T08:00:00',
    organizer: 'Assistência Social',
    confirmedCount: 120,
    type: 'MEETING',
    lat: -19.9910,
    lng: -44.1550,
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'a3',
    title: 'Caminhada Lula Livre (Simbólico)',
    location: 'Praça da Liberdade',
    region: 'Centro',
    date: 'Domingo, 09:00',
    timestamp: '2024-10-26T09:00:00',
    organizer: 'Juventude PT',
    confirmedCount: 890,
    type: 'PROTEST',
    lat: -19.9320,
    lng: -43.9380
  }
];

export const PETITIONS_DATA: Petition[] = [
  {
    id: 'pet1',
    title: 'Contra a privatização da CEMIG',
    description: 'A energia é do povo mineiro! Assine contra a venda do nosso patrimônio pelo governo Zema.',
    targetGoal: 100000,
    currentSignatures: 45230,
    createdBy: USERS.PT_MG,
    attachments: [
      { type: 'PDF', title: 'Dossiê Técnico Privatização.pdf', url: '#' },
      { type: 'LINK', title: 'Matéria no Brasil de Fato', url: '#' }
    ]
  },
  {
    id: 'pet2',
    title: 'Mais verbas para a Educação de Betim',
    description: 'Pela reforma imediata das escolas municipais do Citrolândia.',
    targetGoal: 5000,
    currentSignatures: 3100,
    createdBy: USERS.MARILIA
  }
];

export const POLLS_DATA: Poll[] = [
  {
    id: 'poll1',
    question: 'Qual deve ser a prioridade do mandato ano que vem?',
    createdBy: USERS.MARILIA,
    totalVotes: 1240,
    timeLeft: '2 dias restantes',
    options: [
      { id: 'o1', text: 'Saúde Básica', votes: 620, percent: 50 },
      { id: 'o2', text: 'Educação Infantil', votes: 310, percent: 25 },
      { id: 'o3', text: 'Transporte Público', votes: 310, percent: 25 },
    ]
  },
  {
    id: 'poll2',
    question: 'Apoia a greve dos professores estaduais?',
    createdBy: USERS.PT_MG,
    totalVotes: 5600,
    timeLeft: '5 horas restantes',
    options: [
      { id: 'o1', text: 'Sim, totalmente', votes: 5040, percent: 90 },
      { id: 'o2', text: 'Não', votes: 560, percent: 10 },
    ]
  }
];

export const UNIVERSITY_DATA: UniversityEntity[] = [
  { id: 'uni1', name: 'DCE UFMG', university: 'Universidade Federal de Minas Gerais', type: 'DCE', members: '25K membros' },
  { id: 'uni2', name: 'CA Ciências Sociais PUC', university: 'PUC Minas', type: 'CA', members: '1.2K membros' },
  { id: 'uni3', name: 'Movimento Estudantil Betim', university: 'UNA / PUC Betim', type: 'DCE', members: '800 membros' },
];

export const SOCIAL_AID_DATA: SocialAidInfo[] = [
  { id: 'aid1', title: 'Calendário Bolsa Família', description: 'Confira as datas de pagamento e requisitos para manutenção do benefício.', type: 'BOLSA_FAMILIA' },
  { id: 'aid2', title: 'Farmácia Popular', description: 'Lista de medicamentos gratuitos disponíveis na rede credenciada de Betim.', type: 'INFO' },
  { id: 'aid3', title: 'Solicitar Cesta Básica', description: 'Canal direto para famílias em situação de vulnerabilidade extrema.', type: 'AID_REQUEST' },
];

export const FACT_CHECK_DATA: FactCheck[] = [
  {
    id: 'fc1',
    fakeNews: 'Dizem que o governo vai acabar com o MEI.',
    fact: 'Isso é FAKE! O governo propôs ampliar o limite de faturamento do MEI para fortalecer os pequenos empreendedores.',
    source: 'Fonte: Secom / Governo Federal',
    date: '23/10/2024'
  },
  {
    id: 'fc2',
    fakeNews: 'Aumento de impostos na cesta básica.',
    fact: 'Mentira! A reforma tributária ZEROU os impostos da cesta básica para combater a fome.',
    source: 'Fonte: Ministério da Fazenda',
    date: '20/10/2024'
  }
];