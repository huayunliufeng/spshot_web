<template>
    <div v-if="item.children">
        <template v-if="item.children.length === 0">
            <el-menu-item :index="item.path">
                <i :class="item.icon"></i>
                <span slot="title">{{item.title}}</span>
            </el-menu-item>
        </template>
        <el-submenu v-else :index="item.path">

            <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title" v-show="!collapse">{{item.title}}</span>
            </template>

            <template v-for="child in item.children">
                <sidebar-item
                        v-if="child.children&&child.children.length>0"
                        :item="child"
                        :key="child.path"/>
                <el-menu-item v-else :key="child.path" :index="child.path">
                    <i :class="child.icon"></i>
                    {{child.title}}
                </el-menu-item>
            </template>

        </el-submenu>

    </div>


</template>

<script>

    export default {
        name: 'SidebarItem',
        props: {
            item: {
                type: Object,
                required: true
            },
            collapse: {
                type: Boolean,
                default: false
            }
        }
    }
</script>