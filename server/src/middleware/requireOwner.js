import { getAuthClient } from "../config/auth.js";

function bearerToken(header = "") {
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
}

export function createRequireOwner({
  authClient = getAuthClient,
  ownerId = () => process.env.OWNER_USER_ID,
} = {}) {
  return async function requireOwner(request, response, next) {
    const client = authClient();
    const allowedUserId = ownerId();
    if (!client || !allowedUserId) {
      return response.status(503).json({ error: "Private access is not configured." });
    }

    const token = bearerToken(request.get("authorization"));
    if (!token) return response.status(401).json({ error: "Sign in is required." });

    try {
      const { data, error } = await client.auth.getUser(token);
      if (error || !data.user) {
        return response.status(401).json({ error: "Your session is invalid or has expired." });
      }
      if (data.user.id !== allowedUserId) {
        return response.status(403).json({ error: "This account cannot access the private journal." });
      }
      request.user = data.user;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export const requireOwner = createRequireOwner();
