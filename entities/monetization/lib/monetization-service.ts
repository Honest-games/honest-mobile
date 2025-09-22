import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from '@react-native-community/netinfo'; // Временно закомментировано
import {
  SwipeValidationRequest,
  SwipeValidationResponse,
  MonetizationSyncRequest,
  MonetizationSyncResponse,
  ServerMonetizationState
} from '../api/types';
import { monetizationApi } from '../api/monetization-api';

const STORAGE_KEYS = {
  MONETIZATION_STATE: '@monetization_state',
  OFFLINE_ACTIONS: '@monetization_offline_actions',
  LAST_SYNC: '@monetization_last_sync',
} as const;

interface OfflineAction {
  id: string;
  type: 'swipe' | 'purchase';
  deckId: string;
  userId: string;
  timestamp: number;
  data: any;
}

/**
 * Сервис для управления монетизацией с поддержкой offline режима
 * Обеспечивает консистентность данных между клиентом и сервером
 */
export class MonetizationService {
  private static instance: MonetizationService;
  private offlineQueue: OfflineAction[] = [];
  private isOnline = true;
  private syncInProgress = false;

  private constructor() {
    this.initializeNetworkListener();
    this.loadOfflineQueue();
  }

  static getInstance(): MonetizationService {
    if (!MonetizationService.instance) {
      MonetizationService.instance = new MonetizationService();
    }
    return MonetizationService.instance;
  }

  private initializeNetworkListener() {
    // Временная реализация без NetInfo
    // В production версии здесь будет полноценный мониторинг сети
    this.isOnline = true;

    // NetInfo.addEventListener(state => {
    //   const wasOffline = !this.isOnline;
    //   this.isOnline = state.isConnected ?? false;

    //   // Если восстановилось соединение, синхронизируем данные
    //   if (wasOffline && this.isOnline && this.offlineQueue.length > 0) {
    //     this.syncOfflineActions();
    //   }
    // });
  }

  private async loadOfflineQueue() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_ACTIONS);
      if (stored) {
        this.offlineQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  private async saveOfflineQueue() {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.OFFLINE_ACTIONS,
        JSON.stringify(this.offlineQueue)
      );
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  /**
   * Валидация свайпа с fallback на локальную логику
   */
  async validateSwipe(request: SwipeValidationRequest): Promise<SwipeValidationResponse> {
    const { userId, deckId, currentSwipeCount, incrementBy } = request;

    if (!this.isOnline) {
      // Offline режим - используем локальную логику
      return this.handleSwipeOffline(request);
    }

    try {
      // Пытаемся валидировать на сервере
      // В реальной имплементации здесь будет полноценный API вызов
      // Пока используем fallback логику
      return this.handleSwipeOffline(request);
    } catch (error) {
      console.error('Server validation failed, using offline logic:', error);
      return this.handleSwipeOffline(request);
    }
  }

  private async handleSwipeOffline(request: SwipeValidationRequest): Promise<SwipeValidationResponse> {
    const { deckId, currentSwipeCount, incrementBy } = request;
    const newCount = currentSwipeCount + incrementBy;

    // Добавляем действие в очередь для последующей синхронизации
    await this.addToOfflineQueue({
      id: `swipe_${Date.now()}_${Math.random()}`,
      type: 'swipe',
      deckId,
      userId: request.userId,
      timestamp: Date.now(),
      data: request,
    });

    // Проверяем локальное состояние покупки
    const isPurchased = await this.getLocalPurchaseStatus(deckId);

    return {
      success: true,
      allowedSwipeCount: newCount,
      serverSwipeCount: newCount,
      shouldShowPaywall: !isPurchased && newCount >= 15,
      syncRequired: true,
    };
  }

  private async addToOfflineQueue(action: OfflineAction) {
    this.offlineQueue.push(action);
    await this.saveOfflineQueue();
  }

  private async getLocalPurchaseStatus(deckId: string): Promise<boolean> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.MONETIZATION_STATE);
      if (stored) {
        const state = JSON.parse(stored);
        return state.deckPurchases?.[deckId]?.isPurchased || false;
      }
    } catch (error) {
      console.error('Failed to get local purchase status:', error);
    }
    return false;
  }

  /**
   * Синхронизация offline действий с сервером
   */
  async syncOfflineActions(): Promise<boolean> {
    if (this.syncInProgress || !this.isOnline || this.offlineQueue.length === 0) {
      return false;
    }

    this.syncInProgress = true;

    try {
      // Группируем действия по пользователям
      const actionsByUser = this.groupActionsByUser();

      for (const [userId, actions] of Object.entries(actionsByUser)) {
        await this.syncUserActions(userId, actions);
      }

      // Очищаем очередь после успешной синхронизации
      this.offlineQueue = [];
      await this.saveOfflineQueue();

      // Обновляем время последней синхронизации
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    } finally {
      this.syncInProgress = false;
    }
  }

  private groupActionsByUser(): Record<string, OfflineAction[]> {
    return this.offlineQueue.reduce((acc, action) => {
      if (!acc[action.userId]) {
        acc[action.userId] = [];
      }
      acc[action.userId].push(action);
      return acc;
    }, {} as Record<string, OfflineAction[]>);
  }

  private async syncUserActions(userId: string, actions: OfflineAction[]) {
    // Получаем текущее локальное состояние
    const localState = await this.getLocalMonetizationState(userId);

    // Формируем запрос на синхронизацию
    const syncRequest: MonetizationSyncRequest = {
      userId,
      localState: this.prepareLocalStateForSync(localState, actions),
    };

    try {
      // В реальной имплементации здесь будет вызов API для синхронизации
      // Пока оставляем заглушку
      console.log(`Syncing user ${userId} actions:`, actions.length);

      // Применяем локальные изменения как будто они пришли с сервера
      // В production здесь будет реальная логика разрешения конфликтов
    } catch (error) {
      console.error(`Failed to sync user ${userId}:`, error);
      throw error;
    }
  }

  private async getLocalMonetizationState(userId: string): Promise<any> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.MONETIZATION_STATE);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get local monetization state:', error);
      return {};
    }
  }

  private prepareLocalStateForSync(localState: any, actions: OfflineAction[]): any {
    // Применяем offline действия к локальному состоянию для синхронизации
    const stateForSync = { ...localState };

    actions.forEach(action => {
      if (action.type === 'swipe') {
        const { deckId } = action.data;
        if (!stateForSync[deckId]) {
          stateForSync[deckId] = {
            deckId,
            swipeCount: 0,
            isPurchased: false,
            lastUpdate: new Date(action.timestamp).toISOString(),
          };
        }
        stateForSync[deckId].swipeCount += action.data.incrementBy;
        stateForSync[deckId].lastUpdate = new Date(action.timestamp).toISOString();
      }
    });

    return stateForSync;
  }

  private async applyServerState(syncResponse: MonetizationSyncResponse) {
    // Применяем состояние с сервера к локальному Redux store
    // Это должно вызывать соответствующие actions в Redux

    if (syncResponse.conflicts && syncResponse.conflicts.length > 0) {
      console.warn('Monetization sync conflicts detected:', syncResponse.conflicts);
      // Логируем конфликты для анализа
    }

    // Сохраняем обновленное состояние
    await AsyncStorage.setItem(
      STORAGE_KEYS.MONETIZATION_STATE,
      JSON.stringify(syncResponse.serverState)
    );
  }

  /**
   * Проверяет, нужна ли синхронизация
   */
  async needsSync(): Promise<boolean> {
    if (!this.isOnline) return false;

    const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    if (!lastSync) return true;

    const lastSyncDate = new Date(lastSync);
    const now = new Date();
    const hoursSinceSync = (now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60);

    // Синхронизируем если прошло больше часа или есть offline действия
    return hoursSinceSync > 1 || this.offlineQueue.length > 0;
  }

  /**
   * Форсированная синхронизация
   */
  async forceSync(): Promise<boolean> {
    if (!this.isOnline) return false;

    return this.syncOfflineActions();
  }

  /**
   * Получение статуса подключения
   */
  isConnected(): boolean {
    return this.isOnline;
  }

  /**
   * Получение количества pending действий
   */
  getPendingActionsCount(): number {
    return this.offlineQueue.length;
  }
}