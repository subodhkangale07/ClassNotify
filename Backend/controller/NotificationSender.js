const { default: axios } = require("axios");
const { configDotenv } = require("dotenv");

configDotenv();

const fetchEvents = async () => {
    try {
        const url = process.env.BACKEND_URL;
        const response = await axios.get(`${url}/getAllSlots`);
        

        if (!response || !response.data || !response.data.result) {
            console.error("No slots data received.");
            return [];
        }

        // console.log("Fetched slots:", response.data.result);

        // const slots = response.data.result.forEach((slot)=>{
        //     if(slot.day == 'Tuesday'){
        //         console.log(slot);
        //     }
        // })

        return response.data.result;

        
    } catch (error) {
        console.error("Error fetching events:", error.message);
        return [];
    }
};

const getNotificationTime = (eventTime, t) => {
    try {
        if (!eventTime) return null;
        eventTime = eventTime.trim().replace(/\s+/g, ' ');
        console.log("Event Time " , eventTime);
        const startTime = eventTime.split(' - ')[0];
        const date = new Date();
        const [time, period] = startTime.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        // Convert 12-hour format to 24-hour format
        let hours24 = hours;
        if (period === 'PM' && hours !== 12) {
            hours24 += 12;
        } else if (period === 'AM' && hours === 12) {
            hours24 = 0;
        }

        date.setHours(hours24, minutes, 0);
        date.setMinutes(date.getMinutes() - t); // Subtract t minutes

        return date.getTime();
    } catch (error) {
        console.error("Error in getNotificationTime:", error.message);
        return null;
    }
};

exports.filterEvents = async () => {
   
    try {
        const slots = await fetchEvents();
        if (!slots.length) return [];

        // console.log("Processing slots:", slots);

        const events = [];
        const istDate = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
        });
        const currentTime = new Date(istDate).getTime();
        console.log(currentTime);

        const currentDay = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            timeZone: "Asia/Kolkata"
        }).format(new Date());

        
    //    console.log("Slots :", slots);
        slots.forEach((slot) => {
            if (!slot.time || !slot.day) return;
            
            const slotTime15 = getNotificationTime(slot.time, 15);
            const slotTime30 = getNotificationTime(slot.time, 30);

            if (!slotTime30) return; // Skip invalid times

            if (slot.day === currentDay) {
                console.log("CurrentDay --> " ,currentDay);

                // if (currentTime >= slotTime15 && currentTime < slotTime15 + 10*60000) {
                //     events.push({ ...slot, message: "15 minutes before" });
                // }
                if (currentTime >= slotTime30 && currentTime < slotTime30 + 5*60000) {
                    events.push({ ...slot, message: "30 minutes before" });
                }
            }
        });
        // Hello

        console.log("Events to notify:", events);
        return events;
    } catch (error) {
        console.error("Error in filterEvents:", error.message);
        return [];
    }
};


// exports.filterEvents = async () => {
//     const slots = await fetchEvents();
//     const events = [];
//     const currentTime = Date.now();
//     const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });

//     slots.forEach((slot) => {
//         const eventTime = slot.time;
//         const slotTime1 = getNotificationTime(eventTime, 1); // 1 minute before

//         if (!slotTime1) return; // Skip if conversion fails

//         if (slot.day === currentDay) {
//             if (currentTime >= slotTime1 && currentTime < slotTime1 + 5 * 60000) {
//                 events.push({ ...slot, message: "1 minute before" });
//             }
//         }
//     });

//     console.log("Events to notify:", events);
//     return events;
// };
