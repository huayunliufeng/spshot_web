<template>
    <div>
        <el-container>
            <el-header style="background-color: rgba(212,141,163,0.3)">
                <div style="float: left;line-height: 50px">
                    <el-image src="http://42.192.5.45:8090/images/logo.png" fit="fill"/>
                </div>
                <div style="float: right">
                    <el-dropdown class="avatar-container right-menu-item" trigger="click">
                        <div class="avatar-wrapper" style="height: 60px;line-height:60px;float: right;">
                            <span style="margin-bottom: 30px">{{loginname}}</span>
                        </div>
                        <div style="float: right">
                            <el-avatar style="margin-top: 10px" icon="el-icon-user-solid"></el-avatar>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item divided>
                                <span style="display:block;" @click="aboutMe">关于我们</span>
                            </el-dropdown-item>
                            <el-dropdown-item divided>
                                <span @click="logout" style="display:block;">退出</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                </div>
            </el-header>
            <el-container>
                <el-aside width="200px" style="height: 100%">
                    <el-menu
                            @select="selectMenu"
                            :default-active="currentIndexLight"
                            class="el-menu-vertical-demo"
                            @open="handleOpen"
                            @close="handleClose"
                            background-color="rgba(212,141,163,0.6)"
                            text-color="#fff"
                            :router="startRouter"
                            active-text-color="rgb(30,36,45)"
                    >
                        <!--:default-openeds="defaultOpen"-->
                        <div v-for="item in menuList" :key="item.path">
                            <!-- 没有子菜单 -->
                            <template v-if="item.children && item.children.length === 0">
                                <el-menu-item :index="item.path">
                                    <i :class="item.icon"></i>
                                    {{item.title}}
                                </el-menu-item>
                            </template>

                            <!-- 有子菜单 -->
                            <el-submenu v-else :index="item.path">
                                <template slot="title">
                                    <i :class="item.icon"></i>
                                    {{item.title}}
                                </template>

                                <template v-for="child in item.children">
                                    <!-- 这里是类似递归循环 -->
                                    <sidebar-item v-if="child.children&&child.children.length>0" :item="child"
                                                  :key="child.path"/>
                                    <el-menu-item v-else :key="child.path" :index="child.path">
                                        <i :class="child.icon"></i>
                                        <el-badge v-if="child.path==='/data/feedback'&& badges[0]!==0"
                                                  :value="badges[0]" class="item">
                                            <span>{{child.title}}</span>
                                        </el-badge>
                                        <el-badge v-else-if="child.path==='/issure/unverify' && badges[1]!==0"
                                                  :value="badges[1]" class="item">
                                            <span>{{child.title}}</span>
                                        </el-badge>
                                        <span v-else>{{child.title}}</span>
                                    </el-menu-item>
                                </template>
                            </el-submenu>
                        </div>
                    </el-menu>
                </el-aside>
                <el-main style="background-color: rgba(225,238,226,0.3)">
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>


    </div>
</template>
<script>
    import SidebarItem from '../components/SidebarItem'
    import {getRequest} from "../utils/api.js";

    export default {
        components: {SidebarItem},
        data() {
            return {
                badges: [0, 0],
                loginname: 'admin',
                startRouter: true,//开启路由标识， ，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
                currentIndexLight: '',//当前激活菜单的 index  高亮显示
                menuList: []
            }
        },

        created() {

            getRequest("/user/admin/info").then((res) => {
                this.loginname = res.data.loginname;
                window.sessionStorage.setItem("id", res.data.id);
                window.sessionStorage.setItem("loginname", res.data.loginname);

                let id = window.sessionStorage.getItem("id");
                getRequest("/user/admin/getMenu/"+id).then((res)=>{
                    this.menuList = res.data.menus;
                    for (let i = 0; i < res.data.menuPath.length; i++) {
                        window.sessionStorage.setItem(res.data.menuPath[i], res.data.menuPath[i]);
                    }
                },(err)=>{});
            },(err)=>{});

        },

        methods: {
            selectMenu(key, keyPath) {
                this.currentIndexLight = key;
                //查询未处理投票
                let id = window.sessionStorage.getItem("id");
                getRequest("/issure/issure/count/" + id).then((res) => {
                    this.badges[1] = res.data;
                }, (err) => {
                });
                //查询未处理反馈
                getRequest("/data/feedback/count").then((res) => {
                    this.badges[0] = res.data;
                }, (err) => {
                });
            },
            // 展开指定的 sub-menu
            handleOpen(key, keyPath) {
                // console.log('展开的时候触发', key, keyPath);
                let id = window.sessionStorage.getItem("id");
                getRequest("/issure/issure/count/" + id).then((res) => {
                    this.badges[1] = res.data;
                }, (err) => {
                });
                getRequest("/data/feedback/count").then((res) => {
                    this.badges[0] = res.data;
                }, (err) => {
                });
            },

            //    收起指定的 sub-menu
            handleClose(key, keyPath) {
                // console.log('收起的时候触发', key, keyPath);
                let id = window.sessionStorage.getItem("id");
                getRequest("/issure/issure/count/" + id).then((res) => {
                    this.badges[1] = res.data;
                }, (err) => {
                });
                getRequest("/data/feedback/count").then((res) => {
                    this.badges[0] = res.data;
                }, (err) => {
                });
            },
            aboutMe() {
                this.$alert('Copyright © 2021-2022 华风部落版权所有', '关于我们', {
                    confirmButtonText: '确定'
                });
            },
            logout() {
                let id = window.sessionStorage.getItem("id");
                getRequest("/user/admin/logout/" + id).then((res) => {
                    window.sessionStorage.clear();
                    this.$router.replace("/");
                });
            }


        }
    }
</script>
