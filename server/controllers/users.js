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

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { preferredName, phoneNumber } = req.body;
    
        if (preferredName.trim().length < 2 || preferredName.trim().length > 50) {
          return res.status(400).json({ error: "Preferred name is not valid" });
        }
    
        if (!/^[A-Za-z]+$/.test(preferredName)) {
          return res.status(400).json({ error: "Preferred name contains invalid characters" });
        }
    
        if (!/^\d{10}$/.test(phoneNumber)) {
          return res.status(400).json({ error: "Phone number is not valid" });
        }
    
        await User.findByIdAndUpdate(id, { preferredName, phoneNumber });
        res.status(200).json({ message: "Profile updated successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

