const open = require('open');
const command_exists = require('command-exists');



async function command_check(cmd) {
    try {
        command_exists(cmd)
        return true;
    }
    catch(err) {
        return false;
    }
}


async function depends_check() {
    let depends_list = [
        {
            name: 'gpg',
            install: {
                windows: 'xxxxx'
            }
        }
    ];

    depends_list.map(d=>{
        if(!command_check(d.name)) {
            console.log(d.install);
        }
        else {
            console.log(`${d.name} exists`);
        }
    });

}







// open('README.md', {app: 'typora'});

(async ()=>{
    await depends_check();
})();

const Diff = require('diff');

const one = 'beep boopsss';
const other = 'beep boob blah';

const diff = Diff.diffChars(other,one);


console.log(diff.map(p=>p.value).join(''));


// console.log(diff.reduce((t, p)=>t?t+p.value:p.value));

diff.forEach((part) => {
    console.log(part);
});
