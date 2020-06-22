<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-table 
              height="400"
                :data="tabledetail.tabledata"
                style="width: 100%" ref="Tabledetail"
              >
                <el-table-column
                  v-for="col in tabledetail.tablepath"
                  :key="col.prop"
                  :prop="col.prop"
                  :label="col.label"
                ></el-table-column>
              </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        tabledetail:{
        id:0,
          tablepath:[],
          tabledata:[]
        }
      }
    },
    methods: {
      init (dataFormtow,id) {
        this.tabledetail.id = id;
        this.visible = true;
       // console.log(this.tabledetail);
        this.$nextTick(() => {
            this.$http({
              url: this.$http.adornUrl("/report/clasdetail"),
              method: 'post',
              data: this.$http.adornData({
                 date1: dataFormtow.date1,
                 deptid: dataFormtow.deptId,
                 id:this.tabledetail.id
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.tabledetail.tablepath=data.data.tablepath;
                this.tabledetail.tabledata=data.data.tabledata;
                //console.log(data);
              }
            })
             // console.log(dataFormtow);
         
        })
      }
    }
  }
</script>
