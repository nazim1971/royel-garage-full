
import { baseApi } from "../../api/baseApi";


// const generateQueryParams = (args?: TQueryParam[]): URLSearchParams => {
//   const params = new URLSearchParams();
//   if (args) {
//     args.forEach((item: TQueryParam) => {
//       params.append(item.name, item.value as string);
//     });
//   }
//   return params;
// };


const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    addOrder: builder.mutation({
      query: (orderInfo) => ({
        url: "/orders",
        method: "POST",
        body: orderInfo,
      }),
    }),
  }),
});

export const {useAddOrderMutation} = orderApi