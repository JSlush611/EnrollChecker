import dotenv from 'dotenv';
import axios from "axios"

dotenv.config({ path: './server/.env' });

const POLLING_INTERVAL_MS = 10000;
 
async function printTimeStamp(courseAvailabilityData) {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(time, '- Successful poll:', courseAvailabilityData);
}

async function getCoursesAvailability() {
    const response = await axios.get('http://localhost:3001/admin/pollcourses', {
      headers: {
        'Admin-Key': process.env.ADMIN_KEY,
      },
    });
    return response.data;
};

async function requestCoursePoll() {
    try {
        const courseAvailabilityData = await getCoursesAvailability();
        printTimeStamp(courseAvailabilityData);
    } catch (error) {
        console.error('Error polling: :', error.message);
    } 
};

function startPolling() {
    setInterval(requestCoursePoll, POLLING_INTERVAL_MS); 
};

startPolling();