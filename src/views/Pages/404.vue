<template>
    <div class="error-page">
        <div class="error-code">
            404   
        </div>
        <div class="error-desc">你访问的页面不存在~</div>
        <div class="error-handle">
            <router-link to="/">
                <el-button type="primary" size="large" @click="toDash">返回首页</el-button>
            </router-link>
            <el-button class="error-btn" type="primary" size="large" @click="toPrev">返回上一页</el-button>
        </div>
    </div>
</template>

<script>
export default {
    methods:{
        toDash(){
            this.$roter.push('/')
        },
        toPrev(){
            this.$router.go(-1);
        }
    }    
}
</script>

<style lang="scss">
    .error-page{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 100vw;
        height: 100vh;
        background-image: linear-gradient(125deg,#2c3e50,#27ae60,#2980b9,#e74c3c,#8e44ad);
        background-size: 400%;
        animation: bgmove 20s infinite;

        .error-code{
            color: #fff;
            opacity: 0.8;
            font-size: 250px;
            font-weight: bolder;
        }

        .error-desc{
            font-size: 30px;
            color: #fff;
        }

        .error-handle{
            margin-top: 30px;
            padding-bottom: 200px;

            .error-btn{
                margin-left: 100px;
            }
        }
    }

    @keyframes bgmove{
        0%,100%{
            background-position: 0% 50%;
        }
        50%{
            background-position: 100% 50%;
        }
    }
</style>