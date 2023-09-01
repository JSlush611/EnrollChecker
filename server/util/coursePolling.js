import { fetchSingleCourseAvailability, fetchMultipleCoursesAvailability } from "./courseAvailability.js";
import { findUsersSubscribedToCourse, removeCourseFromUser } from "./subscriptionQueries.js";
import { providers } from "../notifications/index.js";

const emailNotifier = providers.email.Create();

export async function singleCoursePoll (course) {
    const availabilityData = await fetchSingleCourseAvailability(course);
    const availableSeats = availabilityData.availableSeats;
    
    if (availableSeats > 0) {
        const usersSubscribedToCourse = await findUsersSubscribedToCourse(course);

        for (const user of usersSubscribedToCourse) {
            await removeCourseFromUser(user._id, course._id);
            await emailNotifier.send({user, course, availableSeats});
        };
    };
};

export async function multipleCoursePoll (courses) {
    const availabilityData = await fetchMultipleCoursesAvailability(courses);

    const availableCourses = courses.filter(course => {
        const matchingAvailability = availabilityData.find(data => data.courseId === course.courseID);
        return matchingAvailability && matchingAvailability.availableSeats > 0;
    });

    for (const course of availableCourses) {
        const usersSubscribedToCourse = await findUsersSubscribedToCourse(course);
        const availableSeats = availabilityData.find(data => data.courseId === course.courseID).availableSeats;

        for (const user of usersSubscribedToCourse) {
            await removeCourseFromUser(user._id, course._id);
            await emailNotifier.send({user, course, availableSeats});
        };
    };
};