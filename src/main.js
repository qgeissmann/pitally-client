import Vue from "vue";
import App from "./App.vue";
import router from "./routes";
import store from "./store";
import FormItem from "./components/ui/FormItem";
import "vuetify/dist/vuetify.min.css"; // Ensure you are using css-loader
import Vuetify from "vuetify";
Vue.use(Vuetify);

Vue.config.productionTip = false;
Vue.component("FormItem", FormItem);

Vue.use(_Vue => {
  _Vue.prototype.$store = store;
});
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
