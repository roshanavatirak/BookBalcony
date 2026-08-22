/**
 * Declarative ABAC & RBAC authorization middleware builder.
 * 
 * Options:
 * - roles: Array<string> (e.g. ['admin'])
 * - attributes: Object (e.g. { isSeller: true, isPremium: true })
 * - model: Mongoose Model (optional, for resource ownership checks)
 * - ownerField: string (default: 'seller' or 'userId' or 'user')
 * - idParam: string (default: 'id')
 */
function authorize(options = {}) {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required before authorization check.",
        });
      }

      // 1. Check account blockage status
      if (user.blocked) {
        return res.status(403).json({
          success: false,
          message: "Your account has been suspended. Access denied.",
        });
      }

      const isAdmin = user.role === "admin";

      // Admins bypass standard role/attribute restrictions if allowed
      if (!options.adminBypass === false && isAdmin) {
        // Continue to resource lookup if ownership model specified
      } else {
        // 2. Check RBAC (Roles)
        if (options.roles && Array.isArray(options.roles) && options.roles.length > 0) {
          if (!options.roles.includes(user.role)) {
            return res.status(403).json({
              success: false,
              message: `Access denied. Requires one of the following roles: ${options.roles.join(", ")}`,
            });
          }
        }

        // 3. Check ABAC (User Attributes / Features)
        if (options.attributes && typeof options.attributes === "object") {
          for (const [attrKey, expectedVal] of Object.entries(options.attributes)) {
            if (user[attrKey] !== expectedVal) {
              return res.status(403).json({
                success: false,
                message: `Access denied. Required user attribute '${attrKey}' is not satisfied.`,
              });
            }
          }
        }
      }

      // 4. Check Resource-level ABAC Ownership (if model specified)
      if (options.model) {
        const idParam = options.idParam || "id";
        const resourceId = req.params[idParam] || req.body[idParam];

        if (resourceId) {
          const resource = await options.model.findById(resourceId);

          if (!resource) {
            return res.status(404).json({
              success: false,
              message: "Requested resource not found.",
            });
          }

          const ownerField = options.ownerField || (resource.seller ? "seller" : resource.user ? "user" : "userId");
          const resourceOwnerId = resource[ownerField]
            ? (resource[ownerField]._id || resource[ownerField]).toString()
            : null;

          const isOwner = resourceOwnerId && resourceOwnerId === user.id;

          if (!isOwner && !isAdmin) {
            return res.status(403).json({
              success: false,
              message: "Access denied. You do not own or have permissions for this resource.",
            });
          }

          // Attach loaded resource to request to eliminate redundant database queries in controllers
          req.resource = resource;
        }
      }

      next();
    } catch (error) {
      console.error("❌ Authorization error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Authorization check error",
        error: error.message,
      });
    }
  };
}

module.exports = authorize;
