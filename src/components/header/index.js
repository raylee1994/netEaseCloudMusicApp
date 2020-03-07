import React,{Component} from "react";
import {Icon,Input,AutoComplete,Menu,Avatar} from 'antd';
import "./index.less";
import {Link,NavLink} from "react-router-dom";
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
        this.state = {
            dataSource: []
        }
        this.logout = this.logout.bind(this)
        this.searchSuggest = this.searchSuggest.bind(this)
    }
    logout() {
        createAjax(http.get(apisPaths["logout"]), () => {
            window.location.reload()
        })
    }
    searchSuggest(e) {
        let _ts = this
        debounce(function(keywords) {
            createAjax(http.get(apisPaths["search/suggest"], {keywords}), res => {
                let searchList = [<div className="search_title"><Link to={{ pathname: "/search", search: "?keywords="+keywords+"&type=1002",}}></Link></div>];
                res.data.result.order.forEach(item => {
                    let options;
                    switch (item) {
                        case "artists":
                            options = res.data.result.artists.map(item => 
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/artist", search: "?id="+item.id}}>
                                        {filterKeyword(keywords, item.name)}
                                    </Link>
                                </Option>
                            )
                            searchList.concat([<OptGroup key="artists" label={<div className="label">歌手</div>}>{options}</OptGroup>])
                            break;
                        case "songs":
                            options = res.data.result.songs.map(item => 
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/song", search: "?id="+item.id}}>
                                        {filterKeyword(keywords, item.name)}-
                                        {
                                            item.artists.map(items => 
                                                (filterKeyword(keywords, items.name) + " ")
                                            )
                                        }
                                    </Link>
                                </Option>
                            )
                            searchList.concat([<OptGroup key="songs" label={<div className="label">单曲</div>}>{options}</OptGroup>])
                            break;
                        case "albums":
                            options = res.data.result.albums.map(item => 
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/album", search: "?id="+item.id}}>
                                        {filterKeyword(keywords, item.name)}-{filterKeyword(keywords, item.artist.name)}
                                    </Link>
                                </Option>
                            )
                            searchList.concat([<OptGroup key="albums" label={<div className="label">专辑</div>}>{options}</OptGroup>])
                            break;
                        case "mvs":
                            options = res.data.result.mvs.map(item => 
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/mv", search: "?id="+item.id}}>
                                        MV:{filterKeyword(keywords, item.name)}-{filterKeyword(keywords, item.artistName)}
                                    </Link>
                                </Option>
                            )
                            searchList.concat([<OptGroup key="mvs" label={<div className="label">视频</div>}>{options}</OptGroup>])
                            break;
                        case "playlists":
                            options = res.data.result.playlists.map(item => 
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/playlists", search: "?id="+item.id}}>
                                        {filterKeyword(keywords, item.name)}
                                    </Link>
                                </Option>
                            )
                            searchList.concat([<OptGroup key="playlists" label={<div className="label">歌单</div>}>{options}</OptGroup>])
                            break;
                        default:
                            return
                    }
                })
                _ts.setState({
                    dataSource: searchList
                })
            })
        })(e)
    }
    render() {
        return (
            <div className="header">
                <div className="wrap clearfix">
                    <NavLink to="/" className="logo fl"><img src={require("./images/logo.png").default} /></NavLink>
                    {
                        routes.map(element => <NavLink key={element.path} to={element.path} className="navLink fl" activeClassName={element.activeClassName}>{element.name}</NavLink>)
                    }
                    {
                        this.props.userStatus == 3 && <a className="login fr" onClick={this.props.switchAuthModal(true)}>登录</a>
                    }
                    {
                        this.props.userStatus == 2 && 
                        <Menu className="fr" style={{ width: 30, marginRight: 30, marginTop: 10}} mode="horizontal">
                            <SubMenu title={<Avatar src={this.props.avatarUrl} className="avatar" size={30}></Avatar>}>
                                <Menu.ItemGroup>
                                    <Menu.Item key="1"><Link to={{pathname: "/user/home", search: "?id="+this.props.userId}}>我的主页</Link></Menu.Item>
                                    <Menu.Item key="2"><Link to={{pathname: "/user/update", search: "?id="+this.props.userId}}>个人设置</Link></Menu.Item>
                                    <Menu.Item key="3" onClick={this.logout}><span>退出</span></Menu.Item>
                                </Menu.ItemGroup>
                            </SubMenu>
                        </Menu>
                    }
                    <div className="search_wrap fr">
                        <AutoComplete onChange={this.searchSuggest} dataSource={this.state.dataSource} placeholder="音乐/视频/电台/用户">
                            <Input className="search_input" suffix={<Icon type="search" className="search_icon" />} />
                        </AutoComplete>
                    </div>
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

const mapDispatchToProps = dispatch => ({
    switchAuthModal: visibility => () => dispatch(switchAuthModal(visibility))
})

export default connect(mapStateToProps,mapDispatchToProps)(Header);