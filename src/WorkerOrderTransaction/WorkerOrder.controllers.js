const { createWorkOrder, orderImage, getAllWorkOrder, getAllworkOrderTransaction } = require('./WorkerOrder.services')
module.exports = {
    createWorkOrder: (req, res) => {
        const body = req.body
        // console.log(body)
        createWorkOrder(body, (err, result) => {
            if (err) {

                if (err.message.startsWith("Violation of UNIQUE KEY constraint 'UQ__WorkOrde__AE7551141AD2709B'")) {
                    const duplicateKeyValue = err.message.match(/value is \(([^)]+)\)/)[1];

                    return res.status(403).json({
                        success: 0,
                        message: `WorkId ${duplicateKeyValue} is Already Exist`
                    });
                } else {
                    return res.status(500).json({
                        success: 0,
                        message: "Internal server Error"
                    });
                }
            }
            return res.status(200).json({
                success: 1,
                message: "Images Upload Successfully"
            })
        })
    },
    createImageTransaction: (req, res) => {
        const body = req.body
        console.log(body)
        orderImage(body, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: "Internal Server Error"
                })

            }
            return res.status(200).json({
                success: 1,
                message: "Inserted Successfully"
            })
        })

    },
    getAllWorkOrder: (req, res) => {
        getAllWorkOrder((err, result) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Internal server error"
                })
            }
            return res.status(200).json({
                success: 1,
                data: result
            })
        })
    },
    getAllWorkOrderTransaction: (req, res) => {
        getAllworkOrderTransaction((err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                    success: 0,
                    message: "Interal Server Error"
                })
            }
            // if (result.WorkID == null) {
            //     return res.status(200).json({
            //         success: 1,
            //         data: 0
            //     })
            // }
            // else{
                return res.status(200).json({
                    success: 1,
                    data: result
                })
            // }
           
        })

    },

}