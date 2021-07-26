
import React, { Component } from 'react';
import Header from '../../common/header/Header';

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
        width: '70%',
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
    const [paymentMode, setPaymentMode] = React.useState("");
    const [address, setAddress] = React.useState("");

    const [snackBarMessage, setSnackBarMessage] = React.useState("");
    const [opensnackBar, setOpenSnackBar] = React.useState(false);
    const [saveAddressTab, setSaveAddressTab] = React.useState(false);

    function handleSnackbarClose() {
        setSnackBarMessage("");
        setOpenSnackBar(false);
    }

    function getSteps() {
        console.log(props);
        console.log(props.location.orderBuild);
        return ['Delivery', 'Payment'];
    }

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <DeliveryAddress {...props} addressSelection={checkoutAddressSelect} address={address} saveAddressTab={saveAddressTabSelected} />
            case 1:
                return <PaymentMode {...props} paymentModeSelection={paymentModeSelect} paymentMode={paymentMode} />
            default:
                return 'Unknown step';
        }
    }

    const saveAddressTabSelected = (value) => {
        setSaveAddressTab(value);
    }

    const paymentModeSelect = (paymentid) => {
        setPaymentMode(paymentid);
    }

    function checkoutAddressSelect(addressid) {
        setAddress(addressid);
    }

    const handleNext = () => {
        if (activeStep === 0) {
            if (address !== "") { setActiveStep((prevActiveStep) => prevActiveStep + 1) };
        }

        if (activeStep === 1) {
            if (paymentMode !== "") {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }
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
        let itemQuantityPrice = [];
        for (let val of receivedProps.orderItemDetails) {
            let obj = {};
            obj.item_id = val.item.id;
            obj.quantity = val.quantity;
            obj.price = val.price;
            itemQuantityPrice.push(obj);
        }

        let dataOrder = JSON.stringify({
            "address_id": address,
            "payment_id": paymentMode,
            "bill": billno,
            "discount": 0,
            "coupon_id": "",
            "restaurant_id": receivedProps.restaurant.id,
            "item_quantities": itemQuantityPrice
        });

        let xhrSaveOrder = new XMLHttpRequest();
        xhrSaveOrder.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {

                if (xhrSaveOrder.status === 201) {

                    let orderSuccessMessage = "Order placed successfully! Your order ID is" + JSON.parse(this.responseText).id
                    setSnackBarMessage(orderSuccessMessage);
                    setOpenSnackBar(true);
                }

                if (xhrSaveOrder.status !== 201) {
                    setSnackBarMessage(JSON.parse(this.responseText).message);
                    setOpenSnackBar(true);
                }

            }
        });

        xhrSaveOrder.open("POST", props.baseUrl + "/order");
        xhrSaveOrder.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrSaveOrder.setRequestHeader("Content-Type", "application/json");
        xhrSaveOrder.send(dataOrder);
    }

    return (
        <div>           
     
            <Header {...props} />
        <div className ="checkout-page-container">
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
                                            onClick={!saveAddressTab ? handleNext : ""}
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
                        <Typography component="h5" variant="h5">View the summary and place your order now!</Typography>
                        <Button onClick={handleChangeClick} className="btn-change">
                            CHANGE
                        </Button>
                    </Paper>
                )}
            </div>
            <div className="orderSummaryCard">

                <Card className="summaryCard">
                    <CardHeader
                        title={<Typography component="h4" variant="h4">Summary</Typography>}                            
                    />
                    <br />
                    <CardContent>
                        <List>
                            <ListItemText 
                                primary={<Typography component="h5" variant="h5">{receivedProps.restaurant.restaurant_name}</Typography>}
                            />
                            <br />
                            {receivedProps.orderItemDetails.map(orderitem => (
                                <div key={"placeOrder" + orderitem.item.id}>
                                    <ListItem>
                                        <ListItemIcon>
                                            {orderitem.item.item_type === "VEG"
                                                ? <Icon className="fa fa-stop-circle-o " style={{ color: 'green' }} />
                                                : <Icon className="fa fa-stop-circle-o " style={{ color: 'red' }} />
                                            }
                                        </ListItemIcon>
                                        <ListItemText primary={orderitem.item.item_name} />
                                        <ListItemText/>
                                        <ListItemText primary={orderitem.quantity} />
                                        <ListItemText/>
                                        <ListItemIcon>
                                            <Icon className="fa fa-inr" />
                                        </ListItemIcon>
                                        <ListItemText primary={orderitem.price} />
                                    </ListItem>,
                                </div>
                            ))}
                        </List>
                        <Divider />
                        <br />
                        <Typography component="h5" variant="h5">
                            NET AMOUNT 
                            <Icon className="fa fa-inr" /> 
                            {receivedProps.cartTotalPrice}
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

            < Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={opensnackBar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackBarMessage}
                action={
                    < React.Fragment >
                        <IconButton size="small" aria-label="close" color="inherit" onClick={{ handleSnackbarClose }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </div>
        </div>

    );
}


class PaymentMode extends Component {

    constructor(props) {

        super(props);
        this.state = {
            paymentModes: [],
            paymentSelectValue: props.paymentMode !== "" ? props.paymentMode : ""
        }
    }

    paymentModeClick = (event) => {
        this.setState({
            paymentSelectValue: event.target.value
        })
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
                <RadioGroup aria-label="paymentMode" name="paymentMode" value={this.state.paymentSelectValue} onChange={this.paymentModeClick}>
                    {this.state.paymentModes.map(modes => (
                        <FormControlLabel
                            key={modes.id}
                            value={modes.id}
                            control={<Radio />}
                            label={modes.payment_name}
                        />
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

    constructor(props) {
        super(props);
        this.state = {

            addresses: [],
            states: [],
            addressTabValue: 0,

            addressSelected: props.address !== "" ? props.address : "",

            saveAddressRequest: {
                "flat_building_name": "",
                "locality": "",
                "city": "",
                "pincode": "",
                "state_uuid": ""
            },
            isRequiredFlatBuilding: "dispNone",
            isRequiredLocality: "dispNone",
            isRequiredCity: "dispNone",
            isRequiredPincode: "dispNone",
            isRequiredState: "dispNone",
            isPincodeValid: "dispNone",

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
        if (value === 1) {
            this.props.saveAddressTab(true);
        } else {
            this.props.saveAddressTab(false);
        }
    }

    addressSelectHandler = (addressUuid) => {

        console.log(this.state.addressSelected);
        if (this.state.addressSelected === "") {
            this.setState({
                addressSelected: addressUuid
            })
            this.props.addressSelection(addressUuid);
        } else {
            this.setState({
                addressSelected: ""
            })
            this.props.addressSelection("");
        }
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

        for (let val of this.state.states) {
            if (val["id"] === event.target.value) {
                saveAddressDetail.state_uuid = val["id"];
                selectedStateName = val["state_name"];
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

    handleSnackbarClose =()=>{
        this.setState({
            openSnackBar: false,
            snackBarMessage: ""
        });
    }

    saveAddressClickHandler = () => {

        this.state.saveAddressRequest.flat_building_name === ""
            ? this.setState({ isRequiredFlatBuilding: "dispBlock" })
            : this.setState({ isRequiredFlatBuilding: "dispNone" });

        this.state.saveAddressRequest.locality === "" ? this.setState({ isRequiredLocality: "dispBlock" }) : this.setState({
            isRequiredLocality: "dispNone"
        });
        this.state.saveAddressRequest.city === "" ? this.setState({ isRequiredCity: "dispBlock" }) : this.setState({
            isRequiredCity: "dispNone"
        });
        this.state.saveAddressRequest.state_uuid === "" ? this.setState({ isRequiredState: "dispBlock" }) : this.setState({
            isRequiredState: "dispNone"
        });
        if (this.state.saveAddressRequest.pincode === "") { this.setState({ isRequiredPincode: "dispBlock" }) }
        else {
            (!isNaN(this.state.saveAddressRequest.pincode) || this.state.saveAddressRequest.pincode.length !== 6)
                ? this.setState({ isPincodeValid: "dispBlock" })
                : this.setState({ isPincodeValid: "dispNone" });
        }

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
                    that.getAddressList();
                }
            }
        });

        xhrSaveAddress.open("POST", this.props.baseUrl + "/address");
        xhrSaveAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
        xhrSaveAddress.send(dataAddress);
    }

    getAddressList = () => {

        fetch(this.props.baseUrl + "address/customer", {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("access-token")
            }
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    addresses: response.addresses
                })
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
                        <div className="chkoutAddrestList-container">
                            <ImageList cols={3} className="chkoutAddressGridList" gap={2} rowHeight='auto'>
                                {(this.state.addresses !== null) &&
                                    this.state.addresses.map(address => (
                                        <ImageListItem key={"add" + address.id} className="chkoutAddressDetail" onClick={() => this.addressSelectHandler(address.id)}>
                                            <Paper elevation={1} variant='outlined'>
                                                <p>{address.flat_building_name}</p>
                                                <p>{address.locality}</p>
                                                <p>{address.city}</p>
                                                <p>{address.state.state_name}</p>
                                                <p>{address.pincode}</p>
                                            </Paper>
                                            <ImageListItemBar className="chkoutAddressListItemBar"
                                                actionIcon={this.state.addressSelected !== address.id
                                                    ? <IconButton className="chckoutaddressSelectIcon">
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                    : <IconButton className="chckoutaddressSelectIconGreen">
                                                        <CheckCircleIcon style={{ color: "green" }} />
                                                    </IconButton>
                                                }
                                                actionPosition='right'
                                            />
                                        </ImageListItem>))
                                }

                                {(this.state.addresses === null) &&
                                    <p>There are no saved addresses! You can save an address using the 'New Address' tab or using your ‘Profile’ menu option.</p>
                                }

                            </ImageList>
                        </div>
                    </TabContainer>
                }


                {this.state.addressTabValue === 1 &&
                    <TabContainer className='chckout-saveAddress-container'>
                        <FormControl required>
                            <InputLabel htmlFor="flatBuildingNo">Flat / Building No.</InputLabel>
                            <Input id="flatBuildingNo" type="text" username={saveAddress.flat_building_name} onChange={this.inputflatBuildingNoChangeHandler} />
                            <FormHelperText className={this.state.isRequiredFlatBuilding}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />

                        <FormControl required>
                            <InputLabel htmlFor="locality">Locality</InputLabel>
                            <Input id="locality" type="text" username={saveAddress.locality} onChange={this.inputlocalityChangeHandler} />
                            <FormHelperText className={this.state.isRequiredLocality}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />

                        <FormControl required>
                            <InputLabel htmlFor="city">City</InputLabel>
                            <Input id="city" type="text" username={saveAddress.city} onChange={this.inputcityChangeHandler} />
                            <FormHelperText className={this.state.isRequiredCity}>
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
                                placeholder={this.state.stateName}
                            >
                                {this.state.states.map(state => (
                                    <MenuItem key={state.state_name} value={state.id} >{state.state_name}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText className={this.state.isRequiredState}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />

                        <FormControl required>
                            <InputLabel htmlFor="pincode">Pincode</InputLabel>
                            <Input id="pincode" type="text" username={saveAddress.pincode} onChange={this.inputPincodeChangeHandler} />
                            <FormHelperText className={this.state.isRequiredPincode}>
                                <span className="red">required</span>
                            </FormHelperText>
                            <FormHelperText className={this.state.isPincodeValid}>
                                <span className="red">Pincode must contain only numbers and must be 6 digits long</span>
                            </FormHelperText>

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