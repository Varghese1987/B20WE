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

const createJWT = async ({email,id})=>{
    return await JWT.sign(
        {
            email,id
        },
        secret,
        {
            expiresIn:"24h"
        }
    )
}

module.exports={hashing,hashCompare,createJWT};