import { http } from '@asgardeo/react';

export default async function getOrderById(orderId) {
  const response = await http.request({
    url: `${import.meta.env.VITE_PIZZA_API_URL}/orders/${orderId}`,
    method: 'GET',
  });

  return response.data;
}
