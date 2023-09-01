import User from "../models/User.js";
import Course from "../models/Course.js";
import { SubscriptionValidation } from "../util/validation/SubscriptionValidation.js";
import { HTTP_SUCCESS, HTTP_BAD_REQUEST, HTTP_SERVER_ERROR } from "../statusCodes.js";

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(HTTP_SUCCESS).json(courses);
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).json({ message: 'Internal server error.'});
    }
};

export const subscribeCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
    
        const validationResult = SubscriptionValidation.validateSubscription({user, course, courseId});

        if (validationResult) {
            return res.status(HTTP_BAD_REQUEST).json(validationResult); 
        }

        user.subscriptions.push(course);
        course.subscribed += 1;

        await Promise.all([user.save(), course.save()]);

        const courses = await user.subscriptions;
          
        res.status(HTTP_SUCCESS).json(courses);

    } catch (error) {
        res.status(HTTP_SERVER_ERROR).json({ message: 'Internal server error.'});
    }
};

export const unsubscribeCouse = async (req, res) => {
    try {
      const { userId, courseId } = req.params;
  
      const user = await User.findById(userId);
      const course = await Course.findById(courseId);

      const validationResult = SubscriptionValidation.validateUnsubscription({user, course, courseId});
      console.log(validationResult)
      if (validationResult) {
        return res.status(HTTP_BAD_REQUEST).json(validationResult); 
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
  
      res.status(HTTP_SUCCESS).json(finalCourses);
    } catch (error) {
      res.status(HTTP_SERVER_ERROR).json({ message: 'Internal server error.' });
    }
  };
  


