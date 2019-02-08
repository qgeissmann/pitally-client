import Vue from "vue";
import Router from "vue-router";
import IndexRoute from "@/components/routes/IndexRoute";
import PhotoRoute from "@/components/routes/PhotoRoute";
import VideoRoute from "@/components/routes/VideoRoute";
import Manage from "@/components/routes/Manage";

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
    },
    {
      path: "/video",
      name: "video",
      component: VideoRoute
    },
    {
      path: "/manage",
      name: "manage",
      component: Manage
    }
  ]
});
