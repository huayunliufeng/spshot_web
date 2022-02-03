<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="first">
            <span slot="label"><i class="icon-spshot-weichuli"></i>&nbsp;&nbsp;未处理</span>
            <router-view/>
        </el-tab-pane>
        <el-tab-pane name="second">
            <span slot="label"><i class="icon-spshot-yichuli"></i>&nbsp;&nbsp;已处理</span>
            <router-view/>
        </el-tab-pane>
    </el-tabs>


</template>

<script>
    export default {
        name: "Feedback",
        data() {
            return {
                activeName: 'first'
            };
        },
        created() {
            // this.$router.replace('/data/feedback/untreated')
        },
        methods: {
            handleClick(tab, event) {
                if (tab.name === 'first') {
                    this.$router.replace('/data/feedback/untreated')
                } else {
                    this.$router.replace('/data/feedback/treated')
                }
                // console.log(tab, event);
            }
        }
    }
</script>

<style scoped>

</style>
