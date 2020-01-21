import React,{Component} from "react";
import PropTypes from "prop-types";
import {Modal,Button,Checkbox} from "antd";
import styles from "./index.module.less";

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 1 // 1 -> 登录； 2 -> 手机号登录； 3 -> 手机号注册1； 4 -> 手机号注册2； 5 -> 手机号注册3； 6 -> 手机号注册4；
        };
        this.setModalTitle = this.setModalTitle.bind(this);
        this.createFooter = this.createFooter.bind(this);
        this.setStatus = this.setStatus.bind(this);
    }
    setStatus(status) {
        return () => {
            this.state.status = status;
        }
    }
    setModalTitle() {
        switch (this.state.status) {
            case 1:
                return "登录";
            case 2:
                return "手机号登录";
            case 3:case 4:case 5:case 6:
                return "手机号注册";
            default:
                return "";
        }
    }
    createFooter() {
        if(this.state.status == 1 || this.state.status == 6) {
            return null
        }else if(this.state.status == 2) {
            return (
                <div className={style["modalFooter"] + " " + style["clearfix"]}>
                    <div className={style["returnLogin"]} onClick={this.setStatus(1)}>< 其他登录方式</div>
                    <div className={style["turnRegister"]} onClick={this.setStatus(3)}>没有账号？免费注册 ></div>
                </div>
            )
        }else {
            return (
                <div className={style["modalFooter"] + " " + style["clearfix"]}>
                    <div className={style["returnLogin"]} onClick={this.setStatus(1)}>返回登录</div>
                </div>
            )
        }
    }
    render() {
        return (
            <Modal
                title = {this.setModalTitle()}
                footer = {this.createFooter()}
                visible = {this.props.visible}
                maskStyle = {{
                    background: none
                }}
                wrapClassName = {styles.authModal}
            >
                {
                    this.state.status == 1 && 
                    (
                        <div className={style["modal_1"]}>
                            <div className={style["modal_1_btngroup"]}>
                                <img src={require("./images/platform.png")} />
                                <Button type="primary" block>手机号登录</Button>
                                <Button type="default" block>注册</Button>
                            </div>
                            <div className={style["modal_1_privacy"]}>
                                <Checkbox>同意 <a target="_blank" href="http://st.music.163.com/official-terms/service">《服务条款》</a> <a target="_blank" href="http://st.music.163.com/official-terms/privacy">《隐私政策》</a> <a target="_blank" href="https://st.music.163.com/official-terms/children">《儿童隐私政策》</a></Checkbox>    
                            </div>
                        </div>
                    )
                }
            </Modal>
        )
    }
}

Auth.defalutProps = {
    visible: false
}
Auth.propTypes = {
    visible: PropTypes.bool
}