<template>
    <div class="preview">
        <div class="preview-box">
            <img :src="preImg" />
        </div>
    </div>
</template>

<script>
    export default{
        props:{
            preImg:{
                type:String
            }
        },
        created(){
            console.log(this.preImg);
        }
    }
</script>

<style lang="scss" scoped>
    .preview{
        position:absolute;
        top:0;
        left:0;
        width:100vw;
        height:100vh;
        background: rgba(30, 30, 30,0.9);
        opacity:0.6;
        z-index: 99;

        .preview-box{
            width: 500px;
            height:600px;
            position:absolute;
            top:20px;
            left:200px;
            z-index:9999;
            background:#fff;

            img{
                width:100%;
                height:100%;
            }
        }
    }
</style>