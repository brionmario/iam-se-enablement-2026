import { http } from '@asgardeo/react';

export default async function submitOrder(orderData) {
  const response = await http.request({
    url: `${import.meta.env.VITE_PIZZA_API_URL}/orders`,
    method: 'POST',
    data: orderData
  });
  
  return response.data;
}
