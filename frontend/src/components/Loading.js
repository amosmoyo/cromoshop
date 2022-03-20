import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = ({variant}) => {
  return (
    <Spinner
      animation="border"
      variant="primary"
      className="text-primary"
      role="status"
      style={{
        width: "100px",
        height: "100px",
        margin: "100px auto",
        display: "block",
        color:"blue"
      }}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

Loading.defaultProps = {
 variant:"primary"
}

export default Loading;
