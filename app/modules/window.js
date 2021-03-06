const {
    BrowserWindow,
    Menu
} = require('electron');


let obj = {
    debug: process.env.DEBUG,
};


// 内嵌浏览器的示例代码，文档： https://www.electronjs.org/docs/api/browser-view
// const view = new BrowserView()
// obj.win.setBrowserView(view)
// view.setBounds({ x: 100, y: 100, width: 1000, height: 500 })
// view.webContents.loadURL('https://www.bilibili.com')
// 注入js，做数据高亮显示
// 文档：https://www.electronjs.org/docs/api/web-contents
// view.webContents.executeJavaScript('alert(1);');


function create({
    path=''
}={}) {
    let win = new BrowserWindow({
        width: 1024,
        height: 768,
        minWidth: 620,
        minHeight: 520,
        // resizable: false, //禁止改变主窗口尺寸
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.setMenu(Menu.buildFromTemplate([{
        label: '视图(&V)',
        submenu: [
            {
                label: '开发者工具',
                role: 'toggledevtools',
                accelerator: 'Shift+F12'
            }
        ]
    }]));
    if(obj.debug) {
        // 调试模式下使用本地8080端口
        win.loadURL(`http://localhost:8080/#${path}`);
        // win.webContents.openDevTools({detach: true});
    }
    else {
        // 在窗口内要展示的内容为 ./dist/index.html，即打包生成的index.html
        win.loadURL(`file://${__dirname}/../../dist/index.html#${path}`);
    }
}


function list() {
    return BrowserWindow.getAllWindows();
}


module.exports = {
    create,
    list,
};

