<template>
  <div class="drawer">
      <div class="drawer-avatar">
          <img src="../assets/move.png" />
      </div>
      <div class="drawer-title">
          <h4>西柚小程序管理平台</h4>
          <p>
              西柚失物招领小程序(微信、QQ)的管理平台,方便管理员对小程序进行可视化管理。
          </p>
      </div>
      <div class="drawer-erCode">
          <h4>西柚微信小程序体验版二维码</h4>
          <div class="ercode">
            <img src="../assets/ercode.jpg" />
          </div>
      </div>
      <div class="drawer-admin">
          <h4>项目成员</h4>
          <ul>
              <li>龚涛</li>
              <li>陈瑶</li>
              <li>邓雯</li>
              <li>何双宝</li>
         </ul>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    .drawer{
        width:100%;
        height:100%;
        z-index:99;
        display:flex;
        flex-direction:column;
        // justify-content:center;
        align-items:center;

        &>div{
            margin:5px 0 10px;
        }

        .drawer-avatar{
            width:100px;
            height:100px;
            img{
                width:100%;
                height:100%;
            }
        }
        .drawer-title,
        .drawer-erCode,
        .drawer-admin{
            h4{
                text-align:center;
                margin: 0 0 20px;
            }
        }
        .drawer-title{
            p{
                font-size: 14px;
                text-indent: 2em;
                padding: 0 16px;
                line-height:25px;
                box-sizing:border-box;
            }
        }
        .drawer-admin{
            ul,li{
                list-style:none;
            }
            li{
                margin:10px 0;
            }
        }
        .drawer-erCode{
            display:flex;
            flex-direction:column;
            align-items:center;

            .ercode{
                width:120px;
                height:120px;
                img{
                    width:100%;
                    height:100%;
                }
            }
        }
    }
</style>