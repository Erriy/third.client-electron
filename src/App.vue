<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
const {ipcRenderer} = window.require('electron');
export default {
    name: 'App',
    methods: {
        ipc_user_listener(e, a) {
            if ('key' === a.action) {
                this.$common.key = a.key;
                this.$common.update_title();
            }
        },
        ipc_service_listener(e, a) {
            if('service' === a.action) {
                this.$common.service = a.service;
                this.$common.update_title();
            }
        }
    },
    destroyed() {
        ipcRenderer.removeListener('user', this.ipc_user_listener);
        ipcRenderer.removeListener('service', this.ipc_service_listener);
    },
    mounted() {
        ipcRenderer.on('user', this.ipc_user_listener);
        ipcRenderer.on('service', this.ipc_service_listener);
    }
}
</script>

<style>
#app{
    min-width: 600px;
    max-width: 1024px;
    margin: auto;
    height: 100%;
}
</style>

