<template>
    <div class="tags">
        <ul>
            <li class="tags-li" v-for="(item,index) in tagsList" :key="index"
                :class="{ 'active': isActive(item.path)}">
                <router-link :to="item.path">{{ item.meta.title }}</router-link>
                <span class="tags-li-icon" @click="closeTags(index)">
                    <i class="el-icon-close"></i>
                </span>
            </li>
        </ul>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags"
                >
                <!-- <span>标签选项</span> -->
                <el-button type="primary" size="small">标签选项<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown" size="small">
                    <el-dropdown-item command="closeother">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="closeall">关闭全部</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
export default {
    computed:{
        ...mapState({
            visitedView:state=>state.visitedViews,
            tagsList:state=>state.tagsList,
            token:state=>state.token
        })
    },
    data(){
        return{
            tagList:[]
        }
    },
    methods:{
        ...mapMutations(['addTags','clearAll','clearOther']),
        isActive(path){
            return path === this.$route.fullPath;
        },
        setTags(route){
            const isExit=this.tagsList.some(item=>{
                return item.path === route.fullPath
            })

            if(!isExit){
                this.addTags(route)
            }
        },
        closeTags(index){
            const delItem=this.tagsList.splice(index,1)[0];
            const item=this.tagsList[index]?this.tagsList[index]:this.tagsList[index-1];
            if(item){
                delItem.path === this.$route.fullPath && this.$router.push(item.path)
            }else{
                this.$router.push('/dashboard')
            }
        },
        handleTags(command){
            if(command === 'closeother'){
                this.clearOther(this.$route);
            }else if(command === 'closeall'){
                this.clearAll();
                this.$router.push('/dashboard')
            }
        }
    },
    created(){
        this.setTags(this.$route)
    },
    watch:{
        $route(newVal){
            let Token=localStorage.getItem('token');
            if(!Token){
                this.$router.push('/login')
                this.$message('登录失效,请重新登录');
            }
            this.setTags(newVal)
        }
    }
}
</script>

<style lang="scss">
    .tags{
        background: #fff;
        box-sizing: border-box;
        box-shadow: 3px 5px 8px #e7e7e7;
        height: 40px;
        overflow: hidden;
        display: flex;
        align-items: center;
        z-index: 999;

        ul{
            box-sizing: border-box;
            width: 100%;
            height: 100%;

            .tags-li{
                height: 30px;
                line-height: 30px;
                display: inline-block;
                font-size: 12px;
                padding: 0px 5px;
                box-sizing: border-box;
                background: #fff;
                list-style: none;
                border-radius: 4px;
                margin: 5px 10px;
                border:1px solid #e9eaec;
                transition: all .3s ease-in;

                &:not(.active):hover {
                    background: #f8f8f8;
                }

                a{
                    color:#666666;
                }

                .tags-li-icon{
                    margin-left: 4px;
                    color: #ccc;
                }
                .tags-li-icon:hover{
                    background: rgb(247, 109, 109);
                    border-radius: 50%;
                }
                &.active{
                    background: #409eff;

                    a{
                        color: #fff;
                    }

                    .tags-li-icon{
                        color: #fff;
                    }
                }
            }
        }

        .tags-close-box{
            box-sizing: border-box;
            position: absolute;
            right: 0;
            top:0;
            padding-top: 1px;
            width: 110px;
            height: 30px;
            box-shadow: -3px 0 15px rgba(0, 0, 0,0.1);
            z-index: 10;
        }        
    }
</style>