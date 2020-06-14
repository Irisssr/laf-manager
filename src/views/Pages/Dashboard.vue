<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="10">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <div class="user-info-cont">
                            <div class="user-info-name" style="font-size:22px;">
                                管理员:{{ user.realName}}
                                <el-tag :type="log.online | typeFilter">{{ log.online | lineFilter}}</el-tag>
                            </div>
                            <div class="user-info-name" style="margin:10px 0 0;">账号：{{ user.admId}}</div>
                            <div class="user-info-name">手机号：{{ user.telephone }}</div>
                            <div class="user-info-name">邮箱：{{ user.email}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：{{ log.loginTime}}
                        <span></span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：{{ log.address}}
                        <span></span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>管理员成员</span>
                        <div v-for="(item,index) in adminList" :key="index">
                            <div class="admin-name">
                                {{ item.realName }}
                                <el-tag :type="item.status | statusType">{{ item.status | statusFilter}}</el-tag>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="14">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="10">
                        <el-card shadow="hover"
                            :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon">
                                    <i class="el-icon-user"></i>
                                </i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ dataList.admins}}</div>
                                    <div>管理员数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="10">
                        <el-card shadow="hover" :body-style="{padding: '0px'}"
                            >
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon">
                                    <i class="el-icon-bell"></i>
                                </i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{dataList.users}}</div>
                                    <div>小程序用户量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:550px;">
                    <div slot="header" class="clearfix">
                        <span>日历</span>
                        <el-calendar v-model="toDate"></el-calendar>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'dashboard',
    filters:{
        statusType(type){
            const typeMap={
                super:'',
                admin:'success',
                no:'info'
            }
            return typeMap[type];
        },
        statusFilter(status){
            const statusMap={
                admin:'管理员',
                super:'超级管理员',
                no:'禁止登录'
            }
            return statusMap[status];
        },
        lineFilter(online){
            const onlineMap={
                true:'在线',
                false:'离线'
            }
            return onlineMap[online]
        },
        typeFilter(online){
            const onlineMap={
                true:'success',
                false:'info'
            }
            return onlineMap[online]
        }
    },
    data() {
        return {
            user:{},
            log:{},
            dataList:{
                admins:null,
                users:null
            },
            todoList: [],
            adminList:[],
            toDate:new Date()
        };
    },
    methods: {
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        notify(){
            const h = this.$createElement;
             this.$notify({
                title: `管理员${this.user.realName}你好!`,
                message: h('i', { style: 'color: teal'}, 
                '欢迎登录西柚管理平台')
            });
        },
        getAdminList(){
            let that=this;
            that.$api.admins().then(res=>{
                that.adminList=res.data.admins;
                that.dataList.admins=res.data.count;
            })
        },
        getUser(){
            let that=this;
            that.$api.users().then(res=>{
                that.dataList.users=res.data.count;
            })
        }
    },
    created(){
        this.user=JSON.parse(localStorage.getItem('username'));
        this.log=JSON.parse(localStorage.getItem('log'));
        this.notify();
        this.getAdminList();
        this.getUser();
    }
};
</script>


<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.admin-name{
    margin:20px 0 10px;
    .el-tag{
        margin-left:40px;
    }
}

</style>
