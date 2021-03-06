const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
 	name:{
 			type:String,
			required:true,
			trim: true
 	},
	email:{
			type: String,
			required: true,
			unique: true,
			trim: true,
			validate(value){
				if(!validator.isEmail(value)){
					throw new Error("Email is invalid")
				}
			}
	},
 	age:{
 	 			type:Number,
 	 			required:true,
 	 			default: 0,
 	 			validate(value){
 	 				if(value<0)
 	 				{
 	 					throw new Error("Not a valid age")
 	 				}
 	 			}
 	},
 	password:{
 			type:String,
 			required:true,
 			trim:true,
 			minlength:6,
 			validate(value){	
 				if(value.toLowerCase().includes("password"))
 						throw new Error("containing password substring")
 			}
 	}
 })

userSchema.statics.findByCredentials = async (email, password)=>{
	const user = await User.findOne({email})
	if(!user){
		throw new Error("Unable to login")
	}

	const isMatch = await bcrypt.compare(password, user.password)

	if(!isMatch)
	{
		throw new Error("Unable to login")
	}
	return user
}
 userSchema.pre('save', async function(next){
 	const user = this
 	if(user.isModified('password'))
 		user.password = await bcrypt.hash(user.password, 8)
 	next()
 })
 const User = mongoose.model('User',userSchema)	

 module.exports = User