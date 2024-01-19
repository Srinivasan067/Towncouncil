const { upload } = require("../database/imageMulter")

const express = require("express");

const router = express.Router()

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
            // console.log(updatedData)

            res.json({
                status: 200,
                message: "Image Uploaded",
                data: updatedData
            });
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
