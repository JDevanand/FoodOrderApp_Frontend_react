import React, { Component } from 'react';
import './Details.css';
import Header from '../../common/header/Header';

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

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AddIcon from '@material-ui/icons/Add';
import Badge from '@material-ui/core/Badge';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';


class Details extends Component {


    constructor() {
        super();
        this.state = {
            restaurant: {
                "id": "",
                "restaurant_name": "",
                "photo_URL": "",
                "customer_rating": 0,
                "average_price": 0,
                "number_customers_rated": 0,
                "address": {
                    "id": "",
                    "flat_building_name": "",
                    "locality": "",
                    "city": "",
                    "pincode": "",
                    "state": {
                        "id": "",
                        "state_name": "strng"
                    }
                },
                "categories": [
                    {
                        "id": "",
                        "category_name": "",
                        "item_list": []
                    }
                ]
            },
            orderItemDetails: [],

            cartTotalPrice: 0,
            countofCartItems: 0,

            openSnackBar:0,
            snackBarMessage:""
        }
    }

    componentWillMount() {
        let that = this;
        let dataRestaurant = null;
        let xhrRestaurant = new XMLHttpRequest();
        xhrRestaurant.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    restaurant: JSON.parse(this.responseText)
                });
            }
        });

        xhrRestaurant.open("GET", this.props.baseUrl + "restaurant/" + this.props.match.params.restaurantID);
        xhrRestaurant.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrRestaurant.setRequestHeader("Content-Type", "application/json");
        //xhrMovie.setRequestHeader("Cache-Control", "no-cache");
        xhrRestaurant.send(dataRestaurant);
    }

    addNewItemHandler = (item) => {
        let state = this.state;
        state.countofCartItems += 1;

        //First check if present in cart & update if present
        if (state.orderItemDetails.length !== 0) {
            state.orderItemDetails.map((cartItem) => {
                if (cartItem.item.id === item.id) {
                    state.orderItemDetails.cartItem.quantity += 1;
                    state.orderItemDetails.cartItem.price += item.price;

                    state.cartTotalPrice += item.price;
                    this.setState({
                        state
                    })
                }
                return true;
            })
        }

        //if not in cart, add as new item to cart
        let newItem = {};
        newItem.item = item;//need to add the item with uuid and set quantity and total price
        newItem.quantity = 1;
        newItem.price = newItem.quantity * item.price;
        state.orderItemDetails.push(newItem);
        state.cartTotalPrice += newItem.price;
        this.setState({
            state
        })
    }

    addAdditionalItemHandler = (item) => {
        let state = this.state;
        state.countofCartItems += 1;

        state.orderItemDetails.map((cartItem) => {
            if (cartItem.item.id === item.id) {
                state.orderItemDetails.cartItem.quantity += 1;
                state.orderItemDetails.cartItem.price += item.price;

                state.cartTotalPrice += item.price;
                this.setState({
                    state
                })
            }
            return 1;
        })
    }

    reduceItemHandler = (item) => {
        let state = this.state;
        state.countofCartItems -= 1;

        state.orderItemDetails.map((cartItem) => {
            if (cartItem.item.id === item.id) {
                state.orderItemDetails.cartItem.quantity -= 1;
                state.orderItemDetails.cartItem.price -= item.price;

                state.cartTotalPrice -= item.price;
                this.setState({
                    state
                })
            }
            return true;
        })

    }

    placeOrderClickHandler =()=>{
        let state = this.state;
        
        //if no cart item selected, snackbar msg to add atleast 1 item
        if(state.countofCartItems===0){
            state.snackBarMessage = "Please add an item to your cart!";
            state.openSnackBar = 1;

            this.setState({
                state
            })
            return ;
        }


        //check if user is logged in else snackback msg to login first

        this.props.history.push({
            pathname: '/checkout/',
            orderBuild: this.state
        })
    }

    render() {

        let restaurant = this.state.restaurant;
        let categoryItem = this.state.restaurant.categories;

        return (
            <div>
                <Header />
                <div className="restaurantDetails">

                    <div className="restaurant-image">
                        <img src={restaurant.photo_URL} alt={restaurant.restaurant_name}></img>
                    </div>

                    <div className="restaurantDetails">
                        <div>
                            <Typography variant="headline" component="h2">{restaurant.restaurant_name} </Typography>
                        </div>
                        <br />

                        <div>
                            <Typography variant="headline" component="h2">{restaurant.address.locality} </Typography>
                        </div>
                        <br /><br />

                        <div>
                            <Typography variant="headline" component="h2">{restaurant.categories.category_name} </Typography>
                        </div>

                        <div className="ratingAndAvgPrice">

                            <div className="rating">
                                <div>
                                    <Icon className="fa fa-star" aria-hidden="true" />{restaurant.customer_rating}
                                </div>
                                <Typography variant="headline" component="h2">AVERAGE RATING BY {restaurant.number_customers_rated} CUSTOMERS </Typography>
                            </div>

                            <div className="avgPrice">
                                <div>
                                    <Icon className="fa fa-inr" aria-hidden="true" />{restaurant.average_price}
                                </div>
                                <Typography variant="headline" component="h2">AVERAGE COST FOR TWO PEOPLE</Typography>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="menuAndCart">
                    <Grid container justifyContent="space-between">

                        {/* items in restaurant */}
                        <Grid item xs={12} md={5}>

                            {categoryItem.map(category => (
                                <div key={category.category_name}>
                                    <Typography variant="h6" className="categoryTitle">
                                        {category.category_name}
                                    </Typography>

                                    <Divider />

                                    <List>
                                        {category.item_list.map(item => (
                                            <div key={item.id}>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        {item.type === "VEG"
                                                            ? <Icon className="fa fa-circle " style={{ color: 'green[500]' }} />
                                                            : <Icon className="fa fa-circle " style={{ color: 'red[500]' }} />
                                                        }
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={item.item_name}
                                                    />
                                                    <ListItemText
                                                        primary={item.price}
                                                    />
                                                    <IconButton edge="end" aria-label="delete" onClick={this.addNewItemHandler(item)}>
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
                                    title="My Cart"
                                />

                                <CardContent>
                                    <List>
                                        {this.state.orderItemDetails.map(orderitem => (
                                            <div key={"cart" + orderitem.item.id}>
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
                                                    <ListItemIcon>
                                                    <Icon className="fa fa-minus" onClick={this.reduceItemHandler(orderitem)}/>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={orderitem.quantity}
                                                    />
                                                    <ListItemIcon>
                                                    <Icon className="fa fa-plus" onClick={this.addAdditionalItemHandler(orderitem)}/>
                                                    </ListItemIcon>

                                                    <ListItemIcon>
                                                    <Icon className="fa fa-inr"/>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={orderitem.price}
                                                    />                                                    
                                                </ListItem>,
                                            </div>
                                        ))}
                                    </List>

                                    <Typography>
                                        TOTAL AMOUNT {this.state.cartTotalPrice}
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

            </div >
        )
    }
}

export default Details;