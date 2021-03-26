// OVERLAY means it goes _on top_ of the video call
// POPUP means the little drop-down icon in the corner of your screen
import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

const Main = () => {
  return <Div>test</Div>;
};

const Div = styled.div`
  background-color: red;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

function init() {
  let myDiv = document.createElement("div");
  document.body.appendChild(myDiv);

  ReactDOM.render(<Main />, myDiv);
}

init();
