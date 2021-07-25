
import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import FormHelperText from '@material-ui/core/FormHelperText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import './Checkout.css';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));

export default function Checkout(props) {
    const classes = useStyles();   
    const [activeStep, setActiveStep] = React.useState(0); 
    const steps = getSteps();
    const receivedProps = props.location.orderBuild;
    //const {restaurant, orderItemDetails, cartTotalPrice} = props.location.orderBuild;
    const [paymentMode, setpaymentMode] = React.useState("");
    const [address, setAddress] = React.useState("");

    function getSteps() { 
        console.log(props.location.orderBuild);
        //receivedProps = props.location.orderBuild;
        return ['Delivery', 'Payment'];
    }

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <DeliveryAddress {...props} addressSelection={checkoutAddressSelect} />
            case 1:
                return <PaymentMode {...props} paymentModeSelection={paymentModeSelect} />
            default:
                return 'Unknown step';
        }
    }

    function paymentModeSelect(paymentid) {
        setpaymentMode(paymentid);
    }

    function checkoutAddressSelect(addressid) {
        setAddress(addressid);
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    /* send back to details page but with all the currentt state attributes in props*/
    const handleChangeClick = () => {
        setActiveStep(0);
    }

    const placeOrderClickHandler = () => {

        let billno = 102;
        let dataOrder = JSON.stringify({            
                "address_id": address,
                "payment_id": paymentMode,
                "bill": billno,
                "discount": 0,
                "coupon_id": "",
                "restaurant_id": receivedProps.restaurant.id,
                "item_quantities": receivedProps.orderItemDetails            
        });

        let xhrSaveOrder = new XMLHttpRequest();
        let that = this;
        xhrSaveOrder.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                if (xhrSaveOrder.status === 201) {

                    let orderSuccessMessage = "Order placed successfully! Your order ID is" + JSON.parse(this.responseText).id
                    that.setState({
                        snackBarMessage: orderSuccessMessage,
                        openSnackBar: true
                    });
                }

                if (xhrSaveOrder.status !== 201) {
                    that.setState({
                        snackBarMessage: JSON.parse(this.responseText).message,
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

    return (
        <div>
            <Header {...props} />

            <div className={classes.root}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {getStepContent(index)}
                                <div className={classes.actionsContainer}>
                                    <div>
                                        <Button
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            className={classes.button}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            className={classes.button}
                                        >
                                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                        </Button>
                                    </div>
                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={classes.resetContainer}>
                        <Typography>View the summary and place your order now!</Typography>
                        <Button onClick={handleChangeClick} className="btn-change">
                            CHANGE
                        </Button>
                    </Paper>
                )}
            </div>

 
            <div className="orderSummaryCard">
                        
                        <Card className="summaryCard">
                            <CardHeader
                                title="Summary"
                            />
                            <br /><br />
                            <CardContent>
                                <List>
                                    <ListItemText
                                        primary={receivedProps.restaurant.restaurant_name} 
                                    />
                                    <br />
                                    {receivedProps.orderItemDetails.map(orderitem => (
                                        <div key={"placeOrder" + orderitem.item.id}>
                                            <ListItem>
                                                <ListItemIcon>
                                                    {orderitem.item.type === "VEG"
                                                        ? <Icon className="fa fa-stop-circle-o " style={{ color: 'green[500]' }} />
                                                        : <Icon className="fa fa-stop-circle-o " style={{ color: 'red[500]' }} />
                                                    }
                                                </ListItemIcon>
                                                <ListItemText primary={orderitem.item.item_name}/>
                                                <ListItemText primary={orderitem.quantity}/>
                                                <ListItemIcon>
                                                    <Icon className="fa fa-inr" />
                                                </ListItemIcon>
                                                <ListItemText primary={orderitem.price}/>
                                            </ListItem>,
                                        </div>
                                    ))}
                                </List>
                                <Divider />
                                <br />
                                <Typography>
                                    NET AMOUNT {receivedProps.cartTotalPrice}
                                </Typography>
                            </CardContent>
                            <br />
                            <CardActions disableSpacing>
                                <Button variant="contained" color="primary" onClick={placeOrderClickHandler}>
                                    Place Order
                                </Button>
                            </CardActions>
                        </Card>
                    </div>

        </div>
    
    );
}


class PaymentMode extends Component {

    constructor() {

        super();
        this.state = {
            paymentModes: []
        }
    }

    paymentModeClick = (event) => {
        this.props.paymentModeSelection(event.target.value);
    }

    componentWillMount() {
        //Get all payment methodse
        fetch(this.props.baseUrl + "payment", {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("access-token")
            }
        })
            .then(response => response.json())
            .then(response1 => {
                this.setState({
                    paymentModes: response1.paymentMethods
                })
                console.log(this.state.paymentModes);
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <FormControl component="fieldset">
                <FormLabel component="legend">Select Mode of Payment</FormLabel>
                <RadioGroup aria-label="paymentMode" name="paymentMode" value="" onChange={() => this.paymentModeClick.bind(this)}>
                    {this.state.paymentModes.map(modes => (
                        <FormControlLabel key={modes.uuid} value={modes.uuid} control={<Radio />} label={modes.payment_name} checked={false} />
                    ))}
                </RadioGroup>
            </FormControl>
        )
    }
}

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

class DeliveryAddress extends Component {

    constructor() {
        super();
        this.state = {

            addresses: [{
                state:{}
            }],
            states: [],
            addressTabValue: 0,

            saveAddressRequest: {
                "flat_building_name": "",
                "locality": "",
                "city": "",
                "pincode": "",
                "state_uuid": ""
            },

            stateName: "",
            saveAddressStatus: {}, //required to hold error messages from server            

            openSnackBar: false,
            snackBarMessage: ""
        }
    }

    componentWillMount() {
        //Get customer addresses
        this.getAddressList();

        //Get All states
        fetch(this.props.baseUrl + "/states", {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(response1 => {
                this.setState({
                    states: response1.states
                })
            })
            .catch(err => {
                console.log(err);
            });
    }

    tabChangeHandler = (event, value) => {
        this.setState({ addressTabValue: value });
    }

    addressSelectHandler = (addressUuid) => {
        this.props.addressSelection(addressUuid);
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
        let selectedStateName = "";

        for (let i = 0; i < this.state.states.length; i++) {
            if (this.state.states[i]["id"] === event.target.value) {

                saveAddressDetail.state_uuid = this.state.states[i]["id"];
                selectedStateName = this.state.states[i]["state_name"];
            }
        }

        this.setState({
            saveAddressRequest: saveAddressDetail,
            stateName: selectedStateName
        })
    }

    inputPincodeChangeHandler = (event) => {
        let saveAddressDetail = this.state.saveAddressRequest;
        saveAddressDetail.pincode = event.target.value;
        this.setState({
            saveAddressRequest: saveAddressDetail
        });
    }

    saveAddressClickHandler = () => {

        let dataAddress = JSON.stringify(this.state.saveAddressRequest);

        let xhrSaveAddress = new XMLHttpRequest();
        let that = this;
        xhrSaveAddress.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                if (xhrSaveAddress.status !== 201) {
                    that.setState({
                        saveAddressStatus: JSON.parse(this.responseText),
                        snackBarMessage: JSON.parse(this.responseText).message,
                        openSnackBar: true,
                    });
                }

                if (xhrSaveAddress.status === 201) {
                    that.setState({
                        saveAddressStatus: JSON.parse(this.responseText),
                        snackBarMessage: JSON.parse(this.responseText).status,
                        openSnackBar: true,
                        addressTabValue: 0,
                    });
                    this.getAddressList();
                }
            }
        });

        xhrSaveAddress.open("POST", this.props.baseUrl + "/address");
        xhrSaveAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
        xhrSaveAddress.send(dataAddress);
    }

    getAddressList = () => {
        //Get customer addresses after new address is added

        fetch(this.props.baseUrl + "address/customer", {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("access-token")
            }
        })
            .then(response => response.json())
            .then(response1 => {
                this.setState({
                    addresses: response1.addresses
                })

                console.log(this.state.addresses);
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {

        let saveAddress = this.state.saveAddressRequest;

        return (
            <div>
                <Tabs className="tabs" value={this.state.addressTabValue} onChange={this.tabChangeHandler}>
                    <Tab label="Existing Address" />
                    <Tab label="New Address" />
                </Tabs>
  
                {(this.state.addressTabValue === 0) &&
                    <TabContainer>
                        <div className = "addrestList-container">
                        <ImageList cols={3} className="addressGridList" spacing={2}>
                            {(this.state.addresses !== null) &&
                                this.state.addresses.map(address => (
                                    <ImageListItem key={"add" + address.id} className="addressDetail" onClick={() => this.addressSelectHandler.bind(this, address.id)}>
                                        <Typography>
                                            {address.flat_building_name}
                                            {address.locality}
                                            {address.city}
                                            {address.state}
                                            {address.pincode}
                                        </Typography>
                                        <ImageListItemBar
                                            actionIcon={
                                                <IconButton className="addressSelectIcon">
                                                    <CheckCircleIcon />
                                                </IconButton>}
                                        />
                                    </ImageListItem>))}
                        </ImageList>
                        </div>
                    </TabContainer>
                }               


                {this.state.addressTabValue === 1 &&
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="flatBuildingNo">Flat / Building No.</InputLabel>
                            <Input id="flatBuildingNo" type="text" username={saveAddress.flat_building_name} onChange={this.inputflatBuildingNoChangeHandler} />
                            <FormHelperText className={saveAddress.flat_building_name === "" ? "dispBlock" : "dispNone"}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />

                        <FormControl required>
                            <InputLabel htmlFor="locality">Locality</InputLabel>
                            <Input id="locality" type="text" username={saveAddress.locality} onChange={this.inputlocalityChangeHandler} />
                            <FormHelperText className={saveAddress.locality === "" ? "dispBlock" : "dispNone"}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />

                        <FormControl required>
                            <InputLabel htmlFor="city">City</InputLabel>
                            <Input id="city" type="text" username={saveAddress.city} onChange={this.inputcityChangeHandler} />
                            <FormHelperText className={saveAddress.city === "" ? "dispBlock" : "dispNone"}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />

                        <FormControl required>
                            <InputLabel id="state">State</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={this.state.id}
                                onChange={this.inputStateChangeHandler}
                                placeholder = {this.state.stateName}
                            >
                                {this.state.states.map(state => (
                                    <MenuItem key={state.state_name} value={state.id} >{state.state_name}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText className={saveAddress.state_uuid === "" ? "dispBlock" : "dispNone"}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />

                        <FormControl required>
                            <InputLabel htmlFor="pincode">Pincode</InputLabel>
                            <Input id="pincode" type="text" username={saveAddress.pincode} onChange={this.inputPincodeChangeHandler} />
                            <FormHelperText className={saveAddress.pincode === "" ? "dispBlock" : "dispNone"}>
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

                        <Button variant="contained" color="secondary" onClick={this.saveAddressClickHandler}>SAVE ADDRESS</Button>

                    </TabContainer>
                }

                {/*Common SnackBar*/}
                < Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }
                    }
                    open={this.state.openSnackBar}
                    autoHideDuration={6000}
                    onClose={this.handleSnackbarClose}
                    message={this.state.snackBarMessage}
                    action={
                        < React.Fragment >
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleSnackbarClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />

            </div>
        )
    }
}