
import { 
  Company, 
  User, 
  UserRole, 
  Category,
  Product,
  Market,
  MarketType,
  PriceRecord,
  PriceOrigin,
  DelegatedTask,
  TaskStatus
} from '../types';

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'SuperMonitor Ltda.',
    cnpj: '12.345.678/0001-90',
    email: 'contato@supermonitor.com'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Demo',
    email: 'admin@supermonitor.com',
    role: UserRole.ADMIN,
    companyId: '1'
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@supermonitor.com',
    role: UserRole.AUDITOR,
    companyId: '1'
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria@supermonitor.com',
    role: UserRole.AUDITOR,
    companyId: '1'
  },
  {
    id: '4',
    name: 'Carlos Pereira',
    email: 'carlos@gmail.com',
    role: UserRole.CONTRIBUTOR,
    companyId: '1'
  },
  {
    id: '5',
    name: 'Ana Santos',
    email: 'ana@gmail.com',
    role: UserRole.CONTRIBUTOR,
    companyId: '1'
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Laticínios',
    companyId: '1'
  },
  {
    id: '2',
    name: 'Bebidas',
    companyId: '1'
  },
  {
    id: '3',
    name: 'Cereais',
    companyId: '1'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Leite Integral',
    brand: 'Parmalat',
    barcode: '7891234567890',
    categoryId: '1',
    companyId: '1',
    category: mockCategories[0]
  },
  {
    id: '2',
    name: 'Iogurte Natural',
    brand: 'Nestlé',
    barcode: '7891234567891',
    categoryId: '1',
    companyId: '1',
    category: mockCategories[0]
  },
  {
    id: '3',
    name: 'Refrigerante Cola',
    brand: 'Coca-Cola',
    barcode: '7891234567892',
    categoryId: '2',
    companyId: '1',
    category: mockCategories[1]
  },
  {
    id: '4',
    name: 'Suco de Laranja',
    brand: 'Del Valle',
    barcode: '7891234567893',
    categoryId: '2',
    companyId: '1',
    category: mockCategories[1]
  },
  {
    id: '5',
    name: 'Arroz Branco',
    brand: 'Tio João',
    barcode: '7891234567894',
    categoryId: '3',
    companyId: '1',
    category: mockCategories[2]
  },
  {
    id: '6',
    name: 'Feijão Carioca',
    brand: 'Camil',
    barcode: '7891234567895',
    categoryId: '3',
    companyId: '1',
    category: mockCategories[2]
  }
];

export const mockMarkets: Market[] = [
  {
    id: '1',
    name: 'Carrefour',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Pinheiros',
    type: MarketType.HYPERMARKET
  },
  {
    id: '2',
    name: 'Extra',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Moema',
    type: MarketType.SUPERMARKET
  },
  {
    id: '3',
    name: 'Assaí Atacadista',
    city: 'Rio de Janeiro',
    state: 'RJ',
    neighborhood: 'Tijuca',
    type: MarketType.WHOLESALE
  },
  {
    id: '4',
    name: 'Pão de Açúcar',
    city: 'Rio de Janeiro',
    state: 'RJ',
    neighborhood: 'Copacabana',
    type: MarketType.SUPERMARKET
  }
];

// Helper function to generate a date in the past
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const mockPriceRecords: PriceRecord[] = [
  {
    id: '1',
    productId: '1',
    marketId: '1',
    price: 4.89,
    collectedAt: daysAgo(1),
    userId: '2',
    origin: PriceOrigin.AUDITOR,
    notes: 'Promoção de lançamento',
    product: mockProducts[0],
    market: mockMarkets[0],
    user: mockUsers[1]
  },
  {
    id: '2',
    productId: '1',
    marketId: '2',
    price: 5.19,
    collectedAt: daysAgo(2),
    userId: '4',
    origin: PriceOrigin.CONTRIBUTOR,
    product: mockProducts[0],
    market: mockMarkets[1],
    user: mockUsers[3]
  },
  {
    id: '3',
    productId: '3',
    marketId: '1',
    price: 7.99,
    collectedAt: daysAgo(3),
    userId: '3',
    origin: PriceOrigin.AUDITOR,
    notes: 'Embalagem de 2L',
    product: mockProducts[2],
    market: mockMarkets[0],
    user: mockUsers[2]
  },
  {
    id: '4',
    productId: '3',
    marketId: '3',
    price: 6.75,
    collectedAt: daysAgo(5),
    userId: '5',
    origin: PriceOrigin.CONTRIBUTOR,
    product: mockProducts[2],
    market: mockMarkets[2],
    user: mockUsers[4]
  },
  {
    id: '5',
    productId: '5',
    marketId: '2',
    price: 22.50,
    collectedAt: daysAgo(1),
    userId: '2',
    origin: PriceOrigin.AUDITOR,
    notes: 'Pacote de 5kg',
    product: mockProducts[4],
    market: mockMarkets[1],
    user: mockUsers[1]
  },
  {
    id: '6',
    productId: '6',
    marketId: '4',
    price: 8.90,
    collectedAt: daysAgo(2),
    userId: '4',
    origin: PriceOrigin.CONTRIBUTOR,
    product: mockProducts[5],
    market: mockMarkets[3],
    user: mockUsers[3]
  },
  // Adicionar preços históricos para mostrar evolução
  {
    id: '7',
    productId: '1',
    marketId: '1',
    price: 4.59,
    collectedAt: daysAgo(10),
    userId: '2',
    origin: PriceOrigin.AUDITOR,
    product: mockProducts[0],
    market: mockMarkets[0],
    user: mockUsers[1]
  },
  {
    id: '8',
    productId: '1',
    marketId: '1',
    price: 4.29,
    collectedAt: daysAgo(20),
    userId: '2',
    origin: PriceOrigin.AUDITOR,
    product: mockProducts[0],
    market: mockMarkets[0],
    user: mockUsers[1]
  }
];

export const mockDelegatedTasks: DelegatedTask[] = [
  {
    id: '1',
    productId: '2',
    marketId: '1',
    city: 'São Paulo',
    state: 'SP',
    auditorId: '2',
    deadline: daysAgo(-2), // 2 days in future
    status: TaskStatus.PENDING,
    companyId: '1',
    product: mockProducts[1],
    market: mockMarkets[0],
    auditor: mockUsers[1]
  },
  {
    id: '2',
    productId: '4',
    marketId: '3',
    city: 'Rio de Janeiro',
    state: 'RJ',
    auditorId: '3',
    deadline: daysAgo(-5), // 5 days in future
    status: TaskStatus.PENDING,
    companyId: '1',
    product: mockProducts[3],
    market: mockMarkets[2],
    auditor: mockUsers[2]
  },
  {
    id: '3',
    productId: '5',
    marketId: '4',
    city: 'Rio de Janeiro',
    state: 'RJ',
    auditorId: '2',
    deadline: daysAgo(1), // 1 day in past
    status: TaskStatus.COMPLETED,
    completionDate: daysAgo(2),
    collectedPrice: 21.90,
    notes: 'Preço em promoção',
    companyId: '1',
    product: mockProducts[4],
    market: mockMarkets[3],
    auditor: mockUsers[1]
  },
  {
    id: '4',
    productId: '6',
    marketId: '2',
    city: 'São Paulo',
    state: 'SP',
    auditorId: '3',
    deadline: daysAgo(3), // 3 days in past
    status: TaskStatus.EXPIRED,
    companyId: '1',
    product: mockProducts[5],
    market: mockMarkets[1],
    auditor: mockUsers[2]
  }
];
