import Vue from "vue";
import Router from "vue-router";
import IndexRoute from "@/components/routes/IndexRoute";
import PhotoRoute from "@/components/routes/PhotoRoute";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "",
      name: "index",
      component: IndexRoute,
    },
    {
      path: "/photo",
      name: "photo",
      component: PhotoRoute
    }
  ]
});
