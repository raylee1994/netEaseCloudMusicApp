import React, { Component } from "react";
import {Carousel, Icon} from "antd";
import PropTypes from "prop-types";
import "./index.less";

export default class Slider extends Component {
    constructor(props) {
        super(props)
        this.slider = React.createRef()
    }
    prev() {
        this.slider.current.prev()
    }
    next() {
        this.slider.current.next()
    }
    render() {
        return (
            <div className="slider">
                {
                    this.props.switchBtn && (
                        <React.Fragment>
                            <Icon type="left" onClick={this.prev} className="prev" style={prevStyle} />
                            <Icon type="right" onClick={this.next} className="next" style={nextStyle} />
                        </React.Fragment>
                    )
                }
                <Carousel ref={this.slider} autoplay={this.props.autoplay} dots={this.props.dots}>
                    {this.props.children}
                </Carousel>
            </div>
        )
    }
}

Slider.defaultProps = {
    switchBtn: false,
    dots: false,
    autoplay: true
}
Slider.propTypes = {
    switchBtn: PropTypes.bool,
    dots: PropTypes.bool,
    autoplay: PropTypes.bool
}