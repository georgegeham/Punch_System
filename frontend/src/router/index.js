import MyLayout from "../components/Layout.vue";
import MyStart from "../components/Start.vue";
import HrDashboard from "../components/Hr/HrDashboard.vue";
import HrForm from "../components/Hr/HrForm.vue";
import RegisterPage from "../components/Register/Register.vue";
import EmployeeForm from "../components/Employee/EmployeeForm.vue";
import EmployeeLayout from "../components/Employee/EmployeeLayout.vue";
import MyLogin from "../components/Login/Login.vue";
import EmployeeRegister from "@/components/Employee/EmployeeRegister.vue";
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [
  { path: "/", name: "Start", component: MyStart },
  {
    path: "/login",
    name: "Login",
    component: MyLogin,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/Hr",
    name: "HR",
    meta: {
      requiresAuth: true,
      role: "hr",
    },
    component: MyLayout,
    children: [
      {
        path: "Dashboard",
        name: "HR Dashboard",
        component: HrDashboard,
        meta: {
          requiresAuth: true,
          role: "hr",
        },
      },
      {
        path: "Form",
        name: "HR Form",
        component: HrForm,
        meta: {
          requiresAuth: true,
          role: "hr",
        },
      },
    ],
  },
  {
    path: "/Employee",
    name: "Employee",
    component: EmployeeLayout,
    children: [
      {
        path: "register",
        name: "Employee Register",
        component: EmployeeRegister,
      },
      {
        path: "Form",
        name: "Employee Form",
        component: EmployeeForm,
        meta: {
          requiresAuth: true,
          role: "employee",
        },
      },
    ],
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));

  if (to.meta.requiresAuth && !token) {
    next({ name: "Login" });
    return;
  }

  if (to.meta.role) {
    if (!role) {
      next({ name: "Login" });
      return;
    }
    if (to.meta.role !== role) {
      if (role === "hr") {
        next({ name: "HR Dashboard" });
      } else if (role === "employee") {
        next({ name: "Employee Form" });
      } else {
        next({ name: "Login" });
      }
      return;
    }
  }

  next();
});
export default router;
