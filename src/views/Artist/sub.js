import React,{Component} from "react";
import {NavLink, Route, Switch, withRouter} from "react-router-dom";
import routes from "./router";
import styles from "./sub.module.less";
import RouterGuard from "router/routerGuard";
import qs from "qs";

class Sub extends Component {
    constructor(props) {
        super(props)
        let queryObj = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
        this.state = {
            id: (queryObj ? queryObj.id : null) || ""
        }
    }
    componentDidMount() {
        console.log(1)
    }
    render() {
        return (
            <div className={styles["artist_module"]}>
                <div className="main clearfix">
                    <div className={styles["g-mn4"] + " fl"}>
                        <div className={styles["g-mn4c"]}>
                            <div className={styles["g-wrap6"]}>
                                <div className={styles["n-artist"]}>
                                    {
                                        routes.map(item => (
                                            <NavLink key={item.path} to={item.path+"?id="+this.state.id} activeClassName={item.activeClassName} exact={item.exact}>{item.name}</NavLink>
                                        ))
                                    }
                                </div>
                                <Switch>
                                    {
                                        routes.map(item => (
                                            <Route key={item.path}  path={item.path} exact={item.exact} render={() => <RouterGuard component={item.component}></RouterGuard>}></Route>
                                        ))
                                    }
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Sub)