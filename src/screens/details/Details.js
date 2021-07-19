import React, { Component } from 'react';
import './Details.css';
import Header from '../../common/header/Header';

import Typography from '@material-ui/core/Typography';

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
                                    <i class="fa fa-star" aria-hidden="true"></i>{restaurant.customer_rating}
                                </div>
                                <div>
                                    <Typography variant="headline" component="h2">AVERAGE RATING BY {restaurant.number_customers_rated} CUSTOMERS </Typography>
                                </div>
                            </div>

                            <div className="avgPrice">
                                <div>
                                <i class="fa fa-inr" aria-hidden="true"></i>{restaurant.average_price}
                                </div>

                                <div>
                                <Typography variant="headline" component="h2">AVERAGE COST FOR TWO PEOPLE</Typography>
                                </div>
                            </div>                            
                        </div>

                    </div>

                </div>

                <div className="menuAndCart">
                    <div className="menu">

                    </div>

                    <div className="cart">

                    </div>
                </div>

            </div>
        )
    }
}

export default Details;