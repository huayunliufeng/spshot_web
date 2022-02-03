<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/data/chart' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>运营数据</el-breadcrumb-item>
            <el-breadcrumb-item>推广管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="margin-top: 10px">
            <el-input placeholder="描述/URL" v-model="pagination.queryString" style="width: 300px"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="handleCurrentChange(1)">查询</el-button>
            <el-button type="primary" @click="handleCreate()">新增</el-button>
        </div>

        <div>
            <el-table :show-header="false" :data="tableData" style="width: 100%; margin-top: 20px">
                <el-table-column type="index" align="center" label="序号" width="30"></el-table-column>

                <el-table-column align="center" prop="img" width="231">
                    <template slot-scope="scope">
                        <a :href="scope.row.url" target="_blank">
                            <el-image :src="'http://hylf.club:8090/images/'+scope.row.img" fit="fill"/>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column align="left" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-row style="border: 1px solid #72d25d;height: 40px;line-height: 40px">
                            <span> {{scope.row.url}}</span>
                        </el-row>
                        <el-row style="border: 1px solid #e858c9;border-top: none;border-bottom: none;height: 40px;line-height: 40px">
                            <span>{{scope.row.desc}}</span>
                        </el-row>
                        <el-row style="border: 1px solid #1c74d4;height: 40px;line-height: 40px">
                            <span>{{scope.row.createtime | dateFormat2}}</span>
                        </el-row>
                    </template>
                </el-table-column>


                <el-table-column align="center" prop="state" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.state === 0 ? '正常' : '已下架'}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" width="80">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.state === 0" type="warning" size="mini"
                                   @click="soldOut(scope.row.id)">
                            下架
                        </el-button>
                        <el-button v-else type="success" size="mini" @click="recover(scope.row.id)">
                            上架
                        </el-button>
                        <el-button style="margin: 20px 0 0 0" type="primary" size="mini"
                                   @click="handleUpdate(scope.row.id)">
                            修改
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div class="pagination-container">
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

        <!-- 新增标签弹层 -->
        <div>
            <el-dialog title="新增推广" width="40%" :visible.sync="dialogFormVisible" :before-close="beforeClose"
                       :show-close="false">
                <el-form label-position="top" ref="dataAddForm" :model="formData" :rules="rules">

                    <el-form-item label="链接" prop="url">
                        <el-input v-model="formData.url"/>
                    </el-form-item>

                    <el-form-item label="描述" prop="desc">
                        <el-input v-model="formData.desc"/>
                    </el-form-item>

                    <el-form-item label="上传图片" prop="img" style="overflow: visible">
                        <el-upload drag
                                   action="/data/promote/upload"
                                   :auto-upload="true"
                                   name="img"
                                   :show-file-list="false"
                                   :on-success="handleAvatarSuccess"
                                   :before-upload="beforeAvatarUpload">
                            <el-image v-if="imgUrl" :src="imgUrl"
                                      fit="fill" style="width: 360px;height: 180px"/>
                            <i v-else class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

                        </el-upload>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="()=>{this.dialogFormVisible = false;this.isClose=true}">取消
                    </el-button>
                    <el-button type="success" @click="insert()">确认</el-button>
                </div>
            </el-dialog>
        </div>
        <!-- 编辑标签弹层 -->
        <div>
            <el-dialog title="新增推广" width="40%" :visible.sync="dialogFormVisible4Edit" :before-close="beforeClose"
                       :show-close="false">
                <el-form label-position="top" ref="dataEditForm" :model="formData" :rules="rules">

                    <el-form-item label="链接" prop="url">
                        <el-input v-model="formData.url"/>
                    </el-form-item>

                    <el-form-item label="描述" prop="desc">
                        <el-input v-model="formData.desc"/>
                    </el-form-item>

                    <el-form-item label="上传图片" prop="img">
                        <el-upload drag
                                   action="/data/promote/upload"
                                   :auto-upload="true"
                                   name="img"
                                   :show-file-list="false"
                                   :on-success="handleAvatarSuccess"
                                   :before-upload="beforeAvatarUpload">
                            <el-image :src="imgUrl" fit="fill" style="width: 360px;height: 180px"/>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

                        </el-upload>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="()=>{this.dialogFormVisible4Edit = false;this.isClose=true}">取消
                    </el-button>
                    <el-button type="success" @click="update()">确认</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    import {getRequest, postRequest, putRequest} from "../../utils/api";

    export default {
        name: "Promote",
        data() {
            return {
                isClose: false,
                imgUrl: '',
                countRec: 0,
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize: 5,
                    total: 16,
                    queryString: ''
                },
                rules: {//校验规则
                    url: [{required: true, message: '链接为必填项', trigger: 'blur'},],
                    desc: [{required: true, message: '描述为必填项', trigger: 'blur'}],
                    img: [{required: true, message: '必须上传图片', trigger: 'blur'}]
                },
                tableData: [],
                formData: {},
                dialogFormVisible: false,
                dialogFormVisible4Edit: false

            }
        },
        created() {
            this.handleCurrentChange(1);
        },
        methods: {
            //弹出新建窗口
            handleCreate() {
                this.formData = {};
                this.isClose = false;
                this.imgUrl = '';
                this.dialogFormVisible = true;
            },
            //弹出编辑窗口
            handleUpdate(id) {
                getRequest("/data/promote/" + id).then((res) => {
                    this.formData = res.data;
                    this.imgUrl = 'http://42.192.5.45:8090/images/' + res.data.img;
                }, (err) => {
                });

                this.isClose = false;
                this.dialogFormVisible4Edit = true;
            },
            beforeClose() {
                if (!this.isClose) {
                    return false;
                } else {
                    return done(true)
                }
            },
            //切换页码
            handleCurrentChange(currentPage) {
                this.pagination.currentPage = currentPage;
                postRequest("/data/promote/search", this.pagination).then((res) => {
                    this.pagination.total = res.data.total;
                    this.tableData = res.data.rows;
                }, (err) => {
                });
            },
            //文件上传成功后的钩子，response为服务端返回的值，file为当前上传的文件封装成的js对象
            handleAvatarSuccess(response, file) {
                //把文件名赋值给表单中的套餐数据
                this.formData.img = response.data;
                this.imgUrl = 'http://42.192.5.45:8090/images/' + response.data;
                //弹出消息
                this.$message({
                    message: response.message,
                    type: response.flag ? 'success' : 'error'
                });
            },
            //上传图片之前执行
            beforeAvatarUpload(file) {

            },
            //增加新的推广
            insert() {
                this.$refs['dataAddForm'].validate((valid) => {
                    if (valid) {
                        postRequest("/data/promote/", this.formData).then((res) => {
                            this.dialogFormVisible = false;
                            this.handleCurrentChange(this.pagination.currentPage);
                        }, (err) => {
                        });
                    } else { // 失败
                        this.$message.error("校验失败,请重新填写");
                        return false;
                    }
                });
            },
            //下架
            soldOut(id) {
                this.$confirm('确认下架吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getRequest("/data/promote/" + id + "/1").then((res) => {
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

            //修改
            update() {
                this.$refs['dataEditForm'].validate((valid) => {
                    if (valid) {
                        putRequest("/data/promote/", this.formData).then((res) => {
                            this.dialogFormVisible4Edit = false;
                            this.handleCurrentChange(this.pagination.currentPage);
                        }, (err) => {
                        });
                    } else { // 失败
                        this.$message.error("校验失败,请重新填写");
                        return false;
                    }
                });
            },
            //上架
            recover(id) {
                getRequest("/data/promote/count").then((res) => {
                    this.countRec = res.data;
                    if (this.countRec >= 6) {
                        this.$message.error("已达到最大推广数（6）");
                    } else {
                        getRequest("/data/promote/" + id + "/0").then((res) => {
                            this.handleCurrentChange(this.pagination.currentPage);
                        }, (err) => {
                        });
                    }
                }, (err) => {
                });
            }
        }
    }
</script>

<style scoped>

</style>
