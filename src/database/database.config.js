
const mssql = require("mssql");
const dotenv =require('dotenv')
dotenv.config();

const config = {
    server: '97.74.83.13',
    database: 'dev.shatechno',
    user: 'dev.shatechno', 
    password: '7!jYo787n',
    options: {
        trustedConnection: false,
        enableArithAbort: true,
        encrypt: false, 
        trustServerCertificate: true,

    }
}


// mssql.connect(config, function(err) {
//     if(err) {
//         console.log("err", err)
//     }
//     else{
//         console.log("connected")
//     }
// })

module.exports = config;