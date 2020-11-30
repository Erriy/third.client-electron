const {ipcRenderer} = window.require("electron");


function __rpc_call__(channel, obj={}){
    let nonce = new Date().getTime().toString() + Math.floor(Math.random()*1000).toString();
    let listen_channel = channel + "." + nonce;
    let p = new Promise((resolve, reject)=>{
        ipcRenderer.once(listen_channel, (e, info)=>{
            if(!info.error) {
                resolve(info.result);
            }
            else {
                reject(info.error);
            }
        });
    });
    ipcRenderer.send(channel, {obj:obj, channel: listen_channel});
    return p;
}


const method_handler = {
    get(target, key) {
        if(undefined === target[key]) {
            target[key] = eval(`(a)=>(__rpc_call__('${target.__module_name__}.${key}', a))`);
        }
        return target[key];
    }
};


const module_handler = {
    get(target, key) {
        if(undefined === target[key]) {
            target[key] = new Proxy({__module_name__: key}, method_handler);
        }
        return target[key];
    }
};


export default {
    install(Vue) {
        Vue.prototype.$api = new Proxy({}, module_handler);
    }
}

