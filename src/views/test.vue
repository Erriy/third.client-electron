<template>
    <div>
        <a-button @click='$router.push("/config")'>
            test
        </a-button>
        <a-button @click='sign_test'>
            sign_test
        </a-button>
    </div>
</template>

<script>
export default {
    name: 'test',
    methods: {
        sign_test() {
            this.$api.gpg.sign({data: 'test', key: '8525DD485D1BC4D7B5F9F93443AD74A9E6472AE2'}).then(console.log);
        }
    },
    mounted() {
        this.$api.detector.refresh().then(i=>{console.log(i)});
    }
}
</script>

<style>

</style>