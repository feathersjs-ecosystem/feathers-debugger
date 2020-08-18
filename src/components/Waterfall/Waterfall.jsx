import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ReactTooltip from 'react-tooltip';
import packageJson from '../../../package.json';
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
  min-width: 26px;
  padding: 0 8px;
  flex-shrink: 0;
  height: 35px;
  font-size: 10.5px;
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
      display: block;

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
  padding: 8px;
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
  overflow-x: scroll;
  box-sizing: border-box;
  flex-grow: 1;
  margin-top: -2px;
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

const TIMEFRAMES = [10 / 60, 30 / 60, 5, 15];

export default function Waterfall() {
  const [port, setPort] = useState(localStorage.getItem('port') || 3030);
  const [items, setItems] = useState([]);
  const [condensed, setCondensed] = useState(localStorage.getItem('condensed'));
  const [zoomFactor, setZoomFactor] = useState(1);
  const [fetchError, setFetchError] = useState(false);
  const [stats, setStats] = useState({});
  const [timeframe, setTimeframe] = useState(
    Number(localStorage.getItem('timeframe')) || TIMEFRAMES[2]
  );
  const [autoZoom, setAutozoom] = useState(true);
  const [tail, setTail] = useState(!!localStorage.getItem('tail') || false);
  const [percentile, setPercentile] = useState();

  const toggleTail = val => {
    clearInterval(interval);
    if (val) setAutozoom(true);
    setTail(val);
  };

  const fetchData = () => {
    const gt = Date.now() - timeframe * 1000 * 60; // timeframe from seconds to ms
    return fetch(
      `http://localhost:${port}/feathers-debugger?$sort[ts]=1&$limit=500&ts[$gt]=${gt}&$version=${packageJson.version}`
    )
      .then(res => res.json())
      .then(res => {
        if (res.message) throw new Error(res.message);
        setFetchError(false);
        setItems(res.data);
        setStats(res.stats);
      })
      .catch(e => {
        setFetchError(e.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const data = items;

  const start = data.length ? data[0].ts : 0;

  useEffect(() => {
    if (!items.length) return;
    if (!autoZoom) return;
    if (condensed) {
      setZoomFactor(0.6);
      return;
    }
    const lastItem = items[items.length - 1];
    const pixls = lastItem.end - start;
    const zoomFct = (window.innerWidth / pixls) * 0.8; // 0.8 is correction factor
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
    fetch(`http://localhost:${port}/feathers-debugger`, {
      method: 'delete',
    }).then(() => {
      setItems([]);
    });
  };

  const toggleCondensed = () => {
    setCondensed(!condensed);
    setAutozoom(true);
  };

  const gte = stats[percentile] || 0;

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
          {stats && (
            <BtnGroup>
              <Btn
                data-tip="Highlight top 10% slow queries"
                active={percentile === 'p90'}
                onClick={() => setPercentile(percentile === 'p90' ? 0 : 'p90')}
              >
                p90
              </Btn>
              <Btn
                data-tip="Highlight top 5% slow queries"
                active={percentile === 'p95'}
                onClick={() => setPercentile(percentile === 'p95' ? 0 : 'p95')}
              >
                p95
              </Btn>
            </BtnGroup>
          )}
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
                key={`${item._id}`}
                item={item}
                zoomFactor={zoomFactor}
                start={start}
                previousItem={data[idx - 1]}
                opacity={item.duration > gte ? 1 : 0.2}
              />
            ))}
          </WaterfallItems>
        </Container>
      )}
      {!data.length && <NoData error={fetchError} port={port} />}
    </Root>
  );
}
