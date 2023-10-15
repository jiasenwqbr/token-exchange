import React, { Component } from "react";
import { connect } from "react-redux";
import Balance from "./Balance";
import NewOrder from "./NewOrder";
import OrderBook from "./OrderBook";
import PriceChart from "./PriceChart";
import MyTransactions from "./MyTransactions";
import Trades from "./Trades";
import {
  loadAllOrders,
  subscribeToEvents,
} from "../store/interactionsWithChain";
import { exchangeSelector } from "../store/selectors";
class Content extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props);
  }
  async loadBlockchainData(props) {
    const { dispatch, exchange } = props;
    await loadAllOrders(exchange, dispatch);
    //await subscribeToEvents(exchange, dispatch);
  }

  render() {
    return (
      <div className="content">
        <div className="vertical-split">
          <Balance />
          <NewOrder />
        </div>
        <OrderBook />
        <div className="vertical-split">
          <PriceChart />
          <MyTransactions />
        </div>
        <Trades />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    exchange: exchangeSelector(state),
  };
}
export default connect(mapStateToProps)(Content);
