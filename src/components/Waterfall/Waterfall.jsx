import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import sortBy from 'lodash/sortBy';
import WaterfallItem from './WaterfallItem';
import ZoomIn from '../../assets/zoom-in.svg';
import ZoomOut from '../../assets/zoom-out.svg';

const Root = styled.div`
  background: #fff;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h1`
  font-size: 15px;
  font-weight: normal;
`;

const Btn = styled.button`
  color: ${(p) => p.theme.primary};
  border: 1px solid #eee;
  background: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  padding: 0;
  svg {
    opacity: 0.8;
    width: 15px;
    height: 15px;
  }
`;

const Toolbar = styled.div`
  padding: 10px;
  border: 1px solid #eee;
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`;

const Container = styled.div`
  border: 1px solid #eee;
  overflow-x: overlay;
  background: rgba(0, 30, 255, 0.01);
  box-sizing: border-box;
  flex-grow: 1;
`;

const WaterfallItems = styled.div`
  display: inline-block;
  min-width: 100%;
  overflow-y: auto;
  flex-grow: 1;
`;

export default function Waterfall() {
  const [items, setItems] = useState([]);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [timeframe] = useState(15);

  useEffect(() => {
    fetch('http://localhost:3030/waterfall.txt')
      .then((res) => res.text())
      .then((res) => {
        const ARR = [];
        res.split('\n').forEach((item) => {
          if (!item) return;
          ARR.push(JSON.parse(item));
        });
        const sorted = sortBy(ARR, 'ts');
        const filtered = sorted.filter(
          (item) => item.ts > Date.now() - 1000 * 60 * timeframe
        );
        console.log('FILTER', filtered);

        setItems(filtered);
      });
  }, [timeframe]);

  const start = items.length ? items[0].ts : false;

  useEffect(() => {
    if (!items.length) return;
    const lastItem = items[items.length - 1];
    const pixls = lastItem.end - start;
    const zoomFct = (window.innerWidth / pixls) * 0.9;
    setZoomFactor(zoomFct);
  }, [items]) // eslint-disable-line

  return (
    <Root>
      <Toolbar>
        <Title>Requests Waterfall</Title>
        <div>
          <Btn onClick={() => setZoomFactor(zoomFactor / 0.75)}>
            <ZoomIn />
          </Btn>
          <Btn onClick={() => setZoomFactor(zoomFactor * 0.75)}>
            <ZoomOut />
          </Btn>
        </div>
      </Toolbar>
      <Container>
        <WaterfallItems>
          {items.map((item, idx) => (
            <WaterfallItem
              key={idx}
              item={item}
              zoomFactor={zoomFactor}
              start={start}
              previousItem={items[idx - 1]}
            />
          ))}
        </WaterfallItems>
      </Container>
    </Root>
  );
}
