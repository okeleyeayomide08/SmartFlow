function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user.role;

    const roleIsValid = allowedRoles.includes(role);

    if (!roleIsValid) {
      return res.status(403).json({
        message:
          "Access denied. You do not have permission to perform this action",
      });
    }

    next();
  };
}

export default roleMiddleware;
