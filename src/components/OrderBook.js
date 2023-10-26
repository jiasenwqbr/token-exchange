import React, { Component } from "react";
import { connect } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Spinner from "./Spinner";
import {
  orderBookSelector,
  orderBookLoadedSelector,
  exchangeSelector,
  accountSelector,
  orderFillingSelector,
} from "../store/selectors";
import { fillOrder } from "../store/interactionsWithChain";

const renderOrder = (order, props) => {
  const { dispatch, exchange, account } = props;
  return (
    <OverlayTrigger
      key={order.id}
      placement="auto"
      overlay={
        <Tooltip id={order.id}>
          {`Click here to ${order.orderFillAction}`}
        </Tooltip>
      }
    >
      <tr
        key={order.id}
        className="order-book-order"
        onClick={(e) => fillOrder(dispatch, exchange, order, account)}
      >
        <td>{order.tokenAmount}</td>
        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
        <td>{order.etherAmount}</td>
      </tr>
    </OverlayTrigger>
  );
};

const showOrderbook = (props) => {
  //render orders list sell orders, show assets, list buy orders
  const { orderBook } = props;
  return (
    <tbody>
      {orderBook.sellOrders.map((order) => renderOrder(order, props))}
      <tr>
        <th>DAPP</th>
        <th>DAPP/ETH</th>
        <th>ETH</th>
      </tr>
      {orderBook.buyOrders.map((order) => renderOrder(order, props))}
    </tbody>
  );
};

class Orderbook extends Component {
  render() {
    return (
      <div className="vertical">
        <div className="card bg-dark text-white">
          <div className="card-header">Order Book</div>
          <div className="card-body order-book">
            <table className="table table-dark table-sm small">
              {this.props.showOrderBook ? (
                showOrderbook(this.props)
              ) : (
                <Spinner type="table" />
              )}
            </table>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const orderBookLoaded = orderBookLoadedSelector(state);
  const orderFilling = orderFillingSelector(state);
  const account = accountSelector(state);
  const exchange = exchangeSelector(state);
  const orderBook = orderBookSelector(state);
  return {
    orderBook: orderBook,
    showOrderBook: orderBookLoaded && !orderFilling,
    account: account,
    exchange: exchange,
  };
}

export default connect(mapStateToProps)(Orderbook);
