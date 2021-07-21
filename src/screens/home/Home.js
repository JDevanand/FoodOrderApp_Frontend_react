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
            restaurants: []
        }
    }

    componentWillMount() {
        let that = this;
        let dataRestaurant = null;
        let xhrAllRestaurant = new XMLHttpRequest();
        xhrAllRestaurant.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    restaurants: JSON.parse(this.responseText).restaurants
                });
            }
        });

        xhrAllRestaurant.open("GET", this.props.baseUrl + "restaurant");
        //xhrMovie.setRequestHeader("Cache-Control", "no-cache");
        xhrAllRestaurant.send(dataRestaurant);
    }

    restaurantClickHandler=(restaurantId)=>{
        this.props.history.push('/restaurant/' + restaurantId);
    }

    render() {
        return (
            <div>
                <Header />
                <div className="flex-container">
                    {this.state.restaurants.map(restaurant => (
                        <Card className="card" key={"home" + restaurant.id} onClick={() => this.restaurantClickHandler(restaurant.id)}>
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
                                    <br/><br/>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {restaurant.categories}
                                    </Typography>
                                    <br/>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <div className="restaurantRating">
                                        <Icon className="fa fa-star" aria-hidden="true" />
                                        {restaurant.customer_rating}({restaurant.number_customers_rated})
                                        </div>
                                        <div>
                                        <Icon className="fa fa-inr" aria-hidden="true"/>
                                        {restaurant.average_price} for two
                                        </div>
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }
}

export default Home;