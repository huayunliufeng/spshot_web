<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
            <el-breadcrumb-item :to="{ path: '/data/chart' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>运营数据</el-breadcrumb-item>
            <el-breadcrumb-item>用户反馈</el-breadcrumb-item>
            <el-breadcrumb-item>已处理</el-breadcrumb-item>
        </el-breadcrumb>

        <div style="margin: 10px 0">
            <el-input placeholder="用户名/主题" v-model="pagination.queryString" style="width: 300px"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="handleCurrentChange(1)">查询</el-button>
        </div>
        <div>
            <el-table border :data="tableData" style="width: 100%"
                      :default-sort="{prop: 'dealtime', order: 'descending'}" highlight-current-row>
                <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
                <el-table-column prop="username" align="center" label="用户名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createtime" sortable align="center" label="提交时间" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.createtime | dateFormat2}}
                    </template>
                </el-table-column>
                <el-table-column prop="adminname" align="center" label="处理者"></el-table-column>
                <el-table-column prop="dealtime" align="center" sortable label="处理时间" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.dealtime | dateFormat2}}
                    </template>
                </el-table-column>
                <el-table-column prop="title" align="center" label="主题" width="400"
                                 show-overflow-tooltip></el-table-column>

                <el-table-column prop="result" align="center" label="结果" show-overflow-tooltip></el-table-column>

                <el-table-column align="center" label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="findFb(scope.row.id,scope.$index)">详情</el-button>
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
                                    <el-input v-model="formData.result" type="textarea" disabled/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" round @click="dialogFormVisible = false">确认</el-button>
                </div>
            </el-dialog>
        </div>


    </div>


</template>

<script>
    import {getRequest, postRequest} from "../../../utils/api.js";
    export default {
        name: "Treated",
        data() {
            return {
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize: 10,
                    total: 100,
                    queryString: ''
                },
                formData: {},
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
                postRequest("/data/feedback/search/1", this.pagination).then((res) => {
                    this.pagination.total = res.data.total;
                    this.tableData = res.data.rows;
                }, (err) => {
                });
            },

            findFb(id, index) {
                getRequest("/data/feedback/desc/deal/" + id).then((res) => {
                    this.formData = res.data;
                    let date = this.formData.createtime
                    // this.formData.createtime = this.format(date);
                }, (err) => {
                });
                this.dialogFormVisible = true;
            },
            format(originVal){
                const dt = new Date(originVal[0], originVal[1], originVal[2], originVal[3], originVal[4], originVal[5])
                const yyyy = dt.getFullYear()
                const MM = (dt.getMonth() + 1 + '').padStart(2, 0);
                const dd = (dt.getDate() + '').padStart(2, 0);
                const HH = (dt.getHours() + '').padStart(2, 0);
                const mm = (dt.getMinutes() + '').padStart(2, 0);
                const ss = (dt.getSeconds() + '').padStart(2, 0);
                return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
            }

        }
    }
</script>

<style scoped>

</style>
