const {
    ipcMain,
} = require('electron');
const log = require('electron-log');
const fs = require('fs');
const path=require('path');


// todo 使用handle-invoke进行远程调用
function regist_api(channel, func) {
    ipcMain.on(channel, async(e, obj)=>{
        let result = null;
        try{
            result = func(obj.obj, e);
            if(result instanceof Promise) {
                result = await result;
            }
            result = {result: result};
        }
        catch(err) {
            result = {error: err};
        }
        try{
            e.sender.send(obj.channel, result);
        }catch(err) {
            log.error("api结果发送失败：" + err);
        }
    });
}


function regist_api_modules(modules_path) {
    fs.readdirSync(modules_path).forEach((file)=>{
        if(file.endsWith('.js')) {
            const module_name = file.slice(0, file.length-3);
            const md = require(path.join(modules_path, module_name));
            Object.keys(md)
            .filter(name=>!name.startsWith('_'))
            .map(name=>regist_api(`${module_name}.${name}`, md[name]));
        }
    })
}


function initialize() {
    let __start = new Date();
    regist_api_modules(path.join(__dirname, 'modules'));
    let __end = new Date();
    log.info(`app api 注册完成, 耗时 ${(__end - __start)/1000} s`);
}


module.exports = {
    initialize,
};

