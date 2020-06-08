var express = require('express');
var router = express.Router();
let articleController=require('../controllers/articles')
const multer=require('multer');
const path=require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/images'))
    },
    filename: function (req, file, cb) {
		let fragments=file.originalname.split('.');
		const extension=fragments.splice(-1)[0];

      	cb(null, Date.now() + '.jpg');
    }
  })

const upload =multer({
	limits: {
		fileSize: 5000000
	},
	fileFilter(req,file,cb){
		if(!file.originalname.endsWith('.jpg') && !file.originalname.endsWith('.jpeg') && !file.originalname.endsWith('.png')){
			return cb(new Error('File must be a Image'))
		}
		cb(undefined,true)
	},
	storage: storage
})

/* GET home page. */
router.post('/uploadImage',upload.single('upload'),articleController.uploadLink)
router.get('/articles',articleController.getAll);
router.post('/add',articleController.add)
router.post('/update',articleController.update)
module.exports = router;
