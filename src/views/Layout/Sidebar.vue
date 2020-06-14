<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.path" :key="item.path">
                        <template slot="title">
                            <i :class="item.icon"></i> 
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-menu-item :index="subItem.path" :key="subItem.path">
                                <i :class="subItem.icon"></i>
                                <span slot="title">{{ subItem.title }}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.path" :key="item.path">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    computed:{
        ...mapState({
            collapse:state=>state.collapse,
            items:state=>state.items
        }),
        onRoutes(){
            return this.$route.path.replace('/','')
        }
    },
    data(){
        return{
        }
    },
    methods:{
        ...mapMutations(['addTags']),
        addNewTags(){
            this.addTags(this.$route)
        }
    }
}
</script>

<style lang="scss" scoped>
    .sidebar{
        display: block;
        position: absolute;
        left:0;
        top:70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 200px;
    }
    .sidebar > ul{
        height: 100%;
    }
</style>