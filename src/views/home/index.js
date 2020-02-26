import React, { Component } from "react";
import {createAjax} from "common/js/utils";
import http from "apis/http";
import apisPaths from "apis/paths";
import styles from "./index.module";

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    getBanner() {

    }
    componentDidMount() {

    }
    render() {
        return (
            <React.Fragment>
                <div className={styles['banner']}>
                    <div className="main">

                    </div>
                </div>
            </React.Fragment>
        )
    }
}