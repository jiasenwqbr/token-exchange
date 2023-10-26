import React, { Component } from "react";

class MetaMaskWarning extends Component {
  render() {
    return (
      <div className="content">
        <h1 className="text-white">Please download the MetaMask extension.</h1>
        <a href="https://metamask.io/">More info</a>
      </div>
    );
  }
}

export default MetaMaskWarning;
