<template>
<div>
<Nav />
    <div style="margin-left:10%;width:80%;padding-top:10%">
      <div v-html="readme">
      </div>
    </div>
</div>
</template>
<script>
import readme from '../About/aboutus.md'
import Nav from '../../components/nav/Nav'
import Footer from '../../components/nav/Footer'


export default {
data(){
   return {
     readme:this.md2html(readme)
   }
 },
 components:{
    Nav,Footer
  },
}
</script>