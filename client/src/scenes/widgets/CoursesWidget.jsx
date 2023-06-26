import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "state";
import CourseWidget from "./CourseWidget";


const CoursesWidget = ( { userId, isProfile = false}) => {
   const dispatch = useDispatch();
   const courses = useSelector((state) => state.courses);
   const token = useSelector((state) => state.token);


   const getCourses = async () => {
       const response = await fetch ("http://localhost:3001/courses/show", {
           method: "GET",
           headers: { Authorization: `Bearer ${token}` },
       });
  
   const data = await response.json();
   dispatch(setCourses({ courses: data}));
   };


   const getUserCourses = async () => {
       const response = await fetch (`http://localhost:3001/users/${userId}/subscriptions`,
       {
           method: "GET",
           headers: { Authorization: `Bearer ${token}` },
       });
  
   const data = await response.json();
   dispatch(setCourses({ courses: data}));
   };


   useEffect(() => {
       if (isProfile) {
           getUserCourses();
       } else {
           getCourses();
       }
   }, []);


   return (
       <>
           {courses.map(
               ({
                   _id,
                   title,
                   credits,
                   termCode,
                   subjectCode,
                   courseID,
                   courseDesignation,
                   subscribed,
               }) => (
                   <CourseWidget
                   key={_id}
                   courseId={_id}
                   title={title}
                   credits={credits}
                   termCode={termCode}
                   subjectCode={subjectCode}
                   courseID={courseID}
                   courseDesignation={courseDesignation}
                   subscribed={subscribed}
                   />
               )
           )}
       </>
   );
};


export default CoursesWidget