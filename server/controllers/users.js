import User from "../models/User.js";
import { validateUserUpdateInfo } from "./validation.js";
import { GOOD_REQUEST, BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from "../statusCodes.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(GOOD_REQUEST).json(user);

    } catch (err) {
        res.status(NOT_FOUND).json({message: err.message});
    }
}

export const getUserSubscriptions = async (req, res) => {
  try {
      const { id } = req.params;
      const user = await User.findById(id);
      const courses = user.subscriptions;

      res.status(GOOD_REQUEST).json(courses);
  } catch (err) {
      res.status(NOT_FOUND).json({ message: err.message });
  }
};


export const updateUser = async (req, res) => {
  try {
      const { id } = req.params;
      const { preferredName, phoneNumber } = req.body;

      const validationResult = validateUserUpdateInfo(preferredName, phoneNumber);
      if (validationResult) {
          return res.status(BAD_REQUEST).json(validationResult);
      }

      await User.findByIdAndUpdate(id, { preferredName, phoneNumber });
      res.status(GOOD_REQUEST).json({ message: "Profile updated successfully" });
  } catch (err) {
      res.status(SERVER_ERROR).json({ error: err.message });
  }
};

