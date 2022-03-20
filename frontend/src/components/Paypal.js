import React from "react";
import Loader from "./Loading";

import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

// const currency = "USD";
const style = { layout: "vertical" };

const Paypal = ({ currency, showSpinner, amount, onApproveHandler }) => {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  // React.useEffect(() => {
  //   dispatch({
  //     type: "resetOptions",
  //     value: {
  //       ...options,
  //       currency: currency,
  //     },
  //   });
  // }, [dispatch, currency, options]);

  return (
    <>
      {showSpinner && isPending && <Loader />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                },
              ],
            })
            .then((orderId) => {
              console.log(orderId, 'orderId')
              // Your code here after create the order
              return orderId;
            });
        }}
        onApprove={onApproveHandler}
      />
    </>
  );
};

export default Paypal;
