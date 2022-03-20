const pool = require('../modules/pool');
const table = 'zatch_product';

const zatch_ = {
    getZatch: async (serviceIdx) => {
        const query = `SELECT photo, certified, categoryName, productName, categoryIdx1, productName1, 
                        categoryIdx2, productName2, categoryIdx3, productName3, purchasedAt, number, openCheck, addInfo, profile_image, profile_nickname, address
                       FROM plcdb.zatch_product v, category c, zatch_photo p, user u
                       WHERE v.categoryIdx = c.categoryIdx AND v.productIdx = p.productIdx AND v.userIdx = u.userIdx
                       AND v.productIdx = ${serviceIdx}`
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getService ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getService ERROR : ', err);
            throw err;
        }
    },

    getZatchList: async (order, address, product) => {

        var table;
        if (order == "recent") {
            table = `plcdb.zatch_product as v INNER JOIN user as u ON v.userIdx = u.userIdx
                     JOIN category as c ON c.categoryIdx = v.categoryIdx
                     JOIN zatch_photo as p ON v.productIdx = p.productIdx
                     WHERE v.categoryIdx = ${product}
                     GROUP BY v.productIdx
                     ORDER BY v.createdAt desc;`
        } else if (order == "popular") {

        } else if (order == "remain") {

        } else if (order == "") {

        }

        var query = `SELECT * FROM ${table}`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            // if (err.errno == 1062) {
            //     console.log('getServiceList ERROR : ', err.errno, err.code);
            //     return -1;
            // }
            console.log("왜 여기..?", result);
            console.log('getServiceList ERROR : ', err);
            throw err;
        }
    },

    createZatch: async (categoryIdx,
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
        userIdx) => {

        const fields = 'categoryIdx, productName, number, purchasedAt, expiration, openCheck, categoryIdx1, productName1, categoryIdx2, categoryIdx3, otherCheck, addInfo, userIdx';
        const questions = '?,?,?,?,?,?,?,?,?,?,?,?,?';
        const values = [categoryIdx,
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
            userIdx];
        const query = `INSERT INTO zatch_product(${fields}) VALUES (${questions}); `;

        // connection query
        try {
            const result = await pool.queryParamArr(query, values);
            return result;
        } catch (err) {
            //  return -1;
            if (err.errno == 1062) {
                console.log('createStudy ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('createStudy ERROR : ', err);
            throw err;
        }
    },

    uploadZatchPhoto: async (userIdx, files, certified) => {
        //productphoto table\
        // console.log(files.length);
        if (files.length == 0) return -1;
        const fields2 = 'productIdx, photo, certified';
        const questions2 = '?,?';
        const values2 = [userIdx];
        var query2 = `SET @productIdx = (SELECT productIdx FROM value_product WHERE userIdx = ? ORDER BY productIdx DESC LIMIT 1);
                       INSERT INTO value_photo(${fields2}) VALUES`;
        for (var i = 0; i < files.length; i++) {
            values2.push("https://zatch-example.s3.ap-northeast-2.amazonaws.com/" + files[i].key, certified[i]);
            query2 += ` (@productIdx, ${questions2})`;
            if (i != files.length - 1) query2 += `,`;
        }
        // connection query
        try {
            const result2 = await pool.queryParamArr(query2, values2);
            return result2;
        } catch (err) {
            //return -1;
            if (err.errno == 1062) {
                console.log('createStudy ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('createStudy ERROR : ', err);
            throw err;
        }
    },


    /*
    app.put('/profile_edit/:id', upload.single('image'), async(req, res) => {
      //기존 url을 받아옴 -> s3에서 삭제하고
       var sql_find = `SELECT profile_image FROM plcdb.user2 WHERE userID = ?`
       connection.query(sql_find,[req.params.id], function(err,result){
           if(err) throw err;
           deleteFile(result[0].profile_image);
        });
    
      // 새로운 url을 넣는다. + db update
       var sql = `UPDATE user2 SET profile_nickname = ?, address = ?, profile_image = ? WHERE userID = ?`;
       const file = req.file;
       const result = await uploadFile(file);
       var profile_nickname = req.body.profile_nickname;
       var address = req.body.address;
        connection.query(sql, [profile_nickname, address, result.Key, req.params.id], function(err,result){
            if(err) throw err;
         });
       res.send("ok");
     })
    
    
    */


    checkZatchIdx: async (idx) => {
        const query = `SELECT * FROM user WHERE userIdx = ${idx}`;
        try {
            const result = await pool.queryParam(query);
            if (result.length >= 1) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            if (err.errno == 1062) {
                console.log('checkServiceIdx ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('checkServiceIdx ERROR: ', err);
            throw err;
        }
    },

    updateZatch: async (updateService) => {
        const query = `UPDATE ${table}
        SET categoryIdx = "${updateService.categoryIdx}", productName = "${updateService.productName}" ,number = "${updateService.number}", purchasedAt = "${updateService.purchasedAt}"
      ,expiration = "${updateService.expiration}",openCheck = "${updateService.openCheck}" ,categoryIdx1 = "${updateService.categoryIdx1}", productName1 = "${updateService.productName1}"
      ,categoryIdx2 = "${updateService.categoryIdx2}",productName2 = "${updateService.productName2}",categoryIdx3 = "${updateService.categoryIdx3}",productName3 = "${updateService.productName3}"
      ,otherCheck = "${updateService.otherCheck}", addInfo = "${updateService.addInfo}" WHERE productIdx = "${updateService.productIdx}"`;

        try {
            const result = await pool.queryParam(query);
            if (result.affectedRows > 0) return result;
            else return -1;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateService ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateService ERROR: ', err);
            throw err;
        }
    },

    deleteZatch: async (ServiceIdx) => {
        const query = `DELETE FROM ${table} WHERE UserIdx = ${ServiceIdx} `;
        try {
            const result = await pool.queryParamArr(query);
            if (result.affectedRows > 0) return 1;
            else return 0;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('deleteService ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('deleteService ERROR: ', err);
            throw err;
        }
    },
}

module.exports = zatch_;