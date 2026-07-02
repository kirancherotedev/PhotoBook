// ── Design Data Types (The Core Contract) ──

export interface BookConfig {
  projectType?: 'photobook' | 'polaroid';
  size: '8x8' | '10x10' | '12x12';
  coverType: 'hardcover' | 'softcover' | 'leather';
  paperType: 'matte' | 'glossy' | 'silk';
  pageCount: number;
}

export interface ImageProperties {
  src: string;
  originalWidth?: number;
  originalHeight?: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  opacity?: number;
  filters?: string[];
}

export interface TextProperties {
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  fontWeight?: string;
  fontStyle?: string;
  letterSpacing?: string;
  lineHeight?: number;
}

export interface PageElement {
  id: string;
  type: 'image' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  properties: ImageProperties | TextProperties;
}

export interface PageBackground {
  type: 'color' | 'pattern' | 'image';
  value: string;
}

export interface BookPage {
  id: string;
  type: 'front_cover' | 'back_cover' | 'spine' | 'content';
  background: PageBackground;
  elements: PageElement[];
}

export interface DesignData {
  bookConfig: BookConfig;
  pages: BookPage[];
}

// ── API Response Types ──

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ── User Types ──

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  phone?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ── Template Types ──

export interface TemplateItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  thumbnail: string | null;
  designData: string;
  isPublic: boolean;
  isFeatured: boolean;
  createdById: string;
  createdBy?: { name: string };
  createdAt: string;
}

// ── Order Types ──

export type OrderStatus = 'pending' | 'paid' | 'in_production' | 'printed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  user?: { name: string; email: string };
}

export interface OrderDetail extends OrderSummary {
  designSnapshot: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  shippingAddress: string | null;
  deliverySpeed: string | null;
  notes: string | null;
  items: OrderItemData[];
  payments: PaymentData[];
  project: { id: string; name: string };
}

export interface OrderItemData {
  id: string;
  label: string;
  description: string | null;
  amount: number;
  quantity: number;
}

export interface PaymentData {
  id: string;
  sessionId: string;
  status: string;
  amount: number;
  method: string;
  createdAt: string;
}

// ── Pricing Types ──

export interface PriceBreakdown {
  basePrice: number;
  basePriceLabel: string;
  perPageCost: number;
  extraPages: number;
  coverSurcharge: number;
  coverLabel: string;
  paperSurcharge: number;
  paperLabel: string;
  subtotal: number;
  discount: number;
  discountLabel?: string;
  shippingCost: number;
  total: number;
}

// ── Shipping Types ──

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}
