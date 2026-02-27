/* src/api/middleware/attachAccessContext.js
   desc: injeta req.access com o contexto de permissões do usuário logado.
*/

import { computeAccessContext } from '../services/accessControl.js';

export function attachAccessContext() {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id || req.userId; // ajuste conforme seu auth
      if (!userId) {
        req.access = { exists: false };
        return next();
      }

      req.access = await computeAccessContext(userId);
      return next();
    } catch (err) {
      console.error('attachAccessContext error', err);
      req.access = { exists: false };
      return next();
    }
  };
}
