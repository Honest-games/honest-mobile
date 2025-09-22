/**
 * API типы для системы монетизации
 * Готовые интерфейсы для будущей интеграции с бэкендом
 */

export interface ServerMonetizationState {
  userId: string;
  deckId: string;
  swipeCount: number;
  isPurchased: boolean;
  purchaseDate?: string;
  transactionId?: string;
  lastSyncDate: string;
  serverSwipeCount?: number; // Счетчик на сервере для верификации
}

export interface SwipeValidationRequest {
  userId: string;
  deckId: string;
  currentSwipeCount: number;
  incrementBy: number;
  clientTimestamp: number;
}

export interface SwipeValidationResponse {
  success: boolean;
  allowedSwipeCount: number;
  serverSwipeCount: number;
  shouldShowPaywall: boolean;
  error?: string;
  syncRequired?: boolean;
}

export interface PurchaseValidationRequest {
  userId: string;
  deckId: string;
  transactionId: string;
  provider: 'apple_iap' | 'tbank';
  receipt?: string; // Для Apple IAP
}

export interface PurchaseValidationResponse {
  success: boolean;
  isPurchased: boolean;
  purchaseDate?: string;
  validatedTransactionId?: string;
  error?: string;
}

export interface MonetizationSyncRequest {
  userId: string;
  localState: Record<string, {
    deckId: string;
    swipeCount: number;
    isPurchased: boolean;
    lastUpdate: string;
  }>;
}

export interface MonetizationSyncResponse {
  success: boolean;
  serverState: Record<string, ServerMonetizationState>;
  conflicts?: Array<{
    deckId: string;
    clientCount: number;
    serverCount: number;
    resolution: 'use_server' | 'use_client' | 'reset';
  }>;
  error?: string;
}

export interface UserLimitsResponse {
  userId: string;
  freeSwipeLimit: number;
  premiumFeatures: string[];
  regionConfig: {
    isRussia: boolean;
    paymentProvider: 'apple_iap' | 'tbank';
    currency: string;
  };
}