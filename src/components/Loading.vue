<template>
    <div class="loading">
        <div class="load-circle">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>    
        </div>    
    </div>
</template>

<script>
export default {
    name:'Loaging'
}
</script>

<style lang="scss">
    .loading{
        position: fixed;
        left: 0;
        top:0;
        background: #000;
        opacity: 0.5;
        width: 100vw;
        height: 100vh;
        z-index: 999;
        display:flex;
        justify-content:center;
        align-content:center;
        
        .load-circle{
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            display:flex;
        }

        .load-circle>div{
            width:10px;
            height:80px;
            background: rgb(0, 120, 215);
            display:inline-block;
            margin:0 8px;
            transform:translate(-50%,-50%);
            animation:move 1.2s infinite ease;
        }
        .load-circle>div:nth-child(1){
            animation-delay: -1.0s;
        }
        .load-circle>div:nth-child(2){
            animation-delay: -1.1s;
        }
        .load-circle>div:nth-child(3){
            animation-delay: -1.2s;
        }
        .load-circle>div:nth-child(4){
            animation-delay: -1.3s;
        }
        .load-circle>div:nth-child(5){
            animation-delay: -1.4s;
        }
    }

    @keyframes move{
        0%,40%,100%{
            transform:scaleY(0.4);
        }
        20%{
            transform:scaleY(1);
        }
    }
</style>