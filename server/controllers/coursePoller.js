import { singleCoursePoll, multipleCoursePoll } from "../util/coursePolling.js"
import {findCoursesWithSubscribers} from "../util/subscriptionQueries.js"
import { HTTP_SUCCESS } from "../util/statusCodes.js";

export const pollClasses = async (req, res) => {
    try {
        const coursesWithSubscribers = await findCoursesWithSubscribers();

        if (!coursesWithSubscribers || coursesWithSubscribers.length === 0) {
            res.status(HTTP_SUCCESS).send("No courses have subscribers");
        } else if (coursesWithSubscribers.length === 1) {
            await singleCoursePoll(coursesWithSubscribers[0]); // If there is only one, pass as a single object instead of a list
            res.status(HTTP_SUCCESS).send("Single course poll completed")
        } else {
            await multipleCoursePoll(coursesWithSubscribers);
            res.status(HTTP_SUCCESS).send("Multiple course poll completed")
        }
    } catch (error) {
        console.log(error);
    }
};