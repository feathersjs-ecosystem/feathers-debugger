/* eslint-disable no-console */
import React from 'react';
import packageJson from '../../package.json';

const AppContext = React.createContext();
AppContext.displayName = 'AppContext';

let cache = {};

// Read cached values from localStorage
try {
  const readCache = JSON.parse(localStorage.getItem('feathers-debugger'));
  // If there is mismatch in versions, ignore cache (eg. new version is released)
  if (readCache && readCache.appVersion === packageJson.version) {
    cache = readCache;
    console.log('Hydrating from localstorage', cache);
  }
} catch (e) {
  console.log('Error loading cache', e.message);
  // NO OP
}

export const initialState = {
  appVersion: packageJson.version,
  url: cache.url || 'http://localhost:3030',
  data: [],
  zoomFactor: 1,
  pollInterval: 1500,
  timeframes: [10 / 60, 30 / 60, 5, 15],
  autoZoom: cache.autoZoom || true,
  condensed: cache.condensed || false,
  timeframe: cache.timeframe || 5,
  percentile: undefined,
  tail: cache.tail || true,
  fetchError: null,
  stats: undefined,
  settingsOpen: true,
  protocol: cache.protocol || 'http',
};

let timeout;

// Delayed (debounce) localStorage Write
const updateCache = state => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    try {
      localStorage.setItem(
        'feathers-debugger',
        JSON.stringify({
          appVersion: state.appVersion,
          url: state.url,
          autoZoom: state.autoZoom,
          condensed: state.condensed,
          timeframe: state.timeframe,
          tail: state.tail,
          protocol: state.protocol,
        })
      );
    } catch (e) {
      // NO_OP
      console.log('Error updating cache', e.message);
    }
  }, 500);
};

export function updateContext(update, cb) {
  this.setState(currentState => {
    const newState = { ...currentState, ...update };
    updateCache(newState, cb);
    return update;
  });
}

export default AppContext;
