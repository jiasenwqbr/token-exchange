import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import Spinner from "./Spinner";

class Balance extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">Balance</div>
        <div className="card-body"></div>
      </div>
    );
  }
}

function mapStateToProps(state) {}
export default connect(mapStateToProps)(Balance);
