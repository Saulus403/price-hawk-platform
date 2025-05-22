
export enum UserRole {
  ADMIN = "admin",
  AUDITOR = "auditor",
  CONTRIBUTOR = "alimentador",
  PUBLIC = "public"
}

export enum MarketType {
  HYPERMARKET = "hipermercado",
  SUPERMARKET = "supermercado",
  WHOLESALE = "atacadista"
}

export enum TaskStatus {
  PENDING = "pendente",
  COMPLETED = "realizado",
  EXPIRED = "expirado"
}

export enum PriceOrigin {
  AUDITOR = "auditor",
  CONTRIBUTOR = "alimentador"
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  company?: Company;
}

export interface Category {
  id: string;
  name: string;
  companyId: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  barcode: string;
  categoryId: string;
  companyId: string;
  category?: Category;
}

export interface Market {
  id: string;
  name: string;
  city: string;
  state: string;
  neighborhood: string;
  type: MarketType;
}

export interface PriceRecord {
  id: string;
  productId: string;
  marketId: string;
  price: number;
  collectedAt: string;
  userId: string;
  origin: PriceOrigin;
  notes?: string;
  product?: Product;
  market?: Market;
  user?: User;
}

export interface DelegatedTask {
  id: string;
  productId: string;
  marketId: string;
  city: string;
  state: string;
  auditorId: string;
  deadline: string;
  status: TaskStatus;
  completionDate?: string;
  collectedPrice?: number;
  notes?: string;
  companyId: string;
  product?: Product;
  market?: Market;
  auditor?: User;
}
