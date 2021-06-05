const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const secret = "sdfghtvgt";

const hashing = async(value)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        // console.log("Salt-",salt);

        const hashed = await bcrypt.hash(value,salt);
        // console.log("hashed-",hashed);
        return hashed;

    } catch (error) {
        return error;
    }
}

const hashCompare = async(password,hashValue)=>{
    try {
        return await bcrypt.compare(password,hashValue)
    } catch (error) {
        return error;
    }
}

const createJWT = async ({email,id,role})=>{
    return await JWT.sign(
        {
            email,id,role
        },
        secret,
        {
            expiresIn:"24h"
        }
    )
}

const authenticate = async (req,res,next)=>{
    try {
        //check if the token is present
        const bearereToken = await req.headers.authorization
        if(bearereToken){
            JWT.verify(bearereToken,secret,(err,decode)=>{
                console.log(decode)
                if(decode !== undefined){
                    const auth = decode;
                    req.body.auth = auth;
                    next()
                }else{
                    res.sendStatus(403);
                }
            })
        }else{
            return res.sendStatus(403)
        }
        
        //check whether it is valid
        //if valid allow the user
    } catch (error) {
        
    }
}

const permit = (...roles)=>{
    return function (req,res,next){
        const {role} = req.body.auth;
        if(roles.includes(role)){
            next();
        }else{
            res.status(403).json({message:"Permission Denied"})
        }
    }
}

module.exports={hashing,hashCompare,createJWT, authenticate,permit};