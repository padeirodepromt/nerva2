/* src/api/middleware/rateLimiter.js
   desc: Middleware de Rate Limiting para proteção de endpoints críticos
*/

const rateLimitStore = new Map();

/**
 * Rate limiter simples em memória
 * @param {number} maxRequests - Máximo de requisições permitidas
 * @param {number} windowMs - Janela de tempo em milissegundos
 */
export function createRateLimiter(maxRequests = 5, windowMs = 60000) {
  return (req, res, next) => {
    const key = `${req.ip}-${req.path}`;
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, []);
    }

    const requests = rateLimitStore.get(key);
    
    // Limpar requisições antigas
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Muitas requisições. Tente novamente mais tarde.',
        retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
      });
    }

    validRequests.push(now);
    rateLimitStore.set(key, validRequests);

    next();
  };
}

/**
 * Rate limiter específico para auth
 * 5 tentativas por 15 minutos
 */
export const authLimiter = createRateLimiter(5, 15 * 60 * 1000);

/**
 * Rate limiter para APIs
 * 30 requisições por minuto
 */
export const apiLimiter = createRateLimiter(30, 60 * 1000);

/**
 * Rate limiter mais relaxado para leitura
 * 100 requisições por minuto
 */
export const readLimiter = createRateLimiter(100, 60 * 1000);

// Limpar store a cada 1 hora
setInterval(() => {
  const now = Date.now();
  for (const [key, requests] of rateLimitStore.entries()) {
    const validRequests = requests.filter(time => now - time < 3600000);
    if (validRequests.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, validRequests);
    }
  }
}, 60000);

export default {
  createRateLimiter,
  authLimiter,
  apiLimiter,
  readLimiter
};
