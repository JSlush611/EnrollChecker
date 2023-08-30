import User from "../models/User.js";
import { validateUserUpdateInfo } from "./validation.js";

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
          console.log(course.credits);
      });

      res.status(200).json(courses);
  } catch (err) {
      res.status(404).json({ message: err.message });
  }
};


export const updateUser = async (req, res) => {
  try {
      const { id } = req.params;
      const { preferredName, phoneNumber } = req.body;

      const validationResult = validateUserUpdateInfo(preferredName, phoneNumber);
      if (validationResult) {
          return res.status(400).json(validationResult);
      }

      await User.findByIdAndUpdate(id, { preferredName, phoneNumber });
      res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

