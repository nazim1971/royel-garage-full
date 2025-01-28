import { TProduct } from "../../../types/products.types";
import { baseApi } from "../../api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (userInfo) => ({
        url: "/products",
        method: "POST",
        body: userInfo,
      }),
    }),
    getAllProduct: builder.query({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
    }),
    deleteProduct: builder.mutation({
        query: (id) => ({
          url: `/products/${id}`,
          method: "DELETE",
        }),
      }),
      updateProduct: builder.mutation<any, { id: string; productData: Partial<TProduct> }>({
        query: ({ id, productData }) => ({
          url: `/products/${id}`,
          method: 'PUT',
          body: productData,
        }),
      }),
  }),
});

export const { useAddProductMutation, useGetAllProductQuery, useDeleteProductMutation, useUpdateProductMutation } = productApi;