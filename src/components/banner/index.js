import React, { Component } from "react";
import {Carousel, Icon} from "antd";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import "./index.less";

export default class Banner extends Component {
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
        const prevStyle = {left: this.props.switchBtnPos == "in" ? "20px" : "-20px"};
        const nextStyle = {right: this.props.switchBtnPos == "in" ? "20px" : "-20px"};
        const carouselList = this.props.bannerList.map((item) => {
            if(!item.to) {
                return <Link to={() => {}}><img className="banner_img" src={item.img} /></Link>
            }else {
                return <Link to={item.to}><img className="banner_img" src={item.img} /></Link>
            }
        })
        return (
            <div className="banner">
                {
                    this.props.switchBtn && (
                        <React.Fragment>
                            <Icon type="left" onClick={this.prev} className="prev" style={prevStyle} />
                            <Icon type="right" onClick={this.next} className="next" style={nextStyle} />
                        </React.Fragment>
                    )
                }
                <Carousel ref={this.banner} autoplay={this.props.autoplay} dots={this.props.dots}>
                    {carouselList}
                </Carousel>
            </div>
        )
    }
}

Banner.defaultProps = {
    bannerList: [],
    switchBtn: false,
    switchBtnPos: "out",
    dots: true,
    autoplay: true
}
Banner.propTypes = {
    bannerList: PropTypes.array,
    switchBtn: PropTypes.bool,
    switchBtnPos: PropTypes.oneOf(["in", "out"]),
    dots: PropTypes.bool,
    autoplay: PropTypes.bool
}