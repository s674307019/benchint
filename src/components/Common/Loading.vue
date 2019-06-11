<template>
    <div class="loading" v-if="loadingShow" @touchmove.prevent>
        <div class="loadingImg"><img src="~loading.gif" alt=""></div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: 'Loading',
        computed: {
            ...mapState(['loadingShow'])
        }
    }
</script>

<style lang="stylus" scoped>
    .loading
        position fixed
        top 0
        left 0
        z-index 1000
        background-color rgba(0,0,0,.2)
        width 100%
        height 100%
        .loadingImg
            position absolute
            top 42%
            left 50%
            margin-left -1.333rem
            img
                width 2.667rem

</style>
