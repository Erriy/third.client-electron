const gpg = require('gpg');
const util = require('util');
const srandom = require('random-string');
const axios = require('axios').default;


let async_gpg_call = util.promisify(gpg.call);
let async_gpg_verify = util.promisify(gpg.verifySignature);
let async_gpg_encrypt = util.promisify(gpg.encrypt);
let async_gpg_decrypt = util.promisify(gpg.decrypt);


async function list_secret_key() {
    let d = await async_gpg_call('', ['--list-secret-keys','--with-colons', '--fixed-list-mode']);
    let s = d.toString();
    let reg = /sec.*\r?\n?(?<fpr>fpr.*)\r?\n?grp.*\r?\n(?<uid>uid.*)\r?\n?/mg;
    let list = [];
    while(true) {
        let i = reg.exec(s);
        if(!i) {
            break;
        }
        list.push({
            fingerprint: i.groups.fpr.split(':')[9],
            uid: i.groups.uid.split(':')[9],
        })
    }
    return list;
}


async function _sign({
    data='',
    key='',
}={}) {
    let options = ['--detach-sign', '--armor', '--local-user', key];
    let d = await async_gpg_call(data, options);
    return d.toString();
}


async function verify({
    data='',
    sign='',
}={}) {
    let clearsign_data = `-----BEGIN PGP SIGNED MESSAGE-----\r\nHash: SHA256\r\n\r\n${data}\r\n${sign}`;
    return (await async_gpg_verify(clearsign_data, ['--with-fingerprint'])).toString();
}


async function encrypt({
    data='',
    key='',
}={}){
    let options = ['--armor', '--recipient', key];
    let d = await async_gpg_encrypt(data, options);
    return d.toString();
}


async function decrypt({
    data='',
}={}) {
    let d = await async_gpg_decrypt(data);
    return d.toString();
}


async function _request({
    method='',
    path='',
    key='',
    data=null,
    api='',
}={}) {
    let headers = {};
    method = method.toUpperCase();
    if('' !== key){
        if(-1 == path.indexOf('?')) {
            path = path + "?";
        }
        path = path + '&nonce=' + srandom({length:80});
        let sign_data = `${method} /api${path}`;
        if(data) {
            if(typeof(data)!=='string') {
                data = JSON.stringify(data);
            }
            sign_data += '\r\n'+data;
        }
        headers['Content-Type'] = 'application/json';
        headers['Sign'] = JSON.stringify(await _sign({data:sign_data, key:key}));
    }
    let url = api + path;
    return new Promise((resolve, reject)=>{
        axios({
            method: method,
            url: url,
            headers: headers,
            data: data
        }).then(r=>resolve(r.data))
        .catch(e=>reject(e.response?e.response.data.message:e.message));
    });
}


async function upload_pubkey({
    key='',
    api='',
}={}) {
    let public_key_armored = (await async_gpg_call('', ['--export', '--armor', key])).toString();
    await _request({
        method: 'PUT',
        path: '/pubkey',
        api: api,
        data: {pubkey: public_key_armored}
    });
}


module.exports = {
    list_secret_key,
    sign:_sign,
    verify,
    decrypt,
    encrypt,
    upload_pubkey,
    _request
};

