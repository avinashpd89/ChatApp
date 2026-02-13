import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
        expiresIn: "10d"
    });
    res.cookie("jwt", token, {
        httpOnly: true,  // to protect xss attack
        secure: process.env.NODE_ENV !== "production",  // Use secure cookies in production
        sameSite: "strict",  // to protect csrf attack
        maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
    })
}

export default createTokenAndSaveCookie; 