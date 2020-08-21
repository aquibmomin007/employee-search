import React from 'react';
import styles from './App.module.scss';
import EmployeeSearch from './components/EmployeeSearch/EmployeeSearch';

const App = () => {
  return (
    <div className={styles.root}>
      <div className={styles.mainWrapper}>
        <EmployeeSearch />
      </div>
    </div>
  );
}

export default App;
