import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

import 'font-awesome/css/font-awesome.min.css';

class Home extends Component {


    constructor() {
        super();
        this.state = {
            restaurants: [],
        }
    }

    componentWillMount() {
        this.searchRestaurants("");
    }

    getAllRestaurants = () => {        

        /*
        let that = this;
        let dataRestaurant = null;
        let xhrAllRestaurant = new XMLHttpRequest();
        xhrAllRestaurant.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let fetchedData = [];
                fetchedData.push(JSON.parse(this.responseText).restaurants);
                that.setState({
                    restaurants: fetchedData
                });
            }
        });

        xhrAllRestaurant.open("GET", this.props.baseUrl + "restaurant");
        xhrAllRestaurant.setRequestHeader("Content-Type", "application/json");
        xhrAllRestaurant.send(dataRestaurant);
        */
        
        fetch(this.props.baseUrl + "restaurant", {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    restaurants: response.restaurants
                })
            })
            .catch(err => {
                console.log(err);
            });
    }


    searchRestaurants = (searchString) => {
        this.setState({
            restaurants: []
        })
        if (searchString === "") {
            this.getAllRestaurants();
        } else {
            this.searchByRestaurantName(searchString);
        }
    }

    searchByRestaurantName = (searchString) => {
        ///api/restaurant/name/{restaurantName}
        /*
        let that = this;
        let dataRestaurant = null;
        let xhrRestaurantByName = new XMLHttpRequest();
        xhrRestaurantByName.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let fetchedData1 = [];
                fetchedData1.push(JSON.parse(this.responseText).restaurants);
                that.setState({
                    restaurants: fetchedData1
                });
            }
        });

        xhrRestaurantByName.open("GET", this.props.baseUrl + "restaurant/name/" + searchString);
        xhrRestaurantByName.setRequestHeader("Content-Type", "application/json");
        xhrRestaurantByName.send(dataRestaurant);
        */

        fetch(this.props.baseUrl + "restaurant/name/" + searchString, {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(response1 => {
                this.setState({
                    restaurants: response1.restaurants
                })
            })
            .catch(err => {
                console.log(err);
            });
    }

    restaurantClickHandler = (restaurantId) => {
        this.props.history.push('/restaurant/' + restaurantId);
    }

    render() {
        return (
            <div>
                <Header showSearchBar={true} baseUrl={this.props.baseUrl} onNameSearch={this.searchRestaurants} />

                <div className="flex-container">
                    {(this.state.restaurants!==null) &&                    
                     this.state.restaurants.map(restaurant => (
                        <div className="card" key={"home" + restaurant.id}>
                            <Card>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        alt={restaurant.restaurant_name}
                                        height="140"
                                        image={restaurant.photo_URL}
                                        title={restaurant.restaurant_name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {restaurant.restaurant_name}
                                        </Typography>
                                        <br /><br />
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {restaurant.categories}
                                        </Typography>
                                        <br />

                                        <Typography variant="body2" color="textSecondary" component="p">
                                            <Icon className="fa fa-star" aria-hidden="true" />
                                            {restaurant.customer_rating}({restaurant.number_customers_rated})
                                        </Typography>

                                        <Typography>
                                            <Icon className="fa fa-inr" aria-hidden="true" />
                                            {restaurant.average_price} for two
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </div>
                        ))}         
                </div>                
            </div>
        )
    }
}

export default Home;