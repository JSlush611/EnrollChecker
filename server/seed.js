import User from "./models/User.js";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/Course.js";
import jsonData from './classes.json' assert { type: 'json' };


dotenv.config();
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 6001;

await mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));


  Course.find({ subscribed: { $gt: 0 } })
  .sort({ subscribed: -1 }) // Sort in descending order based on subscribed count
  .then((courses) => {
    courses.forEach((course) => {
      console.log(course);
    });
  })
  .catch((error) => {
    console.log(error);
  });

  User.find({ subscribedCourses: courseID })
  .then((users) => {
    users.forEach((user) => {
      console.log(user);
    });
  })
  .catch((error) => {
    console.log(error);
  });

  /* ADD COURSE
 const newCourse = new Course({
    title: "Introduction to Computer Science",
    credits: 3,
    termCode: 1242,
    subjectCode: 266,
    courseID: 23191,
  });

  newCourse.save()
  .then(savedCourse => {
    console.log("Course saved successfully:", savedCourse);
  })
  .catch(error => {
    console.error("Error saving course:", error);
  }); 
  */


/* ADD COURSE TO USER
const userId = '64973cad0b65aa18846a96bb';
const courseId = '6497463c98b651f00102bfd5'
var CurrUser;
var CurrCourse;

await User.findById(userId).then(user => CurrUser = user);
await Course.findById(courseId).then(course => CurrCourse = course);

CurrUser.subscriptions.forEach(subscription => {
  if (subscription.title === CurrCourse.title) {
    console.log("NOPE"); // Exit the forEach loop
  }})

CurrUser.subscriptions.push(CurrCourse.toObject()); // Convert course document to plain JavaScript object
CurrUser.save()
  .then(updatedUser => {
    console.log('User subscriptions updated:');
    // Handle further operations with the updated user object
  })
  .catch(error => {
    console.error('Error saving updated user:');
    // Handle error during user save
  });
  console.log('User subscriptions:');
  CurrUser.subscriptions.forEach(subscription => {
    console.log(subscription.title); // Accessing the title property of each subscription object
  });
*/


/* COURSE SAVING
const responseObj = jsonData;

for (const hit of responseObj.hits) {
  const courseID = hit.courseId;
  const termCode = hit.termCode;
  const subjectCode = hit.subject.subjectCode;
  const credits = hit.maximumCredits;
  const title = hit.title;
  const courseDesignation = hit.courseDesignation;
  const description = hit.description;

  const newCourse = new Course({
    title,
    credits,
    termCode,
    subjectCode,
    courseID,
    courseDesignation,
    description
  });

  newCourse.save()
    .then(savedCourse => {
      console.log('Course saved successfully');
    })
    .catch(error => {
      console.error('Error saving course:', error);
    });
} */



