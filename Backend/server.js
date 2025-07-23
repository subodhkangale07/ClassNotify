const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Routes = require('./Routes/Route');
const connectDB = require('./config/db');
const cron = require('node-cron');
const { filterEvents } = require('./controller/NotificationSender');
const mailSender = require('./controller/SendNotification');

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1', Routes);



connectDB();




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// fetchEvents()


//Scheduler

// cron.schedule('0,15,30,45 9-23 * * *', () => {
//     console.log("🔄 Running Scheduler...");
//     const events = filterEvents();
//     events.forEach(event => {
//         sendNotification(event);
//     });
// })

app.get("/run-cron", async (req, res) => {
    console.log("Cron endpoint hit...");

    try {
        const events = await filterEvents();

        for (const event of events) {
            const email = event.professor.emailId;
            const title = `Upcoming Lecture Notification: ${event.subject_code}`;
            const body = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ClassNotify Lecture Notification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #8a4fff;
                        background-image: linear-gradient(to right, #8a4fff, #a44dff);
                        color: white;
                        padding: 15px;
                        border-radius: 5px 5px 0 0;
                        text-align: center;
                    }
                    .content {
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-top: none;
                        border-radius: 0 0 5px 5px;
                    }
                    .lecture-details {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                    }
                    .lecture-details h2 {
                        margin-top: 0;
                        color: #8a4fff;
                    }
                    .timetable-section {
                        margin-top: 25px;
                        padding: 15px;
                        background-color: #f5f0ff;
                        border-radius: 5px;
                    }
                    .login-details {
                        background-color: #ede5ff;
                        padding: 15px;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    .button {
                        display: inline-block;
                        background-color: #8a4fff;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 10px;
                    }
                    .footer {
                        margin-top: 25px;
                        font-size: 11px;
                        color: #999;
                        text-align: center;
                    }
                    .feature {
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                    }
                    .feature-icon {
                        margin-right: 10px;
                        color: #8a4fff;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ClassNotify</h1>
                    <p>Stay informed, stay ahead - ClassNotify keeps you updated with all your important class notifications in one place.</p>
                </div>
                
                <div class="content">
                    <div class="lecture-details">
                        <h2>Lecture Details: ${event.subject_code}</h2>
                        <p><strong>Professor:</strong> ${event.professor.name}</p>
                        <p><strong>Subject Code:</strong> ${event.subject_code}</p>
                        <p><strong>Class:</strong> ${event.class}</p>
                        <p><strong>Type:</strong> ${event.type}</p>
                        <p><strong>Room:</strong> ${event.room}</p>
                        <p><strong>Time:</strong> ${event.time}</p>
                        <p><strong>Day:</strong> ${event.day}</p>
                    </div>
                    
                    <div class="timetable-section">
                        <h2>Your Personalized Timetable</h2>
                        <p>You can view your complete personalized timetable, including all upcoming lectures, schedules, and classroom locations through our online portal.</p>
                        
                        <div class="feature">
                            <div class="feature-icon">🔒</div>
                            <div>
                                <strong>Secure Access</strong>
                                <div>Role-based authentication system</div>
                            </div>
                        </div>
                        
                        <div class="feature">
                            <div class="feature-icon">🔔</div>
                            <div>
                                <strong>Real-time Notifications</strong>
                                <div>Never miss important updates</div>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <p><em>View your full personalized timetable on our website</em></p>
                        </div>
                        
                        <a href="https://class-notify.vercel.app/login" style="display: inline-block; background-color: #8a4fff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Complete Timetable</a>
                    </div>
                    
                    <div class="login-details">
                        <h3>Access Your Timetable</h3>
                        <p>To view your complete schedule and additional resources, please log in with your credentials:</p>
                        <p><strong>Email:</strong> ${event.professor.emailId}</p>
                        <p><strong>Password:</strong> 000000</p>
                        <a href="https://class-notify.vercel.app/login" style="display: inline-block; background-color: #8a4fff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Login to Portal</a>
                    </div>
                    
                    <div class="footer">
                        <p>© 2025 ClassNotify. All rights reserved.</p>
                        <p>**This is MiniProject Testing**</p>
                    </div>
                </div>
            </body>
            </html>
        `;

            await mailSender(email, title, body);
        }

        res.status(200).json({
            success: true,
            message: "Cron job executed and emails sent",
        });

    } catch (error) {
        console.error("Error in scheduler:", error);
        res.status(500).json({
            success: false,
            message: "Error running cron job",
        });
    }
});
