import { http } from '@asgardeo/react';

export default async function deleteOrder(orderId) {
  const response = await http.request({
    url: `${import.meta.env.VITE_PIZZA_API_URL}/orders/${orderId}`,
    method: 'DELETE',
  });

  return response.data;
}
