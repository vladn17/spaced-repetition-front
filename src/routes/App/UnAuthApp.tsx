import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import styles from './UnAuthApp.module.css';
import SignUp from '../SignUp';
import Login from '../Login';

const UnAuthApp = () => {
  return (
    <div className={styles.unAuthApp}>
      <div className={styles.formWrapper}>
        <Switch>
          <Route path="/signup" component={SignUp} />
          <Route exact path="/" component={Login} />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default UnAuthApp;
