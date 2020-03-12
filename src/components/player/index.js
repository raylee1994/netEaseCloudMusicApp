import React,{Component} from "React";
import styles from "./index.less";
import {Icon} from "antd";

class Player extends Component {
    constructor(props) {
        this.state = {
            lock: false,
            focus: false
        }
    }
    render() {
        return (
            <div className={styles["g-btmbar"]}>
                <div className={styles["m-playbar"]}>
                    <div className={styles["playbar-lock"]}>
                        <div className={styles["lock-btn"]}>
                            <Icon type={this.state.lock ? 'lock' : 'unlock'} style={{ fontSize: '12px', color: this.state.focus ? '#eee' : '#999' }}/>
                        </div>
                    </div>
                    <div className={styles["playbar-main"]}>
                        <div className="main clearfix">

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}