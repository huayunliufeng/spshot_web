<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/data/chart' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>发布管理</el-breadcrumb-item>
            <el-breadcrumb-item>审核记录</el-breadcrumb-item>
        </el-breadcrumb>

        <div style="margin: 10px 0">
            <el-input placeholder="标题/发布者" v-model="pagination.queryString" style="width: 300px"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="handleCurrentChange(1)">查询</el-button>
        </div>
        <div>
            <el-table border :data="tableData" style="width: 100%" :row-class-name="tableRowClassName"
                      :default-sort="{prop: 'accepttime', order: 'descending'}" highlight-current-row>
                <el-table-column type="index" align="center" label="序号"></el-table-column>
                <el-table-column prop="loginname" align="center" label="操作者"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="username" align="center" label="发布者"></el-table-column>
                <el-table-column prop="title" align="center" label="标题"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="accepttime" align="center" label="操作时间" sortable>
                    <template slot-scope="scope">
                        {{scope.row.accepttime | dateFormat2}}
                    </template>
                </el-table-column>
                <el-table-column prop="reason" align="center" label="理由" show-overflow-tooltip></el-table-column>

                <el-table-column prop="state" align="center" label="操作状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.state === -1 ? '不规范' : scope.row.state === 1?'通过':'已封禁'}}</span>
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
    import {postRequest} from "../../utils/api.js";

    export default {
        name: "Record",
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
            this.handleCurrentChange(1)
        },

        methods: {
            tableRowClassName({row, rowIndex}) {

                if (row.state === -1) {
                    return 'warning-row';
                } else if (row.state === 1) {
                    return 'success-row';
                } else {
                    return 'banned-row';
                }

            },
            //切换页码
            handleCurrentChange(currentPage) {
                this.pagination.currentPage = currentPage;
                postRequest("/issure/issure/record/search", this.pagination).then((res) => {
                    this.pagination.total = res.data.total;
                    this.tableData = res.data.rows;
                }, (err) => {
                });
            }
        }

    }
</script>

<style>
    .el-table .warning-row {
        background: #fdf2cd;
    }

    .el-table .success-row {
        background: #c8f9ca;
    }

    .el-table .banned-row {
        background: #f9cece;
    }
</style>
