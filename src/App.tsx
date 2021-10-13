import React from 'react';
import AppContainer from './AppContainer';
import { GlobalStyles } from './styles/GlobalStyles';

const App = () => {
  return (
    <React.Fragment>
      <GlobalStyles />
      <AppContainer />
    </React.Fragment>
  );
};

export default App;
