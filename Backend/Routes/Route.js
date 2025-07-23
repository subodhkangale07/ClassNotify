const express = require('express');
const authController = require('../Authontication/authication');
const adminController = require('../controller/Admin');
const { authMiddleware, isAdmin } = require('../middleware/middleware');
const timetableController = require("../controller/TimeTableController");
const { sendMail } = require('../controller/SendNotification');
const UserController = require('../controller/UserController');
const mailSender = require('../controller/SendNotification');
const router = express.Router();
router.post('/user/get', UserController.getDayWiseTimeTable);


// User Authentication Routes - LOGIN & SING-UP

router.post('/signup', authController.signup);
router.post('/login', authController.login);


// Admin Routes


// CLASS ROUTES
router.post('/class/add', authMiddleware, isAdmin, adminController.addClass);
router.delete('/class/remove', authMiddleware, isAdmin, adminController.removeClass);
router.get('/class/getAllClass', authMiddleware, isAdmin, adminController.getAllClass);




// SUBJECT ROUTES
router.post('/subject/add', authMiddleware, isAdmin, adminController.addSubject);
router.delete('/subject/remove', authMiddleware, isAdmin, adminController.removeSubject);
router.get('/subject/getAllSubject', authMiddleware, isAdmin, adminController.getAllSubject);


// USER Routes

router.post('/user/add', authMiddleware, isAdmin, adminController.addUser);
router.delete('/user/remove', authMiddleware, isAdmin, adminController.deleteUser);
router.get('/user/getAllUser', authMiddleware, isAdmin, adminController.getAllUser);



router.get('/getAllSlots',timetableController.getAllSlots);





// TIMETABLE MAGANGMENT



// 📌 Create a new timetable


router.post("/tt/create", timetableController.createOrUpdateTimetable);


// delete TimeTable
router.delete("/tt/delete/:id", timetableController.deleteTimetable);

// 📌 Get all timetables
router.get("/tt/get", timetableController.getAllTimetables);


// 📌 Get timetable by ID
router.get("/tt/:id", timetableController.getTimetableById);

// updation by id
router.put("/tt/update/:id", timetableController.updateTimeTableById);

// 📌 Get timetable for a specific instructor by name
//router.get("/tt/instructor/:name", timetableController.getInstructorTimetable);

// User Management
//router.put('/user/update', authMiddleware, adminController.updateUser);

//Admin Routes






module.exports = router;
