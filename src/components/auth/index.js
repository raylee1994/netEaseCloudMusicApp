import React, { Component } from "react";
import { Modal, Button, Checkbox, message, Input, Select, Form } from "antd";
import styles from "./index.module";
import countryCode from "common/js/country-code";
import http from "apis/http";
import apisPaths from "apis/paths";
import {connect} from "react-redux";
import {loginCellphone} from "store/user/action";
import {createAjax} from "common/js/utils";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 1, // 1 -> 登录； 2 -> 手机号登录； 3 -> 手机号注册1； 4 -> 手机号注册2； 5 -> 手机号注册3； 6 -> 手机号注册4； 7 -> 重设密码1；8 -> 重设密码2；
      agree: false,
      phoneCode: "86",
      phone: "",
      password: "",
      remember_login: 1,
      loading: false,
      showTips: false,
      hasPhone: false,
      hasPassword: false,
    };
    this.setModalTitle = this.setModalTitle.bind(this);
    this.createFooter = this.createFooter.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.changePolicy = this.changePolicy.bind(this);
    this.changeAutoLogin = this.changeAutoLogin.bind(this);
    this.setPhoneCode = this.setPhoneCode.bind(this);
    this.setPhone = this.setPhone.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.showPassWordTips = this.showPassWordTips.bind(this);
    this.logIn = this.logIn.bind(this);
    this.checkPhone3 = this.checkPhone3.bind(this);
    this.checkPassWord3 = this.checkPassWord3.bind(this);
    this.register = this.register.bind(this);
  }
  setStatus(status) {
    return () => {
      this.setState({
        status,
        agree: false,
        phoneCode: "86",
        phone: "",
        password: "",
        showTips: false,
        hasPhone: false,
        hasPassword: false,
      });
    };
  }
  setModalTitle() {
    switch (this.state.status) {
      case 1:
        return "登录";
      case 2:
        return "手机号登录";
      case 3:
      case 4:
      case 5:
      case 6:
        return "手机号注册";
      case 7:
      case 8:
        return "重设密码";
      default:
        return "";
    }
  }
  createFooter() {
    if (this.state.status == 1 || this.state.status == 6) {
      return null;
    } else if (this.state.status == 2) {
      return (
        <div className={style["modalFooter"] + " " + style["clearfix"]}>
          <div className={style["returnLogin"]} onClick={this.setStatus(1)}>
            &lt; 其他登录方式
          </div>
          <div className={style["turnRegister"]} onClick={this.setStatus(3)}>
            没有账号？免费注册 &gt;
          </div>
        </div>
      );
    } else {
      return (
        <div className={style["modalFooter"] + " " + style["clearfix"]}>
          <div className={style["returnLogin"]} onClick={this.setStatus(1)}>
            返回登录
          </div>
        </div>
      );
    }
  }
  changePolicy(e) {
    this.setState({
      agree: e.target.checked
    });
  }
  changeAutoLogin(e) {
    this.setState({
      remember_login: e.target.checked ? 1 : 0
    });
  }
  checkPolicy(status) {
    return () => {
      if (!this.state.agree) {
        message.destroy();
        message.open({
          content: "请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》"
        });
        return;
      }
      this.setState({
        status
      });
    };
  }
  logIn() {
    if (!this.state.phone) {
      message.destroy();
      message.error("请输入手机号码");
      return;
    }
    if (!this.state.password) {
      message.destroy();
      message.error("请输入登录密码");
      return;
    }
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.state.phone)) {
      message.destroy();
      message.error("请输入正确的手机号");
      return;
		}
		this.setState({
			loading: true
    });
    const successCallback = res => {
      this.switchAuthModal(false)
      this.setState({
        loading: false
      });
    }
    const failCallback = res => {
      message.destroy();
      message.error(res.data.msg);
      this.setState({
        loading: false
      });
    }
    const errCallback = error => {
      if (error.response) {
        message.destroy();
        message.error(error.response.data);
      } else if (error.request) {
        message.destroy();
        message.error(error.request);
      } else {
        message.destroy();
        message.error(error.message);
      }
      this.setState({
        loading: false
      });
    }
    this.props.loginCellphone({
      phone: this.state.phone,
      password: this.state.password,
      countrycode: this.state.phoneCode
    }, successCallback, failCallback, errCallback)
  }
  register() {
    this.setState({
      status: 4
    })
    createAjax(http.post(apisPaths["/captcha/sent"], {
      phone: this.state.phone
    }), res => {

    })
  }
  setPhoneCode(e) {
    this.setState({
      phoneCode: e.target.value
    });
  }
  setPhone(e) {
    this.setState({
      phone: e.target.value
    });
  }
  setPassword(e) {
    this.setState({
      password: e.target.value
    });
  }
  checkPhone3(e) {
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(e.target.value)) {
      this.setState({
        hasPhone: true
      })
    }else {
      this.setState({
        hasPhone: false
      })
    }
    this.setState({
      phone: e.target.value
    });
  }
  checkPassWord3(e) {
    var checkSpace = this.checkSpace(e.target.value)
    var checkLength = this.checkLength(e.target.value)
    var checkFormat = this.checkFormat(e.target.value)
    if(checkSpace && checkLength && checkFormat) {
      this.setState({
        hasPassword: true
      })
    }else {
      this.setState({
        hasPassword: false
      })
    }
    this.setState({
      password: e.target.value
    });
  }
  showPassWordTips() {
    this.setState({
      showTips: true
    })
  }
  checkSpace(password) {
    return password.test(/\s/g) ? "red" : ""
  }
  checkFormat(password) {
    var test1 = /(\d)/g.test(password)
    var test2 = /[a-z]/gi.test(password)
    var test3 = /\S\D[^a-z]/gi.test(password)
    var arr = [test1, test2, test3]
    var length = arr.filter(function(item) {
      return item
    })
    return length >= 2 ? "red" : ""
  }
  checkLength(password) {
    return (password.length < 6 || password.length > 16) ? "red" : ""
  }
  hidePhone(phone) {
    var arr = phone.split("");
    arr.splice(3,4,"*","*","*","*")
    var str = arr.join("")
    return str
  }
  getDerivedStateFromProps(props, state) {
    if(props.authModalVisibility == false) {
      return {
        status: 1, 
        agree: false,
        phoneCode: "86",
        phone: "",
        password: "",
        remember_login: 1,
        loading: false,
        hasPhone: false,
        hasPassword: false,
      }
    }
    return null
  }
  render() {
    const InputGroup = Input.Group;
    const { Option } = Select;
    const optionItems = countryCode.map((item, index) => {
      return (
        <Option value={item.code.substring(1)}>
          {item.cn} {item.code}
        </Option>
      );
    });
    return (
      <Modal
        title={this.setModalTitle()}
        footer={this.createFooter()}
        visible={this.props.authModalVisibility}
        maskStyle={{
          background: "none"
        }}
        wrapClassName={styles.authModal}
      >
        {this.state.status == 1 && (
          <div className={style["modal_1"]}>
            <div className={style["modal_1_btngroup"]}>
              <img src={require("./images/platform.png")} />
              <Button type="primary" onClick={this.checkPolicy(2)} block>
                手机号登录
              </Button>
              <Button type="default" onClick={this.checkPolicy(3)} block>
                注册
              </Button>
            </div>
            <div className={style["modal_1_privacy"]}>
              <Checkbox onChange={this.changePolicy}>
                同意{" "}
                <a
                  target="_blank"
                  href="http://st.music.163.com/official-terms/service"
                >
                  《服务条款》
                </a>{" "}
                <a
                  target="_blank"
                  href="http://st.music.163.com/official-terms/privacy"
                >
                  《隐私政策》
                </a>{" "}
                <a
                  target="_blank"
                  href="https://st.music.163.com/official-terms/children"
                >
                  《儿童隐私政策》
                </a>
              </Checkbox>
            </div>
          </div>
        )}
        {this.state.status == 2 && (
          <div className={style["modal_2"]}>
            <div className={style["modal_2_inputgroup"]}>
              <InputGroup compact>
                <Select defaultValue={this.state.phoneCode} onChange={this.setPhoneCode}>
                  {optionItems}
                </Select>
                <Input placeholder="请输入手机号" onChange={this.setPhone} />
              </InputGroup>
              <br />
              <Input.Password
                placeholder="请输入密码"
                autocomplete="off"
                onChange={this.setPassword}
              />
            </div>
            <div className="clearfix">
              <div className="fl">
                <Checkbox onChange={this.changeAutoLogin}>自动登录 </Checkbox>
              </div>
              <div className="fr">
                <a href="javascript:;" onClick={this.checkPolicy(7)}>
                  忘记密码？
                </a>
              </div>
            </div>
            <br />
            <Button type="primary" onClick={this.logIn} loading={this.state.loading} block>
              登录
            </Button>
          </div>
        )}
        {this.state.status == 3 && (
          <div className={style["modal_3"]}>
            <div className={style["modal_3_inputgroup"]}>
              <p>手机号：</p> 
              <InputGroup compact>
                <Select defaultValue={this.state.phoneCode} onChange={this.setPhoneCode}>
                  {optionItems}
                </Select>
                <Input placeholder="请输入手机号" onChange={this.checkPhone3} />
              </InputGroup>
              <p>密码：</p> 
              <Input.Password
                placeholder="设置登录密码，不少于6位"
                autocomplete="off"
                onChange={this.checkPassWord3}
                onFocus={this.showPassWordTips}
              />
              <p style={{display: this.state.showTips ? "block" : "none"}} className={this.checkSpace(this.state.password)}>密码不能包含空格</p> 
              <p style={{display: this.state.showTips ? "block" : "none"}} className={this.checkFormat(this.state.password)}>包含字母、数字、符号中至少两种</p> 
              <p style={{display: this.state.showTips ? "block" : "none"}} className={this.checkLength(this.state.password)}>密码长度为6-16位</p> 
            </div>
            <br />
            <Button type="primary" disabled={!this.hasPhone || !this.hasPassword} onClick={this.register} block>
              下一步
            </Button>
          </div>
        )}
        {this.state.status == 4 && (
          <div className={style["modal_4"]}>
            <div className={style["modal_4_inputgroup"]}>
              <p>你的手机号：+{this.state.phoneCode} {this.hidePhone(this.state.phone)}</p> 
              <p>为了安全，我们会给你发送短信验证码</p>
            </div>
            <br />
            <Button type="primary" disabled={!this.hasPhone || !this.hasPassword} onClick={this.register} block>
              下一步
            </Button>
          </div>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  authModalVisibility: state.user.authModalVisibility
})

const mapDispatchToProps = dispatch => ({
  loginCellphone: (params, successCallback, failCallback, errCallback) => dispatch(loginCellphone(params, successCallback, failCallback, errCallback)),
  switchAuthModal: visibility => dispatch(switchAuthModal(visibility))
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth)


