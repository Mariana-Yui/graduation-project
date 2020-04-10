<template>
    <el-scrollbar :native="false" :noresize="true" class="admin-list-scrollbar">
        <div class="admin-list-wrapper">
            <el-row class="search-input-suffix">
                <el-col :span="1">搜索:</el-col>
                <el-col :span="4">
                    <el-input
                        placeholder="请输入用户名"
                        prefix-icon="el-icon-search"
                        v-model="input2"
                    >
                    </el-input>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary">新增</el-button>
                </el-col>
            </el-row>
            <el-row class="admin-table">
                <el-col :span="24">
                    <el-table :data="tableData" border style="width: 100%">
                        <el-table-column prop="date" label="日期" width="180"> </el-table-column>
                        <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
                        <el-table-column prop="address" label="地址"> </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
    </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AdminUser extends Vue {
    private tableData = [
        {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
        },
        {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
        },
        {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        },
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        }
    ];
}
</script>
<style lang="scss" scoped>
.admin-list-scrollbar {
    .admin-list-wrapper {
        overflow: hidden;
        .search-input-suffix {
            display: flex;
            align-items: center;
        }
    }
    ::v-deep .el-scrollbar__wrap {
        overflow-x: hidden;
        overflow-y: scroll;
    }
}
</style>
