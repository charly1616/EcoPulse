import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    console.log("Se ha generado una cookie ", userId)
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });

    res.cookie("jwt", token, {
        maxAge: 5 * 24 * 60 * 60 * 1000, // La cookie expira en 5 dias
        httpOnly: true,
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
};