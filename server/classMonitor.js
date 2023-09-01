import { findCoursesWithSubscribers } from "./util/subscriptionQueries.js";
import { singleCoursePoll, multipleCoursePoll } from "./util/coursePolling.js";

export async function pollClasses () {
    try {
        const coursesWithSubscribers = await findCoursesWithSubscribers();
        if (!coursesWithSubscribers || coursesWithSubscribers.length === 0) {
            return
        } else if (coursesWithSubscribers.length === 1) {
            singleCoursePoll(coursesWithSubscribers[0]); // If there is only one, pass as a single object instead of a list
        } else {
            multipleCoursePoll(coursesWithSubscribers);
        }
    } catch (error) {
        console.log(error);
    }
}

await pollClasses();
