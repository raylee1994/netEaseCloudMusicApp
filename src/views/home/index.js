import React, { Component } from "react";
import {createAjax, countTrasnform, errorMessage} from "common/js/utils";
import {Button, Tooltip} from "antd";
import http from "apis/http";
import apisPaths from "apis/paths";
import Banner from "components/banner";
import Slider from "components/slider";
import styles from "./index.module";
import "./slider.less";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {Icon} from "antd"; 
import {switchAuthModal} from "store/user/action";

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bannerList: [],
            backgroundImageList: [],
            bannerBg: {},
            personalizedList: [],
            recommendList: [],
            albumList: [],
            toplist: [],
            artistList: [],
            login: false,
            signing: false,
            tooltipVisible: false,
            user: {}
        }
        this.sign = this.sign.bind(this)
        this.bannerChange = this.bannerChange.bind(this)
    }
    getBanner() {
        createAjax(http.get(apisPaths["banner"], {
            type: 0
        }), res => {
            var bannerList = []
            var backgroundImageList = []
            res.data.banners.forEach(element => {
                if(element.targetType == 10) {
                    bannerList.push({
                        img: element.imageUrl,
                        to: "/album?id="+element.targetId
                    })
                    backgroundImageList.push(element.imageUrl+"?imageView&blur=40x20")
                }
                if(element.targetType == 1) {
                    bannerList.push({
                        img: element.imageUrl,
                        to: "/song?id="+element.targetId
                    })
                    backgroundImageList.push(element.imageUrl+"?imageView&blur=40x20")
                }
            });
            this.setState({
                bannerList,
                backgroundImageList,
                bannerBg: {
                    backgroundImage: `url(${backgroundImageList[0]})`,
                    backgroundSize: "6000px",
                    backgroundPosition: "center center"
                }
            })
        })
    }
    getPersonalized() {
        createAjax(http.get("batch?/api/personalized/playlist={'limit':5}&/api/personalized/djprogram={'limit':3}"), res => {
            const list = [];
            res.data["/api/personalized/playlist"].result.forEach((item,index) => {
                list.push({
                    id: item.id,
                    type: "/playList",
                    picUrl: item.picUrl,
                    count: countTrasnform(item.playCount),
                    name: item.name
                })
            })
            res.data["/api/personalized/djprogram"].result.forEach((item,index) => {
                list.splice(3+2*index, 0, {
                    id: item.id,
                    type: "/dj",
                    picUrl: item.picUrl,
                    count: countTrasnform(item.program.listenerCount),
                    name: item.name
                })
            })
            this.setState({
                personalizedList: list
            })
        })
    }
    getRecommendList() {
        http.get(apisPaths["recommend/resource"]).then(res => {
            if(res.data.code == 200) {
                const list = [];
                for(let i = 0, item = res.data.recommend[i]; i < 3; i++) {
                    list.push({
                        id: item.id,
                        name: item.name,
                        copywriter: item.copywriter,
                        count: countTrasnform(item.playcount),
                        picUrl: item.picUrl
                    })
                }
                this.setState({
                    login: true,
                    recommendList: list
                })
            }
        })
    }
    getAlbumList() {
        http.get(apisPaths["album/newest"]).then(res => {
            const list = [];
            res.data.albums.slice(0,10).forEach((item, index) => {
                list.push({
                    id: item.id,
                    title: item.name,
                    name: item.artist.name,
                    picUrl: item.picUrl
                })
            })
            this.setState({
                albumList: list
            })
        })
    }
    getToplist() {
        let toplist1 = http.get(apisPaths["top/list"], {idx: 3}).then(res => {
            if(res.data.code == 200) {
                return Promise.resolve(res.data.playlist)
            }else {
                return Promise.reject(res.data.msg)
            }
        });
        let toplist2 = http.get(apisPaths["top/list"], {idx: 0}).then(res => {
            if(res.data.code == 200) {
                return Promise.resolve(res.data.playlist)
            }else {
                return Promise.reject(res.data.msg)
            }
        });
        let toplist3 = http.get(apisPaths["top/list"], {idx: 2}).then(res => {
            if(res.data.code == 200) {
                return Promise.resolve(res.data.playlist)
            }else {
                return Promise.reject(res.data.msg)
            }
        });
        Promise.all([toplist1, toplist2, toplist3]).then(res => {
            let list  = [];
            res.forEach((item, index) => {
                let tracks = []
                for(let i = 0; i < 10; i++) {
                    var track = item.tracks[i]
                    tracks.push({
                        id: track.id,
                        name: track.name
                    })
                }
                list.push({
                    name: item.name,
                    id: item.id,
                    coverImgUrl: item.coverImgUrl,
                    tracks
                })
            })
            this.setState({
                toplist: list
            })
        }).catch(err => {
            errorMessage(err)
        });
    }
    getUserDetail() {
        http.get(apisPaths["user/detail"], {uid: this.props.uid}).then(res => {
            if(res.data.code == 200) {
                this.setState({
                    user: {
                        sign: res.data.pcSign,
                        avatarUrl: res.data.profile.avatarUrl,
                        nickname: res.data.profile.nickname,
                        level: res.data.level,
                        eventCount: res.data.profile.eventCount,
                        follows: res.data.profile.follows,
                        followeds: res.data.profile.followeds
                    }
                })
            }
        })
    }
    sign() {
        this.setState({
            signing: true
        })
        http.get(apisPaths["daily_signin"], {type: 1}).then(res => {
            this.setState({
                signing: false,
                tooltipVisible: true
            })
            setTimeout(() => {
                this.setState({
                    tooltipVisible: false
                })
            }, 1000)
        }, err => {
            this.setState({
                signing: false
            })
        })
    }
    bannerChange(current) {
        this.setState({
            bannerBg: {
                backgroundImage: `url(${this.state.backgroundImageList[current]})`,
                backgroundSize: "6000px",
                backgroundPosition: "center center"
            }
        })
    }
    componentDidMount() {
        this.getBanner();
        this.getPersonalized();
        this.getRecommendList();
        this.getAlbumList();
        this.getToplist();
        if(this.props.login == 2) {
            this.getUserDetail()
        }
    }
    render() {
        const {playlistTag} = this.props;
        const tagList = playlistTag.map((item, index) => {
            if(index <= 4) {
                return (
                    <li key={item.id} className="fl">
                        <Link to={"/playList?cat="+item.name}>{item.name}</Link> 
                        {
                            index <= 3 && (
                                <React.Fragment>
                                    &nbsp;&nbsp;|&nbsp;&nbsp;
                                </React.Fragment>
                            )
                        }
                    </li>
                )
            }
        });
        const personalizedList = this.state.personalizedList.map((item, index) => {
            return (
                <li key={index} className="fl">
                    <Link to={item.type+"?id="+item.id}>
                        <div className={styles["cover"]}>
                            <img src={item.picUrl} />
                            <div className={styles["count"]}>
                                <span className="fl" style={{color: '#ccc'}}><Icon type="customer-service" style={{ fontSize: '12px', marginRight: "5px" }} />{item.count}</span>
                                <span className="fr" style={{color: '#ccc'}}><Icon type="play-circle" style={{ fontSize: '12px' }} /></span>
                            </div>
                        </div>
                        <div className={styles["name"]}>
                            {
                                item.type.indexOf("dj") > -1 && (
                                    <span className={styles["tag"]}>电台节目</span>
                                )
                            }
                            {item.name}
                        </div>
                    </Link>
                </li>
            )
        });
        const recommendList = this.state.recommendList.map((item, index) => {
            return (
                <li key={index+1}>
                    <Link to={"/playlist?id="+item.id}>
                        <div className={styles["cover"]}>
                            <img src={item.picUrl} />
                            <div className={styles["count"]}>
                                <span className="fl" style={{color: '#ccc'}}><Icon type="customer-service" style={{ fontSize: '12px' }} />{item.count}</span>
                                <span className="fr" style={{color: '#ccc'}}><Icon type="play-circle" style={{ fontSize: '12px' }} /></span>
                            </div>
                        </div>
                        <div className={styles["name"]}>{item.name}</div>
                        <div className={styles["desc"]}>{item.copywriter}</div>
                    </Link>
                </li>
            )
        });
        const toplist = this.state.toplist.map((item, index) => {
            const list = item.tracks.map((items, index) => {
                return (
                    <li key={index}>
                            <span className={styles["no"] + (index < 3 ? (" " + styles["no-top"]) : "")}>{index+1}</span>
                            <Link to={"/song?id="+items.id}><span className={styles["nm"]}>{items.name}</span>
                            </Link>
                            <span className={styles["oper"]}><Icon type="play-circle" style={{color: "#aaa", fontSize: "12px", marginRight: "5px"}} /><Icon type="plus" style={{color: "#aaa", fontSize: "12px", marginRight: "5px"}} /><Icon type="customer-service" style={{color: "#aaa", fontSize: "12px", marginRight: "5px"}} /></span>
                    </li>
                )
            });
            return (
                <div className={styles["toplist_item"] + " fl"} key={index}>
                    <div className={styles["top"]}>
                        <div className={styles["cver"] + " fl"}>
                            <Link to={"/toplist?id="+item.id}>
                                <img src={item.coverImgUrl} />
                            </Link>
                        </div>
                        <div className={styles["tit"] + " fl"}>
                            <Link to={"/toplist?id="+item.id}>
                                <p>{item.name}</p>
                            </Link>
                            <div className={styles["btn"]}>
                                <span><Icon type="play-circle" style={{color: "#aaa", fontSize: "18px"}} /></span>
                                <span><Icon type="file-add" style={{color: "#aaa", fontSize: "18px"}} /></span>
                            </div>
                        </div>
                    </div>
                    <ul className={styles["list"]}>
                        {list}
                    </ul>
                    <div className={styles["more"]}><Link to={"/toplist?id="+item.id}>查看全部&gt;</Link></div>
                </div>
            )
        });
        const col = 5;
        const times = new Array(Math.ceil(this.state.albumList.length / col)).fill(0);
        const slideList = times.map((item, index) => {
            return (
                <ul className="slider_item" key={index}>
                    {
                        this.state.albumList.slice(col*index, col*index+col).map((items, indexs) => {
                            return (
                                <li key={items.id}>
                                    <Link to={"/album?id="+items.id}>
                                        <div className="cover">
                                            <img src={items.picUrl} />
                                        </div>
                                        <p className="title">{items.title}</p>
                                        <p className="name">{items.name}</p>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            )
        });
        const days = new Date().getDay();
        let day;
        switch (days) {
            case 0: 
                day = "星期天"
                break;
            case 1: 
                day = "星期一"
                break;
            case 2: 
                day = "星期二"
                break;
            case 3: 
                day = "星期三"
                break;
            case 4: 
                day = "星期四"
                break;
            case 5: 
                day = "星期五"
                break;
            case 6: 
                day = "星期六"
                break;
        };
        const date = new Date().getDate();
        return (
            <React.Fragment>
                <div className={styles['banner']} style={this.state.bannerBg}>
                    <div className="main">
                        <Banner effect="fade" switchBtn={true} bannerList={this.state.bannerList} afterChange={this.bannerChange} />
                    </div>
                </div>
                <div className={styles["home_module"]}>
                    <div className={styles["home_module_main"] + " main clearfix"}>
                        <div className={styles["home_left"] + " fl"}>
                            <div className={styles["personalized_module"]}>
                                <div className={styles["home_module_title"] + " clearfix"}>
                                    <span className="font24 fl">热门推荐</span>
                                    <ul className={styles["taglist"] + " fl"}>
                                        {tagList}
                                    </ul>
                                    <Link to="/playList" className={styles["more"] + " fr"}>更多</Link>
                                </div>
                                <ul className={styles["home_module_list"] + " clearfix"}>
                                    {personalizedList}
                                </ul>
                            </div>
                            {
                                this.state.login && (
                                    <div className={styles["recommend_module"]}>
                                        <div className={styles["home_module_title"] + " clearfix"}>
                                            <span className="font24">个性化推荐</span>
                                        </div>
                                        <ul className={styles["home_module_list"] + " clearfix"}>
                                            <li key={0}>
                                                <Link to="">
                                                    <div className={styles["date"] + " " + styles["u-date"] + " " + styles["f-alpha"]}>
                                                        <span className={styles["head"]}>{day}</span>
                                                        <span className={styles["bd"]}>{date}</span>
                                                        <span className={styles["mask"]}></span>
                                                    </div>
                                                    <div className={styles["name"]}>每日歌曲推荐</div>
                                                    <div className={styles["desc"]}>根据你的口味生成，<br />每天6:00更新</div>
                                                </Link>
                                            </li>
                                            {recommendList}
                                        </ul>
                                    </div>
                                )
                            }
                            <div className={styles["album_module"]}>
                                <div className={styles["home_module_title"] + " clearfix"}>
                                    <span className="font24">新碟上架</span>
                                    <Link to="/album" className={styles["more"] + " fr"}>更多</Link>
                                </div>
                                <div className={styles["album_list"]}>
                                    <Slider>
                                        {slideList}
                                    </Slider>
                                </div>
                            </div>
                            <div className={styles["toplist_module"]}>
                                <div className={styles["home_module_title"] + " clearfix"}>
                                    <span className="font24">榜单</span>
                                    <Link to="/toplist" className={styles["more"] + " fr"}>更多</Link>
                                </div>
                                <div className={styles["toplist"] + " clearfix"}>
                                    {toplist}
                                </div>
                            </div>
                        </div>
                        <div className={styles["home_right"] + " fr"}>
                            {do{
                                if(this.props.login != 2) {
                                    <div className={styles["myinfo"] + " " + styles["myinfo1"]}>
                                        <p>登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
                                        <span onClick={this.props.switchAuthModal}>用户登录</span>
                                    </div>
                                }else {
                                    <div className={styles["myinfo"] + " " + styles["myinfo2"]}>
                                        <div className={styles["f-cb"]}>
                                            <Link to={"/user/home?id="+this.props.uid}>
                                                <img src={this.state.user.avatarUrl} />
                                            </Link>
                                        </div>
                                        <div className={styles["info"] + " clearfix"}>
                                            <h4 style={{"overflow": "hidden"}}>
                                                <Link to={"/user/home?id="+this.props.uid}>{this.state.user.nickname}</Link>
                                            </h4>
                                            <p><span className={styles["level"]}>Lv. {this.state.user.level}</span></p>
                                            <div className={styles["btnwrap"]}>
                                                <Tooltip title="+2积分" visible={this.state.tooltipVisible} placement="bottom">
                                                    <Button type="primary" loading={this.state.signing} disabled={this.state.user.sign} onClick={this.sign}>{this.state.user.sign ? "已 签 到" : "签 到"}</Button>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <ul className={styles["count"]}>
                                            <li key={0}><strong>{this.state.user.eventCount}</strong><span>动态</span></li>
                                            <li key={1}><strong>{this.state.user.follows}</strong><span>关注</span></li>
                                            <li key={2}><strong>{this.state.user.followeds}</strong><span>粉丝</span></li>
                                        </ul>
                                    </div>
                                }
                            }}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    playlistTag: state.playlist.playlistTag,
    uid: state.user.profile.userId,
    login: state.user.status
})
const mapDispatchToProps = dispatch => ({
    switchAuthModal: () => dispatch(switchAuthModal(true))
})

export default connect(mapStateToProps,mapDispatchToProps)(Home)