const AsyncRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: 'Dashboard',
        redirect: '/dashboard/index',
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: 'index',
                name: 'index',
                component: 'HomePage'
            },
            {
                path: 'admin_list',
                name: 'adminlist',
                component: 'AdminList',
                meta: {
                    role: ['admin']
                }
            },
            {
                path: 'all_users',
                name: 'allusers',
                component: 'AllUsers',
                meta: {
                    role: ['admin']
                }
            },
            {
                path: 'create_read_article',
                name: 'createreadarticle',
                component: 'ReadArticle'
            },
            {
                path: 'create_music_article',
                name: 'createmusicarticle',
                component: 'MusicArticle'
            },
            {
                path: 'create_film_article',
                name: 'createfilmarticle',
                component: 'FilmArticle'
            },
            {
                path: 'create_broadcast_article',
                name: 'createbroadcastarticle',
                component: 'BroadcastArticle'
            },
            {
                path: /[read|music|film|broadcast]_article_list/,
                name: 'articlelist',
                component: 'ArticleLists'
            }
        ]
    },
    {
        path: '*',
        redirect: '/404',
        meta: {}
    }
];

function hasPermission(role, route) {
    if (
        route.meta == null ||
        route.meta.role == null ||
        (route.meta && route.meta.role.indexOf(role) > -1)
    ) {
        return true;
    }
    return false;
}

const recursion = (asyncRoutesMap) => {
    const result = [];
    if (Array.isArray(asyncRoutesMap))
        asyncRoutesMap.forEach((v) => {
            if (hasPermission('author', v)) {
                if (v.children && v.children.length > 0) {
                    v.children = recursion(v.children);
                }
                result.push(v);
            }
        });
    return result;
};

console.log(recursion(AsyncRoutes));
