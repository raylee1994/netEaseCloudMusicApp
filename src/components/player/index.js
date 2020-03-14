import React,{Component} from "React";
import styles from "./index.less";
import {Icon} from "antd";
import {connect} from "react-redux";
import {switchPlayState} from "store/Player/action";

class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lock: false,
            focus: false,
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

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
                                {
                                    do {
                                        if(this.state.currentSong.id) {
                                            <img src={require("~/common/images/default_album.jpg")} />
                                        }else {
                                            <img src={this.state.currentSong.al.picUrl} />
                                        }
                                    }
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    playState: state.player.playState,
    trackQueue: state.player.trackQueue,
    playerSetting: state.player.playerSetting
})

const mapDispatchToProps = dispatch => ({
    switchPlayState: state => dispatch(switchPlayState(state))
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)