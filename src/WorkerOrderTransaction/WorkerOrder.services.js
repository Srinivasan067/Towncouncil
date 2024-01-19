const model = require('../database/model');
const sql = require('mssql');

module.exports = {



  createWorkOrder: async (data, callback) => {

    try {
      const request = model.db.request();

      // let query = `select max(workOrderId) as workID from workOrderTransaction`;
      // const result = await request.query(query);

      const workID = data.workID

      // console.log(data)

      console.log(workID)

      query = `insert into WorkOrderTransaction(WorkOrderId,Userid,categoryName,Remarks) values (
                      @workid,@userid,@categoryName,@remarks
                  )`;
      request
        .input('workid', sql.Int, workID)
        .input('userid', sql.Int, data.userId)
        .input('categoryName', data.categoryName)
        .input('remarks', data.remarks);

      const response = await request.query(query);


      query = "insert into workOrderImage (ImagePath, WorkOrderId, StartTime) values " +
        data.image.map(function (x) {
          return "('" + x.path + "'," + workID +",'"+x.time +"')";
        }).join(", ");
      await request.query(query);

      return callback(null, response);

      // }

    } catch (err) {
      return callback(err);
    }
  },
  orderImage: async (data, callback) => {

    try {
      console.log(data);
      const request = model.db.request();
      let query = "insert into workOrderImage (ImagePath, WorkOrderId, StartTime) values " +
        data.image.map(function (x) {
          return "('" + x.filename + "'," + x.workid +",'"+x.time+"')";
        }).join(", ");


      await request.query(query);


      return callback(null, "response");
    } catch (err) {
      return callback(err);
    }

  },

  getAllWorkOrder: async (callback) => {

    try {
      const request = model.db.request();
      let query = `select * from workOrderImage`
      const response = await request.query(query);
      return callback(null, response.recordset);
    }
    catch (err) {
      return callback(err)
    }


  },
  getAllworkOrderTransaction: async (callback) => {
    try {
      const request = model.db.request();
      let query = `select max(WorkOrderId) as WorkID from WorkOrderTransaction`;
      const response = await request.query(query);
      return callback(null, response.recordset);
    }
    catch (err) {
      return callback(err);
    }
  },
  

}