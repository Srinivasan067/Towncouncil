const { upload } = require("../database/imageMulter")
const express = require("express");
const router = express.Router()

const moment = require('moment-timezone');


router.post('/upload', upload.array('photos', 10), async (req, res) => {

    try {
        const data = [...req.files];
        const times = Array.isArray(req.body.time) ? req.body.time : [req.body.time];

        const dateStringArray = times.map(time => new Date(Number(time)).toLocaleString("en-US", {
            timeZone: 'Asia/Kolkata' // Specify UTC for consistency
        }));

        if (req.files) {
            const updatedData = data.map((file, index) => {
                return {
                    ...file,
                    "time": dateStringArray[index]
                };
            });

            res.json({
                status: 200,
                message: "Image Uploaded",
                data: updatedData
            });
            console.log(updatedData)

        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: 0,
            message: "Image Upload Error!"
        })
    }
});


router.post('/timeUpload', upload.array('photos', 10), async (req, res) => {

    try {
        const data = [...req.files];
        const times = Array.isArray(req.body.time) ? req.body.time : [req.body.time];
        const longitudes = Array.isArray(req.body.longitude) ? req.body.longitude : [req.body.longitude];
        const latitudes = Array.isArray(req.body.latitude) ? req.body.latitude : [req.body.latitude];
        const dateStringArray = times.map(time => moment.unix(time/1000).tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss.SSS'));
        const longitudeArray = longitudes.map(longitude => longitude);
        const latitudeArray = latitudes.map(latitude => latitude);
        // console.log("time",times)
        if (req.files) {
            
            const updatedData = data.map((file, index) => {
                return {
                    ...file,
                    "dateTime": dateStringArray[index],
                    "longitude":longitudeArray[index],
                    "latitude":latitudeArray[index]
                };
            });
            res.json({
                status: 200,
                message: "Image Uploaded",
                data: updatedData
            });
            // console.log(updatedData)
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: 0,
            message: "Image Upload Error!"
        })
    }
});

module.exports = router
