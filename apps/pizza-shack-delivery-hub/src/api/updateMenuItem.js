import { http } from '@asgardeo/react';

/**
 * Update a menu item
 */
export default async function updateMenuItem(id, updates) {
  const response = await http.request({
    url: `${import.meta.env.VITE_PIZZA_API_URL}/menu/${id}`,
    method: 'PUT',
    data: updates,
  });

  return response.data;
}
