import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ReactTooltip from 'react-tooltip';
import sortBy from 'lodash/fp/sortBy';
import compose from 'lodash/fp/compose';
import filter from 'lodash/fp/filter';
import get from 'lodash/get';

import WaterfallItem from './WaterfallItem';
import NoData from './NoData';

import {
  ZoomIn,
  ZoomOut,
  Sync,
  Tail,
  TailDisabled,
  Trash,
  ErrorTriangle,
  Condensed,
} from '../../assets';

const Root = styled.div`
  background: #fff;
  min-height: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
const PortInput = styled.input`
  font-size: 15px;
  font-weight: normal;
  height: 30px;
  border: 1px solid ${p => p.theme.border};
  border-radius: 3px;
  margin: 0;
  padding: 0 10px;
  width: 80px;
  outline: 0;
  font-weight: bold;
  &:hover,
  &:focus {
    border-color: ${p => p.theme.primary};
  }
`;

const BtnGroup = styled.div`
  display: flex;
  align-items: center;
  margin: 0 5px;
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
      border-right: 1px solid ${p => p.theme.border};
    }
  }
`;

const Btn = styled.button`
  border: 1px solid ${p => p.theme.border};
  color: ${p => p.theme.text};
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
  &:active {
    background: ${p => p.theme.primary};
    color: white;
    svg {
      fill: #fff;
    }
  }
  ${p =>
    p.active === true &&
    css`
      background: ${x => x.theme.primary};
      color: white;
      svg,
      path {
        fill: #fff;
      }
    `}
  svg {
    opacity: 0.8;
    width: 15px;
    height: 15px;
  }
`;

const Title = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
`;

const Toolbar = styled.div`
  padding: 10px;
  border: 1px solid ${p => p.theme.border};
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom: 1px solid ${p => p.theme.border};
  .right {
    display: flex;
    align-items: center;
  }
`;

const Container = styled.div`
  border: 1px solid ${p => p.theme.border};
  border-bottom: none;
  overflow-x: scroll;
  box-sizing: border-box;
  flex-grow: 1;
`;

const WaterfallItems = styled.div`
  display: inline-block;
  min-width: 100%;
  flex-grow: 1;
`;

const ErrorIcon = styled(ErrorTriangle)`
  width: 15px;
  height: 15px;
  fill: ${p => p.theme.danger};
  margin: 0 10px;
`;

let interval;
let portTimeout;

const TIMEFRAMES = [10 / 60, 0.5, 1, 3, 15];

export default function Waterfall() {
  const [port, setPort] = useState(localStorage.getItem('port') || 3030);
  const [items, setItems] = useState([]);
  const [condensed, setCondensed] = useState(localStorage.getItem('condensed'));
  const [zoomFactor, setZoomFactor] = useState(1);
  const [fetchError, setFetchError] = useState(false);
  const [timeframe, setTimeframe] = useState(
    Number(localStorage.getItem('timeframe')) || 3
  );
  const [autoZoom, setAutozoom] = useState(true);
  const [tail, setTail] = useState(!!localStorage.getItem('tail') || false);
  const [startTs, setStartTs] = useState(0);

  const toggleTail = val => {
    clearInterval(interval);
    if (val) setAutozoom(true);
    setTail(val);
  };

  const fetchData = () =>
    fetch(`http://localhost:${port}/feathers-debugger`)
      .then(res => res.text())
      .then(res => {
        setFetchError(false);
        const ARR = [];
        res.split('\n').forEach(item => {
          if (!item) return;
          ARR.push(JSON.parse(item));
        });
        setItems(ARR);
      })
      .catch(() => {
        setFetchError(true);
      });

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const data = compose(
    sortBy('ts'),
    filter(item => {
      if (startTs >= item.ts) return false;
      return item.ts > Date.now() - 1000 * 60 * timeframe;
    })
  )(items);

  const start = get(data[0], 'ts', 0);

  useEffect(() => {
    if (!items.length) return;
    if (!autoZoom) return;
    if (condensed) {
      setZoomFactor(0.5);
      return;
    }
    const lastItem = items[items.length - 1];
    const pixls = lastItem.end - start;
    const zoomFct = (window.innerWidth / pixls) * 0.75; // 0.75 is correction factor
    setZoomFactor(zoomFct);
  }, [items, autoZoom, condensed]);

  const setZoom = factor => () => {
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
    localStorage.setItem('tail', tail ? 'true' : '');
    localStorage.setItem('condensed', condensed ? 'true' : '');
  }, [timeframe, port, tail, condensed]);

  useEffect(() => {
    clearTimeout(portTimeout);
    portTimeout = setTimeout(() => {
      fetchData();
    }, 500);
  }, [port]);

  const updateTimeframe = val => () => {
    setTimeframe(val);
  };

  // Filters

  const clear = () => () => {
    if (!data.length) return null;
    return setStartTs(data[data.length - 1].ts); // to last item
  };

  const toggleCondensed = () => {
    setCondensed(!condensed);
    setAutozoom(true);
  };

  return (
    <Root>
      <ReactTooltip delayShow={550} place="bottom" type="dark" effect="solid" />
      <Toolbar>
        <Title>Feathers Debugger</Title>
        <div className="right">
          <Btn onClick={clear()} data-tip="Clear">
            <Trash />
          </Btn>
          <BtnGroup>
            <Btn
              onClick={() => toggleTail(!tail)}
              active={tail}
              data-tip="Watch server (realtime updates)"
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

          <Btn
            onClick={toggleCondensed}
            active={!!condensed}
            data-tip={
              condensed ? 'Disable condensed view' : 'Enable condensed view'
            }
          >
            <Condensed />
          </Btn>

          <BtnGroup data-tip="Lookback timeframe">
            {TIMEFRAMES.map(val => (
              <Btn
                active={timeframe === val}
                key={val}
                onClick={updateTimeframe(val)}
              >
                {val >= 1 ? `${val}m` : `${val * 60}s`}
              </Btn>
            ))}
          </BtnGroup>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {fetchError && (
            <ErrorIcon data-tip="Error connecting to FeathersJS server" />
          )}
          <PortInput
            data-tip="Feathers port (only localhost)"
            type="number"
            onChange={e => setPort(e.target.value)}
            value={port}
          />
        </div>
      </Toolbar>
      {!!data.length && (
        <Container>
          <WaterfallItems>
            {data.map((item, idx) => (
              <WaterfallItem
                condensed={condensed}
                index={idx}
                key={idx}
                item={item}
                zoomFactor={zoomFactor}
                start={start}
                previousItem={data[idx - 1]}
              />
            ))}
          </WaterfallItems>
        </Container>
      )}
      {!data.length && <NoData error={fetchError} port={port} />}
    </Root>
  );
}
