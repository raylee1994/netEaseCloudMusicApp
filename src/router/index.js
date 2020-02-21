export default [
    {
        path: "/",
        component: "home",
        name: "推荐",
        exact: true,
        activiClassName: "selected"
    },
    {
        path: "/toplist",
        component: "toplist",
        name: "排行榜",
        exact: false,
        activiClassName: "selected"
    },
    {
        path: "/playlist",
        component: "playlist",
        name: "歌单",
        exact: false,
        activiClassName: "selected"
    },
    {
        path: "/djradio",
        component: "djradio",
        name: "主播电台",
        exact: false,
        activiClassName: "selected"
    },
    {
        path: "/artist",
        component: "artist",
        name: "歌手",
        exact: false,
        activiClassName: "selected"
    },
    {
        path: "/album",
        component: "album",
        name: "新碟上架",
        exact: false,
        activiClassName: "selected"
    }
]