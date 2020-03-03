import React,{Component,lazy} from "react";
import {connect} from "react-redux";

class RouterGuard extends Component {
    componentWillMount() {
        
    }
    render() {
        const RenderComponent = lazy(() => import(`views/${this.props.component}`));
        return (
            <RenderComponent key={this.props.is_refresh_page}></RenderComponent>
        )
    }
}
const mapStateToProps = state => ({
    is_refresh_page: state.is_refresh_page,
})

export default connect(mapStateToProps)(RouterGuard);