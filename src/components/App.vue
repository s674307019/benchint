<template>
  <div class="app">
    <router-view/>
  </div>
</template>

<script>
    export default {
        name: 'App',
        data(){
            return {
                tabShow: false
            }
        },
        created(){
        },
        computed: {
        },
        watch: {
        },
        methods: {
        }
    }
</script>

<style lang="stylus">
  .app
    padding-bottom 1.307rem
    font-size 0
    .noData
      padding .4rem 0
      text-shadow #FFF 0 .0267rem 0
      color #808080
      font-size .4rem
      text-align center
      width 100%

</style>
