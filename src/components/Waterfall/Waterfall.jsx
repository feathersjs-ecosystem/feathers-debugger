import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import sortBy from 'lodash/sortBy';
import ReactTooltip from 'react-tooltip';
import WaterfallItem from './WaterfallItem';
import ZoomIn from '../../assets/zoom-in.svg';
import ZoomOut from '../../assets/zoom-out.svg';
import Sync from '../../assets/sync.svg';
import Tail from '../../assets/eye.svg';
import TailDisabled from '../../assets/eye-o.svg';
import Trash from '../../assets/trash.svg';

const Root = styled.div`
  background: #fff;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;
const PortInput = styled.input`
  font-size: 15px;
  font-weight: normal;
  height: 30px;
  border: 1px solid #eee;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 3px;
  margin: 0;
  padding: 0 10px;
  width: 80px;
  outline: 0;
  font-weight: bold;
`;

const BtnGroup = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
  button {
    margin: 0;
    border-radius: 0;
    border-right: 0;
    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
    &:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      border-right: 1px solid #eee;
    }
  }
`;

const Title = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
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
  min-width: 28px;
  padding: 0 10px;
  flex-shrink: 0;
  height: 35px;
  font-size: 11px;
  color: #333;
  &:active {
    background: #635380;
    color: white;
    svg {
      fill: #fff;
    }
  }
  ${(p) =>
    p.active === true &&
    css`
      background: #635380;
      color: white;
      svg {
        fill: #fff;
      }
    `}
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
  .right {
    display: flex;
    align-items: center;
  }
`;

const Container = styled.div`
  border: 1px solid #eee;
  border-bottom: none;
  overflow-x: overlay;
  box-sizing: border-box;
  flex-grow: 1;
`;

const WaterfallItems = styled.div`
  display: inline-block;
  min-width: 100%;
  flex-grow: 1;
`;

const Caption = styled.div`
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #ccc;
  display: inline-block;
  margin-right: 5px;
`;

let interval;
let portTimeout;

export default function Waterfall() {
  const [port, setPort] = useState(localStorage.getItem('port') || 3030);
  const [items, setItems] = useState([]);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [fetchError, setFetchError] = useState(false);
  const [timeframe, setTimeframe] = useState(
    Number(localStorage.getItem('timeframe')) || 3
  );
  const [autoZoom, setAutozoom] = useState(true);
  const [tail, setTail] = useState(false);

  const toggleTail = (val) => {
    clearInterval(interval);
    if (val) setAutozoom(true);
    setTail(val);
  };

  const fetchData = () =>
    fetch(`http://localhost:${port}/waterfall.txt`)
      .then((res) => res.text())
      .then((res) => {
        setFetchError(false);
        const ARR = [];
        res.split('\n').forEach((item) => {
          if (!item) return;
          ARR.push(JSON.parse(item));
        });
        const sorted = sortBy(ARR, 'ts');
        const filtered = sorted.filter(
          (item) => item.ts > Date.now() - 1000 * 60 * timeframe
        );
        setItems(filtered);
      })
      .catch(() => {
        toggleTail(false);
        setFetchError(true);
      });

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const start = items.length ? items[0].ts : false;

  useEffect(() => {
    if (!items.length) return;
    if (!autoZoom) return;
    const lastItem = items[items.length - 1];
    const pixls = lastItem.end - start;
    const zoomFct = (window.innerWidth / pixls) * 0.75; // 0.75 is correction factor
    setZoomFactor(zoomFct);
  }, [items, autoZoom]) // eslint-disable-line

  const setZoom = (factor) => () => {
    setAutozoom(false);
    setZoomFactor(factor);
  };

  useEffect(() => {
    clearInterval(interval);
    if (!tail) return;
    interval = setInterval(() => {
      fetchData();
    }, 1500);
  }, [tail, timeframe, port]);

  useEffect(() => {
    localStorage.setItem('timeframe', timeframe);
    localStorage.setItem('port', port);
  }, [timeframe, port]);

  useEffect(() => {
    clearTimeout(portTimeout);
    portTimeout = setTimeout(() => {
      fetchData();
    }, 500);
  }, [port]);

  const updateTimeframe = (val) => () => {
    setTimeframe(val);
  };

  return (
    <Root>
      <ReactTooltip delayShow={550} place="bottom" type="dark" effect="solid" />
      <Toolbar>
        <Title>Feathers Debugger</Title>
        <div className="right">
          <Btn>
            <Trash />
          </Btn>
          <BtnGroup>
            <Btn
              onClick={() => toggleTail(!tail)}
              active={tail}
              data-tip="realtime update"
            >
              {tail ? <Tail /> : <TailDisabled />}
            </Btn>
            <Btn data-tip="Refresh" onClick={() => fetchData()}>
              <Sync />
            </Btn>
          </BtnGroup>

          <BtnGroup>
            <Btn onClick={setZoom(zoomFactor / 0.75)} data-tip="Zoom in">
              <ZoomIn />
            </Btn>
            <Btn
              onClick={() => setAutozoom(true)}
              active={autoZoom}
              data-tip="Auto zoom"
            >
              Auto
            </Btn>
            <Btn onClick={setZoom(zoomFactor * 0.75)} data-tip="Zoom out">
              <ZoomOut />
            </Btn>
          </BtnGroup>

          <BtnGroup data-tip="Set data time frame (in minutes)">
            <Btn active={timeframe === 1} onClick={updateTimeframe(1)}>
              1m
            </Btn>
            <Btn active={timeframe === 3} onClick={updateTimeframe(3)}>
              3m
            </Btn>
            <Btn active={timeframe === 5} onClick={updateTimeframe(5)}>
              5m
            </Btn>
            <Btn active={timeframe === 15} onClick={updateTimeframe(15)}>
              15m
            </Btn>
          </BtnGroup>
        </div>
        <div>
          {fetchError && 'Error'}
          <Caption>Port:</Caption>
          <PortInput
            data-tip="Feathers port (only localhost)"
            type="number"
            onChange={(e) => setPort(e.target.value)}
            value={port}
          />
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
