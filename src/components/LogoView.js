// components are "dumb" react components that are not aware of redux
// they receive data from their parents through regular react props
// they are allowed to have local component state and view logic
// use them to avoid having view logic & local component state in "smart" components

import _ from 'lodash';
import React, { Component } from 'react';
// import logo from '../../img/logo.svg';
import '../matchviewer.css';

export default class LogoView extends Component {

  render() {
    return (
        <div className="logo">
         
        </div>
    );
  }

}
