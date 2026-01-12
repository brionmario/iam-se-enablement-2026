import { http } from '@asgardeo/react';

export default async function getOrders() {
  const response = await http.request({
    url: `${import.meta.env.VITE_PIZZA_API_URL}/orders`,
    method: 'GET',
  });

  return response.data;
}
