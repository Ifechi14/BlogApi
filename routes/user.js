const router= require('express').Router();
const User= require('../models/User');
const Post= require('../models/Posts');
const bcrypt= require('bcrypt');


//Update User
router.put('/:id', async(req,res)=>{
   if(req.params.id === req.body.userId){
    if(req.body.password){
        const salt= await bcrypt.genSalt(10);
        req.body.password= await bcrypt.hash(req.body.password, salt)
    }
    try {
        const updatedUser= await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{
            new: true
        });

        res.status(200).json({
            status: 'success',
            data:{
                updatedUser
            }
        });
    } catch(err) {
        res.status(500).json(err)
    }
   }else{
    res.status(401).json({
        status: 'fail',
        message: 'You can only update your account'
    })
   }
});


//Delete User
router.delete('/:id', async (req,res)=>{
    if(req.body.userId === req.params.id){
        try {
            const user= await User.findById(req.params.id);
            try {
                await Post.deleteMany({username: user.username});
                await User.findByIdAndDelete(req.params.id);

                res.status(200).json({
                    status: 'success',
                    message: 'User deleted'
                });
            } catch (err) {
                res.status(500).json(err);
            }
        } catch (err) {
            res.status(500).json({
                status: 'fail',
                message: 'User not found'
            });  
        }
    }else{
        res.status(401).json({
            status:'fail',
            message: 'You can delete only your account'
        });
    }
});


//Get User
router.get('/:id', async(req,res)=>{
    try {
        const user= await User.findById(req.params.id);
        const { password, ...others }= user._doc;
        res.status(200).json({
            status: 'success',
            data:{
                others
            }
        })
    } catch (err) {
        res.status(500).json(err);
    }
});





module.exports=  router;