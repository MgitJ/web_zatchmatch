const express = require('express');
const router = express.Router();

//가치

const valueController = require('../controllers/value');
const upload = require('../modules/multer');

//value 서비스 목록 조회
router.get('/category/:order', valueController.getValueList);
//value 서비스 상세 조회
router.get('/:idx', valueController.getValue);
//value 서비스 생성(with photo)
router.post('/', upload.array('photos', 10), valueController.createValue);
//value 서비스 수정
router.put('/:idx', valueController.updateValue);
//value 서비스 삭제
router.delete('/:idx', valueController.deleteValue);

router.get('/my/category/:order', valueController.getValueList);

module.exports = router;
