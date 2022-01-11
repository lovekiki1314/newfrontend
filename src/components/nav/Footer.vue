<template>
  <div>
    <a-layout-footer id="footer">
      Designed by 
      <img src="../../assets/logo_48.png" alt="logo">
    </a-layout-footer>
    <a-back-top />
    <strong style="color: rgba(64, 64, 64, 0.6)"></strong>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
#footer {
  width: 150;
  text-align: center;
  height: 150;
}
#footer:before{
  content: "\00a9";
}
</style>