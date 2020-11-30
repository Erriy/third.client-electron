<template>
    <div>
        <div id="vditor" class="vditor-toolbar--hide vditor--fullscreen"></div>
    </div>
</template>

<script>
const { v4: uuidv4 } = require('uuid');
import Vditor from 'vditor';
const {ipcRenderer} = window.require('electron');
export default {
    data() {
        return {
            seed: {
                id: '',
                visible: 'private',
                last_save_content: '',
            },
            vditor: '',
        }
    },
    methods: {
        new_seed() {
            this.seed.id = uuidv4().replace('-', '');
            try {
                this.last_save_content = '';
                this.vditor.setValue('');
            } catch(err) {
            }
        },
        ipc_seed_listener(e, a) {
            if('save' === a.action) {
                let data = this.vditor.getValue();
                if(2>=data.length) {
                    this.$api.seed.delete({
                        id: this.seed.id,
                        service: this.$common.service
                    }).then(()=>{
                        this.$message.success('删除成功');
                        this.new_seed();
                    })
                }
                else {
                    this.$api.seed.save({
                        service: this.$common.service,
                        id: this.seed.id,
                        data: this.vditor.getValue()
                    }).then(()=>{
                        this.$message.success('保存成功');
                    });
                }
            }
            else if('new' === a.action) {
                // fixme 保存警告
                this.new_seed();
            }
            else if ('list' === a.action) {
                // fixme 保存警告
                if(this.$route.path !== '/list'){
                    this.$router.replace('/list');
                }
            }
        },
        menu_update({
            allow_save=true,
        }={}) {
            this.$api.menu.update({seed: {save: `show,${allow_save?'enable':'disable'}`}});
        }
    },
    mounted() {
        this.$common.set_title('节点');
        this.menu_update();
        ipcRenderer.on('seed', this.ipc_seed_listener);

        let content = '';
        if(this.$route.query.id) {
            let seed = sessionStorage[this.$route.query.id];
            if(typeof(seed) == 'string' && seed.length > 0) {
                seed = JSON.parse(seed);
                this.seed.id = seed.meta.id;
                content = seed.data;
            }
        }
        else {
            this.new_seed();
        }
        this.vditor = new Vditor('vditor', {
            mode: 'ir',
            toolbar: [],
            cache: {
                enable: false,
            },
            after: () => {
                this.vditor.setValue(content);
                this.vditor.focus();
            },
            input: (md)=>{
            },
        });
    },
    destroyed() {
        ipcRenderer.removeListener('seed', this.ipc_seed_listener);
    }
}
</script>

<style>
@import "~vditor/dist/index.css";
</style>