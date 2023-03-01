export const checkCreateAccess = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== 3) throw new Error("Unauthorized");
    next(); //creation du rapport
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
