<template>
    <div class="test">
        <div>{{num}}</div>
        <button @click="addFn">+</button>
        <button @click="ajaxFn">ajax</button>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';

    export default {
        name: 'Test',
        data(){
            return {
            }
        },
        computed: {
            ...mapState({
                items: ({ test: { items } }) => items,
                num: ({ test: { num } }) => num,
            })
        },
        created() {
            console.log('items***', this.items);
            console.log('checkoutStatus***', this.num);
        },
        methods: {
            ...mapActions('test', ['incrementA', 'testAjaxA']),
            addFn() {
                this.incrementA({num: 5})
            },
            ajaxFn() {
                this.testAjaxA({params: {start: 1, count: 10}})
            }
        }
    }
</script>

<style lang="stylus">
.test
    font-size 18px

</style>
