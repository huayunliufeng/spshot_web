<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App',
        mounted() {
            let route = window.location.hash.slice(1);
            let token = window.sessionStorage.getItem('token');
            if (route !== '/' && (token === null || token === undefined || token === '')){
                // new一个实例出来
                this.$message.error("需要登陆");
                // 不存在token
                this.$router.replace('/')
            }
        }
    }
</script>

<style>

</style>
