import { useState, useEffect } from 'react';
import { getIdToken } from '../utils/auth';

const AuthTokenDisplay = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const idToken = await getIdToken();
      setToken(idToken);
    } catch (err: any) {
      setError(err.message || 'Error al obtener el token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-sm">Token de Autenticación</h4>
        <button
          onClick={fetchToken}
          disabled={loading}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>
      
      {error && (
        <p className="text-red-600 text-xs mb-2">{error}</p>
      )}
      
      {token ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-600 mb-1">
            Token (primeros 50 caracteres):
          </p>
          <code className="block p-2 bg-white border border-gray-300 rounded text-xs break-all">
            {token.substring(0, 50)}...
          </code>
          <p className="text-xs text-gray-500 mt-1">
            Usa este token en el header: <code className="bg-gray-200 px-1 rounded">Authorization: Bearer {'{token}'}</code>
          </p>
        </div>
      ) : (
        <p className="text-gray-500 text-xs">No hay token disponible</p>
      )}
    </div>
  );
};

export default AuthTokenDisplay;

