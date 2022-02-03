<template>

    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
            <el-breadcrumb-item :to="{ path: '/data/chart' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>发布管理</el-breadcrumb-item>
            <el-breadcrumb-item>未通过</el-breadcrumb-item>
            <el-breadcrumb-item>已封禁</el-breadcrumb-item>
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
                <el-table-column prop="createtime" sortable align="center" label="提交时间" width="180">
                    <template slot-scope="scope">
                        {{scope.row.createtime | dateFormat2}}
                    </template>
                </el-table-column>
                <el-table-column prop="title" align="center" label="标题" width="450"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="partcode" align="center" label="参与码" width="80"></el-table-column>
                <el-table-column prop="partpass" align="center" label="密码" width="80"></el-table-column>
                <el-table-column prop="maxperson" align="center" label="最大人数">
                    <template slot-scope="scope">
                        <span>{{ scope.row.maxperson === -1 ? '不限' : scope.row.maxperson}}</span>
                    </template>
                </el-table-column>
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
                <el-table-column align="center" label="操作" width="120px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="audit(scope.row.id)">查看详情</el-button>
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
                    <el-form label-position="left" :model="formData" style="height: 500px;overflow: scroll;">

                        <el-form-item prop="title">

                            <i class="el-icon-view"></i>&nbsp;&nbsp;标题
                            <el-input v-model="formData.title" disabled/>
                        </el-form-item>

                        <template v-for="item in formData.items">

                            <el-form-item><i class="el-icon-question"></i>&nbsp;&nbsp;{{item.question}}(最多选择{{item.optional}}项)
                            </el-form-item>

                            <el-radio-group v-if="item.optional && item.optional === 1" disabled>
                                <el-radio class="box" v-for="it in item.item" :label="it.ans"></el-radio>
                            </el-radio-group>

                            <el-checkbox-group v-else disabled>
                                <el-checkbox class="box" v-for="it in item.item" :label="it.ans"></el-checkbox>
                            </el-checkbox-group>
                        </template>
                        <el-form-item prop="reason">
                            <i class="icon-spshot-jujueliyouyemian"></i>&nbsp;&nbsp;封禁理由
                            <el-input type="textarea" disabled :rows="2" placeholder="请输入内容"
                                      v-model="formData.reason"></el-input>
                        </el-form-item>
                    </el-form>

                </template>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" style="width: 180px;height: 40px" round
                               @click="dialogFormVisible = false">取消
                    </el-button>
                    <el-button type="warning" style="width: 180px;height: 40px" round @click="pass()">解封</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import {getRequest, postRequest} from "../../../utils/api.js";

    export default {
        name: "Banned",
        data() {
            return {

                reason: '',
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize: 10,
                    total: 100,
                    queryString: null,
                },
                formData: {},//表单数据
                verifyData: {},
                tableData: [],//表格数据
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
                let loginname = window.sessionStorage.getItem("loginname");
                let id = window.sessionStorage.getItem("id");
                //如果是运维，只查询所属投票
                if (loginname.endsWith("_op")) {
                    postRequest("/issure/issure/search/2/" + id, this.pagination).then((res) => {
                        this.pagination.total = res.data.total;
                        this.tableData = res.data.rows;
                    }, (err) => {
                        this.$message.error("出错！");
                    });
                } else {
                    //否则查询所有投票
                    postRequest("/issure/issure/search/2", this.pagination).then((res) => {
                        this.pagination.total = res.data.total;
                        this.tableData = res.data.rows;
                    }, (err) => {
                        this.$message.error("出错！");
                    });
                }
            },
            //审核
            audit(id) {
                getRequest("/issure/issure/" + id).then((res) => {
                    this.formData = res.data;
                    //设置verify的参数
                    this.verifyData.adminid = window.sessionStorage.getItem("id");
                    this.verifyData.issureid = this.formData.id;
                    this.verifyData.loginname = window.sessionStorage.getItem("loginname");
                    this.verifyData.username = this.formData.username;
                    this.verifyData.title = this.formData.title;
                }, (err) => {
                });
                this.dialogFormVisible = true;
            },
            //通过
            pass() {
                this.verifyData.reason = '符合规范';
                postRequest("/issure/issure/audit/1", this.verifyData).then((res) => {
                    this.dialogFormVisible = false;
                    this.handleCurrentChange(this.pagination.currentPage);
                }, (err) => {
                });
            }
        }
    }
</script>

<style scoped>

    .box {
        display: block;
        margin: 0 0 10px 30px;
    }
</style>
