import { http } from '@asgardeo/react';

/**
 * Create a new menu item
 */
export default async function createMenuItem(menuItem) {
  try {
    const response = await http.request({
      url: `${import.meta.env.VITE_PIZZA_API_URL}/menu`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(menuItem),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to create menu item: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
}
