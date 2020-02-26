import React,{Component,lazy} from "react";

class RouterGuard extends Component {
    componentWillMount() {
        
    }
    render() {
        const RenderComponent = lazy(() => import(`views/${this.props.component}`));
        return (
            <RenderComponent></RenderComponent>
        )
    }
}

export default RouterGuard;