<template>

    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
            <el-breadcrumb-item :to="{ path: '/data/chart' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>发布管理</el-breadcrumb-item>
            <el-breadcrumb-item>通过</el-breadcrumb-item>
            <el-breadcrumb-item>已过期</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="margin: 10px 0">
            <el-input placeholder="标题/发布者/参与码" v-model="pagination.queryString" style="width: 300px"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="handleCurrentChange(1)">查询</el-button>
        </div>
        <div>
            <el-table border :data="tableData" style="width: 100%"
                      :default-sort="{prop: 'createtime', order: 'descending'}" highlight-current-row>
                <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
                <el-table-column prop="username" align="center" label="发布者" width="100"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="createtime" sortable align="center" label="提交时间" width="160">
                    <template slot-scope="scope">
                        {{scope.row.createtime | dateFormat2}}
                    </template>
                </el-table-column>
                <el-table-column prop="accepttime" sortable align="center" label="审核时间" width="160">
                    <template slot-scope="scope">
                        {{scope.row.accepttime | dateFormat2}}
                    </template>
                </el-table-column>
                <el-table-column prop="title" align="center" label="标题" width="400"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="partcode" align="center" label="参与码" width="80"></el-table-column>
                <el-table-column prop="partpass" align="center" label="密码" width="60"></el-table-column>
                <el-table-column prop="maxperson" align="center" label="最大人数">
                    <template slot-scope="scope">
                        <span>{{ scope.row.maxperson === -1 ? '不限' : scope.row.maxperson}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="currperson" align="center" label="当前人数"></el-table-column>
                <el-table-column prop="effecttime" sortable align="center" width="120" label="有效时间"></el-table-column>
                <el-table-column prop="isanony" align="center" label="是否匿名" width="60">
                    <template slot-scope="scope">
                        <span>{{ scope.row.isanony === '0' ? '否' : '是'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ispublic" align="center" label="是否公开" width="60">
                    <template slot-scope="scope">
                        <span>{{ scope.row.ispublic === '0' ? '否' : '是'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="state" align="center" label="状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.state === 0 ? '未审核' : scope.row.state === 1?'已通过':scope.row.state === 2?'已封禁':'不规范'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="audit(scope.row.id)">详情</el-button>
                        <el-button type="danger" size="mini" @click="deleteIssure(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    :current-page.sync="pagination.currentPage"
                    :page-size="pagination.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination.total">
            </el-pagination>
        </div>

        <div>
            <el-dialog center title="详情" :visible.sync="dialogFormVisible"  @close="close()">

                <template>
                    <el-form label-position="left" :model="formData" style="height: 500px;overflow: scroll;">

                        <el-form-item prop="title">

                            <i class="el-icon-view"></i>&nbsp;&nbsp;标题
                            <el-input v-model="formData.title" disabled/>
                        </el-form-item>

                        <template v-for="item in formData.items">

                            <el-form-item><i class="el-icon-question"></i>&nbsp;&nbsp;{{item.question}}(最多选择{{item.optional}}项)
                            </el-form-item>

                            <div :id="item.id" style="height: 200px;width: 680px;"></div>

                        </template>
                    </el-form>
                </template>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" style="width: 200px;height: 40px" round @click="dialogFormVisible = false">确认</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import * as echarts from 'echarts/core';
    import {GridComponent} from 'echarts/components';
    import {BarChart} from 'echarts/charts';
    import {CanvasRenderer} from 'echarts/renderers';
    import {getRequest, postRequest, putRequest, deleteRequest} from "../../../utils/api.js";
    echarts.use([GridComponent, BarChart, CanvasRenderer]);
    export default {
        name: "Overdue",
        data() {
            return {
                yArray: [],
                data: [],
                myChart: [],
                options: [],
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize: 10,
                    total: 100,
                    queryString: ''
                },
                formData: {},//表单数据
                verifyData: {},
                tableData: [],//新增和编辑表单中对应的检查项列表数据
                dialogFormVisible: false,//控制详情窗口显示/隐藏
                dialogVisible: false//封禁窗口
            }
        },
        mounted() {
            this.handleCurrentChange(1);
        },
        methods: {

            open(){
                this.$nextTick(() => {
                    //  执行echarts方法
                    for (let i = 0; i < this.yArray.length; i++) {
                        this.myChart[i] = echarts.init(document.getElementById(this.formData.items[i].id));
                        this.options[i] = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                },
                                formatter (params) {
                                    return  params[0].data.a;
                                }
                            },
                            xAxis: {
                                type: 'value'
                            },
                            yAxis: {
                                type: 'category',
                                data: this.yArray[i]
                            },
                            grid: {
                                top: '0',
                                bottom: '0',
                                left: '5%',
                                containLabel: true
                            },
                            series: [
                                {
                                    data: this.data[i],
                                    label:{
                                        show: true,
                                        position: 'inside'
                                    },
                                    type: 'bar'
                                }
                            ]
                        };
                        this.myChart[i].setOption(this.options[i]);
                    }
                })
            },
            close(){
                for (let i = 0; i < this.yArray.length; i++) {
                    this.myChart[i].dispose();
                }
            },
            //切换页码
            handleCurrentChange(currentPage) {
                this.pagination.currentPage = currentPage;
                postRequest("/issure/issure/pass/1/1", this.pagination).then((res) => {
                    this.pagination.total = res.data.total;
                    this.tableData = res.data.rows;
                }, (err) => {});
            },

            //详情
            audit(id) {
                getRequest("/issure/issure/desc/" + id).then((res) => {
                    this.formData = res.data.desc;
                    //设置verify的参数
                    this.verifyData.adminid = window.sessionStorage.getItem("id");
                    this.verifyData.issureid = this.formData.id;
                    this.verifyData.loginname = window.sessionStorage.getItem("loginname");
                    this.verifyData.username = this.formData.username;
                    this.verifyData.title = this.formData.title;
                    for (let i = 0; i < res.data.data.length; i++) {
                        this.data[i] = [];
                        this.data[i] = res.data.data[i];
                    }

                    for (let i = 0; i < this.data.length; i++) {
                        this.yArray[i] = [];
                        for (let j = 0; j < this.data[i].length; j++) {
                            this.yArray[i][j] = 'a' + (j + 1);
                        }
                    }
                    this.open();
                }, (err) => {
                });
                this.dialogFormVisible = true;
            },

            //删除
            deleteIssure(id) {
                this.$confirm('确认删除吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRequest("/issure/issure/"+id).then((res)=>{
                        this.handleCurrentChange(this.pagination.currentPage);
                    },(err)=>{});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>
