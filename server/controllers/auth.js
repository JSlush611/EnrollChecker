import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../models/User.js";

/* REGISTER USER */

export const register = async (req, res) => {
    try {
        const {
            preferredName,
            email,
            password,
            subscriptions,
            subscribedNumber,
            phoneNumber,
        } = req.body;

        if (!preferredName || !email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
          };
      
        if (password.length < 2) {
            return res
                .status(400)
                .json({ error: "Password should be at least 2 characters long" });
            };

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
        };

        if (preferredName.length < 2 || preferredName.length > 50) {
        return res.status(400).json({
            error: "Preferred name should be between 2 and 50 characters long",
        });
        };

        const phoneNumberRegex = /^\d{10}$/; // Assuming 10-digit phone number format
        if (phoneNumber && !phoneNumberRegex.test(phoneNumber)) {
        return res.status(400).json({ error: "Invalid phone number format" });
        };


        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            preferredName,
            email,
            password: passwordHash,
            subscriptions,
            subscribedNumber, 
            phoneNumber       
        });
        const savedUser = await newUser.save();

        const user = await User.findOne({email: email});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email: email});
        if (!user) return res.status(400).json({msg: "User does not exist. "});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({msg: "Invalid credentials. "});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
    res.status(500).json({error: err.message});
    }
};
