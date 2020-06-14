<template>
  <div>
      <transition name="loading">
          <Loading v-if="isLoad"></Loading>
      </transition>

      <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item>
                  <i class="el-icon-bank-card"></i>{{ this.$route.meta.title}}
              </el-breadcrumb-item>
          </el-breadcrumb>
      </div>

     <div class="container">
       <div class="handle-box">
         <!-- 搜索 -->
         <el-input clearable placeholder="学号" class="handle-input mr10" v-model="searchNum"></el-input>
         <span class="fontColor mr10">小程序类型</span>
         <el-select v-model="value" class="handle-input mr10">
            <el-option v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
         <el-button type="primary" icon="el-icon-search"
            size="big" 
            @click="handleSearch">搜索</el-button>
          <el-button type="danger"
            size="big"
            v-show="isCancle"
            @click="handleCancel">取消</el-button>
       </div>
        <div class="handle-box">
          <!-- 删除 -->
          <el-button type="primary" size="small"
              icon="el-icon-delete"
              class="handle-del mr10"
              @click="deleteSelection">
            批量删除
          </el-button>
          <el-button type="success" size="small"
              icon="el-icon-document"
              class="handle-del mr10"
              :loading="downloadLoading"
              @click="handleDownload">
            导出Excel
          </el-button>
        </div>
        <!-- 表格 -->
         <el-table
            height="350"
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="用户id" width="65" prop="id" align="center"></el-table-column>
            <el-table-column label="学号" prop="stuNum" align="center"></el-table-column>
            <el-table-column label="昵称" prop="userName" align="center"></el-table-column>
            <el-table-column label="头像" align="center">
              <template slot-scope="{row}">
                  <el-image :src="row.userHead"
                    fit="cover"
                    style="width:50px;height:50px;"></el-image>      
              </template>
            </el-table-column>
            <el-table-column label="小程序类型" align="center">
              <template slot-scope="{row}">
                <el-tag :type="row.userApp | typeFilter">{{row.userApp | appFilter}}</el-tag>           
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
        <!-- 底部导航页 -->
        <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="query.pageIndex"
              :page-sizes="[10,50, 100]"
              :page-size="query.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="query.totalMsg">
            </el-pagination>
        </div>
     </div>

      <!-- 编辑用户信息 -->
     <el-dialog :title="title" :visible.sync="dialogFormVisible"
        @close="closeDialog">
          <el-form v-model="oneData">
              <el-form-item label="用户id" :label-width="formLabelWidth">
                  {{oneData.id}}
              </el-form-item>
              <el-form-item label="学号" :label-width="formLabelWidth">
                  <el-input v-model="oneData.stuNum" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="昵称" :label-width="formLabelWidth">
                  <el-input v-model="oneData.userName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="头像" :label-width="formLabelWidth">
                    <el-image :src="oneData.userHead"
                      fit="cover"
                      style="width:50px;height:50px;">
                    </el-image>      
              </el-form-item>
              <el-form-item label="小程序类型" :label-width="formLabelWidth">
                  <el-select v-model="oneData.userApp" placeholder="状态">
                      <el-option label="QQ" value="qq"></el-option>
                      <el-option label="微信" value="wx"></el-option>
                  </el-select>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button  @click="dialogFormVisible=false">取 消</el-button>
              <el-button type="primary"  @click="editSuccess">确认修改</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'

  export default {
    filters:{
      appFilter(app){
        const appMap={
            wx:'微信',
            qq:'QQ'
        }
        return appMap[app];
      },
      typeFilter(status){
        const typeMap={
          wx:'success',
          qq:''
        }
        return typeMap[status];
      },
    },
    components:{
      Loading
    },
    data() {
      return {
        isLoad:true,
        value:'',
        isCancle:false,
        searchNum:'',
        options:[
          { label:'不限',value:''},
          { label:'QQ',value:'qq'},
          { label:'微信',value:'wx'}
        ],
        query:{
          pageIndex:1,
          pageSize:10,
          totalMsg:null
        },
        tableData:[],
        formLabelWidth:'120px',
        downloadLoading:false,
        multipleSelection:[],
        dialogFormVisible:false,
        oneData:{},
        title:'小程序用户编辑',
        list:[]
      }
    },
    methods: {
      //获取信息
      getUser(){
        let that=this;
        that.$api.users({
          app:that.value,
          page:that.query.pageIndex,
          limit:that.query.pageSize
        }).then(res=>{
          that.query.totalMsg=res.data.count;
          that.tableData=res.data.users;
          that.isLoad=false;
        })
      },
      //编辑
      closeDialog(){
        this.getUser();
      },
      handleEdit(index,row) {
        this.oneData=row;
        this.dialogFormVisible=true;
      },
      editSuccess(){
        let that=this, oneData=this.oneData;
        this.$api.updateuser({
            id:oneData.id,
            stuNum:oneData.stuNum,
            userApp:oneData.userApp,
            userHead:oneData.userHead,
            userName:oneData.userName
          }).then(res=>{
              if(res.code ===100){
                that.$message(res.message);
                this.dialogFormVisible=false;
              }
          })
        },
        //单项删除
        handleDelete(info) {
          let that = this;
          this.$confirm('确定要删除吗?','提示',{
            type:'warning'
          }).then(()=>{
            that.$api.deluser({
              ids:info.id
            }).then(res=>{
              if(res.code === 100){
                that.$message(res.message);
                that.getUser();
              }
            })
          }).catch(()=>{})
        },
        //多项删除
        handleSelectionChange(val){
          this.multipleSelection=val;
        },
        deleteSelection(){
            if(this.multipleSelection.length === 0) return this.$message('至少选择一项');
            let that=this,str='';
            that.multipleSelection.forEach(item=>{
                str=str+item.id+',';
            })
            this.$confirm('确定要删除吗?','提示',{
              type:'warning'
            }).then(()=>{
                that.$api.deluser({
                    ids:str
                }).then(res=>{
                    if(res.code === 100){
                        that.$message(res.message);
                    }
                    that.getUser();
                })
            }).catch(()=>{})
        },
        //搜索
        handleSearch(){
            let that=this;
            this.isCancle=true;
            that.$api.users({
                app:that.value,
                stuNum:that.searchNum
            }).then(res=>{
              that.query.totalMsg=res.data.count;
              that.tableData=res.data.users;
            })
        },
        handleCancel(){
          this.value='';
          this.getUser();
          this.isCancle=false;
        },
        //底部跳转页数
        handleSizeChange(val){
          this.query.pageSize=val;
        },
        handleCurrentChange(val){
          let that=this;
          this.query.pageIndex=val;
          that.$api.users({
            app:that.value,
            page:that.query.pageIndex,
            limit:that.query.pageSize
          }).then(res=>{
            that.tableData=res.data.users;
          })
        },
        //打印
        handleDownload() {
          this.downloadLoading=true;
          let that=this;
          if(this.multipleSelection.length === 0){
              that.list =that.tableData;
          }else{
              that.list = that.multipleSelection;
          }
          require.ensure([],()=>{
            const { export_json_to_excel } =require("@/excel/Export2Excel");
            const tHeader=['学号','昵称','小程序类型'];
            const filterVal =["stuNum","userName","userApp"];
            const data=this.formatJson(filterVal,that.list);
            export_json_to_excel(tHeader,data,"小程序注册用户");
            this.downloadLoading=false;
          })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v=>filterVal.map(j=>{
            return v[j];
          }))
        }
    },
    created(){
      this.getUser();
    }
  }
</script>
