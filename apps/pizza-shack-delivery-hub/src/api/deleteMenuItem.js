import { http } from '@asgardeo/react';

/**
 * Delete a menu item
 */
export default async function deleteMenuItem(id) {
  const response = await http.request({
    url: `${import.meta.env.VITE_PIZZA_API_URL}/menu/${id}`,
    method: 'DELETE',
  });

  return response.data;
}
