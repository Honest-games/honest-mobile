import { FetchArgs } from '@reduxjs/toolkit/query'
import { api } from '@shared/api'

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendPromo: builder.mutation<FetchArgs | any, any>({
      query: ({ promo, userId }) => {
        return {
          url: `https://logotipiwe.ru/haur/api/v1/enter-promo/${promo}?clientId=${userId}`,
          method: "POST",
        };
      },
    }),
  }),
})

export const {
  useSendPromoMutation,
} = userApi