import { http } from '@asgardeo/react';

export async function getRewards(userId) {
  const response = await http.request({
    url: `${
      import.meta.env.VITE_PIZZA_API_URL
    }/unity-rewards/profile/${userId}`,
    method: 'GET',
  });

  return response.data;
}
