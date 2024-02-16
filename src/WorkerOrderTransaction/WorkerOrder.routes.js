const express = require("express");
const { createWorkOrder, createImageTransaction, getAllWorkOrder, getAllWorkOrderTransaction,getWorkOrderTransaction } = require("./WorkerOrder.controllers");

const router =express.Router()

router.post('/workOrder',createWorkOrder);

router.get('/workOrder',getWorkOrderTransaction);

router.get('/workOrderTransaction',getAllWorkOrderTransaction);

router.post('/image',createImageTransaction);






module.exports =router