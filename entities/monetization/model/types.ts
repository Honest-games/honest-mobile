export interface SwipeCount {
  deckId: string;
  count: number;
}

export interface DeckPurchase {
  deckId: string;
  isPurchased: boolean;
  purchaseDate?: string;
  transactionId?: string;
}

export interface MonetizationState {
  swipeCounts: Record<string, number>;
  deckPurchases: Record<string, DeckPurchase>;
  freeSwipeLimit: number;
  isPaywallVisible: boolean;
  currentDeckId?: string;
}

export enum PaymentProvider {
  TBANK = 'tbank',
  APPLE_IAP = 'apple_iap',
}

export interface PaymentConfig {
  provider: PaymentProvider;
  productId: string;
  price: number;
  currency: string;
}

export interface PurchaseResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface RegionConfig {
  isRussia: boolean;
  paymentProvider: PaymentProvider;
  currency: string;
}