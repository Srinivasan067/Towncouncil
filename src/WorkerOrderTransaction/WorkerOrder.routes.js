const express = require("express");
const { createWorkOrder, createImageTransaction, getAllWorkOrder, getAllWorkOrderTransaction } = require("./WorkerOrder.controllers");

const router =express.Router()

router.post('/workOrder',createWorkOrder);

router.get('/workOrder',getAllWorkOrder);

router.get('/workOrderTransaction',getAllWorkOrderTransaction);

router.post('/image',createImageTransaction);


module.exports =router