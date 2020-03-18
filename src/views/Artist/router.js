export default [
    {
        path: "/artist/song",
        component: "artist/song",
        name: "热门作品",
        exact: false,
        activeClassName: "selected"
    },
    {
        path: "/artist/album",
        component: "artist/album",
        name: "所有专辑",
        exact: false,
        activeClassName: "selected"
    },
    {
        path: "/artist/mv",
        component: "artist/mv",
        name: "相关MV",
        exact: false,
        activeClassName: "selected"
    },
    {
        path: "/artist/introduction",
        component: "artist/introduction",
        name: "艺人介绍",
        exact: false,
        activeClassName: "selected"
    }
]