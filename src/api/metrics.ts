import {setInterval} from 'timers';
import axios from 'axios';

interface ApiResponse {
    // Define the structure of the API response here
}

const data: Record<string, ApiResponse> = {};

const makeApiRequest = async () => {
    // Make the API request here and return the response
    try {
        await axios.get('https://api.example.com/data');
        // Add the returned value to the dictionary
        //data[new Date().toISOString()] = response.data;
        //console.log('API response added to dictionary:', data);
    } catch (error) {
        console.error('Error while sending API request:', error);
    }
};

setInterval(() => {
    const response = makeApiRequest();
    const now = new Date().toLocaleString();
    // @ts-ignore
    data[now] = response;
}, 2 * 60 * 1000);

// Define a dictionary to store the API response values
//const dictionary: Record<string, any> = {};


// Schedule the sendRequest function to be executed every 2 minutes
//setInterval(sendRequest, 2 * 60 * 1000);

