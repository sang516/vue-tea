const User = {
    queryUserTel(option) {
        return `select * from user where tel = '${option.userTel}'`;
    },
    queryUserPwd(option) {
        return `select * from user where tel = '${option.userTel}' and pwd = '${option.userPwd}'`;
    },
    insertData(option) {
        let userTel = option.userTel;
        let userPwd = option.userPwd;

        let jwt = require('jsonwebtoken');

        let secret = 'zxshjyzxy__>';

        let payload = { tel: userTel }

        let token = jwt.sign(payload, secret);

        if (userPwd) {
            return `insert into user(tel,pwd,token) values ('${userTel}','${userPwd}','${token}')`;
        } else {
            return `insert into user(tel,token) values ('${userTel}','${token}')`;
        }
    }
}

exports = module.exports = User;