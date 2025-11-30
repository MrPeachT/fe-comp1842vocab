import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';

import Words from './views/Words.vue';
import New from './views/New.vue';
import Edit from './views/Edit.vue';
import Show from './views/Show.vue';
import Test from './views/Test.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/words'
    },
    {
      path: '/words',
      name: 'words',
      component: Words
    },
    {
      path: '/words/new',
      name: 'new',
      component: New,
      meta: { requiresAuth: true }
    },
    {
      path: '/words/:id',
      name: 'show',
      component: Show
    },
    {
      path: '/words/:id/edit',
      name: 'edit',
      component: Edit,
      meta: { requiresAuth: true }
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  if (!to.matched.some(record => record.meta.requiresAuth)) {
    return next();
  }

  try {
    const res = await axios.get('http://localhost:3000/auth/me', {
      withCredentials: true
    });

    if (res.data) {
      return next();
    }
  } catch (err) {
    console.error('Guard: not logged in or /auth/me failed', err);
  }

  next('/login');
});

export default router;