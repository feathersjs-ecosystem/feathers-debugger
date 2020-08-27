import React, { useContext, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import packageJson from '../../../package.json';
import AppContext from '../../store/index';
import WaterfallItem from '../WaterfallItem/WaterfallItem';
import NoData from '../NoData/NoData';
import Settings from '../Settings/Settings';
import {
  Root,
  BtnGroup,
  Btn,
  Title,
  Toolbar,
  Container,
  WaterfallItems,
  ErrorIcon,
} from './WaterfallStyles';

import {
  ZoomIn,
  ZoomOut,
  Sync,
  Tail,
  TailDisabled,
  Trash,
  Condensed,
  Settings as SettingsIcon,
} from '../../assets';

let interval;

function Waterfall() {
  const ctx = useContext(AppContext);
  // console.log('Ctx Rerender', ctx);
  const {
    url,
    timeframes,
    timeframe,
    zoomFactor,
    condensed,
    autoZoom,
    percentile,
    tail,
    data,
    stats,
    fetchError,
    pollInterval,
    settingsOpen,
    protocol,
  } = ctx;

  const baseUrl = `${protocol}://${url}/feathers-debugger`;

  const fetchData = () => {
    const gt = Date.now() - timeframe * 1000 * 60; // timeframe from seconds to ms
    return fetch(
      `${baseUrl}?$sort[ts]=1&$limit=500&ts[$gt]=${gt}&$version=${packageJson.version}`
    )
      .then(res => res.json())
      .then(res => {
        if (res.message) throw new Error(res.message);
        // TODO: this is not working when triggered from setInterval
        if (res.data.length && res.data.length === data.length) {
          const [lastOldItem] = data.slice(-1);
          const [lastNewItem] = res.data.slice(-1);
          // Skip updates if last timestamp is unchanged
          if (lastNewItem.ts === lastOldItem.ts) return;
        }
        // Skip update if no data
        if (!res.data.length && !data.length && !fetchError) return;
        ctx.update({ data: res.data, stats: res.stats, fetchError: null });
      })
      .catch(e => {
        ctx.update({ fetchError: e.message });
      });
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const start = data.length ? data[0].ts : 0;
  useEffect(() => {
    if (!data.length) return;
    if (!autoZoom) return;
    if (condensed) {
      ctx.update({ zoomFactor: 0.6 });
      return;
    }
    const lastItem = data[data.length - 1];
    const pixls = lastItem.end - start;
    const zoomFct = (window.innerWidth / pixls) * 0.8; // 0.8 is correction factor
    ctx.update({ zoomFactor: zoomFct });
  }, [data, autoZoom, condensed]);

  const setZoom = factor => () => {
    ctx.update({ autoZoom: false, zoomFactor: factor });
  };

  useEffect(() => {
    clearInterval(interval);
    if (!tail) return;
    interval = setInterval(() => {
      fetchData();
    }, pollInterval);
  }, [tail, timeframe, url, data, protocol]);

  // Action Handlers
  const updateTimeframe = val => () => ctx.update({ timeframe: val });

  const toggleTail = val => {
    clearInterval(interval);
    if (val) ctx.update({ autoZoom: true });
    ctx.update({ tail: val });
  };

  const toggleCondensed = () =>
    ctx.update({ condensed: !condensed, autoZoom: true });

  const toggleSettings = e => {
    if (e) e.stopPropagation();
    ctx.update({ settingsOpen: !settingsOpen });
  };
  // Filters
  const clear = () => () => {
    fetch(`${baseUrl}`, {
      method: 'delete',
    }).then(() => {
      ctx.update({ data: [] });
    });
  };

  const gte = stats ? stats[percentile] || 0 : 0;

  return (
    <>
      <Root>
        <ReactTooltip
          delayShow={550}
          place="bottom"
          type="dark"
          effect="solid"
        />
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
                onClick={() => ctx.update({ autoZoom: true })}
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
              {timeframes.map(val => (
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
                  onClick={() =>
                    ctx.update({ percentile: percentile === 'p90' ? 0 : 'p90' })
                  }
                >
                  p90
                </Btn>
                <Btn
                  data-tip="Highlight top 5% slow queries"
                  active={percentile === 'p95'}
                  onClick={() =>
                    ctx.update({ percentile: percentile === 'p95' ? 0 : 'p95' })
                  }
                >
                  p95
                </Btn>
              </BtnGroup>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              data-tip="Error connecting to FeathersJS server"
              style={{ display: fetchError ? 'block' : 'none' }}
            >
              <ErrorIcon data-tip="Connection error, please update settings" />
            </div>

            <Btn
              data-tip="Settings"
              active={settingsOpen}
              onClick={toggleSettings}
            >
              <SettingsIcon />
            </Btn>
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
                  opacity={item.duration >= gte ? 1 : 0.2}
                />
              ))}
            </WaterfallItems>
          </Container>
        )}
        {!data.length && <NoData error={fetchError} url={url} />}
      </Root>
      {/* Modals */}
      {settingsOpen && (
        <Settings close={toggleSettings} ctx={ctx} fetchData={fetchData} />
      )}
    </>
  );
}

export default Waterfall;
