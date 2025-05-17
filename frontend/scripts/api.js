export const API_BASE = 'http://localhost:5500';


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


  let data;
  try {
    data = await res.json();
  } catch (error) { 
    data = {};
  }

  if (!res.ok) {
    return { error: data.error || 'API request failed' }
  } 

  if (method === 'DELETE') return;

  
  return data;
}


export default apiRequest;
