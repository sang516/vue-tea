var express = require('express');
var router = express.Router();
var db = require('../db/sql.js');
var user = require('../db/userSql.js');
let jwt = require('jsonwebtoken');
const axios = require('axios')
    //引入支付宝配置文件
const alipaySdk = require('../db/alipay.js');
const AlipayFormData = require('alipay-sdk/lib/form').default;

// function getTimeToken(exp) {
//     let getTime = parseInt(new Date().getTime() / 1000);
//     if (getTime - exp > 60) {
//         return true;
//     }
// }


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/api/addUser', function(req, res, next) {
    let params = {
        userTel: req.body.phone
    }
    db.query(user.queryUserTel(params), function(error, results) {
        if (results.length > 0) {
            res.send({
                code: 200,
                data: {
                    success: true,
                    msg: '登录成功',
                    data: results[0]
                }
            })
        } else {
            db.query(user.insertData(params), function(error, results) {
                db.query(user.queryUserTel(params), function(error, results2) {
                    res.send({
                        code: 200,
                        data: {
                            success: true,
                            msg: '登录成功',
                            data: results2[0]
                        }
                    })
                })
            })
        }
    })
})

router.post('/api/register', function(req, res, next) {
    let params = {
        userTel: req.body.phone,
        userPwd: req.body.pwd
    }
    db.query(user.queryUserTel(params), function(error, results) {
        if (results.length > 0) {
            res.send({
                code: 301,
                data: {
                    success: false,
                    msg: '该手机号已注册'
                }
            })
        } else {
            db.query(user.insertData(params), function(error, results) {
                db.query(user.queryUserTel(params), function(error, results2) {
                    res.send({
                        code: 200,
                        data: {
                            success: true,
                            msg: '注册成功',
                            data: results2[0]
                        }
                    })
                })
            })
        }
    })
})

router.post('/api/login', function(req, res, next) {
    let params = {
        userTel: req.body.userTel,
        userPwd: req.body.userPwd
    };
    let userTel = params.userTel;

    let jwt = require('jsonwebtoken');

    let secret = 'zxshjyzxy__>';

    let payload = { tel: userTel }

    let token = jwt.sign(payload, secret, {
        expiresIn: 60
    });
    db.query(user.queryUserTel(params), function(error, results) {
        if (results.length > 0) {
            let id = results[0].id;
            db.query(user.queryUserPwd(params), function(error2, results2) {
                if (results.length > 0) {
                    db.query(`update user set token = '${token}' where id = '${id}'`, function() {
                        res.send({
                            code: 200,
                            data: {
                                success: true,
                                data: results2[0],
                                msg: '登录成功'
                            }
                        })
                    })

                } else {
                    res.send({
                        code: 301,
                        data: {
                            success: false,
                            msg: '密码有误'
                        }
                    })
                }
            })
        } else {
            res.send({
                ode: 301,
                data: {
                    success: false,
                    msg: '手机号未注册'
                }
            })
        }
    })
});

router.post('/api/selectUser', function(req, res, next) {
    let params = {
        userTel: req.body.phone
    };
    db.query(user.queryUserTel(params), function(error, results) {
        if (results.length > 0) {
            res.send({
                code: 200,
                data: {
                    success: true,
                }
            })
        } else {
            res.send({
                code: 0,
                data: {
                    success: false,
                    msg: '用户不存在'
                }
            })
        }
    })
});

router.post('/api/recovery', function(req, res, next) {
    let params = {
        userTel: req.body.phone,
        userPwd: req.body.pwd
    }
    db.query(user.queryUserTel(params), function(error, results) {
        let id = results[0].id;
        let pwd = results[0].pwd;
        db.query(`update user set pwd = replace(pwd,'${pwd}','${params.userPwd}') where id = ${id}`, function(error2, results2) {
            res.send({
                code: 200,
                data: {
                    success: true,
                    msg: '密码已更新'
                }
            })
        })
    })
})

//发送短信验证码
router.post('/api/code', function(req, res, next) {

    /*let tel = req.body.phone;

    // 短信应用SDK AppID
    var appid = 1400187558; // SDK AppID是1400开头

    // 短信应用SDK AppKey
    var appkey = "dc9dc3391896235ddc2325685047edc7";

    // 需要发送短信的手机号码
    var phoneNumbers = [tel];

    // 短信模板ID，需要在短信应用中申请
    var templateId = 285590; // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

    // 签名
    var smsSign = "三人行慕课"; // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

    // 实例化QcloudSms
    var qcloudsms = QcloudSms(appid, appkey);

    // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
    function callback(err, ress, resData) {
        if (err) {
            console.log("err: ", err);
        } else {
            res.send({
                code: 200,
                data: {
                    success: true,
                    data: ress.req.body.params[0]
                }
            })
        }
    }

    var ssender = qcloudsms.SmsSingleSender();
    //这个变量：params 就是往手机上，发送的短信
    var params = [Math.floor(Math.random() * (9999 - 1000)) + 1000];
    ssender.sendWithParam(86, phoneNumbers[0], templateId,
        params, smsSign, "", "", callback); // 签名参数不能为空串
        */
    res.send({
        code: 200,
        data: {
            success: true,
            data: 1024
        }
    })

})

router.get('/api/goods/id', function(req, res, next) {
    let id = req.query.id;
    db.query(`select * from goods_list where id=${id}`, (error, results) => {
        res.json({
            code: 0,
            data: results[0],
            msg: 'success'
        })
    })
})

router.get('/api/goods/list', function(req, res, next) {
    res.send({
        code: 0,
        data: [{
                id: 0,
                name: '推荐',
                data: [{
                    id: 0,
                    name: '推荐',
                    list: [{
                            id: 0,
                            name: '铁观音',
                            imgUrl: './images/list1.jpeg'
                        },
                        {
                            id: 1,
                            name: '功夫茶',
                            imgUrl: './images/list2.jpeg'
                        }, {
                            id: 2,
                            name: '茶具',
                            imgUrl: './images/list3.jpeg'
                        },
                        {
                            id: 3,
                            name: '紫砂壶',
                            imgUrl: './images/list4.jpeg'
                        },
                        {
                            id: 4,
                            name: '龙井',
                            imgUrl: './images/list2.jpeg'
                        },
                        {
                            id: 5,
                            name: '武夷岩茶',
                            imgUrl: './images/list1.jpeg'
                        },
                        {
                            id: 6,
                            name: '普洱',
                            imgUrl: './images/list3.jpeg'
                        }
                    ]
                }, ]
            },
            {
                id: 1,
                name: '绿茶',
                data: [{
                    id: 0,
                    name: '绿茶',
                    list: [{
                            id: 0,
                            name: '龙井',
                            imgUrl: './images/list1.jpeg'
                        },
                        {
                            id: 1,
                            name: '碧螺春',
                            imgUrl: './images/list2.jpeg'
                        }, {
                            id: 2,
                            name: '雀舌',
                            imgUrl: './images/list3.jpeg'
                        },
                        {
                            id: 3,
                            name: '安吉白茶',
                            imgUrl: './images/list4.jpeg'
                        },
                        {
                            id: 4,
                            name: '六安瓜片',
                            imgUrl: './images/list2.jpeg'
                        },
                        {
                            id: 5,
                            name: '武夷岩茶',
                            imgUrl: './images/list1.jpeg'
                        },
                        {
                            id: 6,
                            name: '普洱',
                            imgUrl: './images/list3.jpeg'
                        }
                    ]
                }, ]
            },
            {
                id: 3,
                name: '乌龙',
                data: [{
                    id: 0,
                    name: '乌龙',
                    list: [{
                            id: 0,
                            name: '铁观音',
                            imgUrl: './images/list-wl1.jpeg'
                        },
                        {
                            id: 1,
                            name: '功夫茶',
                            imgUrl: './images/list-wl2.jpeg'
                        }, {
                            id: 2,
                            name: '茶具',
                            imgUrl: './images/list-wl1.jpeg'
                        },
                        {
                            id: 3,
                            name: '紫砂壶',
                            imgUrl: './images/list4.jpeg'
                        },
                        {
                            id: 4,
                            name: '龙井',
                            imgUrl: './images/list2.jpeg'
                        },
                        {
                            id: 5,
                            name: '武夷岩茶',
                            imgUrl: './images/list1.jpeg'
                        },
                        {
                            id: 6,
                            name: '普洱',
                            imgUrl: './images/list3.jpeg'
                        }
                    ]
                }, ]
            },
            {
                id: 3,
                name: '红茶',
                data: [{
                    id: 0,
                    name: '红茶',
                    list: [{
                            id: 0,
                            name: '铁观音',
                            imgUrl: './images/list1.jpeg'
                        },
                        {
                            id: 1,
                            name: '功夫茶',
                            imgUrl: './images/list2.jpeg'
                        }, {
                            id: 2,
                            name: '茶具',
                            imgUrl: './images/list3.jpeg'
                        },
                        {
                            id: 3,
                            name: '紫砂壶',
                            imgUrl: './images/list4.jpeg'
                        },
                        {
                            id: 4,
                            name: '龙井',
                            imgUrl: './images/list2.jpeg'
                        },
                        {
                            id: 5,
                            name: '武夷岩茶',
                            imgUrl: './images/list1.jpeg'
                        },
                        {
                            id: 6,
                            name: '普洱',
                            imgUrl: './images/list3.jpeg'
                        }
                    ]
                }, ]
            },
            {
                id: 4,
                name: '白茶',
                data: [{
                    id: 0,
                    name: '白茶',
                    list: [{
                            id: 0,
                            name: '铁观音',
                            imgUrl: './images/list1.jpeg'
                        },
                        {
                            id: 1,
                            name: '功夫茶',
                            imgUrl: './images/list2.jpeg'
                        }, {
                            id: 2,
                            name: '茶具',
                            imgUrl: './images/list3.jpeg'
                        },
                        {
                            id: 3,
                            name: '紫砂壶',
                            imgUrl: './images/list4.jpeg'
                        },
                        {
                            id: 4,
                            name: '龙井',
                            imgUrl: './images/list2.jpeg'
                        },
                        {
                            id: 5,
                            name: '武夷岩茶',
                            imgUrl: './images/list1.jpeg'
                        },
                        {
                            id: 6,
                            name: '普洱',
                            imgUrl: './images/list3.jpeg'
                        }
                    ]
                }, ]
            },
            {
                id: 5,
                name: '普洱',
                data: [{
                    id: 0,
                    name: '普洱',
                    list: [{
                            id: 0,
                            name: '铁观音',
                            imgUrl: './images/list-pe1.jpeg'
                        },
                        {
                            id: 1,
                            name: '功夫茶',
                            imgUrl: './images/list-pe2.jpeg'
                        }, {
                            id: 2,
                            name: '茶具',
                            imgUrl: './images/list-pe1.jpeg'
                        },
                        {
                            id: 3,
                            name: '紫砂壶',
                            imgUrl: './images/list4.jpeg'
                        },
                        {
                            id: 4,
                            name: '龙井',
                            imgUrl: './images/list2.jpeg'
                        },
                        {
                            id: 5,
                            name: '武夷岩茶',
                            imgUrl: './images/list1.jpeg'
                        },
                        {
                            id: 6,
                            name: '普洱',
                            imgUrl: './images/list3.jpeg'
                        }
                    ]
                }, ]
            }
        ]
    })
})

router.get('/api/goods/shopList', function(req, res, next) {
    let [searchName, orderName] = Object.keys(req.query);
    let [name, order] = Object.values(req.query)
    db.query(`select * from goods_list where name like '%${name}%' order by ${orderName} ${order}`, (error, results) => {
        res.send({
            code: 0,
            data: results,
            msg: '查询成功'
        })
    })
})

router.get('/api/index_list/0/data/1', function(req, res, next) {
    res.send({
        code: 0,
        data: {
            topBar: [
                { id: 0, label: '推荐' },
                { id: 1, label: '大红袍' },
                { id: 2, label: '铁观音' },
                { id: 3, label: '绿茶' },
                { id: 4, label: '普洱' },
                { id: 5, label: '茶具' },
                { id: 6, label: '花茶' }
            ],
            data: [{
                    id: 0,
                    type: 'swiperList',
                    data: [
                        { id: 0, imgUrl: './images/swiper1.jpeg' },
                        { id: 1, imgUrl: './images/swiper2.jpeg' },
                        { id: 2, imgUrl: './images/swiper3.jpeg' }
                    ]
                },
                {
                    id: 1,
                    type: 'iconsList',
                    data: [{
                            id: 1,
                            title: '自饮茶',
                            imgUrl: './images/icons1.png'
                        },
                        {
                            id: 2,
                            title: '茶具',
                            imgUrl: './images/icons2.png'
                        },
                        {
                            id: 3,
                            title: '茶礼盒',
                            imgUrl: './images/icons3.png'
                        },
                        {
                            id: 4,
                            title: '领福利',
                            imgUrl: './images/icons4.png'
                        },
                        {
                            id: 5,
                            title: '官方验证',
                            imgUrl: './images/icons5.png'
                        }
                    ]
                },
                {
                    id: 2,
                    type: 'recommendList',
                    data: [{
                            id: 1,
                            name: "龙井1铁观音250g",
                            content: "鲜爽甘醇 口粮首选",
                            price: 89,
                            imgUrl: "./images/recommend.jpeg",
                        },
                        {
                            id: 2,
                            name: "龙井1号铁观音250g",
                            content: "鲜爽甘醇 口粮首选",
                            price: 100,
                            imgUrl: "./images/recommend2.jpeg",
                        }
                    ]
                },
                {
                    id: 3,
                    type: 'likeList',
                    data: [{
                            id: 1,
                            name: '新工艺正山小种3号茶',
                            imgUrl: './images/goods1.jpg',
                            price: 133
                        },
                        {
                            id: 2,
                            name: '建阳红色芝麻毫建盏茶具',
                            imgUrl: './images/goods2.jpg',
                            price: 145
                        },
                        {
                            id: 3,
                            name: '武夷山灰芽花香金骏眉3号茶',
                            imgUrl: './images/goods3.jpg',
                            price: 154
                        },
                        {
                            id: 4,
                            name: '建盏茶具套装 红色芝麻毫 12件套',
                            imgUrl: './images/like.jpeg',
                            price: 399
                        },
                        {
                            id: 5,
                            name: '建盏茶具套装 红色芝麻毫 12件套',
                            imgUrl: './images/like2.jpeg',
                            price: 399
                        },
                        {
                            id: 6,
                            name: '建盏茶具套装 红色芝麻毫 12件套',
                            imgUrl: './images/like3.jpeg',
                            price: 399
                        },
                        {
                            id: 7,
                            name: '建盏茶具套装 红色芝麻毫 12件套',
                            imgUrl: './images/like2.jpeg',
                            price: 399
                        },
                        {
                            id: 8,
                            name: '建盏茶具套装 红色芝麻毫 12件套',
                            imgUrl: './images/like3.jpeg',
                            price: 399
                        },
                        {
                            id: 9,
                            name: '建盏茶具套装 红色芝麻毫 12件套',
                            imgUrl: './images/like.jpeg',
                            price: 399
                        },
                        {
                            id: 10,
                            name: '建盏茶具套装 红色芝麻毫 12件套',
                            imgUrl: './images/like.jpeg',
                            price: 399
                        },
                        {
                            id: 11,
                            name: '建盏茶具套装 红色芝麻毫 12件套',
                            imgUrl: './images/like2.jpeg',
                            price: 399
                        },
                        {
                            id: 12,
                            name: '建盏茶具套装 红色芝麻毫 12件套',
                            imgUrl: './images/like3.jpeg',
                            price: 399
                        },
                        {
                            id: 13,
                            name: '建盏茶具套装 红色芝麻毫 12件套',
                            imgUrl: './images/like3.jpeg',
                            price: 399
                        },
                        {
                            id: 14,
                            name: '建盏茶具套装 红色芝麻毫 12件套',
                            imgUrl: './images/like2.jpeg',
                            price: 399
                        }
                    ]
                }
            ]
        }
    })
});

router.get('/api/index_list/1/data/1', function(req, res, next) {
    res.send({
        code: 0,
        data: [{
                id: 1,
                type: 'adList',
                data: [{
                        id: 1,
                        imgUrl: './images/dhp.jpeg'
                    },
                    {
                        id: 2,
                        imgUrl: './images/dhp2.jpg'
                    },
                    {
                        id: 3,
                        imgUrl: './images/dhp3.jpg'
                    },
                    {
                        id: 4,
                        imgUrl: './images/dhp4.jpg'
                    },
                    {
                        id: 5,
                        imgUrl: './images/dhp5.jpg'
                    },
                    {
                        id: 6,
                        imgUrl: './images/dhp6.jpg'
                    },
                    {
                        id: 7,
                        imgUrl: './images/dhp7.jpg'
                    }
                ]
            },
            {
                id: 3,
                type: 'iconsList',
                data: [{
                        id: 1,
                        title: '自饮茶',
                        imgUrl: './images/icons1.png'
                    },
                    {
                        id: 2,
                        title: '茶具',
                        imgUrl: './images/icons2.png'
                    },
                    {
                        id: 3,
                        title: '茶礼盒',
                        imgUrl: './images/icons3.png'
                    },
                    {
                        id: 4,
                        title: '领福利',
                        imgUrl: './images/icons4.png'
                    },
                    {
                        id: 5,
                        title: '官方验证',
                        imgUrl: './images/icons5.png'
                    }
                ]
            },
            {
                id: 2,
                type: 'likeList',
                data: [{
                        id: 1,
                        name: '建盏茶具套装 红色芝麻毫 12件套',
                        imgUrl: './images/like.jpeg',
                        price: 399
                    },
                    {
                        id: 2,
                        name: '建盏茶具套装 红色芝麻毫 12件套',
                        imgUrl: './images/like3.jpeg',
                        price: 399
                    },
                    {
                        id: 3,
                        name: '建盏茶具套装 红色芝麻毫 12件套',
                        imgUrl: './images/like2.jpeg',
                        price: 399
                    }
                ]
            }
        ]
    })
});

router.get('/api/index_list/2/data/1', function(req, res, next) {
    res.send({
        code: 0,
        data: [{
                id: 1,
                type: 'adList',
                data: [{
                        id: 1,
                        imgUrl: './images/dhp.jpeg'
                    },
                    {
                        id: 2,
                        imgUrl: './images/dhp.jpeg'
                    }
                ]
            },
            {
                id: 2,
                type: 'iconsList',
                data: [{
                        id: 1,
                        title: '自饮茶',
                        imgUrl: './images/icons1.png'
                    },
                    {
                        id: 2,
                        title: '茶具',
                        imgUrl: './images/icons2.png'
                    },
                    {
                        id: 3,
                        title: '茶礼盒',
                        imgUrl: './images/icons3.png'
                    },
                    {
                        id: 4,
                        title: '领福利',
                        imgUrl: './images/icons4.png'
                    },
                    {
                        id: 5,
                        title: '官方验证',
                        imgUrl: './images/icons5.png'
                    }
                ]
            },
            {
                id: 3,
                type: 'likeList',
                data: [{
                        id: 1,
                        name: '建盏茶具套装 红色芝麻毫 12件套',
                        imgUrl: './images/like.jpeg',
                        price: 399
                    },
                    {
                        id: 2,
                        name: '建盏茶具套装 红色芝麻毫 12件套',
                        imgUrl: './images/like2.jpeg',
                        price: 399
                    },
                    {
                        id: 3,
                        name: '建盏茶具套装 红色芝麻毫 12件套',
                        imgUrl: './images/like3.jpeg',
                        price: 399
                    }
                ]
            }
        ]
    })
});

router.get('/api/selectAddress', function(req, res, next) {
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    db.query(`select * from user where tel = ${tokenObj.tel}`, function(error, results) {
        let uId = results[0].id;
        db.query(`select * from address where uId = ${uId}`, function(err2, results2) {
            res.send({
                data: {
                    code: 200,
                    success: true,
                    data: results2,
                    msg: '获取地址列表成功'
                }
            })
        })
    })
})

router.post('/api/addCart', function(req, res, next) {
    let goodsId = req.body.goodsId;
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    //如果执行，就证明token过期了
    // if (getTimeToken(tokenObj.exp)) {
    //     res.send({
    //         data: {
    //             code: 1000
    //         }
    //     })
    // }
    db.query(`select * from user where tel = ${tokenObj.tel}`, function(error, results) {
        let uId = results[0].id;
        db.query(`select * from goods_list where id = ${goodsId}`, function(error2, results2) {
            let goodsName = results2[0].name;
            let goodsPrice = results2[0].price;
            let goodsImgUrl = results2[0].imgUrl;
            db.query(`select * from goods_cart where uId = ${uId} and goods_id = ${goodsId}`, function(error3, results3) {
                if (results3.length <= 0) {
                    db.query(`insert into goods_cart
                    (uId,goods_id,goods_name,goods_price,goods_num,goods_imgUrl)
                    values
                    ('${uId}','${goodsId}','${goodsName}','${goodsPrice}','1','${goodsImgUrl}')`, function(error4, results4) {
                        res.send({
                            data: {
                                code: 200,
                                success: true,
                                msg: '添加成功'
                            }
                        })
                    })
                } else {
                    let num = results3[0].goods_num;
                    db.query(`update goods_cart set goods_num = replace
                    (goods_num,'${num}','${parseInt(num)+1}') 
                    where id =${results3[0].id}`, function(error5, results5) {
                        res.send({
                            data: {
                                code: 201,
                                success: false,
                                msg: '商品已添加'
                            }
                        })
                    })
                }
            })
        })
    })
})

// 查询购物车
router.get('/api/selectCart', function(req, res, next) {
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    db.query(`select * from user where tel = ${tokenObj.tel}`, function(error, results) {
        let uId = results[0].id;
        db.query(`select * from goods_cart where uId = '${uId}'`, function(reeor2, results2) {
            res.send({
                data: {
                    code: 200,
                    success: true,
                    data: results2,
                }
            })
        })
    })
})

//删除购物车
router.post('/api/deleteCart', function(req, res, next) {
    let arrId = req.body.arrId;
    db.query(`delete from goods_cart where id in (${arrId})`, function(error, results) {
        res.send({
            data: {
                code: 200,
                success: true,
                msg: '删除成功'
            }
        })
    })
})

router.post('/api/updateNum', function(req, res, next) {
    let id = req.body.id;
    let newNum = req.body.num;
    db.query(`select * from goods_cart where id = ${id}`, function(error, results) {
        let num = results[0].goods_num;
        db.query(`update goods_cart set goods_num = replace(goods_num,'${num}','${newNum}') where id = '${id}'`, function(error2, results2) {
            res.send({
                data: {
                    code: 200,
                    success: true
                }
            })
        });
    })
})

router.post('/api/addAddress', function(req, res, next) {
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    let body = req.body;
    let [name, tel, province, city, county, addressDetail, isDefault, areaCode] = [
        body.name,
        body.tel,
        body.province,
        body.city,
        body.county,
        body.addressDetail,
        body.isDefault,
        body.areaCode
    ];
    db.query(`select * from user where tel = ${tokenObj.tel}`, function(error, results) {
        let uId = results[0].id;
        if (isDefault != 1) {
            db.query(`insert into address
        (uId,name, tel, province, city, county, addressDetail, isDefault,areaCode) values
        ('${uId}','${name}','${tel}','${province}','${city}','${county}','${addressDetail}','${isDefault}','${areaCode}')`,
                function(error2, results2) {
                    res.send({
                        data: {
                            code: 200,
                            success: true,
                            msg: '添加成功'
                        }
                    })
                })
        } else {
            db.query(`select * from address where uId = ${uId} and isDefault = ${isDefault}`, function(error3, results3) {
                if (results3.length > 0) {
                    let addressId = results3[0].id;
                    db.query(`update address set isDefault = replace(isDefault,'1','0') where id =${addressId}`, function(error4, results4) {
                        db.query(`insert into address
        (uId,name, tel, province, city, county, addressDetail, isDefault,areaCode) values
        ('${uId}','${name}','${tel}','${province}','${city}','${county}','${addressDetail}','${isDefault}','${areaCode}')`,
                            function(error5, results5) {
                                res.send({
                                    data: {
                                        code: 200,
                                        success: true,
                                        msg: '添加成功'
                                    }
                                })
                            })
                    })
                } else {
                    db.query(`insert into address
        (uId,name, tel, province, city, county, addressDetail, isDefault,areaCode) values
        ('${uId}','${name}','${tel}','${province}','${city}','${county}','${addressDetail}','${isDefault}','${areaCode}')`,
                        function(error2, results2) {
                            res.send({
                                data: {
                                    code: 200,
                                    success: true,
                                    msg: '添加成功'
                                }
                            })
                        })
                }
            })
        }
    })
})

router.post('/api/updateAddress', function(req, res, next) {
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    let body = req.body;
    let [id, name, tel, province, city, county, addressDetail, isDefault, areaCode] = [
        body.id,
        body.name,
        body.tel,
        body.province,
        body.city,
        body.county,
        body.addressDetail,
        body.isDefault,
        body.areaCode
    ];
    db.query(`select * from user where tel = ${tokenObj.tel}`, function(error, results) {
        let uId = results[0].id;
        db.query(`select * from address where uId = ${uId} and isDefault = ${isDefault}`, function(err, results2) {
            if (results2.length > 0) {
                let addressId = results2[0].id;
                db.query(`update address set isDefault = replace(isDefault,'1','0') where id = ${addressId}`, function(e, r) {
                    let updateSql = `update address set uId = ? , name = ? , tel = ? , province = ? , city = ? ,county = ? , addressDetail = ? , isDefault = ? , areaCode = ? where id = ${id}`;
                    db.query(updateSql, [uId, name, tel, province, city, county, addressDetail, isDefault, areaCode], function(errors, datas) {
                        res.send({
                            data: {
                                code: 200,
                                success: true,
                                msg: '修改成功'
                            }
                        })
                    })
                })
            } else {
                let updateSql = `update address set uId = ? , name = ? , tel = ? , province = ? , city = ? ,county = ? , addressDetail = ? , isDefault = ? , areaCode = ? where id = ${id}`;
                db.query(updateSql, [uId, name, tel, province, city, county, addressDetail, isDefault, areaCode], function(errors, datas) {
                    res.send({
                        data: {
                            code: 200,
                            success: true,
                            msg: '修改成功'
                        }
                    })
                })
            }
        })
    })
})

router.post('/api/deleteAddress', function(req, res, next) {
    let id = req.body.id;
    db.query(`delete from address where id = ${id}`, function(error, results) {
        res.send({
            data: {
                code: 200,
                success: true,
                msg: '删除成功'
            }
        })
    })
})

router.post('/api/addOrder', function(req, res, next) {
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    let goodsArr = req.body.arr;

    function setTimeDateFmt(s) {
        return s < 10 ? '0' + s : s
    }

    function randomNumber() {
        const now = new Date();
        let month = setTimeDateFmt(now.getMonth() + 1);
        let day = setTimeDateFmt(now.getDate());
        let hour = setTimeDateFmt(now.getHours());
        let minutes = setTimeDateFmt(now.getMinutes());
        let seconds = setTimeDateFmt(now.getSeconds());
        let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds +
            (Math.round(Math.random() * 1000000)).toString();
        return orderCode;
    }

    /**
     * 未支付:1
     * 待支付:2
     * 支付成功
     * 支付失败:4 | 0
     */
    let goodsName = [];
    let goodsPrice = 0;
    let goodsNum = 0;
    let orderId = randomNumber();

    goodsArr.forEach(v => {
        goodsName.push(v.goods_name);
        goodsPrice += v.goods_price * v.goods_num;
        goodsNum += parseInt(v.goods_num);
    });
    db.query(`select * from user where tel = ${tokenObj.tel}`, function(error, results) {
        let uId = results[0].id;
        db.query(`insert into store_order (order_id,uId,goods_name,goods_price,goods_num,order_status) values
        ('${orderId}','${uId}','${goodsName}','${goodsPrice}','${goodsNum}','1')`, function(err2, results2) {
            db.query(`select * from store_order where uId = '${uId}' and order_id = '${orderId}'`, function(err3, results3) {
                res.send({
                    data: {
                        code: 200,
                        success: true,
                        data: results3
                    }
                })
            })

        })
    });
})

router.post('/api/selectOrder', function(req, res, next) {
    let order_id = req.body.order_id;
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    db.query(`select * from store_order where order_id = '${order_id}'`, function(err, results) {
        res.send({
            data: {
                code: 200,
                success: true,
                data: results
            }
        })
    })

})

router.post('/api/submitOrder', function(req, res, next) {
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    let order_id = req.body.orderId;
    let shopArr = req.body.shopArr;
    db.query(`select * from user where tel = ${tokenObj.tel}`, function(error, results) {
        let uId = results[0].id;
        db.query(`select * from store_order where uId = '${uId}' and order_id = '${order_id}'`, function(err2, results2) {
            let id = results2[0].id;
            db.query(`update store_order set order_status = replace(order_status,'1','2') where id = '${id}'`, function(err3, results3) {
                db.query(`delete from goods_cart where id in (${shopArr})`, function(err, result) {
                    res.send({
                        data: {
                            code: 200,
                            success: true
                        }
                    })
                })
            })
        })
    });
})

//发起支付
router.post('/api/payment', function(req, res, next) {
    //订单号
    let orderId = req.body.orderId;
    //商品总价
    let price = req.body.price;
    //购买商品的名称
    let name = req.body.name;
    //开始对接支付宝API
    const formData = new AlipayFormData();
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get');
    //支付时信息
    formData.addField('bizContent', {
        outTradeNo: orderId, //订单号
        productCode: 'FAST_INSTANT_TRADE_PAY', //写死的
        totalAmount: price, //价格
        subject: name, //商品名称
    });
    //支付成功或者失败跳转的链接
    formData.addField('returnUrl', 'http://localhost:8080/payment');
    //返回promise
    const result = alipaySdk.exec(
        'alipay.trade.page.pay', {}, { formData: formData },
    );
    //对接支付宝成功，支付宝方返回的数据
    result.then(resp => {
        res.send({
            data: {
                code: 200,
                success: true,
                msg: '支付中',
                paymentUrl: resp
            }
        })
    })
})

router.post('/api/successPayment', function(req, res, next) {
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    let out_trade_no = req.body.out_trade_no;
    let trade_no = req.body.trade_no;
    const formData = new AlipayFormData();
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get');
    //支付时信息
    formData.addField('bizContent', {
        out_trade_no,
        trade_no
    });
    const result = alipaySdk.exec(
        'alipay.trade.query', {}, { formData: formData },
    );
    result.then(resData => {
        axios({
            method: 'GET',
            url: resData,
        }).then(data => {
            let responseCode = data.data.alipay_trade_query_response;
            if (responseCode.code == '10000') {
                switch (responseCode.trade_status) {
                    case 'WAIT_BUYER_PAY':
                        res.send({
                            data: {
                                code: 0,
                                data: {
                                    msg: '支付宝有交易记录，没付款'
                                }
                            }
                        })
                        break;

                    case 'TRADE_CLOSED':
                        res.send({
                            data: {
                                code: 1,
                                data: {
                                    msg: '交易关闭'
                                }
                            }
                        })
                        break;

                    case 'TRADE_FINISHED':
                        db.query(`select * from user where tel = ${tokenObj.tel}`, function(error, results) {
                            //用户id
                            let uId = results[0].id;
                            db.query(`select * from store_order where uId = ${uId} and order_id = ${out_trade_no}`, function(err, result) {
                                let id = result[0].id;
                                //订单的状态修改掉2==》3
                                db.query(`update store_order set order_status = replace(order_status,'2','3') where id = ${id}`, function() {
                                    res.send({
                                        data: {
                                            code: 2,
                                            data: {
                                                msg: '交易完成'
                                            }
                                        }
                                    })
                                })
                            })
                        })
                        break;

                    case 'TRADE_SUCCESS':
                        db.query(`select * from user where tel = ${tokenObj.tel}`, function(error, results) {
                            //用户id
                            let uId = results[0].id;
                            db.query(`select * from store_order where uId = ${uId} and order_id = ${out_trade_no}`, function(err, result) {
                                let id = result[0].id;
                                //订单的状态修改掉2==》3
                                db.query(`update store_order set order_status = replace(order_status,'2','3') where id = ${id}`, function() {
                                    res.send({
                                        data: {
                                            code: 2,
                                            data: {
                                                msg: '交易完成'
                                            }
                                        }
                                    })
                                })
                            })
                        })
                        break;
                }
            } else if (responseCode.code == '40004') {
                res.send({
                    data: {
                        code: 4,
                        msg: '交易不存在'
                    }
                })
            }
        }).catch(err => {
            res.send({
                data: {
                    code: 500,
                    data: {
                        msg: '交易失败',
                        err
                    }
                }
            })
        })
    })
})

module.exports = router;