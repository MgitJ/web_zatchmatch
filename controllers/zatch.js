const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const serviceModel = require('../models/zatch');

const zatch = {
    getZatchList: async (req, res) => {
        const order = req.query.order;
        const address = req.query.address;
        const product = req.query.product;

        console.log(order + address + product);
        const getServiceList = await serviceModel.getZatchList(order, address, product);
        if (getServiceList < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.SERVICE_SUCCESS,
                getServiceList
            ));
    },

    getZatch: async (req, res) => {
        const serviceIdx = req.params.idx;
        const getService = await serviceModel.getZatch(serviceIdx);
        if (getService < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SERVICE_SUCCESS, getService));
    },

    createZatch: async (req, res) => {
        const {
            categoryIdx,
            productName,
            number,
            purchasedAt,
            expiration,
            openCheck,
            categoryIdx1,
            productName1,
            categoryIdx2,
            categoryIdx3,
            otherCheck,
            addInfo,
            userIdx
        } = req.body;

        /*   if (await studyModel.checkValueIdx(userIdx)) {
              return res.status(statusCode.BAD_REQUEST)
                   .send(util.fail(statusCode.BAD_REQUEST, resMessage.CREATE_STUDY_FAIL));
          }
  */
        //upload zatch
        const service = await serviceModel.createZatch(categoryIdx,
            productName,
            number,
            purchasedAt,
            expiration,
            openCheck,
            categoryIdx1,
            productName1,
            categoryIdx2,
            categoryIdx3,
            otherCheck,
            addInfo,
            userIdx);
        if (service < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.CREATE_STUDY_FAIL));
        }
        //upload photo
        const service2 = await serviceModel.uploadZatchPhoto(userIdx, req.files, req.body.certified);
        if (service2 < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.CREATE_STUDY_FAIL));
        }
        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.CREATE_STUDY_SUCCESS));
    },


    updateZatch: async (req, res) => {
        const productIdx = req.params.vidx;
        const {
            categoryIdx,
            productName,
            number,
            purchasedAt,
            expiration,
            openCheck,
            categoryIdx1,
            productName1,
            categoryIdx2,
            categoryIdx3,
            otherCheck,
            addInfo
        } = req.body;
        console.log(categoryIdx + addInfo);
        /* if (name === undefined || type === undefined || tags === undefined || layer === undefined) {
              return res.status(statusCode.BAD_REQUEST)
                  .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
          }*/

        const updateService = {
            categoryIdx,
            productName,
            number,
            purchasedAt,
            expiration,
            openCheck,
            categoryIdx1,
            productName1,
            categoryIdx2,
            categoryIdx3,
            otherCheck,
            addInfo,
            productIdx
        };

        const service = await serviceModel.updateZatch(updateService);
        if (service < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.UPDATE_SERVICE_SUCCESS));

    },

    deleteZatch: async (req, res) => {
        const serviceIdx = req.params.idx;

        if (serviceIdx === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        if (!await serviceModel.checkZatchIdx(serviceIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_SERVICE_FAIL));
        }
        const service = await serviceModel.deleteZatch(serviceIdx);
        if (service < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DELETE_SERVICE_FAIL));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.DELETE_SERVICE_SUCCESS));
    },
}

module.exports = zatch;
