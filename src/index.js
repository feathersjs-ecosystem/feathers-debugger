import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './globalStyles';
import Waterfall from './components/Waterfall/Waterfall';
import theme from './theme';

// Initialize the devtools panel
if (process.env.NODE_ENV === 'production') {
  chrome.devtools.panels.create( // eslint-disable-line
    'Feathers',
    null,
    'devtools.html'
  );
}

function App() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Waterfall />
      </ThemeProvider>
    </>
  );
}

const el = document.getElementById('app');
ReactDOM.render(<App />, el);
