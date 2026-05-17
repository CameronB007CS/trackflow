import { useAuth } from '../context/AuthContext';

export function useApi() {
  const { token } = useAuth();

  const request = async (path, options = {}) => {
    const res = await fetch(`/api${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  return {
    get:    (path)         => request(path),
    post:   (path, body)   => request(path, { method: 'POST',   body }),
    patch:  (path, body)   => request(path, { method: 'PATCH',  body }),
    delete: (path)         => request(path, { method: 'DELETE' }),
  };
}
