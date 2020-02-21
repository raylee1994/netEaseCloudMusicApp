import React,{component,Suspense} from "react";
import {BrowserRouter,Switch,Route} from "react-router-dom";
import MyHeader from "components/header";
import routes from "router";
import RouterGuard from "router/roterGuard";
import Loading from "components/loading";
import {connect} from "react-redux";
import {loginRefresh, loginCellphone, switchAuthModal} from "./store/User/action";
import AuthFormModal from "components/auth";

class App extends component {
    componentDidMount() {
        this.props.loginRefresh()
    }
    render() {
        return (
            <React.Fragment>
                <MyHeader></MyHeader>
                <AuthFormModal authModalVisibility={this.props.authModalVisibility} loginCellphone={this.props.loginCellphone} switchAuthModal={this.props.switchAuthModal}></AuthFormModal>
                <BrowserRouter>
                    <Suspense fallback={<Loading></Loading>}>
                        <Switch>
                            {
                                routes.forEach((element, index) => {
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

const mapStateToProps = state => ({
    authModalVisibility: state.user.authModalVisibility
})

const mapDispatchToProps = dispatch => ({
    loginRefresh: () => dispatch(loginRefresh),
    loginCellphone: (params, successCallback, failCallback, errCallback) => dispatch(loginCellphone(params, successCallback, failCallback, errCallback)),
    switchAuthModal: visibility => dispatch(switchAuthModal(visibility))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
