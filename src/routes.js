import Vue from "vue";
import Router from "vue-router";
import IndexRoute from "@/components/routes/IndexRoute";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "",
      name: "index",
      component: IndexRoute
    }
  ]
});
