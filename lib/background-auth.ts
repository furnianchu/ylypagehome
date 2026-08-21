export function verifyToken(token: string | null): boolean {
  if (!token) return false;
  const validTokens = (process.env.BACKGROUND_ADMIN_TOKENS || '').split(',').map(t => t.trim());
  return validTokens.includes(token);
}
