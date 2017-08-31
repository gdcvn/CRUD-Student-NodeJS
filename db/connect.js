var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ass_qlsv',
  dateStrings: 'date'
});

module.exports = connection;
