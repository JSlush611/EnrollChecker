import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        preferredName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        picturePath: {
            type: String,
            default: "",
        },
        subscriptions: {
            type: Array,
            default: []
        },
        phoneNumber: {
            type: String,
        },
        subscribedNumber: Number,

    },
    {timestamps: true}
);

const collection = "User-Storage";
const User = mongoose.model("User", UserSchema, collection);
export default User;