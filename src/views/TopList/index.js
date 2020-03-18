import React,{Component} from "react";
import styles from "./index.module.less";
import {createAjax, transformTime, transformDuration, isEmptyObject} from "common/js/utils";
import http from "apis/http";
import apisPaths from "apis/paths";
import {Link, withRouter} from "react-router-dom";
import {Icon} from "antd"; 
import qs from "qs";

function transformName(ar) {
    let names = ar.map((item, index) => {
        if(index != ar.length-1) {
            return <Link to={{pathname:"/artist/song", search:"?id="+item.id}}>{item.name}/</Link>
        }else {
            return <Link to={{pathname:"/artist/song", search:"?id="+item.id}}>{item.name}</Link>
        }
    })
    return names
}

class TopList extends Component {
    constructor(props) {
        super(props)
        let queryObj = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
        this.state = {
            menu: [],
            playlist: {},
            trackId: (queryObj ? queryObj.id : null) || "19723756"
        }
    }
    getMenu() {
        createAjax(http.get(apisPaths["toplist"]), res => {
            this.setState({
                menu: res.data.list
            })
        })
    }
    getPlaylist() {
        createAjax(http.get(apisPaths["top/list"], {id: this.state.trackId}), res => {
            this.setState({
                playlist: res.data.playlist
            })
        })
    }
    componentDidMount() {
        this.getMenu()
        this.getPlaylist()
    }
    render() {
        if(this.state.menu.length > 0) {
            var menuList = (
            <React.Fragment>
                <h2>云音乐特色榜</h2>
                <ul>
                    {
                        this.state.menu.map(item => {
                            switch (item.id) {
                                case 3779629:
                                case 3778678:
                                case 2884035:
                                case 19723756:
                                    return (
                                        <li key={item.id} className={this.state.trackId == item.id ? styles["active"] : ""}>
                                            <Link to={{pathname: "/toplist", search: "?id="+item.id}}>
                                                <div className={styles["avartar"] + " fl"}>
                                                    <img src={item.coverImgUrl} />
                                                </div>
                                                <div className={styles["des"]}>
                                                    <p>{item.name}</p>
                                                    <p>{item.updateFrequency}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                default:
                                    return
                            }
                        })
                    }
                </ul>
                <h2>全球媒体榜</h2>
                <ul>
                    {
                        this.state.menu.map(item => {
                            if(item.id != 3779629 && item.id != 3778678 && item.id != 2884035 && item.id != 19723756) {
                                return (
                                    <li key={item.id} className={this.state.trackId == item.id ? styles["active"] : ""}>
                                        <Link to={{pathname: "/toplist", search: "?id="+item.id}}>
                                            <div className={styles["avartar"] + " fl"}>
                                                <img src={item.coverImgUrl} />
                                            </div>
                                            <div className={styles["des"]}>
                                                <p>{item.name}</p>
                                                <p>{item.updateFrequency}</p>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            }
                            return
                        })
                    }
                </ul>
            </React.Fragment>)
        }
        if(!isEmptyObject(this.state.playlist)) {
            return (
                <div className={styles["toplist_module"]}>
                    <div className="main clearfix">
                        <div className={styles["toplist_menu"] + " fl"}>
                            <div className={styles["toplist_menu_inner"]}>
                                {menuList}
                            </div>
                        </div>
                        <div className={styles["toplist_track"] + " fl"}>
                            <div className={styles["g-wrap"]}>
                                <div className="clearfix">
                                    <div className={styles["cover"] + " fl"}>
                                        <img src={this.state.playlist.coverImgUrl} />
                                    </div>
                                    <div className={styles["cnt"] + " fr"}>
                                        <div className={styles["cntc"]}>
                                            <h2 className={styles["hd"]}>{this.state.playlist.name}</h2>
                                            <div className={styles["user"]}>
                                                最近更新：
                                                {transformTime(this.state.playlist.trackUpdateTime).month}月{transformTime(this.state.playlist.trackUpdateTime).date}日
                                            </div>
                                            <div className={styles["btns"]}>
        
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles["g-wrap12"]}>
                                <div className={styles["u-title"] + " clearfix"}>
                                    <h3 className="fl">歌曲列表</h3>
                                    <div className={styles["sub"] + " fl"}>
                                        {this.state.playlist.trackCount}首歌
                                    </div>
                                    <div className={styles["more"] + " fr"}>
                                        播放：{this.state.playlist.playCount}次
                                    </div>
                                </div>
                                <div className={styles["song_list"]}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style={{width: '71px'}}></th>
                                                <th>标题</th>
                                                <th style={{width: '91px'}}>时长</th>
                                                <th style={{width: '26%'}}>歌手</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.playlist.tracks.map((item, index) => {
                                                    return (
                                                        <tr key={item.id}>
                                                            <td style={{textAlign: "center"}}>{index + 1}</td>
                                                            <td className={styles["rank"]}>
                                                                <div className="clearfix">
                                                                    <div className={styles["tt"]}>
                                                                        <Link to={{pathname: "/song", search: "?id="+item.id}}>
                                                                            <img src={item.al.picUrl} />
                                                                        </Link>
                                                                        <div className={styles["ttc"]}>
                                                                            <div className={styles["txt"]}>
                                                                                <span><Icon type="play-circle" style={{color: "#aaa", fontSize: "18px"}} /></span>
                                                                                <Link to={{pathname: "/song", search: "?id="+item.id}}>
                                                                                    {item.name}
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={styles["time"]}>{transformDuration(item.dt).min}:{transformDuration(item.dt).sec}</span>
                                                                <div className={styles["hidden_icon"]}>
                                                                    <span><Icon type="plus" style={{color: "#aaa", fontSize: "18px"}} /></span>
                                                                    <span><Icon type="folder-add" style={{color: "#aaa", fontSize: "18px"}} /></span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {transformName(item.ar)}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return <div></div>
    }
}

export default withRouter(TopList)