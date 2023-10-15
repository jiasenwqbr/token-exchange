import React, { Component } from "react";
import { Tabs, Tab } from "react-bootstrap";

class MyTransactions extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">My Transactions</div>
        <div className="card-body">
          <Tabs defaultActiveKey="trades" className="bg-dark text-white">
            <Tab eventKey="trades" title="Trades" className="bg-dark">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>MORDE</th>
                    <th>MORDE/ETH</th>
                  </tr>
                </thead>
                {/* {this.props.showMyFilledOrders ? (
                  showMyFilledOrders(this.props)
                ) : (
                  <Spinner type="table" />
                )} */}
              </table>
            </Tab>
            <Tab eventKey="orders" title="Orders">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>MORDE/ETH</th>
                    <th>Cancel</th>
                  </tr>
                </thead>
                {/* {this.props.showMyOpenOrders ? (
                  showMyOpenOrders(this.props)
                ) : (
                  <Spinner type="table" />
                )} */}
              </table>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default MyTransactions;
