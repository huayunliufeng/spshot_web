<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
            <el-breadcrumb-item :to="{ path: '/data/chart' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>运营数据</el-breadcrumb-item>
            <el-breadcrumb-item>用户反馈</el-breadcrumb-item>
            <el-breadcrumb-item>未处理</el-breadcrumb-item>
        </el-breadcrumb>

        <div style="margin: 10px 0">
            <el-input placeholder="用户名/主题" v-model="pagination.queryString" style="width: 300px"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="handleCurrentChange(1)">查询</el-button>
        </div>
        <div>
            <el-table border :data="tableData" style="width: 100%"
                      :default-sort="{prop: 'createtime', order: 'descending'}" highlight-current-row>
                <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
                <el-table-column prop="username" align="center" label="用户名" width="100"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="createtime" sortable align="center" label="提交时间" width="180">
                    <template slot-scope="scope">
                        {{scope.row.createtime | dateFormat2}}
                    </template>
                </el-table-column>
                <el-table-column prop="title" align="center" label="主题" width="500"
                                 show-overflow-tooltip></el-table-column>

                <el-table-column prop="state" align="center" label="状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.state === 0 ? '未处理' : '已处理'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="findFb(scope.row.id)">详情</el-button>
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
            <el-dialog center title="详情" :visible.sync="dialogFormVisible">

                <template>
                    <el-form label-position="left" :model="formData">

                        <el-form-item prop="title">

                            <i class="el-icon-view"></i>&nbsp;&nbsp;标题
                            <el-input v-model="formData.title" disabled/>
                        </el-form-item>

                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="用户名" prop="username" label-width="80px">
                                    <el-input v-model="formData.username" disabled style="margin-left: -20px"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="提交日期" prop="createtime" label-width="80px">
                                    <template>
                                        {{formData.createtime | dateFormat2}}
                                    </template>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item label="详情" prop="details">
                                    <el-input v-model="formData.details" disabled type="textarea"/>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col>
                                <el-form-item label="回复" prop="result">
                                    <el-input v-model="result" type="textarea"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
                <div slot="footer" class="dialog-footer">
                    <el-button type="danger" round @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="success" round @click="deal()">确认</el-button>
                </div>
            </el-dialog>
        </div>


    </div>


</template>

<script>
    import {getRequest, postRequest} from "../../../utils/api.js";

    export default {
        name: "Untreated",
        data() {
            return {
                result: '',
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize: 10,
                    total: 100,
                    queryString: ''
                },
                formData: {},
                dealData: {},
                tableData: [],
                dialogFormVisible: false//控制详情窗口显示/隐藏
            }
        },
        created() {
            this.handleCurrentChange(1);
        },
        methods: {

            //切换页码
            handleCurrentChange(currentPage) {
                this.pagination.currentPage = currentPage;
                postRequest("/data/feedback/search/0", this.pagination).then((res) => {
                    this.pagination.total = res.data.total;
                    this.tableData = res.data.rows;
                }, (err) => {
                });
            },

            findFb(id) {
                getRequest("/data/feedback/" + id).then((res) => {
                    this.formData = res.data;
                    this.dealData.adminid = window.sessionStorage.getItem("id");
                    this.dealData.adminname = window.sessionStorage.getItem("loginname");
                    this.dealData.userid = this.formData.userid;
                    this.dealData.fbid = id;
                    this.dealData.username = this.formData.username;
                }, (err) => {
                });
                this.dialogFormVisible = true;
            },

            //处理反馈
            deal() {
                if(this.result===null||this.result===''){
                    this.$message.error("内容不可为空！");
                    return;
                }
                this.dealData.result = this.result;
                postRequest("/data/feedback/deal", this.dealData).then((res) => {
                    this.dialogFormVisible = false;
                    this.handleCurrentChange(this.pagination.currentPage);
                }, (err) => {
                });

            }
        }
    }
</script>

<style scoped>

</style>
