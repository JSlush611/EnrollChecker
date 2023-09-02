import axios from "axios";

export async function prepareCoursePayload (course) {
    const { termCode, subjectCode, courseID } = course;
    const courseDataPayload = {
        termCode: parseInt(termCode, 10).toString(),
        subjectCode: parseInt(subjectCode, 10).toString(),
        courseID: courseID,
    };

    return courseDataPayload;
};

export async function fetchSingleCourseAvailability (course) {
    const courseDataPayload = await prepareCoursePayload(course);
    
    try {
        const availabilityResponse = await axios.post('http://localhost:8080', courseDataPayload);
        return availabilityResponse.data;
    } catch (error) {
        throw (error);
    }
};

export async function fetchMultipleCoursesAvailability (courses) {
    const coursesDataPayload = [];

    for (const course of courses) {
        const courseDataPayload = await prepareCoursePayload(course);
        coursesDataPayload.push(courseDataPayload);
    }    

    try {
        const availabilityResponse = await axios.post('http://localhost:8080/courses/availability', coursesDataPayload);
        return availabilityResponse.data;

    } catch (error) {
        throw (error);
    }
};

