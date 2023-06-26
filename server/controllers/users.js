import User from "../models/User.js";
import Course from "../models/Course.js";
import { formToJSON } from "axios";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const getUserSubscriptions = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const courses = user.subscriptions;

        courses.forEach((course) => {
            console.log(course.title);
            console.log(course.credits)
        });
    
        res.status(200).json(courses);

    } catch (err) {
        res.status(404).json({message: err.message});
    }
};

