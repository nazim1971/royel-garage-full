import { baseApi } from "../../api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders
    getAllOrder: builder.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
    }),

    // Delete order by id (only accessible by admin or customer who owns the order)
    deleteOrder: builder.mutation({
      query: (id: string) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
    }),

    // Update order by id (customer can cancel, admin can update status and cancel)
    updateOrder: builder.mutation({
      query: ({
        id,
        status,
        isCancel,
        role,
      }: {
        id: string;
        status?: string;
        isCancel?: boolean;
        role: string;
      }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body: { status, isCancel, role },
      }),
    }),

    getAllOrderByEmail: builder.query({
      query: (email: string) => ({
        url: `/orders/user-order/${email}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useDeleteOrderMutation,
  useGetAllOrderQuery,
  useUpdateOrderMutation,
  useGetAllOrderByEmailQuery,
} = productApi;
