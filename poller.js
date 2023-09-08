import dotenv from 'dotenv';
import axios from "axios"

dotenv.config({ path: './server/.env' });

const POLLING_INTERVAL_MS = 30000;
 
function requestCoursePoll() {
    setInterval(async () => {
        try {
            const response = await axios.get('http://localhost:3001/admin/pollcourses', {
                headers: {
                    'Admin-Key': process.env.ADMIN_KEY,
                },
            });
            console.log('Successful poll: :', response.data);
        } catch (error) {
            console.error('Error polling: :', error.message);
        }
    }, POLLING_INTERVAL_MS);
}

requestCoursePoll();