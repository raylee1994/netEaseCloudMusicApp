import React,{component,Suspense} from "react";
import {BrowserRouter,Switch,Route} from "react-router-dom";
import MyHeader from "components/header";
import routes from "router";
import RouterGuard from "router/roterGuard";
import Loading from "components/loading";
import {connect} from "react-redux";
import {loginRefresh} from "./store/User/action";

class App extends component {
    componentDidMount() {
        this.props.loginRefresh()
    }
    render() {
        return (
            <React.Fragment>
                <MyHeader></MyHeader>
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

const mapDispatchToProps = dispatch => ({
    loginRefresh: () => dispatch(loginRefresh)
})

export default connect(null, mapDispatchToProps)(App)
