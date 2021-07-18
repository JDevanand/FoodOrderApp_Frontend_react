import React, { Component } from 'react';
import './Profile.css';
import Header from '../../common/header/Header';


class Profile extends Component {


    constructor() {
        super();
        this.state = {
       
        }
    }

    render(){
        return(
               <div>
                    <Header/>
                   Profile page                  
               </div>     
        )
    }
}

export default Profile;