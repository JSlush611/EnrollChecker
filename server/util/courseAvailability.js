import axios from "axios";

export async function prepareCoursePayload (course) {
    const { TermCode, SubjectCode, CourseID } = course;

    const courseDataPayload = {
        TermCode: parseInt(TermCode, 10).toString(),
        SubjectCode: parseInt(SubjectCode, 10).toString(),
        CourseID: CourseID,
    };

    return courseDataPayload;
};

export async function fetchSingleCourseAvailability (course) {
    const courseDataPayload = await formatCourseDataPayload(course);

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
        const courseDataPayload = await formatCourseDataPayload(course);
        coursesDataPayload.push(courseDataPayload);
    }    

    try {
        const availabilityResponse = await axios.post('http://localhost:8080/courses/availability', coursesDataPayload);
        return availabilityResponse.data;
    } catch (error) {
        throw (error);
    }
};

