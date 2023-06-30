import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
    {
         title: {
            type: String,
            required: true,
         },
         credits: {
            type: Number,
            required: true,
         },
         termCode: {
            type: Number,
            required: true,
         },
         subjectCode: {
            type: Number,
            required: true,
         },
         courseID: {
            type: String,
            required: true,
         },
         courseDesignation: {
            type: String,
            required: true,
         },
         subscribed: {
            type: Number,
            default: 0
         },
         description: {
            type: String,
            default: ""
         }
    },
    {timestamps: true}
);


const collection = "Course-Storage";
const Course = mongoose.model("Course", CourseSchema, collection);
export default Course;