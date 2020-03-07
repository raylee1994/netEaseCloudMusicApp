import React,{Component,lazy} from "react";
import {connect} from "react-redux";

class RouterGuard extends Component {
    componentWillMount() {
        
    }
    render() {
        const RenderComponent = lazy(() => import(`views/${this.props.component}`));
        return (
            this.props.is_page_loaded && <RenderComponent key={this.props.is_refresh_page}></RenderComponent>
        )
    }
}
const mapStateToProps = state => ({
    is_refresh_page: state.is_refresh_page,
    is_page_loaded: state.is_page_loaded
})

export default connect(mapStateToProps,null)(RouterGuard);