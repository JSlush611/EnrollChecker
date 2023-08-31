import User from "../models/User.js";
import { validateUserUpdateInfo } from "./validation.js";
import { HTTP_SUCCESS, HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_SERVER_ERROR } from "../statusCodes.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(HTTP_SUCCESS).json(user);

    } catch (err) {
        res.status(HTTP_NOT_FOUND).json({message: err.message});
    }
}

export const getUserSubscriptions = async (req, res) => {
  try {
      const { id } = req.params;
      const user = await User.findById(id);
      const courses = user.subscriptions;

      res.status(HTTP_SUCCESS).json(courses);
  } catch (err) {
      res.status(HTTP_NOT_FOUND).json({ message: err.message });
  }
};


export const updateUser = async (req, res) => {
  try {
      const { id } = req.params;
      const { preferredName, phoneNumber } = req.body;

      const validationResult = validateUserUpdateInfo(preferredName, phoneNumber);
      if (validationResult) {
          return res.status(HTTP_BAD_REQUEST).json(validationResult);
      }

      await User.findByIdAndUpdate(id, { preferredName, phoneNumber });
      res.status(HTTP_SUCCESS).json({ message: "Profile updated successfully" });
  } catch (err) {
      res.status(HTTP_SERVER_ERROR).json({ error: err.message });
  }
};

