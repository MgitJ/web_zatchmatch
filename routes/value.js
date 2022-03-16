const express = require('express');
const router = express.Router();

//가치

const valueController = require('../controllers/value');
const upload = require('../modules/multer');

//value_리스트
router.get('/', valueController.getValueList);
//value_상세
router.get('/detail/:vidx', valueController.getValue);
//value_생성(with photo)
router.post('/', upload.array('photos', 10), valueController.createValue);
//value_수정
router.put('/:vidx', valueController.updateValue);
//value_삭제
router.delete('/:vidx', valueController.deleteValue);
//value_검색
//router.get('/search', valueController.getValueSearch)

router.get('/my/category/:order', valueController.getValueList);

module.exports = router;
