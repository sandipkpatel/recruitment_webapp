<template>
  <v-app>
    <v-main>
         <v-container  fluid fill-height>
            <router-view/>
         </v-container>
    </v-main>      
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      
    }
  }
}
</script>
