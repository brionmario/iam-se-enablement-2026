import {http} from '@asgardeo/react';

export default async function getMenu() {
  const response = await http.request({ url: `${import.meta.env.VITE_PIZZA_API_URL}/menu`, method: 'GET' });
  
  return response.data;
}
