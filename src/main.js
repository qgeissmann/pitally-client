import Vue from "vue";
import App from "./App.vue";
import router from "./routes";
import FormItem from "./components/ui/FormItem";

Vue.config.productionTip = false;
Vue.component("FormItem", FormItem);
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
