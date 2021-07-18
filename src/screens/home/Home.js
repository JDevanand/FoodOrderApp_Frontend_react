import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';


class Home extends Component {


    constructor() {
        super();
        this.state = {
       
        }
    }

    render(){
        return(
               <div>
                    <Header/>
                   Home page                  
               </div>     
        )
    }
}

export default Home;