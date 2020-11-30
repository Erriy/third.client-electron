const {
    Menu, BrowserWindow
} = require('electron');
const window = require('./window');
const gpg = require('./gpg');
const service_module = require('./service');


let obj = {
    admin: false,
};


function isenabled(i) {
    if(i && typeof(i) === 'string') {
        return -1 === i.indexOf('disable');
    }
    else {
        return true;
    }
}


function isvisible(i) {
    if(i && typeof(i) === 'string') {
        return -1 !== i.indexOf('show');
    }
    else {
        return false;
    }
}


function ischecked(i, value) {
    if(i && typeof(i) === 'string') {
        return -1 !== i.indexOf(value);
    }
    else {
        return false;
    }
}


async function update({
    seed=true,
    key='',
    service='',
}={}, e) {
    let win = BrowserWindow.fromWebContents(e.sender);

    let config = [];
    // 信息种子菜单栏
    config.push({
        label: '节点(&E)',
        submenu: [
            {
                label: '新建',
                accelerator: 'CommandOrControl+N',
                enabled: isenabled(seed.new),
                click() {
                    e.sender.send('seed', {action:'new'});
                }
            },
            {
                label: '新窗口创建',
                accelerator: 'CommandOrControl+Shift+N',
                enabled: isenabled(seed.new_window),
                click() {
                    window.create({path: '/seed'});
                }
            },
            {
                label: '保存',
                accelerator: 'CommandOrControl+S',
                enabled: isenabled(seed.save),
                visible: isvisible(seed.save),
                click() {
                    e.sender.send('seed', {action: 'save'});
                }
            },
            {
                label: '删除',
                accelerator: 'CommandOrControl+Delete',
                enable: isenabled(seed.delete),
                visible: isvisible(seed.delete),
                click() {
                    e.sender.send('seed', {action: 'delete'});
                }
            },
            {
                type: 'separator',
            },
            {
                label: '刷新',
                accelerator: 'CommandOrControl+R',
                enabled: isenabled(seed.refresh),
                visible: isvisible(seed.refresh),
                click() {
                    e.sender.send('seed', {action: 'list_refresh'});
                }
            },
            {
                label: '列表',
                accelerator: 'CommandOrControl+L',
                enabled: isenabled(seed.list),
                click() {
                    e.sender.send('seed', {action: 'list'});
                }
            },
            {
                label: '新窗口列表',
                accelerator: 'CommandOrControl+Shift+L',
                enabled: isenabled(seed.new_window_list),
                click() {
                    window.create({path: '/list'});
                }
            }
        ]
    });


    // 视图菜单栏
    config.push({
        label: '视图(&V)',
        submenu: [
            // {
            //     label: '显示菜单栏',
            //     type: 'checkbox',
            //     accelerator: 'CommandOrControl+Shift+M',
            //     checked: true,
            //     click(i){
            //         let c = !i.checked;
            //         win.setAutoHideMenuBar(c);
            //     }
            // },
            // {
            //     type: 'separator',
            // },
            {
                label: '窗口置顶',
                accelerator: 'CommandOrControl+Shift+P',
                type: 'checkbox',
                checked: false,
                click(i) {
                    win.setAlwaysOnTop(i.checked);
                }
            },
            {
                role: 'togglefullscreen',
                label: '全屏'
            },
            {
                type: 'separator',
            },
            {
                label: '开发者工具',
                role: 'toggledevtools',
                accelerator: 'Shift+F12'
            }
        ]
    });

    // 用户菜单栏初始化
    let key_list = (await gpg.list_secret_key()).map((k, i)=>({
        label: `${k.uid}(${k.fingerprint.substring(24,)})`,
        checked: k.fingerprint.endsWith(key) ? true : (i===0? true: false),
        type: 'radio',
        fingerprint: k.fingerprint,
        click() {
            e.sender.send('user', {action: 'key', key: k.fingerprint})
        }
    }));
    config.push({
        label: '用户(&U)',
        submenu: [
            ... key_list
        ]
    });
    for(let k of key_list) {
        if(k.checked) {
            e.sender.send('user', {action: 'key', key: k.fingerprint});
        }
    }

    // 服务菜单栏初始化
    let services = service_module.services().map((s, i)=>({
        label: s,
        checked: service === s? true: (i===0?true: false),
        type: 'radio',
        service: s,
        click() {
            e.sender.send('service', {action: 'service', service: s})
        }
    }));
    config.push({
        label: '服务(&S)',
        submenu: [
            ... services
        ]
    });
    for(let s of services) {
        if(s.checked) {
            e.sender.send('service', {action: 'service', service: s.service});
        }
    }


    win.setMenu(Menu.buildFromTemplate(config));
}


module.exports = {
    update,
    _set_admin(b) {
        obj.admin = b;
    },
};

