import React, { Component } from "react";
import {createAjax, countTrasnform} from "common/js/utils";
import http from "apis/http";
import apisPaths from "apis/paths";
import Banner from "components/banner";
import styles from "./index.module";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {Icon} from "antd"; 

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bannerList: [],
            personalizedList: [],
            recommendList: [],
            albumList: [],
            login: false
        }
    }
    getBanner() {
        createAjax(http.get(apisPaths["banner"], {
            type: 0
        }), res => {
            var bannerList = []
            res.banners.forEach(element => {
                if(element.targetType == 10) {
                    bannerList.push({
                        img: element.imageUrl,
                        to: "/album?id="+element.targetId
                    })
                }
                if(element.targetType == 1) {
                    bannerList.push({
                        img: element.imageUrl,
                        to: "/song?id="+element.targetId
                    })
                }
            });
            this.setState({
                bannerList
            })
        })
    }
    getPersonalized() {
        createAjax(http.get("batch?/api/personalized/playlist={'limit':5}&/api/personalized/djprogram={'limit':3}",{}), res => {
            const list = [];
            res["/api/personalized/playlist"].result.forEach((item,index) => {
                list.push({
                    id: item.id,
                    type: "/playList",
                    picUrl: item.picUrl,
                    count: countTrasnform(item.playCount),
                    name: item.name
                })
            })
            res["/api/personalized/djprogram"].result.forEach((item,index) => {
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
        http.get(apisPaths["recommend/resource"], {}).then(res => {
            if(res.code == 200) {
                const list = [];
                for(let i = 0, item = res.recommend[i]; i < 3; i++) {
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

    }
    componentDidMount() {
        this.getBanner();
        this.getSongSheet();
        this.getRecommendList();
        this.getAlbumList();
    }
    render() {
        const {playlistTag} = this.props;
        const tagList = playlistTag.map((item, index) => {
            if(index <= 4) {
                return (
                    <li key={item.id}>
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
                <li key={item.id}>
                    <Link to={item.type+"?id="+item.id}>
                        <div className={styles["cover"]}>
                            <img src={item.picUrl} />
                            <div className={styles["count"]}>
                                <span className="fl" style={{color: '#ccc'}}><Icon type="customer-service" style={{ fontSize: '12px' }} />{item.count}</span>
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
                <li key={item.id}>
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
        })
        const day = new Date().getDay();
        switch (day) {
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
                <div className={styles['banner']}>
                    <div className="main">
                        <Banner bannerList={this.state.bannerList} />
                    </div>
                </div>
                <div className={styles["home_module"]}>
                    <div className="main clearfix">
                        <div className={styles["home_left"] + " fl"}>
                            <div className={styles["personalized_module"]}>
                                <div className={styles["home_module_title"] + " clearfix"}>
                                    <span className="font24 fl">热门推荐</span>
                                    <ul className={styles["taglist" + " fl"]}>
                                        {tagList}
                                    </ul>
                                    <Link to="/playList" className={styles["playlist_more"] + " fr"}>更多</Link>
                                </div>
                                <div className={styles["personalized_list"]}>
                                    <ul className={styles["home_module_list"] + " clearfix"}>
                                        {personalizedList}
                                    </ul>
                                </div>
                            </div>
                            {
                                this.state.login && (
                                    <div className={styles["recommend_module"]}>
                                        <div className={styles["home_module_title"] + " clearfix"}>
                                            <span className="font24">个性化推荐</span>
                                        </div>
                                        <div className={styles["recommend_list"]}>
                                            <ul className={styles["home_module_list"] + " clearfix"}>
                                                <li>
                                                    <Link to="">
                                                        <div className={styles["date"] + " " + styles["u-date"] + " " + styles["f-alpha"]}>
                                                            <span className={styles["head"]}>{day}</span>
                                                            <span className={styles["bd"]}>{date}</span>
                                                            <span className={styles["mask"] + " " + styles["f-alpha"]}></span>
                                                        </div>
                                                        <div className={styles["name"]}>每日歌曲推荐</div>
                                                        <div className={styles["desc"]}>根据你的口味生成，<br />每天6:00更新</div>
                                                    </Link>
                                                </li>
                                                {recommendList}
                                            </ul>
                                        </div>
                                    </div>
                                )
                            }
                            <div className={styles["album_module"]}>
                                <div className={styles["home_module_title"] + " clearfix"}>
                                    <span className="font24">新碟上架</span>
                                    <Link to="/album" className={styles["playlist_more"] + " fr"}>更多</Link>
                                </div>
                                <div className={styles["album_list"]}>
                                    <ul className={styles["home_module_list"] + " clearfix"}>

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={styles["home_right"] + " fr"}>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    playlistTag: state.playlist.playlistTag
})

export default connect(mapStateToProps)(Home)