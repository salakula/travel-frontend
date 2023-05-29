import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/trips",
      name: "trips",
      component: () => import("./views/TripList.vue"),
    },
    {
      path: "/trip/:id",
      name: "editTrip",
      props: true,
      component: () => import("./views/EditTrip.vue"),
    },
    {
      path: "/places",
      name: "places",
      component: () => import("./views/PlaceList.vue"),
    },
  ],
});

export default router;
