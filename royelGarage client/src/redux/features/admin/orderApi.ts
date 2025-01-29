
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


const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

   

    getAllOrder: builder.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
    }),

  
     
  }),
});

export const { useGetAllOrderQuery } = productApi;