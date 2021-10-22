import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import Map from '../views/map/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Map',
    component: Map
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
