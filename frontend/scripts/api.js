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

  // we attempt to parse the response but is it fails data is set to an empty object to avoi breaking the code.
  let data;
  try {
    data = await res.json();
  } catch (error) { 
    data = {};
  }

  if (!res.ok) {
    return { error: data.error || 'API request failed' }
  } 

  if (method === 'DELETE') return; // because my delete controller returns 204 :: No content.

  
  return data;
}


export default apiRequest;
