import UserModel from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import transporter from "../config/emailConfig.js"

class UserController{
    static userRegistration = async (req, res)=>{
        const {name, email,password,password_confirmation,tc}= req.body
        const user = await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"email already exist"})

        }else {
            if(name && email && password && password_confirmation && tc){
                if(password === password_confirmation){
                   try{
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt)
                    const doc = new UserModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        tc:tc
                   
                    })
                    await doc.save()
                    const saved_user = await UserModel.findOne({email:email})
                    //generate jwt token
                    const token = jwt.sign({userID:saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '5d'})
                    res.status(201).send({"status":"success","message":"Regiatration Successfully", "token": token})
                } catch (error){
                    console.log(error)
                    res.send({"status":"failed","message":"unable to register"})
                }

                }else{
                     res.send({"status":"failed","message":"password and confirmation password doesnot match"})
                }

            }else{
                res.send({"status":"failed","message":"All fields are required"})
            }
        }
    }

    static userLogin = async (req, res) =>{
        try{
            const {email,password} = req.body
            if(email && password){
                const user = await UserModel.findOne({email:email})
                if(user != null){
                    const isMatch = await bcrypt.compare(password,user.password)
                    if(user.email === email && isMatch){
                        //jwt token
                        const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '5d'})
                        res.send({"status":"success","message":"login success","token":token})

                    }else{
                        res.send({"status":"failed","message":"email or password is not valid"})
                    }

                }else{
                    res.send({"status":"failed","message":"you are not registered user"})
                }

            }else{
                res.send({"status":"failed","message":"All fields are required"})
            }

        }catch (error){
            console.log(error)
            res.send({"status":"failed","message":"unable to login"})
        }
    }
    static changeUserPassword = async(req,res)=>{
        const {password, password_confirmation} = req.body
        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"status":"failed","message":"new password and confirmation new password doesnot match"})

            }else{
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
                //console.log(req.user._id)
                await UserModel.findByIdAndUpdate(req.user._id,{$set:{password: newHashPassword}})
                res.send({"status":"success","message":"Password change succefully"})

            }

        }else {
            res.send({"status":"failed","message":"All fields are required"})

        }
    }
    static loggedUser = async(req,res)=>{
        res.send({"user":req.user})
    }

    static sendUserPasswordResetEmail = async (req, res)=>{
        const {email} = req.body
        if(email){
            const user = await UserModel.findOne({email:email})
            
            
            if(user){
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({userID: user._id}, secret,{expiresIn:'15m'})
                const link= `http://127.0.0.1:8000/api/user/reset/${user._id}/${token}`
                console.log(link)

                const info= await transporter.sendMail({
                    from: process.env.MAILTRAP_SENDEREMAIL,
                    to: user.email,
                    subject: "Verify your email",
                    html: `<a href=${link}>click here</a> to reset password`,
                    });

                    


                 res.send({"status":"success","message":"password reset email sent ..please check your email","info":info})

            }else{
                 res.send({"status":"failed","message":"Email doesnot exist"})
            }

        }else{
             res.send({"status":"failed","message":"email field is required"})

        }
    }

    static userPasswordReset = async(req,res)=>{
        const{password,password_confirmation} = req.body
        const{id,token}= req.params
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try{
            jwt.verify(token,new_secret)
            if(password && password_confirmation){
                if(password !== password_confirmation){
                    res.send({"status":"failed","message":"New Password and Confirm New Password doesn't match "})


                }else{
                    const salt = await bcrypt.genSalt(10)
                    const newHashPassword = await bcrypt.hash(password, salt)
                     await UserModel.findByIdAndUpdate(user._id,{$set:{password: newHashPassword}})
                      res.send({"status":"success","message":"password reset successfully"})



                }

            }else{
                res.send({"status":"failed","message":"All fields are required"})

            }
        }catch (error){
            console.log(error)
            res.send({"status":"failed","message":"invalid token"})



        }
    }
}
export default UserController