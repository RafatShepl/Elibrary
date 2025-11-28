require("dotenv").config();
const jwt = require("jsonwebtoken");

const setAuth = (requiredRole) => {

    const auth = async (req, res, next) => {
        try {

            const token =
                req.headers["authorization"]?.split(" ")[1] ||
                req.cookies["token"];

            if (!token) {

                return res.status(403).json({
                    message: "User is not authenticated ",
                    success: false
                });
            }


            const user = jwt.verify(token, process.env.SECRTKEY);


            req.user = user;

            if (requiredRole && user.role !== requiredRole) {
                return res.status(403).json({
                    message: "Forbidden: You don't have permission",
                    success: false
                });
            }

            next();

        } catch (err) {
            return res.status(401).json({
                message: "Invalid or expired token",
                success: false
            });
        }
    };

    return auth;
};

const qookuiAuth = async(req, res, next) => {
    try {
        // get the token from the qookie
        const token = req.cookies["token"]
        if(!token){
            return  res.status(400).json({
            message: "user is not authenticated",
            success: false
        });
        }
          const user = jwt.verify(token, process.env.SECRTKEY);


            req.user = user;
         next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
}

module.exports = {setAuth,qookuiAuth};
