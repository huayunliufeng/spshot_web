<template>

    <div>
        <div style="width: 100%;">
            <div style="width: 85%;float: left;">
                <span style="margin-left: 55%"><b>{{currYear}}</b>年数据</span>
            </div>
            <div style="width: 15%;float: right;text-align: center">
                <el-button type="primary" @click="lastYear()" :disabled="lastDis">上一年</el-button>
                <el-button type="success" @click="nextYear()" :disabled="nextDis">下一年</el-button>
            </div>

        </div>
        <div>
            <!--    用户统计    -->
            <div style="width: 50%;height: 400px;float: left" id="userChart"></div>
            <!--    用户反馈    -->
            <div style="width: 50%;height: 400px;float: right;" id="feedbackChart"></div>
            <!--    发布投票    -->
            <div style="width: 50%;height: 400px;float: left" id="issureChart"></div>
            <!--    参与人数    -->
            <div style="width: 50%;height: 400px;float: right" id="partChart"></div>
        </div>
    </div>


</template>

<script>
    import * as echarts from 'echarts/core';
    import {
        DatasetComponent,
        GridComponent,
        LegendComponent,
        TitleComponent,
        TooltipComponent
    } from 'echarts/components';
    import {BarChart} from 'echarts/charts';
    import {CanvasRenderer} from 'echarts/renderers';
    import {getRequest} from "../../utils/api";

    echarts.use([
        DatasetComponent,
        TooltipComponent,
        GridComponent,
        LegendComponent,
        BarChart,
        CanvasRenderer,
        TitleComponent
    ]);

    export default {
        name: "Chart",
        data() {
            return {
                //当前年份
                currYear: new Date().getFullYear(),
                lastDis: false,
                nextDis: true,
                //时间
                xArray: [],
                //用户统计
                user: {
                    userData: [],
                    userOption: {},
                    userChart: {}
                },


                //用户反馈统计
                feedback: {
                    feedbackData: [],
                    feedbackOption: {},
                    feedbackChart: {}
                },

                //发布投票统计
                issure: {
                    issureData: [[], []],
                    issureOption: {},
                    issureChart: {}
                },

                //参与人数统计
                part: {
                    partData: [],
                    partOption: {},
                    partChart: {}
                }

            }
        },
        created() {

        },
        mounted() {
            this.setData();
        },
        methods: {
            setData() {
                getRequest("/data/chart/xArray/" + this.currYear).then((res) => {
                    this.xArray = res.data;
                    getRequest("/data/chart/userData/" + this.currYear + "/" + this.xArray).then((res) => {
                        this.user.userData = res.data;
                        this.setUser();
                    }, (err) => {
                    });
                    getRequest("/data/chart/feedbackData/" + this.currYear + "/" + this.xArray).then((res) => {
                        this.feedback.feedbackData = res.data;
                        this.setFeedback();
                    }, (err) => {
                    });
                    getRequest("/data/chart/issureData/" + this.currYear + "/" + this.xArray).then((res) => {
                        this.issure.issureData = res.data;
                        this.setIssure();
                    }, (err) => {
                    });
                    getRequest("/data/chart/partData/" + this.currYear + "/" + this.xArray).then((res) => {
                        this.part.partData = res.data;
                        this.setPart();
                    }, (err) => {
                    });
                }, (err) => {
                });

            },
            //上一年
            lastYear() {
                this.currYear -= 1;
                if (this.currYear < new Date().getFullYear()) {
                    this.nextDis = false;
                }
                if (this.currYear <= 2021) {
                    this.lastDis = true;
                }
                this.setData();
            },
            //下一年
            nextYear() {
                this.currYear += 1;
                if (this.currYear >= new Date().getFullYear()) {
                    this.nextDis = true;
                }
                if (this.currYear > 2021) {
                    this.lastDis = false;
                }
                this.setData();

            },
            setUser() {
                //用户统计
                this.user.userChart = echarts.init(document.getElementById('userChart'));
                this.user.userOption = {
                    legend: {},
                    tooltip: {},
                    title: {
                        text: '每月新增用户数量统计',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.xArray
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: this.user.userData,
                            type: 'bar',
                            label: {
                                show: true,
                                position: 'top'
                            },
                        }
                    ]
                }
                this.user.userChart.setOption(this.user.userOption);
            },
            setFeedback() {
                //用户反馈统计
                this.feedback.feedbackChart = echarts.init(document.getElementById('feedbackChart'));
                this.feedback.feedbackOption = {
                    legend: {},
                    tooltip: {},
                    title: {
                        text: '每月新增用户反馈统计',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.xArray
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: this.feedback.feedbackData,
                            type: 'bar',
                            label: {
                                show: true,
                                position: 'top'
                            },
                        }
                    ]
                }
                this.feedback.feedbackChart.setOption(this.feedback.feedbackOption);
            },

            setIssure() {
                //发布投票统计
                this.issure.issureChart = echarts.init(document.getElementById('issureChart'));
                this.issure.issureOption = {
                    legend: {
                        // orient: 'vertical',
                        x: 'right'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    title: {
                        text: '每月发布投票统计',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.xArray
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '发布投票数',
                            data: this.issure.issureData[0],
                            type: 'bar'
                        },
                        {
                            name: '通过投票数',
                            data: this.issure.issureData[1],
                            type: 'bar'
                        }
                    ]
                }
                this.issure.issureChart.setOption(this.issure.issureOption);
            },

            setPart() {
                //参与投票人数统计
                this.part.partChart = echarts.init(document.getElementById('partChart'));
                this.part.partOption = {
                    legend: {},
                    tooltip: {},
                    title: {
                        text: '每月参与投票人次统计',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.xArray
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: this.part.partData,
                            type: 'bar',
                            label: {
                                show: true,
                                position: 'top'
                            },
                        }
                    ]
                }
                this.part.partChart.setOption(this.part.partOption);
            }

        },

        //页面销毁
        beforeDestroy() {
            this.user.userChart.dispose();
            this.feedback.feedbackChart.dispose();
            this.issure.issureChart.dispose();
            this.part.partChart.dispose();
        }
    }

</script>

<style scoped>

</style>
