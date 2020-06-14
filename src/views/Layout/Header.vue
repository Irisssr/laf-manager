<template>
    <div>
        <div class="header">
            <div class="collapse-btn" @click="collapseChage">
                <i class="el-icon-s-fold" v-if="!collapse"></i>
                <i class="el-icon-s-unfold" v-else></i>
            </div>
            <div class="logo">西柚失物招领小程序后台管理</div>
            <div class="header-right">
                <!-- 全屏 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip
                        effect="dark"
                        :content="fullscreen?'取消全屏':'全屏'"
                        placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>

                <!-- 侧边栏 -->
                <div class="btn-bell" @click="toMenu">
                    <el-tooltip
                        effect="dark"
                        content="关于我们"
                        placement="bottom">
                        <i class="el-icon-s-tools"></i>
                    </el-tooltip>
                </div>

                <!-- 用户 -->
                <el-dropdown size="small" 
                    split-button
                    @command="handleCommand">
                    <span class="el-dropdown-link">
                        admin
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-drawer
                title="关于我们"
                :visible.sync="drawer"
                :with-header="false">
                <Drawer></Drawer>
        </el-drawer>
    </div>
</template>

<script>
import { mapState, mapMutations} from 'vuex';
import Drawer from '@/components/Drawer.vue'

export default {
    computed:{
        ...mapState({
            collapse:state=>state.collapse,
            userInfo:state=>state.userInfo
        })
    },
    components:{
        Drawer
    },
    data(){
        return{            
            fullscreen:false,
            drawer:false
        }
    },
    methods:{
        ...mapMutations([
            'changeCollpase'
        ]),
        collapseChage(){
            this.changeCollpase();
        },
        handleCommand(command){
            if(command === 'logout'){
                this.$router.push('/login');
                localStorage.removeItem('token');
                localStorage.removeItem('log');
                localStorage.removeItem('username');
                return this.$message('退出成功');
            }
            if(command === 'my'){
                return this.$router.push('/mine')
            }
        },
        handleFullScreen(){
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen=!this.fullscreen
        },
        toMenu(){
            this.drawer=true;
        }
    },
    created(){
        // console.log(this.userInfo)
    }
}
</script>

<style lang="scss">
    .header{
        position: relative;
        box-sizing: border-box;
        height: 70px;
        width: 100%;
        background: #242f42;
        color: #fff;
        font-size: 22px;
    
        .collapse-btn{
            float: left;
            cursor: pointer;
            line-height: 70px;
            padding: 0 21px;
        }

        .logo{
            display: inline-block;
            line-height: 70px;
            font-size: 18px;
        }

        .header-right{
            float: right;
            padding: 0 20px;
            box-sizing: border-box;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content:space-around;

            & > div{
                margin: 0 10px;
            }
        }
    }
</style>