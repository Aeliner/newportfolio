import React from 'react';
import AppContainer from './AppContainer';
import { GlobalStyles } from './styles/GlobalStyles';
import { store } from './store';
import { Provider } from 'react-redux';

const App = () => {
  return (
    <React.Fragment>
      <GlobalStyles />
      <Provider store={store}>
        <AppContainer />
      </Provider>
    </React.Fragment>
  );
};

export default App;
