export const API_BASE = 'http://localhost:5500';

// Reusable function to make authenticated API requests.
async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('authToken');
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : null
  });


  if (!res.ok) {
    throw new Error('API request failed');
  }

  if (method === 'DELETE') return; // beccause my delete controller returns 204 :: No content

  return (await res.json()).data;
}


export default apiRequest;
