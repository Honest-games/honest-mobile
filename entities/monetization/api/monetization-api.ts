import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  SwipeValidationRequest,
  SwipeValidationResponse,
  PurchaseValidationRequest,
  PurchaseValidationResponse,
  MonetizationSyncRequest,
  MonetizationSyncResponse,
  UserLimitsResponse,
} from './types';

/**
 * RTK Query API для системы монетизации
 * Готов к интеграции с бэкендом, пока что с заглушками
 */
export const monetizationApi = createApi({
  reducerPath: 'monetizationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/monetization', // Заменить на реальный URL бэкенда
    prepareHeaders: (headers, { getState }) => {
      // Добавить авторизацию когда будет готово
      // const token = (getState() as RootState).auth.token;
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['MonetizationState', 'UserLimits', 'Purchase'],
  endpoints: (builder) => ({
    /**
     * Валидация свайпа на сервере
     * Проверяет, можно ли выполнить свайп и обновляет счетчик на сервере
     */
    validateSwipe: builder.mutation<SwipeValidationResponse, SwipeValidationRequest>({
      query: (data) => ({
        url: '/validate-swipe',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MonetizationState'],
    }),

    /**
     * Валидация покупки
     * Проверяет транзакцию на серверах Apple/T-Bank
     */
    validatePurchase: builder.mutation<PurchaseValidationResponse, PurchaseValidationRequest>({
      query: (data) => ({
        url: '/validate-purchase',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MonetizationState', 'Purchase'],
    }),

    /**
     * Синхронизация состояния монетизации с сервером
     * Разрешает конфликты между локальным и серверным состоянием
     */
    syncMonetizationState: builder.mutation<MonetizationSyncResponse, MonetizationSyncRequest>({
      query: (data) => ({
        url: '/sync-state',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MonetizationState'],
    }),

    /**
     * Получение лимитов пользователя
     * Возвращает персональные настройки лимитов
     */
    getUserLimits: builder.query<UserLimitsResponse, { userId: string }>({
      query: ({ userId }) => `/limits/${userId}`,
      providesTags: ['UserLimits'],
    }),

    /**
     * Получение состояния монетизации для конкретной колоды
     */
    getDeckMonetizationState: builder.query<
      { deckId: string; swipeCount: number; isPurchased: boolean },
      { userId: string; deckId: string }
    >({
      query: ({ userId, deckId }) => `/state/${userId}/${deckId}`,
      providesTags: (result, error, { deckId }) => [
        { type: 'MonetizationState', id: deckId },
      ],
    }),
  }),
});

export const {
  useValidateSwipeMutation,
  useValidatePurchaseMutation,
  useSyncMonetizationStateMutation,
  useGetUserLimitsQuery,
  useGetDeckMonetizationStateQuery,
} = monetizationApi;