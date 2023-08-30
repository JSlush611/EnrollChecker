import User from "../models/User.js";
import Course from "../models/Course.js";
import { validateSubscription, validateUnsubscription } from "./validation.js";

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.'});
    }
};

export const subscribeCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
    
        const validationResult = validateSubscription(user, course, courseId);

        if (validationResult) {
            return res.status(400).json(validationResult); 
        }

        user.subscriptions.push(course);
        course.subscribed += 1;

        await Promise.all([user.save(), course.save()]);

        const courses = await user.subscriptions;
          
        res.status(200).json(courses);

    } catch (error) {
        res.status(500).json({ message: 'Internal server error.'});
    }
};

export const unsubscribeCouse = async (req, res) => {
    try {
      const { userId, courseId } = req.params;
  
      const user = await User.findById(userId);
      const course = await Course.findById(courseId);
  
      const validationResult = validateUnsubscription(user, course, courseId);
      if (validationResult) {
        return res.status(400).json(validationResult); 
      }
  
      const updatedCourses = user.subscriptions.filter((subscription) =>
        subscription._id.toString() !== courseId
      );
      user.subscriptions = updatedCourses;
  
      if (course.subscribed > 0) {
        course.subscribed -= 1;
      }
  
      await Promise.all([user.save(), course.save()]);
  
      const finalCourses = await user.subscriptions;
  
      res.status(200).json(finalCourses);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  


