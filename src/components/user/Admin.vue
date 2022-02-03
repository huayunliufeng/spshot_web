<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/data/chart' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理员</el-breadcrumb-item>
        </el-breadcrumb>

        <div style="margin: 10px 0">
            <el-input placeholder="管理员名" v-model="pagination.queryString" style="width: 300px"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="handleCurrentChange(1)">查询</el-button>
            <el-button type="primary" @click="handleCreate()">新建</el-button>
        </div>
        <div>
            <el-table border :data="tableData" style="width: 100%" highlight-current-row
                      :row-class-name="tableRowClassName">
                <el-table-column type="index" align="center" label="序号"></el-table-column>
                <el-table-column prop="loginname" align="center" label="管理员名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="password" align="center" label="密码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="state" align="center" label="状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.state === 0 ? '正常' : '已禁用'}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="findAdmin(scope.row.id)">详情</el-button>
                        <el-button v-if="scope.row.state === 0" type="danger" size="mini"
                                   @click="disAdmin(scope.row.id)">禁用
                        </el-button>
                        <el-button v-else type="success" size="mini" @click="recAdmin(scope.row.id)">恢复</el-button>
                        <el-button type="danger" size="mini" @click="delAdmin(scope.row.id)">删除</el-button>
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
            <el-dialog title="新增管理员" :visible.sync="dialogFormVisible" width="30%" :before-close="beforeClose"
                       :show-close="false">
                <template>
                    <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="基本信息" name="first">
                            <el-form label-position="right" ref="dataAddForm" :rules="rules" :model="formData">
                                <el-row>
                                    <el-col>
                                        <el-form-item label="账号" prop="loginname">
                                            <el-input v-model="formData.loginname" auto-complete="false"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col>
                                        <el-form-item label="密码" prop="password">
                                            <el-input v-model="formData.password" type="password"
                                                      auto-complete="false"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col>
                                        <el-form-item label="确认密码" prop="valPassword">
                                            <el-input v-model="valPassword" type="password"
                                                      auto-complete="false"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="角色" name="second">
                            <div>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>选择</th>
                                        <th>角色名</th>
                                        <th>角色关键字</th>
                                        <th>描述</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="c in roleList">
                                        <td style="width: 10%;text-align: center">
                                            <input :id="c.id" v-model="roleIds" type="checkbox" :value="c.id">
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
                                        @current-change="handleCurrentChangeByRoles"
                                        :current-page.sync="paginationByRoles.currentPage"
                                        :page-size="paginationByRoles.pageSize"
                                        layout="total, prev, pager, next, jumper"
                                        :total="paginationByRoles.total">
                                </el-pagination>
                            </div>
                        </el-tab-pane>

                    </el-tabs>
                </template>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="()=>{this.dialogFormVisible = false;this.isClose = true}">取消</el-button>
                    <el-button type="primary" @click="handleAdd()">确定</el-button>
                </div>
            </el-dialog>
        </div>

        <!--    编辑窗口    -->
        <div class="add-form">
            <el-dialog title="编辑管理员" :visible.sync="dialogFormVisible4Edit" width="30%" :before-close="beforeClose"
                       :show-close="false">
                <template>
                    <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="基本信息" name="first">
                            <el-form label-position="right" ref="dataEditForm" :rules="rules"
                                     :model="formData">
                                <el-row>
                                    <el-col>
                                        <el-form-item label="账号" prop="loginname">
                                            <el-input v-model="formData.loginname" auto-complete="false"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col>
                                        <el-form-item label="密码" prop="password">
                                            <el-input v-model="formData.password" auto-complete="false"
                                                      type="password"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col>
                                        <el-form-item label="确认密码" prop="valPassword">
                                            <el-input v-model="valPassword" type="password"
                                                      auto-complete="false"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="角色" name="second">
                            <div>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>选择</th>
                                        <th>角色名</th>
                                        <th>角色关键字</th>
                                        <th>描述</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="c in roleList">
                                        <td style="width: 10%;text-align: center">
                                            <input :id="c.id" v-model="roleIds" type="checkbox" :value="c.id">
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
                                        @current-change="handleCurrentChangeByRoles"
                                        :current-page.sync="paginationByRoles.currentPage"
                                        :page-size="paginationByRoles.pageSize"
                                        layout="total, prev, pager, next, jumper"
                                        :total="paginationByRoles.total">
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
    import {JSEncrypt} from 'jsencrypt'

    export default {
        name: "Admin",
        data() {
            let validLoginname = (rule, value, callback) => {
                let reg = /^\w{4,18}$/
                if (!reg.test(value)) {
                    callback(new Error('用户名格式错误，4-18位字母或数字'))
                } else {
                    callback()
                }
            }
            let validPassword = (rule, value, callback) => {
                let reg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{4,18}$/
                if (!reg.test(value)) {
                    callback(new Error('密码格式错误，必须有字母和数字，长度为4-18，可有特殊字符'))
                } else {
                    callback()
                }
            }
            return {
                isClose: false,
                activeName: 'first',//添加/编辑窗口Tab标签名称
                dialogFormVisible: false,
                dialogFormVisible4Edit: false,
                roleIds: [],//权限的双向绑定
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize: 10,
                    total: 100,
                    queryString: ''
                },
                paginationByRoles: {
                    currentPage: 1,//当前页码
                    pageSize: 10,//每页显示的记录数
                    total: 10//总记录数
                },
                roleList: [],
                tableData: [],
                valPassword: '',
                oldPass: '',
                formData: {},
                rules: {//校验规则
                    loginname: [{required: true, message: '管理员名为必填项', trigger: 'blur'}, {
                        validator: validLoginname,
                        trigger: 'blur'
                    }],
                    password: [{required: true, message: '密码为必填项', trigger: 'blur'}, {
                        validator: validPassword,
                        trigger: 'blur'
                    }]
                }
            }
        },
        created() {
            this.handleCurrentChange(1);
        },

        methods: {
            beforeClose() {
                if (!this.isClose) {
                    return false;
                } else {
                    return done(true)
                }
            },
            tableRowClassName({row, rowIndex}) {

                if (row.state === 1) {
                    return 'disable-row';
                }

            },


            //切换页码
            handleCurrentChange(currentPage) {
                this.pagination.currentPage = currentPage;
                postRequest("/user/admin/search", this.pagination).then((res) => {
                    this.pagination.total = res.data.total;
                    this.tableData = res.data.rows;
                }, (err) => {
                });

            },
            //弹出编辑窗口
            findAdmin(id) {
                getRequest("/user/admin/" + id).then((res) => {
                    this.formData = res.data.admin;
                    this.oldPass = this.formData.password;
                    this.roleIds = res.data.roleIds;
                    this.handleCurrentChangeByRoles(1);
                }, (err) => {
                });

                this.isClose = false;
                this.dialogFormVisible4Edit = true;

            },
            //弹出新建窗口
            handleCreate() {
                this.formData = {};
                this.activeName = 'first';//默认选中first对应的tab
                this.isClose = false;
                this.dialogFormVisible = true;
                this.roleIds = [];
                this.handleCurrentChangeByRoles(1);
            },

            //禁用管理员
            disAdmin(id) {
                this.$confirm('确认禁用该管理员吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getRequest("/user/admin/dis/" + id).then((res) => {
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
            //恢复管理员
            recAdmin(id) {
                this.$confirm('确认恢复该管理员吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getRequest("/user/admin/rec/" + id).then((res) => {
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
                if (this.oldPass !== this.formData.password) {
                    if (this.formData.password !== this.valPassword) {
                        this.$message.error("两次密码不同！");
                        return;
                    }
                }
                if (this.roleIds.length === 0) {
                    this.$message.error("至少选择一个角色！");
                    return;
                }
                this.$refs['dataEditForm'].validate((valid) => {
                    if (valid) {
                        let encrypt = new JSEncrypt();
                        let publicKey = window.sessionStorage.getItem("publicKey");
                        encrypt.setPublicKey(publicKey);
                        this.formData.loginname = encrypt.encrypt(this.formData.loginname);
                        this.formData.password = encrypt.encrypt(this.formData.password);

                        putRequest("/user/admin/" + this.roleIds, this.formData).then((res) => {
                            this.dialogFormVisible4Edit = false;
                            this.handleCurrentChange(this.pagination.currentPage);
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
                if (this.formData.password !== this.valPassword) {
                    this.$message.error("两次密码不同！");
                    return;
                }
                if (this.roleIds.length === 0) {
                    this.$message.error("至少选择一个角色！");
                    return;
                }
                //校验
                this.$refs['dataAddForm'].validate((valid) => {
                    if (valid) {
                        let encrypt = new JSEncrypt();
                        let publicKey = window.sessionStorage.getItem("publicKey");
                        console.log(publicKey);
                        encrypt.setPublicKey(publicKey);
                        this.formData.loginname = encrypt.encrypt(this.formData.loginname);
                        this.formData.password = encrypt.encrypt(this.formData.password);
                        //发送ajax请求
                        postRequest("/user/admin/" + this.roleIds, this.formData).then((res) => {
                            this.dialogFormVisible = false;
                            this.handleCurrentChange(1);
                        }, (err) => {
                        });
                    } else { // 失败
                        this.$message.error("校验失败,请重新填写");
                        return false;
                    }
                });

            },

            //角色翻页
            handleCurrentChangeByRoles(currentPage) {
                //把请求参数封装为一个对象
                this.paginationByRoles.currentPage = currentPage;
                //发出分页请求
                getRequest("/user/role/" + this.paginationByRoles.currentPage + "/" + this.paginationByRoles.pageSize).then((res) => {
                    this.roleList = res.data.rows;
                    this.paginationByRoles.total = res.data.total;
                }, (err) => {
                });
            },
            //删除管理员
            delAdmin(id) {
                this.$confirm('确认删除该管理员吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRequest("/user/admin/" + id).then((res) => {
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
