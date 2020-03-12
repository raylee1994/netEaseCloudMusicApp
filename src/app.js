import React,{Component,Suspense} from "react";
import {BrowserRouter,Switch,Route} from "react-router-dom";
import MyHeader from "components/header";
import routes from "router";
import RouterGuard from "router/routerGuard";
import Loading from "components/loading";
import {connect} from "react-redux";
import {loginRefresh} from "./store/User/action";
import {getPlaylistTag} from "store/Playlist";
import AuthFormModal from "components/auth";
import BackToTop from "components/backTop";

class App extends Component {
    componentDidMount() {
        this.props.loginRefresh();
        this.props.getPlaylistTag();
    }
    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <MyHeader></MyHeader>
                    <BackToTop></BackToTop>
                    <AuthFormModal></AuthFormModal>
                    <Suspense fallback={<Loading></Loading>}>
                        <Switch>
                            {
                                routes.map((element, index) => {
                                    return (
                                        <Route key={index} path={element.path} exact={element.exact} render={() => <RouterGuard component={element.component}></RouterGuard>}></Route>
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

const mapDispatchToProps = dispatch => ({
    loginRefresh: () => dispatch(loginRefresh()),
    getPlaylistTag: () => dispatch(getPlaylistTag())
})

export default connect(null, mapDispatchToProps)(App)
