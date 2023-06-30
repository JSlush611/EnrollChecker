import User from "../models/User.js";
import Course from "../models/Course.js";

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const subscribeCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
    
        if (!course) {
          return res.status(404).json({ message: 'Course not found.' });
        }

        if (user.subscriptions.some(subscription => subscription._id.equals(courseId))) {
            return res.status(400).json({ message: 'Your already subscribed to the course.'});
        }

        user.subscriptions.push(course);
        course.subscribed += 1;

        await Promise.all([user.save(), course.save()]);

        const courses = await user.subscriptions;
          
        res.status(200).json(courses);

    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};


export const unsubscribeCouse = async (req, res) => {
    try {
      const { userId, courseId } = req.params;
  
      const user = await User.findById(userId);
      const course = await Course.findById(courseId);
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found.' });
      }
  
      if (!user.subscriptions.some(subscription => subscription._id.equals(courseId))) {
        return res.status(400).json({ message: 'You are not subscribed to the course.' });
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
  


