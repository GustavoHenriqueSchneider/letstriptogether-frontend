/**
 * Decodifica um JWT token e retorna o payload
 */
export function decodeJWT(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

/**
 * Verifica se um JWT token está expirado
 * @param token - O token JWT a ser verificado
 * @returns true se o token estiver expirado, false caso contrário
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  
  if (!decoded || !decoded.exp) {
    // Se não conseguir decodificar ou não tiver campo exp, considera expirado
    return true;
  }

  // exp está em segundos, Date.now() está em milissegundos
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  return currentTime >= expirationTime;
}

