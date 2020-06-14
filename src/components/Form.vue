<template>
    <div class="loginForm">
        <h2>{{ title }}</h2>
        <input type="text" v-model="desc.str" placeholder="desc.name" />
        <button>{{ btnText }}</button>
        <div class="login-text">
            <span @click="toMove">{{ spanText }}</span>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        title:{
            type:String
        },
        desc:{
            type:Object
        },
        btnText:{
            type:String
        },
        spanText:{
            type:String
        }
    }
}
</script>