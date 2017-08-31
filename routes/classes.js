var express = require('express');
var router = express.Router();
var connect = require('../db/connect');

// get all class
router.get('/', function(req, res, next) {
  let query = "select * from lop";
  connect.query(query, (err, classes) => {
    if (err) {
        return console.error(err);
    }
    res.render('allclass', {title: 'Danh sách lớp', classes: classes});
  });
});

router.get('/new', function(req, res, next) {
  res.render('newclass', {title: 'Thêm lớp'});
});

function getClass (req) {
    const lop = {
        nganh: req.body.nganh,
        khoa: req.body.khoa
    };
    return lop;
}

// add new class
router.post('/', function(req, res, next) {
  let lop = getClass(req);
  let query = "insert into lop (nganh_hoc, khoa) values (?, ?)";
  connect.query(query, [lop.nganh, lop.khoa], (err, result) => {
    if (err) {
        return console.error(err);
    }
    res.redirect('/classes');
  });
});

// get 1 class
router.get('/:id/edit', function(req, res, next) {
  let ma = req.params.id;
  let query = "select * from lop where ma_lop = ?";
  connect.query(query, [ma], (err, lop) => {
    if (err) {
        return console.error(err);
    }
    res.render('editclass', {title: 'Cập nhật thông tin', lop: lop});
  });
});

//update class
router.put('/:id', (req, res) => {
    let lop = getClass(req);
    let ma = req.params.id;
    let query = "update lop set nganh_hoc = ?, khoa = ? where ma_lop = ?";
    connect.query(query, [lop.nganh, lop.khoa, ma], (err, result, next) => {
        if (err) {
            return console.error(err); 
        }
        res.redirect('/classes');
    });
});

router.get('/:id/delete', (req, res, next) => {
  let ma = req.params.id;
  let query = "select * from lop where ma_lop = ?";
	let queryCount = "SELECT COUNT(ma) as total FROM sinhvien WHERE ma_lop = ?";

  connect.query(query, [ma], (err, lop) => {
    if (err) {
        return console.error(err);
    }
		connect.query(queryCount, [ma], (err, count) => {
			if (err) {
				return console.error(err);
			}
			console.log(count);
			res.render('deleteclass', {title: 'Xoá lớp', lop: lop, count: count});
		});
  });
});

// delete class
router.delete('/:id', (req, res, next) => {
	let query = "delete from lop where ma_lop = ?";
	let ma = req.params.id;
	connect.query(query, [ma], (err, result) => {
		if (err) {
			return console.error(err);
		}
		res.redirect('/classes');
	});
});

module.exports = router;