// OVERLAY means it goes _on top_ of the video call
// POPUP means the little drop-down icon in the corner of your screen
import * as React from "react";
import * as ReactDOM from "react-dom";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    * {
        box-sizing: border-box;
        background-color: blue;
    }
`

const Main = () => {
  return (
      <>
      <GlobalStyles/>
      <Div>test</Div>;
      </>
  )
};

const Div = styled.div`
  background-color: red;
`;

ReactDOM.render(<Main />, document.getElementById("root"));;
