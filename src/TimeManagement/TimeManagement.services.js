const model = require('../database/model');
const sql = require('mssql');

module.exports = {

  createTimeSheetManagement: async (data, callback) => {

    try {
      const request = model.db.request();
      const worker_id = data.user_id
      const projectTypeId = data.projectTypeId
      const projectName = data.projectName
      const photoTypeId = data.photoTypeId
      const path = data.image[0].path
      const latitude = data.image[0].latitude
      const longitude = data.image[0].longitude
      const dateTime = data.image[0].dateTime
      const createBy = data.user_id

      console.log(worker_id, projectTypeId, projectName, photoTypeId, path, latitude, longitude, dateTime)

      query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
                      @workers_id,@projectTypeId,@projectName,@createBy
                  )`;
      request
        .input('workers_id', sql.Int, worker_id)
        .input('projectTypeId', sql.Int, projectTypeId)
        .input('projectName', projectName)
        .input('createBy', createBy);


      await request.query(query);

      // query = "insert into workOrderImage (ImagePath, WorkOrderId, StartTime) values " +
      //  .map(function (x) {
      //     return "('" + x.path + "'," + workID +",'"+x.time +"')";
      //   }).join(", ");

      query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
      let response = await request.query(query);
      console.log(response.recordset);
      const TimeSheetId = await response.recordset[0].TimeSheetId
      query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
        @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
    )`;

      request
        .input('TimesheetId', sql.Int, TimeSheetId)
        .input('Latitude', sql.VarChar(50), latitude)
        .input('Longitude', sql.VarChar(50), longitude)
        .input('StartTime', dateTime)
        .input('photoTypeId', photoTypeId)
        .input('photopath', path)
        .input('createdBy', createBy)




      response = await request.query(query);

      // console.log(response)

      return callback(null, response);

      // }

    } catch (err) {
      return callback(err);
    }
  },
  getPhotoTypeId: async (callback) => {
    try {
      const request = model.db.request();
      let query = `select PhotoTypeId,PhotoType from PhotoTypeID`
      const response = await request.query(query);
      return callback(null, response.recordset);
    }
    catch (err) {
      return callback(err)
    }
  },
  getProjectTypeMaster: async (callback) => {
    try {
      const request = model.db.request();
      let query = `select ProjectTypeId,ProjectType from ProjectTypeMaster`;
      const response = await request.query(query);
      return callback(null, response.recordset);
    }
    catch (err) {
      return callback(err);
    }
  },
  createLogTimeSheetManageent: async (data, callback) => {
    try {
      const request = model.db.request();

      const worker_id = data.user_id
      const projectTypeId = data.projectTypeId
      const projectName = data.projectName
      const photoTypeId = data.photoTypeId
      const path = data.image[0].path
      const latitude = data.image[0].latitude
      const longitude = data.image[0].longitude
      const dateTime = data.image[0].dateTime
      const createBy = data.user_id
      const workerid = data.user_id
      let startTimelength = 0
      let EndTimeLength = 0
      let query = `SELECT * FROM TimeManagement tm 
              JOIN TimesheetMaster ts ON tm.TimeSheetID = ts.TimeSheetID 
              WHERE ts.WorkersId = @workersid 
              AND CONVERT(DATE, tm.EntryTime) = CONVERT(DATE, GETDATE());`;

      request.input('workersid', sql.Int, worker_id);
      let response = await request.query(query);

      if (response.recordset && response.recordset.length > 0) {
        console.log("record Found!")

        // query = `SELECT SYSDATETIMEOFFSET () AT TIME ZONE 'Singapore Standard Time' as time;`

        // response = await request.query(query);

       

        const dateObject = new Date(dateTime.replace(' ', 'T'));

        const currentHour = dateObject.getHours();

        console.log(dateTime)

        if (currentHour >= 8 && currentHour < 20) {


          console.log("8 to 8 pm", worker_id);

          query = `SELECT ts.ProjectTypeId
          FROM dbo.TimeManagement tm
          JOIN dbo.TimesheetMaster ts ON tm.TimeSheetID = ts.TimeSheetID
          WHERE  CONVERT(DATE, tm.EntryTime) = CONVERT(DATE, GETDATE())
          AND  DatePART(HOUR,tm.EntryTime)BETWEEN 8 AND 20 and PhotoTypeId=1 and ts.WorkersId =${worker_id}`


          response = await request.query(query);

          // console.log(response.recordset)


          if (response.recordset && response.recordset.length > 0) {

            startTimelength = response.recordset.length
            // console.log(startTimelength)

            console.log("startime Exists", startTimelength)

            let projecttypeid = response.recordset[startTimelength - 1].ProjectTypeId

            console.log(projecttypeid, projectTypeId)

            query = `SELECT ts.ProjectTypeId
            FROM dbo.TimeManagement tm
            JOIN dbo.TimesheetMaster ts ON tm.TimeSheetID = ts.TimeSheetID
            WHERE PhotoTypeId=2 and ts.WorkersId =${worker_id} 
            and CONVERT(DATE, tm.EntryTime) = CONVERT(DATE, GETDATE())
            AND  DatePART(HOUR,tm.EntryTime)BETWEEN 8 AND 20`


            response = await request.query(query);

            if (response.recordset && response.recordset.length > 0) {
              EndTimeLength = response.recordset.length
              console.log("endtime exists", EndTimeLength)

              if (startTimelength === EndTimeLength) {
                console.log("even condition start time insert ")

                if (photoTypeId === 1) {
                  query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
                      @workers_id,@projectTypeId,@projectName,@createBy
                  )`;
                  request
                    .input('workers_id', sql.Int, worker_id)
                    .input('projectTypeId', sql.Int, projectTypeId)
                    .input('projectName', projectName)
                    .input('createBy', createBy);

                  await request.query(query);

                  query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
                  let response = await request.query(query);
                  console.log(response.recordset);
                  const TimeSheetId = await response.recordset[0].TimeSheetId
                  query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
                      @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
                    )`;
                  request
                    .input('TimesheetId', sql.Int, TimeSheetId)
                    .input('Latitude', sql.VarChar(50), latitude)
                    .input('Longitude', sql.VarChar(50), longitude)
                    .input('StartTime', dateTime)
                    .input('photoTypeId', photoTypeId)
                    .input('photopath', path)
                    .input('createdBy', createBy)

                  response = await request.query(query);
                  return callback(null, response);

                }
                else {
                  console.log("Need start time to insert");
                  return callback(null, "No Record");
                }

              }
              else {
                console.log("odd condition insert end time ")
                if (projecttypeid != projectTypeId) {
                  console.log("project not exists")
                  return callback(null, "project not Exists")
                }
                else {
                  console.log("Project exists")
                  if (photoTypeId == 3) {
                    console.log("location change")
                    query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
                      @workers_id,@projectTypeId,@projectName,@createBy
                  )`;
                    request
                      .input('workers_id', sql.Int, worker_id)
                      .input('projectTypeId', sql.Int, projectTypeId)
                      .input('projectName', projectName)
                      .input('createBy', createBy);

                    await request.query(query);

                    query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
                    let response = await request.query(query);
                    console.log(response.recordset);
                    const TimeSheetId = await response.recordset[0].TimeSheetId
                    query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
                      @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
                    )`;
                    request
                      .input('TimesheetId', sql.Int, TimeSheetId)
                      .input('Latitude', sql.VarChar(50), latitude)
                      .input('Longitude', sql.VarChar(50), longitude)
                      .input('StartTime', dateTime)
                      .input('photoTypeId', photoTypeId)
                      .input('photopath', path)
                      .input('createdBy', createBy)

                    response = await request.query(query);
                    return callback(null, response);
                  }
                  if (photoTypeId === 2) {
                    query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
                      @workers_id,@projectTypeId,@projectName,@createBy
                  )`;
                    request
                      .input('workers_id', sql.Int, worker_id)
                      .input('projectTypeId', sql.Int, projectTypeId)
                      .input('projectName', projectName)
                      .input('createBy', createBy);

                    await request.query(query);

                    query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
                    let response = await request.query(query);
                    console.log(response.recordset);
                    const TimeSheetId = await response.recordset[0].TimeSheetId
                    query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
                      @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
                    )`;
                    request
                      .input('TimesheetId', sql.Int, TimeSheetId)
                      .input('Latitude', sql.VarChar(50), latitude)
                      .input('Longitude', sql.VarChar(50), longitude)
                      .input('StartTime', dateTime)
                      .input('photoTypeId', photoTypeId)
                      .input('photopath', path)
                      .input('createdBy', createBy)

                    response = await request.query(query);
                    return callback(null, response);

                  }
                  else {
                    console.log("Need start time to insert");
                    return callback(null, "Record exists");
                  }
                }
              }
            }
            else {
              console.log("endtime not exists");
              if (projecttypeid != projectTypeId) {
                console.log("project not exists")
                return callback(null, "project not Exists")
              }
              else {
                console.log("Project exists")
                if (photoTypeId === 3) {
                  query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
                    @workers_id,@projectTypeId,@projectName,@createBy
                )`;
                  request
                    .input('workers_id', sql.Int, worker_id)
                    .input('projectTypeId', sql.Int, projectTypeId)
                    .input('projectName', projectName)
                    .input('createBy', createBy);

                  await request.query(query);

                  query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
                  let response = await request.query(query);
                  console.log(response.recordset);
                  const TimeSheetId = await response.recordset[0].TimeSheetId
                  query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
                    @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
                  )`;
                  request
                    .input('TimesheetId', sql.Int, TimeSheetId)
                    .input('Latitude', sql.VarChar(50), latitude)
                    .input('Longitude', sql.VarChar(50), longitude)
                    .input('StartTime', dateTime)
                    .input('photoTypeId', photoTypeId)
                    .input('photopath', path)
                    .input('createdBy', createBy)

                  response = await request.query(query);
                  return callback(null, response);

                }
                else if (photoTypeId === 2) {
                  query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
                    @workers_id,@projectTypeId,@projectName,@createBy
                )`;
                  request
                    .input('workers_id', sql.Int, worker_id)
                    .input('projectTypeId', sql.Int, projectTypeId)
                    .input('projectName', projectName)
                    .input('createBy', createBy);

                  await request.query(query);

                  query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
                  let response = await request.query(query);
                  console.log(response.recordset);
                  const TimeSheetId = await response.recordset[0].TimeSheetId
                  query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
                    @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
                  )`;
                  request
                    .input('TimesheetId', sql.Int, TimeSheetId)
                    .input('Latitude', sql.VarChar(50), latitude)
                    .input('Longitude', sql.VarChar(50), longitude)
                    .input('StartTime', dateTime)
                    .input('photoTypeId', photoTypeId)
                    .input('photopath', path)
                    .input('createdBy', createBy)

                  response = await request.query(query);
                  return callback(null, response);

                }
                else {
                  console.log("Need start time to insert");
                  return callback(null, "Record exists");
                }
              }
            }
          }
          else {
            console.log("no start time Exists")  // insert 
            return callback(null, "Time issuse");

          }

        }
        else {
          console.log("8 to 8 am", worker_id);


          query = `SELECT ts.ProjectTypeId
          FROM dbo.TimeManagement tm
          JOIN dbo.TimesheetMaster ts ON tm.TimeSheetID = ts.TimeSheetID
          WHERE ts.WorkersId =${worker_id} and PhotoTypeId=1 and CONVERT(DATE, tm.EntryTime) = CONVERT(DATE, GETDATE()) AND  DatePART(HOUR,tm.EntryTime)BETWEEN 20 and 23
          or CONVERT(DATE, tm.EntryTime) = CONVERT(DATE, GETDATE()+1) 
          and DatePART(HOUR,tm.EntryTime)BETWEEN 0 AND 8`


          response = await request.query(query);

          // console.log(response.recordset)


          if (response.recordset && response.recordset.length > 0) {

            startTimelength = response.recordset.length
            // console.log(startTimelength)

            console.log("startime Exists", startTimelength)

            console.log("response project", response.recordset[startTimelength - 1].ProjectTypeId,projectTypeId)
            let projecttypeid = response.recordset[startTimelength - 1].ProjectTypeId;  // project id 
            // if (! response.recordset || response.recordset.length == 0) {
            //   console.log("project not exists")
            //   return callback(null, "project not Exists")
            // }
            // else {

            //   console.log("project exists")

            query = `SELECT ts.ProjectTypeId
            FROM dbo.TimeManagement tm
            JOIN dbo.TimesheetMaster ts ON tm.TimeSheetID = ts.TimeSheetID
            WHERE ts.WorkersId =${worker_id} and PhotoTypeId=2  
            and CONVERT(DATE, tm.EntryTime) = CONVERT(DATE, GETDATE()) AND DatePART(HOUR,tm.EntryTime)BETWEEN 20 and 23
            or CONVERT(DATE, tm.EntryTime) = CONVERT(DATE, GETDATE()+1) 
            and DatePART(HOUR,tm.EntryTime) BETWEEN 0 AND 8`


            response = await request.query(query);

            if (response.recordset && response.recordset.length > 0) {
              EndTimeLength = response.recordset.length
              console.log("endtime exists", EndTimeLength)

              if (startTimelength === EndTimeLength) {
                console.log("even condition start time insert ")
                if (photoTypeId === 1) {
                  query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
                      @workers_id,@projectTypeId,@projectName,@createBy
                  )`;
                  request
                    .input('workers_id', sql.Int, worker_id)
                    .input('projectTypeId', sql.Int, projectTypeId)
                    .input('projectName', projectName)
                    .input('createBy', createBy);

                  await request.query(query);

                  query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
                  let response = await request.query(query);
                  console.log(response.recordset);
                  const TimeSheetId = await response.recordset[0].TimeSheetId
                  query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
                      @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
                    )`;
                  request
                    .input('TimesheetId', sql.Int, TimeSheetId)
                    .input('Latitude', sql.VarChar(50), latitude)
                    .input('Longitude', sql.VarChar(50), longitude)
                    .input('StartTime', dateTime)
                    .input('photoTypeId', photoTypeId)
                    .input('photopath', path)
                    .input('createdBy', createBy)

                  response = await request.query(query);
                  return callback(null, response);

                }
                else {
                  console.log("Need start time to insert");
                  return callback(null, "No Record");
                }

              }
              else {
                console.log("odd condition insert end time ")
                if (projecttypeid != projectTypeId) {
                  console.log("project not exists")
                  return callback(null, "project not Exists")
                }
                else {
                  console.log("project exists")
                  if (photoTypeId === 3) {
                    console.log("location change");
                    console.log("location change can enable");
                    query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
                    @workers_id,@projectTypeId,@projectName,@createBy
                    )`;
                    request
                      .input('workers_id', sql.Int, worker_id)
                      .input('projectTypeId', sql.Int, projectTypeId)
                      .input('projectName', projectName)
                      .input('createBy', createBy);

                    await request.query(query);

                    query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
                    let response = await request.query(query);
                    console.log(response.recordset);
                    const TimeSheetId = await response.recordset[0].TimeSheetId
                    query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
                    @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
                  )`;
                    request
                      .input('TimesheetId', sql.Int, TimeSheetId)
                      .input('Latitude', sql.VarChar(50), latitude)
                      .input('Longitude', sql.VarChar(50), longitude)
                      .input('StartTime', dateTime)
                      .input('photoTypeId', photoTypeId)
                      .input('photopath', path)
                      .input('createdBy', createBy)

                    response = await request.query(query);
                    return callback(null, response);
                  }
                  else if (photoTypeId === 2) {
                    query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
                      @workers_id,@projectTypeId,@projectName,@createBy
                  )`;
                    request
                      .input('workers_id', sql.Int, worker_id)
                      .input('projectTypeId', sql.Int, projectTypeId)
                      .input('projectName', projectName)
                      .input('createBy', createBy);

                    await request.query(query);

                    query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
                    let response = await request.query(query);
                    console.log(response.recordset);
                    const TimeSheetId = await response.recordset[0].TimeSheetId
                    query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
                      @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
                    )`;
                    request
                      .input('TimesheetId', sql.Int, TimeSheetId)
                      .input('Latitude', sql.VarChar(50), latitude)
                      .input('Longitude', sql.VarChar(50), longitude)
                      .input('StartTime', dateTime)
                      .input('photoTypeId', photoTypeId)
                      .input('photopath', path)
                      .input('createdBy', createBy)

                    response = await request.query(query);
                    return callback(null, response);

                  }
                  else {
                    console.log("Need start time to insert");
                    return callback(null, "Record exists");
                  }
                }
              }
            }
            else {
              console.log("endtime not exists");
              if (projecttypeid != projectTypeId) {
                console.log("project not exists")
                return callback(null, "project not Exists")
              }
              else {

                console.log("project exists")
                if (photoTypeId === 3) {
                  console.log("location change can enable");
                  query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
                    @workers_id,@projectTypeId,@projectName,@createBy
                )`;
                  request
                    .input('workers_id', sql.Int, worker_id)
                    .input('projectTypeId', sql.Int, projectTypeId)
                    .input('projectName', projectName)
                    .input('createBy', createBy);

                  await request.query(query);

                  query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
                  let response = await request.query(query);
                  console.log(response.recordset);
                  const TimeSheetId = await response.recordset[0].TimeSheetId
                  query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
                    @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
                  )`;
                  request
                    .input('TimesheetId', sql.Int, TimeSheetId)
                    .input('Latitude', sql.VarChar(50), latitude)
                    .input('Longitude', sql.VarChar(50), longitude)
                    .input('StartTime', dateTime)
                    .input('photoTypeId', photoTypeId)
                    .input('photopath', path)
                    .input('createdBy', createBy)

                  response = await request.query(query);
                  return callback(null, response);

                }
                else if (photoTypeId === 2) {
                  query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
                    @workers_id,@projectTypeId,@projectName,@createBy
                )`;
                  request
                    .input('workers_id', sql.Int, worker_id)
                    .input('projectTypeId', sql.Int, projectTypeId)
                    .input('projectName', projectName)
                    .input('createBy', createBy);

                  await request.query(query);

                  query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
                  let response = await request.query(query);
                  console.log(response.recordset);
                  const TimeSheetId = await response.recordset[0].TimeSheetId
                  query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
                    @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
                  )`;
                  request
                    .input('TimesheetId', sql.Int, TimeSheetId)
                    .input('Latitude', sql.VarChar(50), latitude)
                    .input('Longitude', sql.VarChar(50), longitude)
                    .input('StartTime', dateTime)
                    .input('photoTypeId', photoTypeId)
                    .input('photopath', path)
                    .input('createdBy', createBy)

                  response = await request.query(query);
                  return callback(null, response);
                }
                else {
                  callback(null, "Record exists");

                }
              }
            }
          }
          else {
            console.log("no start time Exists");
            return callback(null, "Time issuse");

          }
        }

      }

      else {
        console.log(" No Record ! if ph 1 insert")
        if (photoTypeId === 1) {
          query = `insert into TimesheetMaster(WorkersId,ProjectTypeId,ProjectName,CreateBy) values (
            @workers_id,@projectTypeId,@projectName,@createBy
        )`;
          request
            .input('workers_id', sql.Int, worker_id)
            .input('projectTypeId', sql.Int, projectTypeId)
            .input('projectName', projectName)
            .input('createBy', createBy);

          await request.query(query);

          query = `select Max(TimeSheetID) as TimeSheetId from TimesheetMaster`;
          let response = await request.query(query);
          console.log(response.recordset);
          const TimeSheetId = await response.recordset[0].TimeSheetId
          query = `insert into TimeManagement(TimeSheetID,Latitude,Longitude,EntryTime,PhotoTypeId,PhotoPath,CreateBy) values (
            @TimesheetId,@Latitude,@Longitude,@StartTime,@photoTypeId,@photopath,@createdBy
          )`;
          request
            .input('TimesheetId', sql.Int, TimeSheetId)
            .input('Latitude', sql.VarChar(50), latitude)
            .input('Longitude', sql.VarChar(50), longitude)
            .input('StartTime', dateTime)
            .input('photoTypeId', photoTypeId)
            .input('photopath', path)
            .input('createdBy', createBy)

          response = await request.query(query);
          return callback(null, response);

        }
        else {
          console.log("Need start time to insert");
          return callback(null, "No Record");
        }

      }
    }
    catch (err) {
      console.log(err)
      return callback(err);
    }
  },
  getbyId: async (data, callback) => {
    const worker_id = data.user_id;

    try {
      const request = model.db.request();
      const query = `SELECT * FROM TimeManagement tm
                      JOIN TimesheetMaster ts ON tm.TimeSheetID = ts.TimeSheetID
                      WHERE ts.WorkersId = @workersid
                        AND CONVERT(DATE, tm.StartTime) = CONVERT(DATE, GETDATE())`;

      request.input('workersid', sql.Int, worker_id);
      const response = await request.query(query);
      if (response.recordset && response.recordset.length > 0) {
        console.log(response.recordset[0]);
        return callback(null, response.recordset);
      } else {
        console.log('No records found');
        return callback(null, []);
      }
    } catch (err) {
      console.error(err);
      return callback(err);
    }
  }
}