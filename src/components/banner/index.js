import React, { Component } from "react";
import {Carousel, Icon} from "antd";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import "./index.less";

export default class Banner extends Component {
    constructor(props) {
        super(props)
        this.banner = React.createRef()
        this.prev = this.prev.bind(this)
        this.next = this.next.bind(this)
    }
    prev() {
        this.banner.current.prev()
    }
    next() {
        this.banner.current.next()
    }
    render() {
        const prevStyle = {left: this.props.switchBtnPos == "in" ? "48px" : "-48px"};
        const nextStyle = {right: this.props.switchBtnPos == "in" ? "48px" : "-48px"};
        const carouselList = this.props.bannerList.map((item,index) => {
            if(!item.to) {
                return <Link key={index} to={() => {}} className="banner_link"><img className="banner_img" src={item.img} /></Link>
            }else {
                return <Link key={index} to={item.to} className="banner_link"><img className="banner_img" src={item.img} /></Link>
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
                <Carousel ref={this.banner} afterChange={current => this.props.afterChange(current)} autoplay={this.props.autoplay} dots={this.props.dots}>
                    {carouselList}
                </Carousel>
            </div>
        )
    }
}

Banner.defaultProps = {
    bannerList: [],
    switchBtn: true,
    switchBtnPos: "out",
    dots: true,
    autoplay: false,
    afterChange: function(){}
}
Banner.propTypes = {
    bannerList: PropTypes.array,
    switchBtn: PropTypes.bool,
    switchBtnPos: PropTypes.oneOf(["in", "out"]),
    dots: PropTypes.bool,
    autoplay: PropTypes.bool,
    afterChange: PropTypes.func
}