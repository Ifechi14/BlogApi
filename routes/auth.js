const router= require('express').Router();
const User= require('../models/User');
const bcrypt= require('bcrypt');


//Register route
router.post('/register', async(req,res)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword= await bcrypt.hash(req.body.password, salt);
        const newUser= new User({
            username:req.body.username,
            email: req.body.email,
            password: hashPassword
        });

        const savedUser= await newUser.save();
        res.status(200).json({
            status: 'success',
            data:{
                savedUser
            }
        })


    } catch (err) {
        res.status(500).json(err);
    }
    
});


//Login Routes
router.post('/login', async(req,res)=>{
    try {
        const user = await User.findOne({
            username: req.body.username
        });
        if(!user){
            res.status(404).json({
                status: 'fail',
                message: 'Not Found'
            })
        }

        const validate= await bcrypt.compare(req.body.password, user.password);
        if(!validate){
            res.status(400).json({
                status: 'fail',
                message: 'Wrong Credentials'
            });
        }

        const { password, ...others}= user._doc
        res.status(200).json({
            status: 'success', 
            data: {
                others
            }
        })
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports= router;
