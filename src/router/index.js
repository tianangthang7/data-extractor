import { createRouter, createWebHashHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";
import { userService } from "@/service/UserService";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            component: AppLayout,
            children: [

                {
                    path: "/",
                    name: "dashboard",
                    component: () => import("@/views/Dashboard.vue"),
                },
            ],
        },
    ],
});

export default router;
