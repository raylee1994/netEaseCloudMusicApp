import React,{Component} from "react";
import {Icon,Input,AutoComplete,Menu,Avatar} from 'antd';
import styles from "./index.less";
import {Link,NavLink} from "components/header";
import routes from "router";
import http from "apis/http";
import apisPaths from "apis/paths";
import {connect} from "react-redux";
import {createAjax} from "common/js/utils";
import {switchAuthModal} from "store/user/action";

const {Option,OptGroup} = AutoComplete;
const { SubMenu } = Menu;

var timer;
function debounce(fn, delay = 200) {
    return function() {
        if (timer) {
            clearTimeout(timer);
        }
        var context = this;
        var args = arguments;
        timer = setTimeout(() => {
            fn.call(context, ...args);
        }, delay);
    };
}

function filterKeyword(k, w) {
    return w.replace(k, "<span className='blue'>"+k+"</span>")
}

class Header extends Component {
    constructor(props) {
        super(props)
        this.searchSuggest = this.searchSuggest.bind(this)
        this.state = {
            dataSource: ""
        }
        this.logout = this.logout.bind(this)
        this.searchSuggest = this.searchSuggest.bind(this)
    }
    logout() {
        createAjax(http.get(apiPaths["logout"]), () => {
            window.location.reload()
        })
    }
    searchSuggest(e) {
        debounce(function(keywords) {
            createAjax(http.get(apisPaths["search/suggest"], {keywords}), res => {
                let searchList = <div className={styles["search_title"]}><Link to={{ pathname: "/search", search: "?keywords="+keywords+"&type=1002",}}></Link></div>;
                res.data.order.forEach(item => {
                    switch (item) {
                        case "artists":
                            const options = res.data.artists.map(item => 
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/artist", search: "?id="+item.id}}>
                                        {filterKeyword(item.name)}
                                    </Link>
                                </Option>
                            )
                            searchList += <OptGroup key="artists" label={<div className={styles.label}>歌手</div>}>{options}</OptGroup>
                            break;
                        case "songs":
                            const options = res.data.songs.map(item => {
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/song", search: "?id="+item.id}}>
                                        {filterKeyword(item.name)}-
                                        {
                                            item.artists.map(items => 
                                                {filterKeyword(items.name) + " "}
                                            )
                                        }
                                    </Link>
                                </Option>
                            })
                            searchList += <OptGroup key="songs" label={<div className={styles.label}>单曲</div>}>{options}</OptGroup>
                            break;
                        case "albums":
                            const options = res.data.albums.map(item => 
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/album", search: "?id="+item.id}}>
                                        {filterKeyword(item.name)}-{filterKeyword(item.artist.name)}
                                    </Link>
                                </Option>
                            )
                            searchList += <OptGroup key="albums" label={<div className={styles.label}>专辑</div>}>{options}</OptGroup>
                            break;
                        case "mvs":
                            const options = res.data.mvs.map(item => 
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/mv", search: "?id="+item.id}}>
                                        MV:{filterKeyword(item.name)}-{filterKeyword(item.artistName)}
                                    </Link>
                                </Option>
                            )
                            searchList += <OptGroup key="mvs" label={<div className={styles.label}>视频</div>}>{options}</OptGroup>
                            break;
                        default:
                            return
                    }
                })
                this.setState({
                    dataSource: searchList
                })
            })
        })(e.target.value)
    }
    render() {
        return (
            <div className={styles.header}>
                <div className="wrap clearfix">
                    <NavLink to="/" className={styles.logo + " fl"}><img src={require("./images/logo.png")} /></NavLink>
                    {
                        routes.forEach(element => <NavLink to={element.path} className={styles.navLink + " fl"} activiClassName={element.activiClassName}>{element.name}</NavLink>)
                    }
                    <div className={styles.search_wrap + " fr"}>
                        <AutoComplete dataSource={this.state.dataSource} placeholder="音乐/视频/电台/用户">
                            <Input className={styles.search_input} onChange={this.searchSuggest} suffix={<Icon type="search" className={styles.search_icon} />} />
                        </AutoComplete>
                    </div>
                    {
                        this.props.userStatus == 3 && <a className={styles.login + " fr"} onclick={this.props.switchAuthModal(true)}>登录</a>
                    }
                    {
                        this.props.userStatus == 2 && 
                        <Menu className="fr">
                            <SubMenu style={{ width: 30, marginLeft: 64 }} title={<Avatar src={this.props.avatarUrl} size={30}></Avatar>}>
                                <Menu.ItemGroup style={{ width: 158 }}>
                                    <Menu.Item key="1"><Link to={{pathname: "/user/home", search: "?id="+this.props.userId}}>我的主页</Link></Menu.Item>
                                    <Menu.Item key="2"><Link to={{pathname: "/user/update", search: "?id="+this.props.userId}}>个人设置</Link></Menu.Item>
                                    <Menu.Item key="3"><span onclick={this.logout}>退出</span></Menu.Item>
                                </Menu.ItemGroup>
                            </SubMenu>
                        </Menu>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userStatus: state.user.status,
    avatarUrl: state.user.profile.avatarUrl,
    userId: state.user.profile.userId,
})

const mapDispatchToProps = dispatch => {
    switchAuthModal: visibility => () => dispatch(switchAuthModal(visibility))
}

export default connect(mapStateToProps,mapDispatchToProps)(Header);