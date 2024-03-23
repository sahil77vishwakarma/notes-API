const userModel = require('../model/user');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const signup = async (req, res)=>{

    //Existing user check
    //Hashed Password
    //User Creation
    //Token Generation

    const {username , email, password} = req.body;
    try {
        //Existing user check
        const existingUser = await userModel.findOne( {email: email } );
        if(existingUser){
            return res.status(400).json({message : "User Already Exits"});                    
        }

        //hashed password
        const hashedPassword = await bcrypt.hash(password , 10);

        //user creation
        const result = await userModel.create({
            username : username,
            email : email,
            password : hashedPassword,
        })

        //token generation
        const token = jwt.sign({email: result.email, id : result._id}, SECRET_KEY);

        res.status(201).json({user: result , token: token});

    } catch (error) {
        console.log(error);
        res.status(500).json({message : 'Something went wrong'});
    }

}

const signin = async (req,res)=>{
    const {email, password} = req.body;

    try{
        const existingUser = await userModel.findOne({ email: email});
        if(!existingUser){
            return res.status(404).json({message:"User not found"});
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if(!matchPassword){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, SECRET_KEY);
        res.status(200).json({user:existingUser, token:token});

    }catch{
        console.log(error);
        res.status(500).json({message : 'Something went wrong'}); 
    }
}


module.exports = {signup, signin};