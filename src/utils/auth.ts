import { auth } from '../firebase/config';

/**
 * Obtiene el token de autenticación del usuario actual
 * Este token se puede usar para autenticar peticiones al backend
 * @returns Promise<string | null> - El token de ID o null si no hay usuario autenticado
 */
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

/**
 * Obtiene el token de autenticación y lo incluye en el header Authorization
 * Útil para hacer peticiones fetch al backend
 * @returns Promise<Headers> - Headers con el token de autorización
 */
export const getAuthHeaders = async (): Promise<Headers> => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const token = await getIdToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  return headers;
};

/**
 * Ejemplo de uso:
 * 
 * const headers = await getAuthHeaders();
 * const response = await fetch('http://localhost:3000/api/protected-route', {
 *   method: 'GET',
 *   headers: headers
 * });
 */

