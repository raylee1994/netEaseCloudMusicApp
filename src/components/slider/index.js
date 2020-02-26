import React, { Component } from "react";
import {Carousel, Icon} from "antd";
import styles from "./index.module";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

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
        const prevStyle = {left: this.props.switchBtnPos == "in" ? "20px" : "-20px"};
        const nextStyle = {right: this.props.switchBtnPos == "in" ? "20px" : "-20px"};
        const carouselList = this.props.bannerList.map((item) => {
            if(item.to) {
                return <Link to={() => {}}></Link>
            }else {
                return <Link to={item.to}><img className={styles["slide_img"]} src={item.img} /></Link>
            }
        })
        return (
            <div className={styles["slider"]}>
                {
                    this.props.switchBtn && (
                        <React.Fragment>
                            <Icon type="left" onClick={this.prev} className={styles["prev"]} style={prevStyle} />
                            <Icon type="right" onClick={this.next} className={styles["next"]} style={nextStyle} />
                        </React.Fragment>
                    )
                }
                <Carousel ref={this.slider} autoplay={this.props.autoplay} dots={this.props.dots}>
                    {carouselList}
                </Carousel>
            </div>
        )
    }
}

Slider.defaultProps = {
    bannerList: [],
    switchBtn: false,
    switchBtnPos: "out",
    dots: true,
    autoplay: true
}
Slider.propTypes = {
    bannerList: PropTypes.array,
    switchBtn: PropTypes.bool,
    switchBtnPos: PropTypes.oneOf(["in", "out"]),
    dots: PropTypes.bool,
    autoplay: PropTypes.bool
}