import React, { Component } from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AddIcon from '@material-ui/icons/Add';
import Badge from '@material-ui/core/Badge';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';


class Details extends Component {


    constructor() {
        super();
        this.addNewItemHandler = this.addNewItemHandler.bind(this);
        this.state = {
            restaurant: {
                address: {
                    id: "",
                    flat_building_name: "",
                    locality: "",
                    city: "",
                    pincode: "",
                    state: {}
                },
                categories: [
                    {
                        id: "",
                        category_name: "",
                        item_list: [
                            {
                                id: "",
                                item_name: "",
                                price: 0,
                                type: ""
                            }
                        ]
                    }
                ]
            },

            orderItemDetails: [],
            cartTotalPrice: 0,
            countofCartItems: 0,

            openSnackBar: false,
            snackBarMessage: ""
        }
    }

    componentWillMount() {
        fetch(this.props.baseUrl + "restaurant/" + this.props.match.params.restaurantId, {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(response1 => {
                this.setState({
                    restaurant: response1
                })
            })
            .catch(err => {
                console.log(err);
            });
    }

    addNewItemHandler = (item) => {
        let state = this.state;

        let availableItem = state.orderItemDetails.filter(cartItem => cartItem.item.id === item.id);
        let index = state.orderItemDetails.indexOf(availableItem[0]);

        //First check if present in cart & update if present
        if (index >= 0) {
            state.orderItemDetails[index]["quantity"] += 1;
            state.orderItemDetails[index]["price"] += item.price;
            state.cartTotalPrice += item.price;
            state.countofCartItems += 1;
            this.setState({
                state: state
            })

        } else {
            //if not in cart, add as new item to cart
            let newItem = {};
            newItem.item = item;//need to add the item with uuid and set quantity and total price
            newItem.quantity = 1;
            newItem.price = newItem.quantity * item.price;
            state.orderItemDetails.push(newItem);
            state.cartTotalPrice += newItem.price;
            state.countofCartItems += 1;
            this.setState({
                state: state
            })
        }

        this.setState({
            openSnackBar: true,
            snackBarMessage: "Item added to cart!"
        })

    }

    handleSnackbarClose = () => {
        this.setState({
            openSnackBar: false,
            snackBarMessage: ""
        });
    }

    addAdditionalItemHandler = (item) => {
        let state = this.state;
        let index = state.orderItemDetails.indexOf(item);

        state.orderItemDetails[index]["price"] += item.price / item.quantity;
        state.orderItemDetails[index]["quantity"] += 1;
        state.cartTotalPrice += item.price / item.quantity;
        state.countofCartItems += 1;
        this.setState({
            state
        })
    }

    reduceItemHandler = (item) => {
        console.log(item);
        let state = this.state;
        let index = state.orderItemDetails.indexOf(item);

        state.cartTotalPrice -= item.price / item.quantity;
        state.orderItemDetails[index].price -= item.price / item.quantity;
        state.orderItemDetails[index].quantity -= 1;
        state.countofCartItems -= 1;

        if (state.orderItemDetails[index].quantity === 0) {
            state.orderItemDetails.splice(index, 1);
        }

        this.setState({
            state
        })
    }

    placeOrderClickHandler = () => {
        let state = this.state;

        //if no cart item selected, snackbar msg to add atleast 1 item
        if (state.countofCartItems === 0) {
            state.snackBarMessage = "Please add an item to your cart!";
            state.openSnackBar = true;

            this.setState({
                state: state
            });
            return;
        }

        //check if user is logged in else snackback msg to login first
        if (sessionStorage.getItem("access-token") == null) {
            state.snackBarMessage = "Please login first!";
            state.openSnackBar = true;

            this.setState({
                state: state
            })
            return;
        }

        this.props.history.push({
            pathname: '/checkout/',
            orderBuild: this.state,
        })
    }

    render() {

        let restaurant = this.state.restaurant;
        let categoryItem = this.state.restaurant.categories;

        return (
            <div>
                <Header baseUrl={this.props.baseUrl} />
                <div className="restaurant-details-pic">
                    <Card className="card-detailspage">
                        <CardMedia
                            className="restaurant-image"
                            component="img"
                            height = "180"
                            alt={restaurant.restaurant_name}
                            image={restaurant.photo_URL}
                            title={restaurant.restaurant_name}
                        />

                        <div className="restaurant-details">
                            <CardContent className="card-content">
                                <Typography component="h5" variant="h5">
                                    {restaurant.restaurant_name}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {restaurant.address["locality"]}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {restaurant.categories.category_name}
                                </Typography>

                                <div className="ratingAndAvgPrice">
                                    <div className="rating">
                                        <div>
                                            <Icon className="fa fa-star" aria-hidden="true" />{restaurant.customer_rating}
                                        </div>
                                        <Typography variant="subtitle1" color="textSecondary">AVERAGE RATING BY {restaurant.number_customers_rated} CUSTOMERS </Typography>
                                    </div>

                                    <div className="avgPrice">
                                        <div>
                                            <Icon className="fa fa-inr" aria-hidden="true" />{restaurant.average_price}
                                        </div>
                                        <Typography variant="subtitle1" color="textSecondary">AVERAGE COST FOR TWO PEOPLE</Typography>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                </div>

                <div className="menuAndCart">
                    <Grid container justifyContent="space-between">

                        {/* items in restaurant */}
                        <Grid item xs={12} md={5}>

                            {categoryItem.map(category => (
                                <div key={category.category_name}>
                                    <Typography variant="h6" className="categoryTitle" color="textSecondary">
                                        {category.category_name}
                                    </Typography>

                                    <Divider />

                                    <List>
                                        {category.item_list.map(item => (
                                            <div key={item.id}>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        {item.item_type === "NON_VEG"
                                                            ? <Icon className="fa fa-circle " style={{ color: 'red' }} />
                                                            : <Icon className="fa fa-circle " style={{ color: 'green' }} />
                                                        }
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={item.item_name}
                                                    />
                                                    <ListItemText
                                                        primary={item.price}
                                                    />
                                                    <IconButton edge="end" aria-label="delete" onClick={() => this.addNewItemHandler(item)}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </ListItem>,
                                            </div>
                                        ))}
                                    </List>
                                </div>
                            ))}
                        </Grid>

                        {/* My cart components */}
                        <Grid item xs={12} md={5}>
                            <Card className="cart">
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="recipe" className="cartAvatar">
                                            <Badge color="secondary" badgeContent={this.state.countofCartItems} showZero>
                                                <ShoppingCartIcon />
                                            </Badge>
                                        </Avatar>
                                    }
                                    title={<Typography variant="h6" className="categoryTitle" color="textPrimary">
                                        My Cart
                                    </Typography>}
                                />

                                <CardContent>
                                    <List>
                                        {(this.state.orderItemDetails !== null) &&
                                            this.state.orderItemDetails.map(orderitem => (
                                                <div key={"cart" + orderitem.item.id}>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {orderitem.item.item_type === "VEG"
                                                                ? <Icon className="fa fa-stop-circle-o " style={{ color: 'green' }} />
                                                                : <Icon className="fa fa-stop-circle-o " style={{ color: 'red' }} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={orderitem.item.item_name}
                                                        />
                                                        <ListItemIcon>
                                                            <Icon className="fa fa-minus" onClick={() => this.reduceItemHandler(orderitem)} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={orderitem.quantity}
                                                        />
                                                        <ListItemIcon>
                                                            <Icon className="fa fa-plus" onClick={() => this.addAdditionalItemHandler(orderitem)} />
                                                        </ListItemIcon>

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

                                    <Typography variant="h6" color="textPrimary">
                                        TOTAL AMOUNT                                       
                                            <Icon className="fa fa-inr" />                                       
                                        {this.state.cartTotalPrice}
                                    </Typography>
                                </CardContent>

                                <CardActions disableSpacing>
                                    <Button variant="contained" color="primary" onClick={this.placeOrderClickHandler}>
                                        CHECKOUT
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </div >

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
            </div >
        )
    }
}

export default Details;