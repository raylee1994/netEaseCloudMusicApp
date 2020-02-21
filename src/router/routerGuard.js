import React,{component,lazy} from "react";

class RouterGuard extends component {
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