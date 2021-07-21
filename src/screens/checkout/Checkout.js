import React, { Component } from 'react';
import './Checkout.css';
import Header from '../../common/header/Header';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';

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

class Checkout extends Component {


    constructor() {
        super();
        this.state = {
            addresses: [],
            paymentModes: [],
            states: [],

            checkoutDetails: {},

            saveAddressRequest: {
                "flat_building_name": "",
                "locality": "",
                "city": "",
                "pincode": "",
                "state_uuid": ""
            },

            addressTabValue: 0,

            saveAddressStatus: {}, //required to hold error messages from server            

            openSnackBar: 0,
            snackBarMessage: ""
        }
    }

    componentWillMount() {


        let that = this;

        //Set state attributes from details page to checkout page
        let currentState = this.state;
        currentState = this.props.orderBuild;
        this.setState({ state: currentState });

        //Get customer addresses
        let dataAddress = null;
        let xhrAddress = new XMLHttpRequest();

        xhrAddress.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                that.setState({
                    addresses: JSON.parse(this.responseText)
                });

            }
        });

        xhrAddress.open("GET", this.props.baseUrl + "/address/customer");//
        xhrAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrAddress.setRequestHeader("Content-Type", "application/json");
        xhrAddress.send(dataAddress);


        //Get payment methods
        let dataPayment = null;
        let xhrPayment = new XMLHttpRequest();
        that = this;
        xhrPayment.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                that.setState({
                    paymentModes: JSON.parse(this.responseText)
                });

            }
        });

        xhrPayment.open("GET", this.props.baseUrl + "payment");//
        xhrPayment.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrPayment.setRequestHeader("Content-Type", "application/json");
        xhrPayment.send(dataPayment);

        //Get All States
        let dataStates = null;
        let xhrStates = new XMLHttpRequest();
        that = this;
        xhrStates.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                that.setState({
                    states: JSON.parse(this.responseText)
                });

            }
        });

        xhrStates.open("GET", this.props.baseUrl + "/states");
        xhrStates.setRequestHeader("Content-Type", "application/json");
        xhrStates.send(dataStates);

    }

    saveAddressClickHandler = () => {

        let dataAddress = JSON.stringify(this.state.saveAddressRequest);

        let xhrSaveAddress = new XMLHttpRequest();
        that = this;
        xhrSaveAddress.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                if (xhrSignup.getStatusLine().getStatusCode() !== 201) {
                    that.setState({
                        saveAddressStatus: JSON.parse(this.responseText)
                    });
                }

                if (xhrSignup.getStatusLine().getStatusCode() === 201) {
                    that.setState({
                        saveAddressStatus: JSON.parse(this.responseText),
                        openSnackBar: 1,
                        snackBarMessage: "Address added successfully!"
                    });
                }

            }
        });

        xhrSaveAddress.open("POST", this.props.baseUrl + "/address");
        xhrSaveAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
        xhrSaveAddress.send(dataAddress);
    }

    paymentModeClick = (event) => {
        let checkout = this.state.checkoutDetails;
        //method to add new attributes to object
        checkout["payment_id"] = event.target.value;
        this.setState({
            checkoutDetails: checkout
        });
    }

    getStateName = (stateid) => {
        this.state.states.map(state => {
            if (state.state_uuid === stateid) return state.state_name;
            return "";
        });
    }


    inputflatBuildingNoChangeHandler = (event) => {
        let saveAddressDetail = this.state.saveAddressRequest;
        saveAddressDetail.flat_building_name = event.target.value;
        this.setState({
            saveAddressRequest: saveAddressDetail
        });
    }

    inputlocalityChangeHandler = (event) => {
        let saveAddressDetail = this.state.saveAddressRequest;
        saveAddressDetail.locality = event.target.value;
        this.setState({
            saveAddressRequest: saveAddressDetail
        });
    }

    inputcityChangeHandler = (event) => {
        let saveAddressDetail = this.state.saveAddressRequest;
        saveAddressDetail.city = event.target.value;
        this.setState({
            saveAddressRequest: saveAddressDetail
        });
    }

    inputStateChangeHandler = (event) => {
        let saveAddressDetail = this.state.saveAddressRequest;
        this.state.states.map(state => {
            if (state.state_uuid == event.target.value) saveAddressDetail.state_uuid = state.state_uuid;

        })
        this.setState({
            saveAddressRequest: saveAddressDetail
        })
    }

    inputPincodeChangeHandler = (event) => {
        let saveAddressDetail = this.state.saveAddressRequest;
        saveAddressDetail.pincode = event.target.value;
        this.setState({
            saveAddressRequest: saveAddressDetail
        });
    }

    tabChangeHandler = (event, value) => {
        this.setState({ addressTabValue: value });
    }

    {/* <<<Making check circle button change to green to be implemented>>> */ }
addressSelectHandler = (event) => {

}

placeOrderClickHandler = () => {
    let dataOrder = JSON.stringify(this.state.checkoutDetails);

    let xhrSaveOrder = new XMLHttpRequest();
    that = this;
    xhrSaveOrder.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {

            if (xhrSignup.getStatusLine().getStatusCode() === 201) {
                that.setState({
                    snackBarMessage: JSON.parse(this.responseText),
                    openSnackBar: true
                });
            }

            if (xhrSignup.getStatusLine().getStatusCode() !== 201) {
                that.setState({
                    snackBarMessage: JSON.parse(this.responseText),
                    openSnackBar: true
                });
            }

        }
    });

    xhrSaveOrder.open("POST", this.props.baseUrl + "/order");
    xhrSaveOrder.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
    xhrSaveOrder.setRequestHeader("Content-Type", "application/json");
    xhrSaveOrder.send(dataOrder);
}

handleSnackbarClose = () => {
    this.setState({
        openSnackBar: 0,
        snackBarMessage: ""
    })
}

render() {
    let saveAddress = this.state.saveAddressRequest;

    return (

        < div >
            <Header />

            {/* Radio button for payment modes */}
            <FormControl component="fieldset">
                <FormLabel component="legend">Select Mode of Payment</FormLabel>
                <RadioGroup aria-label="paymentMode" name="gender1" onChange={this.paymentModeClick}>
                    {this.state.paymentModes.map(modes => (
                        <FormControlLabel key={modes.uuid} value={modes.uuid} control={<Radio />} label={modes.payment_name} />
                    ))}
                </RadioGroup>
            </FormControl>

            {/*Tabs and its contents                
                <<<Needs to be changed to menu heading change>>>
                */}

            <Tabs className="tabs" value={this.state.addressTabValue} onChange={this.tabChangeHandler}>
                <Tab label="Existing Address" />
                <Tab label="New Address" />
            </Tabs>

            {/*Existing address tab contents 
                
                <<Check circle icon change on address selection to be implemented>>
                */}
            {
                this.state.value === 0 &&
                <TabContainer>
                    <GridList cols={3} className="addressGridList" spacing={2}>
                        {this.state.addresses.map(address => (
                            <GridListTile key={"add" + address.id} className="addressDetail" onClick={this.addressSelectHandler}>
                                <Typography>
                                    {address.flat_building_name}
                                    {address.locality}
                                    {address.city}
                                    {address.state}
                                    {address.pincode}
                                </Typography>
                                <IconButton>
                                    <CheckCircleIcon />
                                </IconButton>
                            </GridListTile>
                        ))}
                    </GridList>
                </TabContainer>
            }

            {/*New address tab contents*/}
            {this.state.value === 1 &&
                <TabContainer>

                    <FormControl required>
                        <InputLabel htmlFor="flatBuildingNo">Flat / Building No.</InputLabel>
                        <Input id="flatBuildingNo" type="text" username={saveAddress.flat_building_name} onChange={this.inputflatBuildingNoChangeHandler} />
                        <FormHelperText className={saveAddress.flat_building_name == "" ? "dispBlock" : "dispNone"}>
                            <span className="red">required</span>
                        </FormHelperText>
                    </FormControl>
                    <br /><br />

                    <FormControl required>
                        <InputLabel htmlFor="locality">Locality</InputLabel>
                        <Input id="locality" type="text" username={saveAddress.locality} onChange={this.inputlocalityChangeHandler} />
                        <FormHelperText className={saveAddress.locality == "" ? "dispBlock" : "dispNone"}>
                            <span className="red">required</span>
                        </FormHelperText>
                    </FormControl>
                    <br /><br />

                    <FormControl required>
                        <InputLabel htmlFor="city">City</InputLabel>
                        <Input id="city" type="text" username={saveAddress.city} onChange={this.inputcityChangeHandler} />
                        <FormHelperText className={saveAddress.city == "" ? "dispBlock" : "dispNone"}>
                            <span className="red">required</span>
                        </FormHelperText>
                    </FormControl>
                    <br /><br />

                    <FormControl required>
                        <InputLabel id="state">State</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={this.getStateName(saveAddress.state_uuid)}
                            onChange={this.inputStateChangeHandler}
                        >
                            {this.state.states.map(state => (
                                <MenuItem key={state.state_name} value={state.id}>{state.state_name}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText className={saveAddress.state_uuid == "" ? "dispBlock" : "dispNone"}>
                            <span className="red">required</span>
                        </FormHelperText>
                    </FormControl>
                    <br /><br />

                    <FormControl required>
                        <InputLabel htmlFor="pincode">Pincode</InputLabel>
                        <Input id="pincode" type="text" username={saveAddress.pincode} onChange={this.inputPincodeChangeHandler} />
                        <FormHelperText className={saveAddress.pincode == "" ? "dispBlock" : "dispNone"}>
                            <span className="red">required</span>
                        </FormHelperText>

                        {/*Pincode error to be fetched and updated properly*/}
                        {this.state.saveAddressStatus !== null &&
                            <FormHelperText >
                                <span className="red">Pincode must contain only numbers and must be 6 digits long</span>
                            </FormHelperText>
                        }
                    </FormControl>
                    <br /><br />

                    {this.state.registrationSuccess === true &&
                        <FormControl>
                            <span className="successText">
                                Registration Successful. Please Login!
                            </span>
                        </FormControl>
                    }
                    <br /><br />

                    <Button variant="contained" color="secondary" onClick={this.saveAddressClickHandler}>SAVE ADDRESS</Button>

                </TabContainer>
            }

            {/* Summary section */}
            <Card className="summaryCard">
                <CardHeader
                    title="Summary"
                />
                <br/><br/>
                <CardContent>
                    <List>
                        <ListItemText
                            primary={this.state.restaurant.restaurant_name}
                        />
                        <br/>
                        {this.state.orderItemDetails.map(orderitem => (
                            <div key={"placeOrder" + orderitem.item.id}>
                                <ListItem>
                                    <ListItemIcon>
                                        {orderitem.item.type === "VEG"
                                            ? <Icon className="fa fa-stop-circle-o " style={{ color: 'green[500]' }} />
                                            : <Icon className="fa fa-stop-circle-o " style={{ color: 'red[500]' }} />
                                        }
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={orderitem.item.item_name}
                                    />
                                    <ListItemText
                                        primary={orderitem.quantity}
                                    />
                                    <ListItemIcon>
                                        <Icon className="fa fa-inr" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={orderitem.price}
                                    />
                                </ListItem>,
                            </div>
                        ))}
                    </List>
                    <Divider />
                    <br />
                    <Typography>
                        NET AMOUNT {this.state.cartTotalPrice}
                    </Typography>
                </CardContent>

                <br />

                <CardActions disableSpacing>
                    <Button variant="contained" color="primary" onClick={this.placeOrderClickHandler}>
                        Place Order
                    </Button>
                </CardActions>
            </Card>

            {/*Common SnackBar*/}
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.state.openSnackBar}
                autoHideDuration={6000}
                onClose={this.handleSnackbarClose}
                message={this.state.snackBarMessage}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleSnackbarClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </div >
    )
}
}


export default Checkout;