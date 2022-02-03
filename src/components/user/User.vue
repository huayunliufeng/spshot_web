<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/data/chart' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户</el-breadcrumb-item>
        </el-breadcrumb>

        <div style="margin: 10px 0">
            <el-input placeholder="用户名" v-model="pagination.queryString" style="width: 300px"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="handleCurrentChange(1)">查询</el-button>
        </div>
        <div>
            <el-table border :data="tableData" style="width: 100%" :row-class-name="tableRowClassName"
                      :default-sort="{prop: 'registime', order: 'descending'}" highlight-current-row>
                <el-table-column type="index" align="center" label="序号"></el-table-column>
                <el-table-column prop="username" align="center" label="用户名" width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="openid" align="center" label="openid" width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="registime" align="center" label="注册时间" sortable show-overflow-tooltip
                                 width="180">
                    <template slot-scope="scope">
                        {{scope.row.registime | dateFormat2}}
                    </template>
                </el-table-column>
                <el-table-column prop="totalissure" align="center" label="总发布数" sortable width="110"></el-table-column>
                <el-table-column prop="totalpart" align="center" label="总参与数" sortable width="110"></el-table-column>
                <el-table-column prop="todaynum" align="center" label="今日剩余次数"></el-table-column>
                <el-table-column prop="state" align="center" label="状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.state === 0 ? '正常' : scope.row.state === -1?'无法参与和发布': scope.row.state === 1? '无法参与':'无法发布'}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" @click="banissure(scope.row.id)">禁发</el-button>
                        <el-button type="primary" size="mini" @click="banpart(scope.row.id)">禁参</el-button>
                        <el-button type="danger" size="mini" @click="ban(scope.row.id)">禁止</el-button>
                        <el-button type="success" size="mini" @click="recover(scope.row.id)">恢复</el-button>
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
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../utils/api.js";

    export default {
        name: "User",
        data() {
            return {
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize: 10,
                    total: 100,
                    queryString: ''
                },
                tableData: []
            }
        },

        created() {
            this.handleCurrentChange(1);
        },

        methods: {

            tableRowClassName({row, rowIndex}) {

                if (row.state === 2) {
                    return 'noissure-row';
                } else if (row.state === 0) {
                    return 'normal-row';
                } else if (row.state === 1) {
                    return 'nopart-row';
                } else {
                    return 'nopartandissure-row';
                }

            },
            //切换页码
            handleCurrentChange(currentPage) {
                this.pagination.currentPage = currentPage;
                postRequest("/user/user/search", this.pagination).then((res) => {
                    this.pagination.total = res.data.total;
                    this.tableData = res.data.rows;
                }, (err) => {
                });
            },
            //禁止发布
            banissure(id) {
                this.$confirm('确认禁止该用户发布投票吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getRequest("/user/user/state/" + id + "/2").then((res) => {
                        this.handleCurrentChange(this.pagination.currentPage);
                    }, (err) => {
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //禁止参与
            banpart(id) {
                this.$confirm('确认禁止该用户参与投票吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getRequest("/user/user/state/" + id + "/1").then((res) => {
                        this.handleCurrentChange(this.pagination.currentPage);
                    }, (err) => {
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //禁止
            ban(id) {
                this.$confirm('确认禁止该用户发布及参与投票吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getRequest("/user/user/state/" + id + "/-1").then((res) => {
                        this.handleCurrentChange(this.pagination.currentPage);
                    }, (err) => {
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //恢复
            recover(id) {
                this.$confirm('确认恢复该用户吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getRequest("/user/user/state/" + id + "/0").then((res) => {
                        this.handleCurrentChange(this.pagination.currentPage);
                    }, (err) => {
                    });
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

<style>
    .el-table .noissure-row {
        background: #fdf2cd;
    }

    .el-table .normal-row {
        background: #c8f9ca;
    }

    .el-table .nopart-row {
        background: #dee7f9;
    }

    .el-table .nopartandissure-row {
        background: #f9cece;
    }


</style>
