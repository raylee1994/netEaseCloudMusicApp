import React,{component,lazy} from "react";
import {connect} from "react-redux";
import {refreshPage} from "store/Page";

class RouterGuard extends component {
    componentWillMount() {
        
    }
    getDerivedStateFromProps(props, state) {
        if(props.is_refresh_page) {
            props.refreshPage(false)
            this.forceUpdate()
        }
    }
    render() {
        const RenderComponent = lazy(() => import(`views/${this.props.component}`));
        return (
            <RenderComponent key={this.props.is_refresh_page}></RenderComponent>
        )
    }
}

const mapStateToProps = state => ({
    is_refresh_page: state.is_refresh_page
})
const mapDispatchToProps = dispatch => ({
    refreshPage: status => dispatch(refreshPage(status))
})

export default connect(mapStateToProps, mapDispatchToProps)(RouterGuard);