/* src/api/system/brandcode/adminGuard.js
   desc: Guard utilitário para operações admin-only do BrandCode
   role:
     - Centralizar validação de ADMIN_USER_ID
     - Evitar que rotas/serviços admin sejam executados por usuários comuns
*/

export function getAdminUserId() {
  const adminId = process.env.ADMIN_USER_ID || process.env.PRANA_ADMIN_USER_ID;
  return adminId || null;
}

export function isAdminUser(userId) {
  const adminId = getAdminUserId();
  if (!adminId) return false;
  return String(userId) === String(adminId);
}

export function assertAdmin(userId) {
  const adminId = getAdminUserId();

  if (!adminId) {
    throw new Error(
      "[BrandCodeAdminGuard] ADMIN_USER_ID não configurado no ambiente."
    );
  }

  if (String(userId) !== String(adminId)) {
    const err = new Error("Ação restrita ao Admin.");
    err.code = "ADMIN_ONLY";
    throw err;
  }

  return true;
}

export default {
  getAdminUserId,
  isAdminUser,
  assertAdmin,
};