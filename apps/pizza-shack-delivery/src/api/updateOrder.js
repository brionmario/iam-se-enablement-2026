import { http } from '@asgardeo/react';

export default async function updateOrder(orderId, updateData) {
  const response = await http.request({
    url: `${import.meta.env.VITE_PIZZA_API_URL}/orders/${orderId}/status`,
    method: 'PATCH',
    data: updateData,
  });

  return response.data;
}
