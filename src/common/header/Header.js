import React, { Component } from 'react';
import './Header.css';


import FastfoodIcon from '@material-ui/icons/Fastfood';
import SearchIcon from '@material-ui/icons/Search';
import accountlogo from '../../assets/account_circle_black_24dp.svg';
import profilelogo from '../../assets/account_circle_white_24dp.svg';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Icon from '@material-ui/core/Icon';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}


class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            customerFirstName: this.props.customerFirstName !== "" ? this.props.customerFirstName : "",

            modalIsOpen: false,
            tabChangeValue: 0,
            usernameRequired: "dispNone",
            username: "",
            loginPasswordRequired: "dispNone",
            loginPassword: "",
            firstnameRequired: "dispNone",
            firstname: "",
            lastname: "",
            emailRequired: "dispNone",
            email: "",
            registerPasswordRequired: "dispNone",
            registerPassword: "",
            contactRequired: "dispNone",
            contact: "",
            registrationSuccess: false,


            isContactValid: "dispNone",
            isPasswordValid: "dispNone",

            openSnackBar: false,
            snackBarMessage: "",

            openSignUpSuccessSnackBar: false,
            signUpStatus: "",

            profileButtonMenu: false
        }
    }

    openModalHandler = () => {
        this.setState({
            modalIsOpen: true,
            tabChangeValue: 0,
            usernameRequired: "dispNone",
            username: "",
            loginPasswordRequired: "dispNone",
            loginPassword: "",
            firstnameRequired: "dispNone",
            firstname: "",
            lastname: "",
            emailRequired: "dispNone",
            email: "",
            registerPasswordRequired: "dispNone",
            registerPassword: "",
            contactRequired: "dispNone",
            contact: "",

            isContactValid: "dispNone",
            isPasswordValid: "dispNone"
        });
    }

    closeModalHandler = () => {
        this.setState({ modalIsOpen: false });
    }

    tabChangeHandler = (event, value) => {
        this.setState({ tabChangeValue: value });
    }

    inputUsernameChangeHandler = (e) => {
        this.setState({ username: e.target.value });
    }

    inputLoginPasswordChangeHandler = (e) => {
        this.setState({ loginPassword: e.target.value });
    }

    loginClickHandler = () => {
        this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
        this.state.loginPassword === "" ? this.setState({ loginPasswordRequired: "dispBlock" }) : this.setState({ loginPasswordRequired: "dispNone" });

        let dataLogin = null;
        let xhrLogin = new XMLHttpRequest();
        let that = this;
        xhrLogin.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                var response = JSON.parse(this.responseText);
                if (xhrLogin.status === 200) {
                    sessionStorage.setItem("access-token", xhrLogin.getResponseHeader("access-token"));
                    console.log(response);
                    that.setState({
                        loggedIn: true,
                        customerFirstName: response.first_name,
                        snackBarMessage: response.message,
                        openSnackBar: true
                    });
                }

                if (xhrLogin.status !== 200) {
                    that.setState({
                        snackBarMessage: response.message,
                        openSnackBar: true
                    });
                }

            }
        });

        xhrLogin.open("POST", this.props.baseUrl + "customer/login");
        xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(this.state.username + ":" + this.state.loginPassword));
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.send(dataLogin);
    }


    logoutHandler = (e) => {

        //<<have to send logout request to server>>>    
        let dataLogout = null;
        let xhrLogout = new XMLHttpRequest();
        let that = this;
        xhrLogout.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                that.setState({
                    loggedIn: false,
                    customerFirstName: ""
                });
                sessionStorage.removeItem("access-token");
            }
        });

        xhrLogout.open("POST", this.props.baseUrl + "customer/logout");
        xhrLogout.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrLogout.setRequestHeader("Content-Type", "application/json");
        xhrLogout.send(dataLogout);
    }

    inputFirstNameChangeHandler = (e) => {
        this.setState({ firstname: e.target.value });
    }

    inputLastNameChangeHandler = (e) => {
        this.setState({ lastname: e.target.value });
    }

    inputEmailChangeHandler = (e) => {
        this.setState({ email: e.target.value });
    }

    inputRegisterPasswordChangeHandler = (e) => {
        this.setState({ registerPassword: e.target.value });
    }

    inputContactChangeHandler = (e) => {
        this.setState({ contact: e.target.value });
    }

    checkPassword = (inputtxt) => {
        var matchPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        return (inputtxt.value.match(matchPattern));
    }

    registerClickHandler = () => {
        this.state.firstname === "" ? this.setState({ firstnameRequired: "dispBlock" }) : this.setState({ firstnameRequired: "dispNone" });
        this.state.email === "" ? this.setState({ emailRequired: "dispBlock" }) : this.setState({ emailRequired: "dispNone" });
        this.state.registerPassword === "" ? this.setState({ registerPasswordRequired: "dispBlock" }) : this.setState({ registerPasswordRequired: "dispNone" });
        this.state.contact === "" ? this.setState({ contactRequired: "dispBlock" }) : this.setState({ contactRequired: "dispNone" });


        (!isNaN(this.state.contact) || this.state.contact.length !== 10)
            ? this.setState({ isContactValid: "dispBlock" })
            : this.setState({ isContactValid: "dispNone" });


        (this.checkPassword(this.state.registerPassword))
            ? this.setState({ isPasswordValid: "dispBlock" })
            : this.setState({ isPasswordValid: "dispNone" });

        let dataSignup = JSON.stringify({
            "email_address": this.state.email,
            "first_name": this.state.firstname,
            "last_name": this.state.lastname,
            "contact_number": this.state.contact,
            "password": this.state.registerPassword
        });

        let xhrSignup = new XMLHttpRequest();
        let that = this;
        xhrSignup.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                let response = JSON.parse(this.responseText);
                if (xhrSignup.status === 201) {
                    that.setState({
                        snackBarMessage: "Registered successfully! Please login now!",
                        openSnackBar: true,
                        tabChangeValue: 0
                    });
                }

                if (xhrSignup.status !== 201) {
                    that.setState({
                        signUpStatus: response.message,
                        snackBarMessage: response.message,
                        openSnackBar: true
                    });
                }
            }
        });

        xhrSignup.open("POST", this.props.baseUrl + "customer/signup");
        xhrSignup.setRequestHeader("Content-Type", "application/json");
        xhrSignup.send(dataSignup);
    }

    inputSearchRestaurantHandler = (event) => {
        //code for handling search restaurant by name
        this.props.onNameSearch(event.target.value);
    }


    profileClickHandler = (event) => {
        this.setState({
            profileButtonMenu: event.currentTarget
        });
    }

    handleProfileMenuClose = () => {
        this.setState({
            profileButtonMenu: null
        });
    }

    handleProfileMenuItemClick = () => {
        this.props.history.push('/profile');
    }

    handleLoginSbarClose = () => {
        this.setState({
            openSnackBar: false,
            snackBarMessage: ""
        });
    }


    handleSignupSbarClose = () => {
        this.setState({
            openSnackBar: false,
            value: 0,
            usernameRequired: "dispNone",
            username: "",
            loginPasswordRequired: "dispNone",
            loginPassword: "",
            firstnameRequired: "dispNone",
            firstname: "",
            lastnameRequired: "dispNone",
            lastname: "",
            emailRequired: "dispNone",
            email: "",
            registerPasswordRequired: "dispNone",
            registerPassword: "",
            contactRequired: "dispNone",
            contact: ""
        });
    }

    render() {
        return (
            <div>
                <div className="appBar">

                    <IconButton edge="start" className="logo" color="inherit" aria-label="menu">
                        <FastfoodIcon />
                    </IconButton>

                    <div className="searchBar"></div>
                    {(this.props.showSearchBar) &&
                        <FormControl className="searchBar">
                            <Icon className="searchIcon"><SearchIcon /> </Icon>
                            <Input id="searchField" type="text"
                                onChange={this.inputSearchRestaurantHandler} placeholder="Search by Restaurant Name" />
                        </FormControl>
                    }
                    <div className="searchBar"></div>

                    {!this.state.loggedIn ?
                        <div className="login-button">
                            <Button variant="contained" color="default" onClick={this.openModalHandler}>
                                <img src={accountlogo} className="account-logo" alt="account Logo" />Login
                            </Button>
                        </div>
                        :
                        <div className="profile-button">
                            <Button variant="contained" color="default" aria-controls="simple-menu" onClick={this.profileClickHandler}>
                                <img src={profilelogo} className="profile-logo" alt="profile Logo" />
                                {this.state.customerFirstName}
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={this.state.profileButtonMenu}
                                keepMounted
                                open={Boolean(this.state.profileButtonMenu)}
                                onClose={this.handleProfileMenuClose}
                            >
                                <MenuItem onClick={this.handleProfileMenuClick}>Profile</MenuItem>
                                <MenuItem onClick={this.logoutHandler}>Logout</MenuItem>
                            </Menu>
                        </div>
                    }
                </div>

                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeModalHandler}
                    style={customStyles}
                >
                    <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label="Login" />
                        <Tab label="SignUp" />
                    </Tabs>

                    {this.state.tabChangeValue === 0 &&
                        <TabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="username">Contact No.</InputLabel>
                                <Input id="username" type="text" username={this.state.username} onChange={this.inputUsernameChangeHandler} />
                                <FormHelperText className={this.state.usernameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="loginPassword">Password</InputLabel>
                                <Input id="loginPassword" type="password" loginpassword={this.state.loginPassword} onChange={this.inputLoginPasswordChangeHandler} />
                                <FormHelperText className={this.state.loginPasswordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />

                            {this.state.logInStatus !== "" &&
                                <FormControl>
                                    <span className="red">
                                        {this.state.logInStatus}
                                    </span>
                                </FormControl>
                            }

                            <br /><br />
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                        </TabContainer>
                    }

                    {this.state.tabChangeValue === 1 &&
                        <TabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="firstname">First Name</InputLabel>
                                <Input id="firstname" type="text" firstname={this.state.firstname} onChange={this.inputFirstNameChangeHandler} />
                                <FormHelperText className={this.state.firstnameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl>
                                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                <Input id="lastname" type="text" lastname={this.state.lastname} onChange={this.inputLastNameChangeHandler} />
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" type="text" email={this.state.email} onChange={this.inputEmailChangeHandler} />
                                <FormHelperText className={this.state.emailRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="registerPassword">Password</InputLabel>
                                <Input id="registerPassword" type="password" registerpassword={this.state.registerPassword} onChange={this.inputRegisterPasswordChangeHandler} />
                                <FormHelperText className={this.state.registerPasswordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.isPasswordValid}>
                                    <span className="red">Password must contain at least one capital letter, one small letter, one number, and one special character and 8-15 characters long</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="contact">Contact No.</InputLabel>
                                <Input id="contact" type="text" contact={this.state.contact} onChange={this.inputContactChangeHandler} />
                                <FormHelperText className={this.state.contactRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.isContactValid}>
                                    <span className="red">Contact No. must contain only numbers and must be 10 digits long</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            {this.state.registrationSuccess === true &&
                                <FormControl>
                                    <span className="successText">
                                        Registration Successful. Please Login!
                                    </span>
                                </FormControl>
                            }


                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                open={this.state.openSignUpSuccessSnackBar}
                                autoHideDuration={6000}
                                onClose={this.handleSignupSbarClose}
                                message="Registered successfully! Please login now!"
                                action={
                                    <React.Fragment>
                                        <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleSignupSbarClose}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </React.Fragment>
                                }
                            />
                            <br /><br />
                            <Button variant="contained" color="primary" onClick={this.registerClickHandler}>SignUp</Button>
                        </TabContainer>
                    }
                </Modal>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openSnackBar}
                    autoHideDuration={6000}
                    onClose={this.handleLoginSbarClose}
                    message={this.state.snackBarMessage}
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleLoginSbarClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                /> 
            </div>
        )
    }
}

export default Header;