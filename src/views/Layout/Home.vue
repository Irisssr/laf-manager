<template>
  <div class="wrapper">
    <v-header></v-header>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move">
          <keep-alive>
              <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import vHeader from './Header' 
import vSidebar from './Sidebar'
import vTags from './Tags'

export default {
  name: 'wrapper',
  components: {
    vHeader,
    vSidebar,
    vTags
  },
  computed:{
    ...mapState({
      collapse:state=>state.collapse
    })
  }
}
</script>
