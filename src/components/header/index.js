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
        console.log(3)
        debounce(function(keywords) {
            createAjax(http.get(apisPaths["search/suggest"], {keywords}), res => {
                let searchList = <div className="search_title"><Link to={{ pathname: "/search", search: "?keywords="+keywords+"&type=1002",}}></Link></div>;
                res.data.order.forEach(item => {
                    let options;
                    switch (item) {
                        case "artists":
                            options = res.data.artists.map(item => 
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/artist", search: "?id="+item.id}}>
                                        {filterKeyword(item.name)}
                                    </Link>
                                </Option>
                            )
                            searchList += <OptGroup key="artists" label={<div className="label">歌手</div>}>{options}</OptGroup>
                            break;
                        case "songs":
                            options = res.data.songs.map(item => {
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
                            searchList += <OptGroup key="songs" label={<div className="label">单曲</div>}>{options}</OptGroup>
                            break;
                        case "albums":
                            options = res.data.albums.map(item => 
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/album", search: "?id="+item.id}}>
                                        {filterKeyword(item.name)}-{filterKeyword(item.artist.name)}
                                    </Link>
                                </Option>
                            )
                            searchList += <OptGroup key="albums" label={<div className="label">专辑</div>}>{options}</OptGroup>
                            break;
                        case "mvs":
                            options = res.data.mvs.map(item => 
                                <Option key={item.id} value={item.name}>
                                    <Link to={{pathname: "/mv", search: "?id="+item.id}}>
                                        MV:{filterKeyword(item.name)}-{filterKeyword(item.artistName)}
                                    </Link>
                                </Option>
                            )
                            searchList += <OptGroup key="mvs" label={<div className="label">视频</div>}>{options}</OptGroup>
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
                        <Menu className="fr" style={{ width: 30, marginRight: 60, marginTop: 10}} mode="horizontal">
                            <SubMenu title={<Avatar src={this.props.avatarUrl} style={{marginLeft: 60}} size={30}></Avatar>}>
                                <Menu.ItemGroup style={{ width: 120 }}>
                                    <Menu.Item key="1"><Link to={{pathname: "/user/home", search: "?id="+this.props.userId}}>我的主页</Link></Menu.Item>
                                    <Menu.Item key="2"><Link to={{pathname: "/user/update", search: "?id="+this.props.userId}}>个人设置</Link></Menu.Item>
                                    <Menu.Item key="3"><span onClick={this.logout}>退出</span></Menu.Item>
                                </Menu.ItemGroup>
                            </SubMenu>
                        </Menu>
                    }
                    <div className="search_wrap fr">
                        <AutoComplete dataSource={this.state.dataSource} placeholder="音乐/视频/电台/用户">
                            <Input className="search_input" onChange={this.searchSuggest} suffix={<Icon type="search" className="search_icon" />} />
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