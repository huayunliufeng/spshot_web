<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/data/chart' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色</el-breadcrumb-item>
        </el-breadcrumb>

        <div style="margin: 10px 0">
            <el-input placeholder="角色名/角色关键字/描述" v-model="pagination.queryString" style="width: 300px"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="handleCurrentChange(1)">查询</el-button>
            <el-button type="primary" @click="handleCreate()">新建</el-button>
        </div>
        <div>
            <el-table border :data="tableData" style="width: 100%" highlight-current-row
                      :row-class-name="tableRowClassName">
                <el-table-column type="index" align="center" label="序号"></el-table-column>
                <el-table-column prop="name" align="center" label="角色名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="keyword" align="center" label="角色关键字" show-overflow-tooltip></el-table-column>
                <el-table-column prop="descr" align="center" label="描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="state" align="center" label="状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.state === 0 ? '正常' : '已禁用'}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="findRole(scope.row.id)">详情</el-button>
                        <el-button v-if="scope.row.state === 0" type="danger" size="mini"
                                   @click="disRole(scope.row.id)">禁用
                        </el-button>
                        <el-button v-else type="success" size="mini" @click="recRole(scope.row.id)">恢复</el-button>
                        <el-button type="danger" size="mini" @click="delRole(scope.row.id)">删除</el-button>
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

        <!-- 新增标签弹层 -->
        <div>
            <el-dialog title="新增角色" :visible.sync="dialogFormVisible">
                <template>
                    <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="基本信息" name="first">
                            <el-form label-position="right" label-width="100px" ref="dataAddForm" :rules="rules"
                                     :model="formData">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="角色名" prop="name">
                                            <el-input v-model="formData.name"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="角色关键字" prop="keyword">
                                            <el-input v-model="formData.keyword"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="描述" prop="descr">
                                            <el-input v-model="formData.descr" type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="权限" name="second">
                            <div>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>选择</th>
                                        <th>权限名</th>
                                        <th>权限关键字</th>
                                        <th>描述</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="c in permissionList">
                                        <td style="width: 10%;text-align: center">
                                            <input :id="c.id" v-model="permissionIds" type="checkbox" :value="c.id">
                                        </td>
                                        <td style="width: 20%;text-align: center"><label :for="c.id">{{c.name}}</label>
                                        </td>
                                        <td style="width: 20%;text-align: center"><label
                                                :for="c.id">{{c.keyword}}</label></td>
                                        <td style="width: 20%;text-align: center"><label :for="c.id">{{c.descr}}</label>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="pagination-container">
                                <el-pagination
                                        class="paginationByCheckItem"
                                        @current-change="handleCurrentChangeByPermission"
                                        :current-page.sync="paginationByPermission.currentPage"
                                        :page-size="paginationByPermission.pageSize"
                                        layout="total, prev, pager, next, jumper"
                                        :total="paginationByPermission.total">
                                </el-pagination>
                            </div>
                        </el-tab-pane>

                    </el-tabs>
                </template>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleAdd()">确定</el-button>
                </div>
            </el-dialog>
        </div>

        <!--    编辑窗口    -->
        <div class="add-form">
            <el-dialog title="编辑角色" :visible.sync="dialogFormVisible4Edit">
                <template>
                    <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="基本信息" name="first">
                            <el-form label-position="right" label-width="100px" ref="dataEditForm" :rules="rules"
                                     :model="formData">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="角色名" prop="name">
                                            <el-input v-model="formData.name"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="角色关键字" prop="keyword">
                                            <el-input v-model="formData.keyword"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="描述" prop="descr">
                                            <el-input v-model="formData.descr" type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="权限" name="second">
                            <div>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>选择</th>
                                        <th>权限名</th>
                                        <th>权限关键字</th>
                                        <th>描述</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="c in permissionList">
                                        <td style="width: 10%;text-align: center">
                                            <input :id="c.id" v-model="permissionIds" type="checkbox" :value="c.id">
                                        </td>
                                        <td style="width: 20%;text-align: center"><label :for="c.id">{{c.name}}</label>
                                        </td>
                                        <td style="width: 20%;text-align: center"><label
                                                :for="c.id">{{c.keyword}}</label></td>
                                        <td style="width: 20%;text-align: center"><label
                                                :for="c.id">{{c.descr}}</label></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="pagination-container">
                                <el-pagination
                                        class="paginationByCheckItem"
                                        @current-change="handleCurrentChangeByPermission"
                                        :current-page.sync="paginationByPermission.currentPage"
                                        :page-size="paginationByPermission.pageSize"
                                        layout="total, prev, pager, next, jumper"
                                        :total="paginationByPermission.total">
                                </el-pagination>
                            </div>
                        </el-tab-pane>

                    </el-tabs>
                </template>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible4Edit = false">取消</el-button>
                    <el-button type="primary" @click="handleEdit()">确定</el-button>
                </div>
            </el-dialog>
        </div>


    </div>
</template>

<script>
    import {deleteRequest, getRequest, postRequest, putRequest} from "../../utils/api.js";

    export default {
        name: "Role",
        data() {
            return {
                activeName: 'first',//添加/编辑窗口Tab标签名称
                dialogFormVisible: false,
                dialogFormVisible4Edit: false,
                permissionIds: [1, 3],//权限的双向绑定
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize: 10,
                    total: 100,
                    queryString: ''
                },
                paginationByPermission: {
                    currentPage: 1,//当前页码
                    pageSize: 10,//每页显示的记录数
                    total: 10//总记录数
                },
                permissionList: [],
                tableData: [],
                formData: {},
                rules: {//校验规则
                    name: [{required: true, message: '角色名为必填项', trigger: 'blur'}],
                    keyword: [{required: true, message: '角色关键字为必填项', trigger: 'blur'}],
                    descr: [{required: true, message: '角色描述为必填项', trigger: 'blur'}]
                }
            }
        },

        created() {
            this.handleCurrentChange(1);
        },

        methods: {
            tableRowClassName({row, rowIndex}) {

                if (row.state === 1) {
                    return 'disable-row';
                }

            },


            //切换页码
            handleCurrentChange(currentPage) {
                this.pagination.currentPage = currentPage;
                postRequest("/user/role/search", this.pagination).then((res) => {
                    this.pagination.total = res.data.total;
                    this.tableData = res.data.rows;
                }, (err) => {
                });
            },
            //弹出编辑窗口
            findRole(id) {
                getRequest("/user/role/" + id).then((res) => {
                    this.formData = res.data.role;
                    this.permissionIds = res.data.permissionIds;
                    this.handleCurrentChangeByPermission(1);
                }, (err) => {
                });
                this.dialogFormVisible4Edit = true;

            },
            //弹出新建窗口
            handleCreate() {
                this.formData = {};
                this.activeName = 'first';//默认选中first对应的tab
                this.dialogFormVisible = true;
                this.permissionIds = [];
                this.handleCurrentChangeByPermission(1);
            },

            //禁用角色
            disRole(id) {
                this.$confirm('确认禁用该角色吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getRequest("/user/role/dis/" + id).then((res) => {
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
            //恢复角色
            recRole(id) {
                this.$confirm('确认恢复该角色吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getRequest("/user/role/rec/" + id).then((res) => {
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
            //编辑
            handleEdit() {
                if (this.permissionIds.length === 0) {
                    this.$message.error("至少选择一个权限！");
                    return;
                }
                this.$refs['dataEditForm'].validate((valid) => {
                    if (valid) {
                        putRequest("/user/role/edit/" + this.permissionIds, this.formData).then((res) => {
                            if (res.flag) { // 服务器端处理成功
                                this.dialogFormVisible4Edit = false;
                                this.handleCurrentChange(this.pagination.currentPage);
                            } else { // 服务器端处理失败
                                this.$message.error(res.data.message);
                            }

                        }, (err) => {
                        });
                    } else {
                        this.$message.error("校验失败,请重新填写");
                        return false;
                    }
                });
            },
            //添加
            handleAdd() {
                if (this.permissionIds.length === 0) {
                    this.$message.error("至少选择一个权限！");
                    return;
                }
                //校验
                this.$refs['dataAddForm'].validate((valid) => {
                    if (valid) {
                        //发送ajax请求
                        postRequest("/user/role/" + this.permissionIds, this.formData).then((res) => {
                            if (res.flag) { // 服务器端处理成功
                                this.dialogFormVisible = false;
                                this.handleCurrentChange(1);
                            }
                        }, (err) => {
                        });
                    } else { // 失败
                        this.$message.error("校验失败,请重新填写");
                        return false;
                    }
                });

            },

            //权限翻页
            handleCurrentChangeByPermission(currentPage) {
                //把请求参数封装为一个对象
                this.paginationByPermission.currentPage = currentPage;
                //发出分页请求
                getRequest("/user/role/permission/" + this.paginationByPermission.currentPage + "/" + this.paginationByPermission.pageSize).then((res) => {
                    this.permissionList = res.data.rows;
                    this.paginationByPermission.total = res.data.total;
                }, (err) => {
                });
            },
            //删除角色
            delRole(id) {
                this.$confirm('确认删除该角色吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRequest("/user/role/" + id).then((res) => {
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
    .el-table .disable-row {
        background: #f9cece;
    }
</style>
