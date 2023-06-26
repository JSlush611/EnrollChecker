import axios from 'axios';


const postData = {
    TermCode: "1242",
    SubjectCode: "266",
    CourseID: "025498",
};

axios.post('http://localhost:8080/', postData)
  .then(response => {
    // Handle the response from the microservice
    console.log(response.data);
  })
  .catch(error => {
    // Handle the error
    console.error(error);
  });
