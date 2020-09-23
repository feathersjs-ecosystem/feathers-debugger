import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './globalStyles';
import AppContext, { initialState, updateContext } from './store/index';
import Waterfall from './components/Waterfall/Waterfall';
import theme from './theme';

// Initialize the devtools panel
if (process.env.NODE_ENV === 'production') {
  if(chrome.devtools) chrome.devtools.panels.create( // eslint-disable-line
      'Feathers',
      null,
      'devtools.html'
    );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      update: updateContext.bind(this) // eslint-disable-line
    };
  }

  render() {
    return (
      <>
        <AppContext.Provider value={this.state}>
          <GlobalStyle />
          <ThemeProvider theme={theme}>
            <Waterfall />
          </ThemeProvider>
        </AppContext.Provider>
      </>
    );
  }
}

const el = document.getElementById('app');
ReactDOM.render(<App />, el);
