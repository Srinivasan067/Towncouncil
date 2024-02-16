const { generateToken } = require('../utils/jwt');
const { createUser, getuserByLoginID } = require('./user.services');

module.exports = {
    register: (req, res) => {
        const body = req.body;
        createUser(body, (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Internal Server Error"
                })
            }
            if (results === 'already Exits') {
                res.status(409).json({
                    success: 0,
                    message: "User already exists"
                })
            }
            return res.status(200).json({
                success: 1,
                message: "Register successfull"
            })
        })
    },
    login: (req, res) => {
        const body = req.body;

        getuserByLoginID(body, (err, result) => {
            if (err) {
                // console.log("err",err)
                return res.status(500).json({
                    success: 0,
                    message: "Internal Server Error"
                })
            }
            if (result && result.length !== 0) {
                const compare = (body.UserPassword === result.UserPassword ? true : false);

                if (compare) {
                    const token = generateToken({ LoginName: body.LoginName });
                    return res.status(200).json({
                        success: 1,
                        message: "login Successfull",
                        token: token,
                        user_id:result.UserRole,
                        name : result.UserName,
                        AdminID :result.AdminID,
                    })
                }
                else {
                    // console.log("hi")
                    return res.status(401).json({
                        success: 0,
                        message: "Invalid user or password"
                    })
                }
            }
            else {
                // console.log("err")
                return res.status(401).json({
                    success: 0,
                    message: "Invalid user or password"
                })
            }
        })

    },
    
}