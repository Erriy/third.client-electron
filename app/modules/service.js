const multicast_dns = require('multicast-dns');
const helper = require('./helper');


let obj = {
    mdns: multicast_dns(),
    service: {
        local: [],
    },
};


obj.mdns.on('response', resp=>{
    let cond = resp.answers.filter(x=>('third' === x.name.toLowerCase() && 'SRV' == x.type.toUpperCase()));
    if(cond.length > 0) {
        obj.service.local = Array.from(new Set([
            ...new Set(obj.service.local),
            ...new Set(cond.map(x=>(`http://${x.data.target}:${x.data.port}`)))
        ]));
    }
});


async function refresh({
    wait=1000,
}={}) {
    obj.service.local = [];
    obj.mdns.query({
        questions:[{
            name: 'third',
            type: 'SRV'
        }]
    });
    await helper.sleep(wait);
    return obj.service.local;
}


function services() {
    return obj.service.local;
}


module.exports = {
    refresh,
    services,
};

