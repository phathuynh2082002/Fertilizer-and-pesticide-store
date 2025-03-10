import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    shippingAddress: {
        address: { type: String, default: '',},
        wards: { type: String, default: '',},
        city: { type: String, default: '',},
        province: { type: String, default: '',},
    },
},{
    timestamps: true,
});


// Login
userSchema.methods.macthPassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};

// Register
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;