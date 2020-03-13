import React,{Component} from "React";
import styles from "./index.less";
import {Icon} from "antd";
import {connect} from "react-redux";
import {switchPlayState} from "store/Player/action";

class Player extends Component {
    constructor(props) {
        this.state = {
            lock: false,
            focus: false,
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
                            <div className={styles["lock-btn"]}>
                                <Icon type="step-backward" style={{color: "#fff"}} />
                                <Icon type={this.props.playState ? "pause-circle" : "play-circle"} style={{color: "#fff"}} />
                                <Icon type="step-forward" style={{color: "#fff"}} />
                            </div>
                            <div className={styles["cover"]}>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    playState: state.playState
})

const mapDispatchToProps = dispatch => ({
    switchPlayState: state => dispatch(switchPlayState(state))
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)