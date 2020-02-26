import React,{Component,Suspense} from "react";
import {BrowserRouter,Switch,Route} from "react-router-dom";
import MyHeader from "components/header";
import routes from "router";
import RouterGuard from "router/roterGuard";
import Loading from "components/loading";
import {connect} from "react-redux";
import {loginRefresh, loginCellphone, switchAuthModal, registerCellphone} from "./store/User/action";
import {refreshPage} from "store/Page";
import {getPlaylistTag} from "store/Playlist";
import AuthFormModal from "components/auth";

class App extends Component {
    componentDidMount() {
        this.props.loginRefresh();
        this.props.getPlaylistTag();
    }
    render() {
        return (
            <React.Fragment>
                <MyHeader></MyHeader>
                <AuthFormModal authModalVisibility={this.props.authModalVisibility} loginCellphone={this.props.loginCellphone} switchAuthModal={this.props.switchAuthModal} is_refresh_page={this.props.is_refresh_page} refreshPage={this.props.refreshPage}></AuthFormModal>
                <BrowserRouter>
                    <Suspense fallback={<Loading></Loading>}>
                        <Switch>
                            {
                                routes.forEach((element, index) => {
                                    return (
                                        <Route key={index} path={element.path} exact={element.exact} render={() => <RouterGuard key={this.props.is_refresh_page} component={element.component}></RouterGuard>}></Route>
                                    )
                                })
                            }
                        </Switch>
                    </Suspense>
                </BrowserRouter>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    is_refresh_page: state.is_refresh_page,
    authModalVisibility: state.user.authModalVisibility,
    playlistTag: state.playlist.playlistTag
})

const mapDispatchToProps = dispatch => ({
    loginRefresh: () => dispatch(loginRefresh),
    loginCellphone: (params, successCallback, failCallback, errCallback) => dispatch(loginCellphone(params, successCallback, failCallback, errCallback)),
    registerCellphone: (params, successCallback, failCallback, errCallback) => dispatch(registerCellphone(params, successCallback, failCallback, errCallback)),
    switchAuthModal: visibility => dispatch(switchAuthModal(visibility)),
    refreshPage: status => dispatch(refreshPage(status)),
    getPlaylistTag: () => dispatch(getPlaylistTag)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
