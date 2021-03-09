<template>
  <main>
    <Header/>
    <Content class="mb-14"/>
    <Footer/>
  </main>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Content from './components/Content.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Content
  }
}
</script>

