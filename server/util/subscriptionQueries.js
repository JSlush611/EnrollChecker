import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";
import User from "../models/User.js";
import axios from "axios";

const MONGO_URL = process.env.MONGO_URL;
dotenv.config();

await mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function findUsersSubscribedToCourse(course) {
    const courseId = course._id.toString();

    try {
        const users = await User.find();

        const subscribedUsers = users.filter(user => {
            return user.subscriptions.some(sub => sub._id.toString() === courseId);
        });

        return subscribedUsers;
    } catch (error) {
      console.error(error);
      return [];
    }
};

export async function findCoursesWithSubscribers() {
    try {
        const subscribedCourseIds = await Course.distinct("_id", { subscribed: { $gt: 0 } });
        const coursesWithSubs = await Course.find({ _id: { $in: subscribedCourseIds } });

        return coursesWithSubs;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export async function removeCourseFromUser(userId, courseId) {
    try {
        const unsubscribeResponse = await axios.get(process.env.BACKEND_URL + `/courses/unsubscribe/${userId}/${courseId}`, {headers:{"Admin-Key": process.env.ADMIN_KEY}});
        return unsubscribeResponse.data;
    } catch (err) {
        console.error('Error removing course from user subscriptions:', err);
    }
};


