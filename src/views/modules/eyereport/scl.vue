<template>
  <el-tabs type="border-card">
  <el-tab-pane label="2018级">
    <el-carousel indicator-position="outside" height="500px">
    <el-carousel-item v-for="item in carouselData" :key="item.id" >
      <center><img :src="item.src" height="400px"/>
      <div><h1>班级：{{item.classname}}</h1><h1>姓名：{{item.name}}</h1></div></center>
    </el-carousel-item>
  </el-carousel>
  </el-tab-pane>
  <el-tab-pane label="2017级">
<el-carousel indicator-position="outside" height="500px">
    <el-carousel-item v-for="item in carouselData2" :key="item.id">
     <center><img :src="item.src" height="400px"/>
      <div><h1>班级：{{item.classname}}</h1><h1>姓名：{{item.name}}</h1></div></center>
    </el-carousel-item>
  </el-carousel>
    
  </el-tab-pane>
</el-tabs>
</template>


<script>
export default {
  data() {
    return {
      carouselData: [
         { src: require ('@/assets/img/1.jpg'),
           id:1,
           name:"李明",
           classname:"一班" },
           { src: require ('@/assets/img/2.jpg'),
           id:2,
           name:"赵国",
           classname:"二班" },
           { src: require ('@/assets/img/3.jpg'),
           id:3,
           name:"李华",
           classname:"三班" },
           { src: require ('@/assets/img/4.jpg'),
           id:4,
           name:"马超",
           classname:"二班" },
           { src: require ('@/assets/img/5.jpg'),
           id:5,
           name:"赵明",
           classname:"三班" },
           { src: require ('@/assets/img/6.jpg'),
           id:6,
           name:"赵华",
           classname:"五班" }
      ],
      carouselData2:[
         { src: require ('@/assets/img/7.jpg'),
           id:1,
           name:"李明",
           classname:"一班" },
           { src: require ('@/assets/img/8.jpg'),
           id:2,
           name:"赵国",
           classname:"二班"  },
           { src: require ('@/assets/img/9.jpg'),
           id:3,
           name:"李华",
           classname:"三班"  },
           { src: require ('@/assets/img/10.jpg'),
           id:4,
           name:"马超",
           classname:"二班"  },
           { src: require ('@/assets/img/11.jpg'),
           id:5,
           name:"赵明",
           classname:"三班" },
           { src: require ('@/assets/img/12.jpg'),
           id:6,
           name:"赵华",
           classname:"五班" }
      ]
    };
  }
};
</script>
