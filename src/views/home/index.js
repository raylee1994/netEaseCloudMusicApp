import React, { Component } from "react";
import {createAjax} from "common/js/utils";
import http from "apis/http";
import apisPaths from "apis/paths";
import Slider from "components/slider";
import styles from "./index.module";
import {connect} from "react-redux";

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bannerList: []
        }
    }
    getBanner() {
        createAjax(http.get(apisPaths["banner"], {
            type: 0
        }), res => {
            var bannerList = []
            res.banners.forEach(element => {
                if(element.targetType == 10) {
                    bannerList.push({
                        img: element.imageUrl,
                        to: "/album?id="+element.targetId
                    })
                }
                if(element.targetType == 1) {
                    bannerList.push({
                        img: element.imageUrl,
                        to: "/song?id="+element.targetId
                    })
                }
            });
            this.setState({
                bannerList
            })
        })
    }
    componentDidMount() {
        this.getBanner();
    }
    render() {
        return (
            <React.Fragment>
                <div className={styles['banner']}>
                    <div className="main">
                        <Slider bannerList={this.state.bannerList} />
                    </div>
                </div>
                <div className={styles["home_module"]}>
                    <div className="main clearfix">
                        <div className={styles["home_left"] + " fl"}>
                            
                        </div>
                        <div className={styles["home_right"] + " fr"}>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    playlistTag: state.playlist.playlistTag
})

export default connect(mapStateToProps)(Home)