const express = require('express');
const router = express.Router();

//재치

const zatchController = require('../controllers/zatch');
const upload = require('../modules/multer');

//zatch 리스트
router.get('/', zatchController.getZatchList);
//zatch 상세
router.get('/detail/:vidx', zatchController.getZatch);
//zatch 생성(with photo)
router.post('/', upload.array('photos', 10), zatchController.createZatch);
//zatch 수정
router.put('/:vidx', zatchController.updateZatch);
//zatch 삭제
router.delete('/:vidx', zatchController.deleteZatch);
//zatch 검색


router.get('/my/category/:order', zatchController.getZatchList);

module.exports = router;