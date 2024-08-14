import  { createRouter, createWebHistory} from 'vue-router';

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: '/', component: () => import("@/components/main.vue")},
    ]
});

