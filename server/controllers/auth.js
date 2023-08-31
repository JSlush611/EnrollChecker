import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../models/User.js";
import { validateRegistration } from "./validation.js";
import { GOOD_REQUEST, CREATED, BAD_REQUEST, SERVER_ERROR } from "../statusCodes.js";

export const register = async (req, res) => {
    try {
        const { preferredName, email, password, subscriptions, phoneNumber } = req.body;

        const validationResult = validateRegistration(preferredName, email, password, phoneNumber);
        if (validationResult) {
            return res.status(BAD_REQUEST).json(validationResult); 
          }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            preferredName,
            email,
            password: passwordHash,
            subscriptions,
            phoneNumber       
        });

        const savedUser = await newUser.save();
        const user = await User.findOne({email: email});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);

        res.status(CREATED).json({ token, user });
    } catch (err) {
        res.status(SERVER_ERROR).json({error: err.message});
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email: email});
        if (!user) return res.status(BAD_REQUEST).json({msg: "User does not exist. "});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(BAD_REQUEST).json({msg: "Invalid credentials. "});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        delete user.password;

        res.status(GOOD_REQUEST).json({ token, user });
    } catch (err) {
    res.status(SERVER_ERROR).json({error: err.message});
    }
};


