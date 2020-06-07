var express = require('express');
var router = express.Router();
let articleController=require('../controllers/articles')

/* GET home page. */
router.get('/articles',articleController.getAll);
router.post('/add',articleController.add)
router.post('/update',articleController.update)
module.exports = router;
