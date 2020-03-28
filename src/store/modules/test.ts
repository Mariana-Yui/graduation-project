import { VuexModule, Module } from 'vuex-module-decorators'

@Module({
    namespaced: true,
    name: 'test'
})
export default class Test extends VuexModule {
    token = ''
}
