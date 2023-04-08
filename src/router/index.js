import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
    // push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
        if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
        return originalPush.call(this, location).catch(err => err)
    }
    // replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
    return originalReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)


const router = new VueRouter({
    routes: [{
            path: "/home",
            name: "Home",
            component: Home,
            meta: {
                keepAlive: true, //此组件需要缓存
            },
        },
        {
            path: "/",
            redirect: '/home'
        },
        {
            path: "/list",
            name: "List",
            component: () =>
                import ("../views/List.vue"),
        },
        {
            path: "/cart",
            name: "Cart",
            component: () =>
                import ("../views/Cart.vue"),
        },
        {
            path: "/my",
            name: "My",
            component: () =>
                import ("../views/My.vue"),
        },
        {
            path: "/search",
            name: "Search",
            children: [{
                    path: "/",
                    name: "index",
                    component: () =>
                        import ("../views/search/SearchIndex.vue")
                },
                {
                    path: "list",
                    name: "list",
                    component: () =>
                        import ("../views/search/SearchList.vue")
                }
            ],
            component: () =>
                import ("../views/Search.vue"),
        },
        {
            path: "/detail",
            name: "Detail",
            meta: {
                keepAlive: true, //此组件需要缓存
            },
            component: () =>
                import ("../views/Detail.vue"),
        },
        {
            path: "/login",
            name: "Login",
            component: () =>
                import ("../views/login/Login.vue"),
        },
        {
            path: "/userLogin",
            name: "UserLogin",
            component: () =>
                import ("../views/login/UserLogin.vue"),
        },
        {
            path: "/register",
            name: "Register",
            component: () =>
                import ("../views/login/Register.vue"),
        },
        {
            path: "/recovery",
            name: "Recovery",
            children: [{
                    path: "/",
                    name: "index",
                    component: () =>
                        import ("../views/recovery/RecoveryIndex.vue")
                },
                {
                    path: "btn",
                    name: "btn",
                    component: () =>
                        import ("../views/recovery/RecoveryBtn.vue")
                }
            ],
            component: () =>
                import ("../views/recovery/Recovery.vue"),
        },
        {
            path: "/path",
            name: "Path",
            children: [{
                    path: "/",
                    name: "path-index",
                    component: () =>
                        import ("../views/path/PathIndex.vue"),
                },
                {
                    path: "path-list",
                    name: "path-list",
                    component: () =>
                        import ("../views/path/PathList.vue"),
                }
            ],
            component: () =>
                import ("../views/Path.vue"),
        },
        {
            path: "/order",
            name: "Order",
            meta: {
                keepAlive: true
            },
            component: () =>
                import ("../views/Order.vue"),
        },
        {
            path: "/payment",
            name: "Payment",
            component: () =>
                import ("../views/Payment.vue"),
        },
    ]
})

router.beforeEach((to, from, next) => {
    let nextRoute = ['Payment', 'Cart', 'Path', 'Order', 'path-index', 'path-list'];
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (nextRoute.indexOf(to.name) >= 0) {
        if (!userInfo) {
            router.push('/login');
        }
    }
    next();
})


export default router