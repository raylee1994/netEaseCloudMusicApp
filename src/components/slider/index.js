import React, { Component } from "react";
import {Carousel, Icon} from "antd";
import PropTypes from "prop-types";
import "./index.less";

export default class Slider extends Component {
    constructor(props) {
        super(props)
        this.slider = React.createRef()
        this.prev = this.prev.bind(this)
        this.next = this.next.bind(this)
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
                            <Icon type="left" onClick={this.prev} className="prev"/>
                            <Icon type="right" onClick={this.next} className="next"/>
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
    switchBtn: true,
    dots: false,
    autoplay: false
}
Slider.propTypes = {
    switchBtn: PropTypes.bool,
    dots: PropTypes.bool,
    autoplay: PropTypes.bool
}