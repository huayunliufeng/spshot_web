<template>

    <div>
        <div style="background-color: #0a0a0a;width: 100%;height: 100%;z-index: -1;overflow: hidden">
            <canvas id="canv" style="overflow: hidden;"></canvas>
            <div style="width: 422px;height: 366px;position: absolute;left: 36%;top: 22%;">
                <el-form style="margin: 0"
                         v-loading="loading"
                         element-loading-text="正在登录"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)"
                         ref="loginForm" :rules="rules" :model="loginForm" class="loginContainer">
                    <h3 class="loginTitle">请投意合后台登录</h3>
                    <el-form-item prop="loginname">

                        <el-input prefix-icon="icon-spshot-zhanghao" v-model="loginForm.loginname" type="text"
                                  auto-complete="false"
                                  placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input prefix-icon="icon-spshot-mima" v-model="loginForm.password" auto-complete="false"
                                  type="password"
                                  placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <el-input prefix-icon="icon-spshot-emiyanzhengma" style="width: 220px;margin-right: 5px;"
                                  v-model="loginForm.code" auto-complete="false"
                                  type="text"
                                  placeholder="点击图片更换验证码"></el-input>
                        <div style="float: right;width: 120px;height: 40px"><img :src="captchaUrl" alt=""
                                                                                 @click="updateCaptcha"/></div>
                        <el-checkbox style="float: left" v-model="rememberMe" class="remember" label="记住我" @change="rem"
                                     name="reamMe"></el-checkbox>
                        <el-button type="primary" @click="onSubmit" style="width: 100%">登&nbsp;&nbsp;&nbsp;&nbsp;录
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="foot">
                <a href="https://beian.miit.gov.cn" target="_blank">鄂ICP备2022001109号-1</a>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;Copyright © 2021-2022 华风部落</span>
            </div>
        </div>
    </div>

</template>

<script>

    import {stars_nest} from '../assets/stars-nest'
    import {getRequest, postRequest} from "../utils/api";
    import {JSEncrypt} from 'jsencrypt'

    export default {
        name: "Login",
        mounted() {
            getRequest("/user/admin/getPublicKey").then((res) => {
                window.sessionStorage.setItem("publicKey", res.data);
            }, (err) => {
            })
            stars_nest();
        },
        data() {
            let valid = (rule, value, callback) => {
                let reg = /^\w{1,12}$/
                if (!reg.test(value)) {
                    callback(new Error('格式错误，字母或数字'))
                } else {
                    callback()
                }
            }
            let validCode = (rule, value, callback) => {
                let reg = /^\w{4}$/
                if (!reg.test(value)) {
                    callback(new Error('验证码格式错误，4位字母或数字'))
                } else {
                    callback()
                }
            }
            return {
                captchaUrl: '',
                rememberMe: false,
                loading: false,
                loginForm: {
                    loginname: '',
                    password: '',
                    code: '',
                    uuid: '1'
                },
                rules: {
                    loginname: [{required: true, message: "请输入用户名", trigger: 'blur'}, {
                        max: 12,
                        message: "最长12位"
                    }, {validator: valid, trigger: 'blur'}],
                    password: [{required: true, message: "请输入密码", trigger: 'blur'}, {
                        validator: valid,
                        trigger: 'blur'
                    }],
                    code: [{required: true, message: "请输入验证码", trigger: 'blur'}, {
                        validator: validCode,
                        trigger: 'blur'
                    }]
                },

            }
        },
        created() {
            this.updateCaptcha();
        },
        methods: {
            onSubmit() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let encrypt = new JSEncrypt();
                        let publicKey = window.sessionStorage.getItem("publicKey");
                        if (publicKey != null && publicKey !== '') {
                            encrypt.setPublicKey(publicKey);
                            this.loginForm.loginname = encrypt.encrypt(this.loginForm.loginname);
                            this.loginForm.password = encrypt.encrypt(this.loginForm.password);
                            this.loginForm.code = this.loginForm.code.toUpperCase();
                            postRequest("/user/admin/login", this.loginForm).then((res) => {
                                if(res.flag){
                                    this.loading = false;
                                    const token = "Bearer " + res.data;
                                    //存储用户token
                                    window.sessionStorage.setItem("token", token);
                                    this.$router.replace('/home')
                                }
                                this.loginForm = {};
                                this.updateCaptcha();
                                this.loading = false;
                            }, (err) => {
                            });
                        } else {
                            this.$message.error("系统出错，请联系管理员！");
                            return false;
                        }
                    } else {
                        this.$message.error("请输入所有字段")
                        return false;
                    }
                });
            },
            updateCaptcha() {
                getRequest("/user/admin/captchaImage/" + this.loginForm.uuid).then((res) => {
                    this.captchaUrl = res.data.img;
                    this.loginForm.uuid = res.data.uuid;
                })
            },
            rem() {
                if (this.rememberMe) {
                    this.$message.info("记不住的");
                }
            }
        }
    }
</script>

<style scoped>

    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #eee7e7;
        border: 1px solid #dec6c6;
        box-shadow: 0 0 25px #6596e5;
        opacity: 0.8;

    }

    .loginTitle {
        margin: 0 auto 40px auto;
        text-align: center;
    }

    .remember {
        text-align: left;
    }



    .foot{
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #e590d4;
    }

    a:hover{
        color: #f00;
    }

</style>
