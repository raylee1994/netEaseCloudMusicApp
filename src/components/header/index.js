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
    return w.replace(k, "<span class='blue'>"+k+"</span>")
}

function convertType(type) {
    switch (type) {
        case "artists":
            return "歌手"
        case "songs":
            return "单曲"
        case "albums":
            return "专辑"
        case "mvs":
            return "视频"
        case "playlists":
            return "歌单"
        default:
            return
    }
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
                if(Object.keys(res.data.result).length > 0) {
                    var searchList = res.data.result.order.map(item => {
                        return (
                            <OptGroup key={item} label={<div className="label">{convertType(item)}</div>}>
                                {do{
                                    if(item == "artists") {
                                        res.data.result.artists.map((items, index) => 
                                            <Option key={index} text={items.name}>
                                                <Link to={{pathname: "/artist", search: "?id="+items.id}}>
                                                    <span dangerouslySetInnerHTML={{__html: filterKeyword(keywords, items.name)}}></span>
                                                </Link>
                                            </Option>
                                        )
                                    }else if(item == "songs") {
                                        res.data.result.songs.map((items, index) => 
                                            <Option key={index} text={items.name}>
                                                <Link to={{pathname: "/song", search: "?id="+items.id}}>
                                                    <span dangerouslySetInnerHTML={{__html: filterKeyword(keywords, items.name)}}></span>-
                                                    {
                                                        items.artists.map(itemss => {
                                                            return (
                                                                <React.Fragment>
                                                                    <span dangerouslySetInnerHTML={{__html: filterKeyword(keywords, itemss.name)}}></span>&nbsp;
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </Link>
                                            </Option>
                                        )
                                    }else if(item == "albums") {
                                        res.data.result.albums.map((items, index) => 
                                            <Option key={index} text={items.name}>
                                                <Link to={{pathname: "/album", search: "?id="+items.id}}>
                                                    <span dangerouslySetInnerHTML={{__html: filterKeyword(keywords, items.name)}}></span>-<span dangerouslySetInnerHTML={{__html: filterKeyword(keywords, items.artist.name)}}></span>
                                                </Link>
                                            </Option>
                                        )
                                    }else if(item == "mvs") {
                                        res.data.result.mvs.map((items, index) => 
                                            <Option key={index} text={items.name}>
                                                <Link to={{pathname: "/mv", search: "?id="+items.id}}>
                                                    MV:<span dangerouslySetInnerHTML={{__html: filterKeyword(keywords, items.name)}}></span>-<span dangerouslySetInnerHTML={{__html: filterKeyword(keywords, items.artistName)}}></span>
                                                </Link>
                                            </Option>
                                        )
                                    }else if(item == "playlists") {
                                        res.data.result.playlists.map((items, index) => 
                                            <Option key={index} text={items.name}>
                                                <Link to={{pathname: "/playlists", search: "?id="+items.id}}>
                                                    <span dangerouslySetInnerHTML={{__html: filterKeyword(keywords, items.name)}}></span>
                                                </Link>
                                            </Option>
                                        )
                                    }else{}
                                }}
                            </OptGroup>
                        )
                    })
                    searchList = [<div className="search_title" key="search_title"><Link to={{ pathname: "/search", search: "?keywords="+keywords+"&type=1002"}}>搜“{keywords}”相关用户></Link></div>].concat(searchList)
                }else {
                    var searchList = [<div key="none">暂无结果</div>]
                }
                _ts.setState({
                    dataSource: searchList
                })
            }, () => {
                _ts.setState({
                    dataSource: []
                })
            }, () => {
                _ts.setState({
                    dataSource: []
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
                        routes.map(element => <NavLink key={element.path} exact={element.exact} to={element.path} className="navLink fl" activeClassName={element.activeClassName}>{element.name}</NavLink>)
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
                        <AutoComplete style={{ width: '100%' }} onChange={this.searchSuggest} dataSource={this.state.dataSource} optionLabelProp="text" placeholder="音乐/视频/电台/用户">
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