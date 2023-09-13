import { multipleCoursePoll } from "../util/coursePolling.js"
import {findCoursesWithSubscribers} from "../util/subscriptionQueries.js"
import { HTTP_SUCCESS } from "../util/statusCodes.js";

export const pollClasses = async (req, res) => {
    try {
        const coursesWithSubscribers = await findCoursesWithSubscribers();

        if (!coursesWithSubscribers || coursesWithSubscribers.length === 0) {
            res.status(HTTP_SUCCESS).send("No courses have subscribers!");
        }

        await multipleCoursePoll(coursesWithSubscribers);
        res.status(HTTP_SUCCESS).send("Multiple course poll completed")
        
    } catch (error) {
        console.error("Error polling classes! ", error);
    }
};