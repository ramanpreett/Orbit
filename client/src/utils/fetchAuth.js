export const fetchAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Adjust url if needed, for now we assume it's like '/api/clients' which proxied by vite
  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};
