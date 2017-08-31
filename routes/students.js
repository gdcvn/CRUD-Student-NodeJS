var express = require('express');
var router = express.Router();
var connect = require('../db/connect');
const multer  = require('multer');

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './public/uploads')
	},  
	filename: function(req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname)  
	}
});

var upload = multer({ storage: storage });


// get all student 
router.get('/', function(req, res, next) {

    let query = "select * from sinhvien"; 
    connect.query(query, (err, students) => {
      if (err) {
        return console.error(err);
      }
      console.log(students);
      res.render('all', {title: 'Danh sách sinh viên', students: students});
    });
});

function getParams (req, command) {
    let avatar = "";
    if (command == "edit" && typeof(req.file) === "undefined") {
        avatar = req.body.anhhientai;
    } else {
        avatar = "../uploads/" + req.file.filename;
    }
    const student = {
        ten: req.body.tensv,
        anh: avatar,  
        ngaysinh: req.body.ngaysinh,
        gioitinh: req.body.optradio,
        lop: req.body.lop,
        diachi: req.body.diachi
    };
    return student;

}

// add student
router.post('/', upload.single('anh'), function(req, res, next) {
    let student = getParams(req);
    
    let query = "insert into sinhvien (anh, ten, gioitinh, ngaysinh, ma_lop, diachi) values (?,?,?,?,?,?)"; 
    connect.query(query, [student.anh, student.ten, student.gioitinh, student.ngaysinh, student.lop, student.diachi], (err, result) => {
        if (err) {
          return console.error(err);
        }
        res.redirect('/students');

    });
});

router.get('/new', function(req, res, next) {
    let query = "select * from lop";
    connect.query(query, (err, lop) => {
        if (err) {
            return console.error(err);
        }
        res.render('new', {title: 'Thêm sinh viên', lop: lop});
    }); 
});

// get 1 student 
router.get('/:id/edit', function(req, res, next) {
    let ma = req.params.id;
    let query = "select * from sinhvien where ma = ?";
    let queryClass = "select * from lop";

    connect.query(query, [ma], (err, student) => {
        if (err) {
          return console.error(err);
        }
        connect.query(queryClass, (err, lop) => {
            if (err) {
                console.error(err);
            }
            res.render('edit', {title: 'Cập nhật thông tin sinh viên', student: student, lop: lop});
        });
    });
});

// update student
router.put('/:id', upload.single('anh'), function(req, res, next) {
    let student = getParams(req, 'edit'); 
    let id = req.params.id;
    let query = "update sinhvien SET anh = ?, ten = ?, gioitinh = ?, ngaysinh = ?, ma_lop = ?, diachi = ? where ma = ?";
    connect.query(query, [student.anh, student.ten, student.gioitinh, student.ngaysinh, student.lop, student.diachi, id], (err, result) => {
        if (err) {
          return console.error(err);
        }
        res.redirect('/students'); 
    }); 
});

router.get('/:id/delete', (req, res, next) => {
    let ma = req.params.id;
    let query = "select * from sinhvien where ma = ?"
    connect.query(query, [ma], (err, student) => {
        if (err) {
            return console.error(err);
        }
        res.render('deletestudent', {title: 'Xoá sinh viên', student: student});
    });
});

// delete sinhvien
router.delete('/:id', (req, res, next) => {
    let ma = req.params.id;
    let query = "delete from sinhvien where ma = ?";
    connect.query(query, [ma], (err, result) => {
        if (err) {
            return console.error(err);
        }
        res.redirect('/students');
    });
});

//get all student of class
router.get('/:class', (req, res, next) => {
    let lop = req.params.class;
    let query = "select * from sinhvien where ma_lop = ?";
    connect.query(query, [lop], (err, students) => {
        if (err) {
            return console.error(err);
        }
        console.log(students);
        res.render('all', {title: 'Danh sách sinh viên của lớp PT' + ("00000" + lop).slice(-5), students: students});
    });
});

module.exports = router;
