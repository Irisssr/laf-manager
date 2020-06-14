<template>
    <div class="login">
        <transition name="logmove">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>

</script>

<style lang="scss">
    /* 登录内容切换动画 */
    .logmove-enter,
    .logmove-leave-to{
        opacity: 0;
        position: absolute;
    }

    .logmove-enter-active,
    .logmove-leave-active{
        transition: all 0.5s ease-in-out;
    }
    .login{
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url('../../../assets/bg.jpg') fixed no-repeat;
        background-size: cover;
    }
    .logForm{
        width: 400px;
        display: flex;
        flex-direction: column;
        padding: 40px;
        position: relative;
        z-index: 100;
        background: inherit;
        overflow: hidden;
        border-radius: 10px;

        h2{
            text-align:center;
            font-size: 20px;
            font-weight: 400;
            color:#3d5245;
            margin-bottom: 20px;
        }

        .el-form-item{
            .el-input{
                border:none;
                border-radius: 5px;
            }
            .telP{
                display:flex;
                align-items: center;
                justify-content: space-between;
                button{
                    margin:0 5px;
                }
            }
            label{
                color:#333;
            }
        }

    }
    .logForm::before{
        content:"";
        width: calc(100% + 10px);
        height: calc(100% + 10px);
        background: inherit;
        box-shadow: inset 0 0 0 200px rgba(255,255,255,0.25);
        position: absolute;
        top:-10px;
        left:-10px;
        z-index: -1;
        filter: blur(2px);
        overflow: hidden;
    }
</style>