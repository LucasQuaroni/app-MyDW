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
    <div className="p-4 bg-gray-800 border border-gray-700 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-sm text-gray-100">Token de Autenticación</h4>
        <button
          onClick={fetchToken}
          disabled={loading}
          className="px-3 py-1 text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition-all"
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>
      
      {error && (
        <p className="text-red-400 text-xs mb-2">{error}</p>
      )}
      
      {token ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 mb-1">
            Token (primeros 50 caracteres):
          </p>
          <code className="block p-2 bg-gray-900 border border-gray-700 rounded-lg text-xs break-all text-gray-300">
            {token.substring(0, 50)}...
          </code>
          <p className="text-xs text-gray-400 mt-1">
            Usa este token en el header: <code className="bg-gray-700 px-1 rounded text-gray-300">Authorization: Bearer {'{token}'}</code>
          </p>
        </div>
      ) : (
        <p className="text-gray-400 text-xs">No hay token disponible</p>
      )}
    </div>
  );
};

export default AuthTokenDisplay;

