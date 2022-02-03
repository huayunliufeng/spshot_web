<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="first">
            <span slot="label"><i class="icon-spshot-buguifan"></i>&nbsp;&nbsp;不规范</span>
            <router-view/>
        </el-tab-pane>

        <el-tab-pane name="second">
            <span slot="label"><i class="icon-spshot-fengjinjilu"></i>&nbsp;&nbsp;已封禁</span>
            <router-view/>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    export default {
        name: "UnPass",
        data() {
            return {
                activeName: 'first'

            };
        },
        created() {
            // this.$router.replace('/issure/unpass/nospec')
        },
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event);
                if (tab.name === 'first') {
                    this.$router.replace('/issure/unpass/nospec')
                } else {
                    this.$router.replace('/issure/unpass/banned')
                }

            }
        }
    }
</script>

<style scoped>

</style>
