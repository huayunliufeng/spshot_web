<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="first">
            <span slot="label"><i class="icon-spshot-jinhangzhong"></i>&nbsp;&nbsp;进行中</span>
            <router-view/>

        </el-tab-pane>
        <el-tab-pane label="已过期" name="second">
            <span slot="label"><i class="icon-spshot-yiguoqi"></i>&nbsp;&nbsp;已过期</span>
            <router-view/>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    export default {
        name: "Pass",
        data() {
            return {
                activeName: 'first'
            };
        },
        created() {
            // this.$router.replace('/issure/pass/ongoing')
        },
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event);
                if (tab.name === 'first') {
                    this.$router.replace('/issure/pass/ongoing')
                } else {
                    this.$router.replace('/issure/pass/overdue')
                }

            }
        }
    }
</script>

<style scoped>

</style>
