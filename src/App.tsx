import React from 'react';
import styles from './App.module.scss';
import EmployeeSearch from './components/EmployeeSearch/EmployeeSearch';
import EmployeeOverview from './components/EmployeeOverview/EmployeeOverview'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

const App = () => {
  return (
    <div className={styles.root}>
      <div className={styles.mainWrapper}>
        <BrowserRouter>
            <Switch>
              <Route path={`/`} exact component={EmployeeSearch} />
              <Route path={`/overview/:guid`} exact component={EmployeeOverview} />
            </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
