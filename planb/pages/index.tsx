import { useEffect } from 'react';
import styled from 'styled-components'


const Title = styled.h1`
  color: red;
  font-size: 50px;
`

export default function Home() {
  useEffect(() => {
    const {default:webgazer} = require('webgazer');
    webgazer.begin();
    console.log(webgazer);
    (globalThis as any).webgazer = webgazer;
    // webgazer
    //   .showVideoPreview(true)
    //   .showPredictionPoints(true)
    //   .applyKalmanFilter(true);
  }, []);
  return <Title>My page</Title>
}
