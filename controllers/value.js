const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const serviceModel = require('../models/value');

const value = {
    getValueList: async (req, res) => {
        const order = req.query.order;
        const address = req.query.address;
        const product = req.query.product;
        const pop = req.query.pop;

       console.log(order + address + product +pop);
        const getServiceList = await serviceModel.getValueList(order, address, product, pop);
        if (getServiceList < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.SERVICE_SUCCESS,
                getServiceList
            ));
    },

    getValue: async (req, res) => {
        const serviceIdx = req.params.idx;
        const getService = await serviceModel.getValue(serviceIdx);
        if (getService < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SERVICE_SUCCESS, getService));
    },

    createValue: async (req, res) => {
        const {
            categoryIdx,
            purchaseCheck,
            productName,
            price,
            number,
            addInfo,
            deadlineCheck,
            userIdx
        } = req.body;

      /*   if (await studyModel.checkValueIdx(userIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                 .send(util.fail(statusCode.BAD_REQUEST, resMessage.CREATE_STUDY_FAIL));
        }
*/
                //upload value
                const service = await serviceModel.createValue(categoryIdx, purchaseCheck, productName, price, number, addInfo, deadlineCheck, userIdx);
                if (service < 0) {
                    return res.status(statusCode.BAD_REQUEST)
                        .send(util.fail(statusCode.BAD_REQUEST, resMessage.CREATE_STUDY_FAIL));
                }
                //upload photo
                const service2 = await serviceModel.uploadValuePhoto(userIdx, req.files, req.body.certified);
                if (service2 < 0) {
                    return res.status(statusCode.BAD_REQUEST)
                        .send(util.fail(statusCode.BAD_REQUEST, resMessage.CREATE_STUDY_FAIL));
                }
                return res.status(statusCode.CREATED)
                    .send(util.success(statusCode.CREATED, resMessage.CREATE_STUDY_SUCCESS));
    },


    updateValue: async (req, res) => {
      const productIdx = req.params.vidx;
      const {
          categoryIdx,
          purchaseCheck,
          productName,
          price,
          number,
          addInfo,
          deadlineCheck
        } = req.body;
     console.log(categoryIdx+addInfo);
      /* if (name === undefined || type === undefined || tags === undefined || layer === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }*/

        const updateService = {
          categoryIdx,
          purchaseCheck,
          productName,
          price,
          number,
          addInfo,
          deadlineCheck,
          productIdx
        };

        const service = await serviceModel.updateValue(updateService);
        if (service < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.UPDATE_SERVICE_SUCCESS));

    },

    deleteValue: async (req, res) => {
        const serviceIdx = req.params.idx;

        if (serviceIdx === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        if (!await serviceModel.checkValueIdx(serviceIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_SERVICE_FAIL));
        }
        const service = await serviceModel.deleteValue(serviceIdx);
        if (service < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DELETE_SERVICE_FAIL));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.DELETE_SERVICE_SUCCESS));
    },
}

module.exports = value;
