<template>
    <div>
        <div style="text-align: center;border-bottom: 2px solid #6596e5;width: 100%;height: 45px;line-height: 40px;">
            <el-button @click="exportExcel" style="float: left">导出Excel</el-button>
            运营数据统计
            <div style="float: right">日期：{{reportData.reportDate}}</div>
        </div>

        <table  class="exceTable" cellspacing="0" cellpadding="0">
            <tr>
                <td colspan="4" class="headBody">用户数据统计</td>
            </tr>
            <tr>
                <td width='20%'  class="tabletrBg">新增用户数</td>
                <td width='30%'>{{reportData.todayNewUser}}</td>
                <td width='20%'  class="tabletrBg">总用户数</td>
                <td width='30%'>{{reportData.totalUser}}</td>
            </tr>
            <tr>
                <td class="tabletrBg">本周新增用户数</td>
                <td>{{reportData.thisWeekNewUser}}</td>
                <td class="tabletrBg">本月新增用户数</td>
                <td>{{reportData.thisMonthNewUser}}</td>
            </tr>
            <tr>
                <td colspan="4" class="headBody">投票数据统计</td>
            </tr>
            <tr>
                <td class="tabletrBg">今日发布投票数</td>
                <td>{{reportData.todayIssureNumber}}</td>
                <td class="tabletrBg">今日参与投票人数</td>
                <td>{{reportData.todayPartNumber}}</td>
            </tr>
            <tr>
                <td class="tabletrBg">本周发布投票数</td>
                <td>{{reportData.thisWeekIssureNumber}}</td>
                <td class="tabletrBg">本周参与投票人数</td>
                <td>{{reportData.thisWeekPartNumber}}</td>
            </tr>
            <tr>
                <td class="tabletrBg">本月发布投票数</td>
                <td>{{reportData.thisMonthIssureNumber}}</td>
                <td class="tabletrBg">本月参与投票人数</td>
                <td>{{reportData.thisMonthPartNumber}}</td>
            </tr>

            <tr>
                <td colspan="4" class="headBody">用户反馈统计</td>
            </tr>
            <tr>
                <td class="tabletrBg">今日用户反馈</td>
                <td>{{reportData.todayFeedBackNumber}}</td>
                <td class="tabletrBg">今日处理反馈</td>
                <td>{{reportData.todayDealNumber}}</td>
            </tr>
            <tr>
                <td class="tabletrBg">本周用户反馈</td>
                <td>{{reportData.thisWeekFeedBackNumber}}</td>
                <td class="tabletrBg">本周处理反馈</td>
                <td>{{reportData.thisWeekDealNumber}}</td>
            </tr>
            <tr>
                <td class="tabletrBg">本月用户反馈</td>
                <td>{{reportData.thisMonthFeedBackNumber}}</td>
                <td class="tabletrBg">本月处理反馈</td>
                <td>{{reportData.thisMonthDealNumber}}</td>
            </tr>



            <tr>
                <td colspan="4" class="headBody">热门投票</td>
            </tr>
            <tr class="tabletrBg textCenter">
                <td>发布者</td>
                <td colspan="2">标题</td>
                <td>参与人数</td>
            </tr>
            <tr v-for="s in reportData.hotissure">
                <td>{{s.username}}</td>
                <td colspan="2">{{s.title}}</td>
                <td>{{s.currperson}}</td>
            </tr>
        </table>

    </div>
</template>

<script>
    import {getRequest} from "../../utils/api";

    export default {
        name: "Statistical",
        data(){
            // Date.prototype.format = function(fmt) {
            //     let o = {
            //         "M+": this.getMonth() + 1, //月份
            //         "d+": this.getDate(), //日
            //         "h+": this.getHours(), //小时
            //         "m+": this.getMinutes(), //分
            //         "s+": this.getSeconds(), //秒
            //         "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            //         "S": this.getMilliseconds() //毫秒
            //     };
            //     if (/(y+)/.test(fmt))
            //         fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            //     for (var k in o)
            //         if (new RegExp("(" + k + ")").test(fmt))
            //             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            //     return fmt;
            // }
            return{
                reportData: {
                    reportDate: null,
                    todayNewUser: 0,
                    totalUser: 0,
                    thisWeekNewUser: 0,
                    thisMonthNewUser: 0,
                    todayIssureNumber: 0,
                    todayPartNumber: 0,
                    thisWeekIssureNumber: 0,
                    thisWeekPartNumber: 0,
                    thisMonthIssureNumber: 0,
                    thisMonthPartNumber: 0,
                    todayFeedBackNumber: 0,
                    todayDealNumber: 0,
                    thisWeekFeedBackNumber: 0,
                    thisWeekDealNumber: 0,
                    thisMonthFeedBackNumber: 0,
                    thisMonthDealNumber: 0,
                    hotissure: []
                }
            }
        },
        created() {
            getRequest("/data/statistical/getReport").then((res)=>{
                this.reportData = res.data;
            },(err)=>{});
        },
        methods: {
            exportExcel() {
                // window.location.href = 'https://hylf.club:10010/data/statistical/exportReport';
                getRequest("/data/statistical/exportReport");
            }
        }
    }
</script>

<style scoped>

    .exceTable{
        width: 100%;
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        font-size: 14px;
        color: #333;
    }
    .exceTable tr,.exceTable td{
        border-left: 1px solid #e6e6e6;
        border-top: 1px solid #e6e6e6;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
    }
    .exceTable .headBody{
        text-align: center;
        font-weight: 700;
        font-size: 14px;
    }
    .tabletrBg{
        /*background: #fcfcfc;*/
        text-align: right;
    }
    .textCenter{
        text-align: center
    }
</style>
