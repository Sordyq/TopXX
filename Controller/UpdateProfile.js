const User = require('../Model/User')

const Updateprofile = async(req,res)=>{
    try{
        const profileId = req.params.id;
        const {fullName, email, gender} = req.body;

        const existingProfile = await User.findById({_id:profileId});

        if(!existingProfile){
            return res.status(404).json({error: 'profile not found', success: false});
        }

        const Updatedprofile = await User.findOneAndUpdate(
            {_id:profileId},
            {$set: {fullName, email, gender}},
            {new: true, runValidators: true}
        );
        
        if(!Updatedprofile){
            return res.status(404).json({error: 'Profile not found', success: false})
        };
        return res.status(200).json({msg: 'Profile Updated Successfully', success: true, Updatedprofile})
    } catch (error){
        console.error(error);
        return res.status(500).json({error: 'Server Error', success: false});
    }
};

module.exports = Updateprofile