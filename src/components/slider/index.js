import React, { Component } from "react";
import {Carousel, Icon} from "antd";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import "./index.less";

export default class Slider extends Component {
    constructor(props) {
        super(props)
        this.banner = React.createRef()
    }
    prev() {
        this.banner.current.prev()
    }
    next() {
        this.banner.current.next()
    }
    render() {
        
    }
}

Slider.defaultProps = {

}
Slider.propTypes = {

}