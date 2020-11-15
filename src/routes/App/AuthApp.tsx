import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Repetition from '../Repetition';
import ManageDeck from '../ManageDeck';
import Board from '../Board';
import styles from './AuthApp.module.css';
import { ToastsProvider } from '../../context/toasts';
import Header from '../../components/Header';

const AuthApp = () => {
  return (
    <ToastsProvider>
      <div className={styles.app}>
        <Header />
        <div className={styles.routesContainer}>
          <Switch>
            <Route path="/decks/:id" component={ManageDeck} />
            <Route path="/repetition/:id" component={Repetition} />
            <Route path="/decks" component={Board} />
            <Route path="*">
              <Redirect to="/decks" />
            </Route>
          </Switch>
        </div>
      </div>
    </ToastsProvider>
  );
};

export default AuthApp;
