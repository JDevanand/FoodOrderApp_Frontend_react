import React, { Component } from 'react';
import './Details.css';
import Header from '../../common/header/Header';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Icon from '@material-ui/core/Icon';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

class Details extends Component {


    constructor() {
        super();
        this.state = {
            restaurant: {}
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

    render() {

        let restaurant = this.state.restaurant;

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
                                    <Icon className="fa fa-star" aria-hidden="true"/>{restaurant.customer_rating}
                                </div>
                                <div>
                                    <Typography variant="headline" component="h2">AVERAGE RATING BY {restaurant.number_customers_rated} CUSTOMERS </Typography>
                                </div>
                            </div>

                            <div className="avgPrice">
                                <div>
                                <Icon className="fa fa-inr" aria-hidden="true"/>{restaurant.average_price}
                                </div>

                                <div>
                                    <Typography variant="headline" component="h2">AVERAGE COST FOR TWO PEOPLE</Typography>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="menuAndCart">
                    <Grid container justifyContent="space-between">
                        <Grid item xs={12} md={5}>
                            <Typography variant="h6" className={classes.title}>
                                Category Name in light text
                            </Typography>
                            <div className="menu-item">
                                <List>
                                    {generate(
                                        <ListItem>       
                                        <ListItemIcon>
                                          <FolderIcon/>
                                        </ListItemIcon>                                               
                                        <ListItemText
                                          primary="Single-line item"                                   
                                        />
                                        <ListItemText
                                          primary="Price"                   
                                          
                                        />
                                         <IconButton edge="end" aria-label="delete">
                                            <AddIcon />
                                          </IconButton> 
                                      </ListItem>,
                                    )}
                                </List>
                            </div>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Card className="cart">
                                

                            </Card>
                        </Grid>
                    </Grid>

                </div>

            </div>
        )
    }
}

export default Details;