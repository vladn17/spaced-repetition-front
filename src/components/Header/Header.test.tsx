import * as React from 'react';
import Header from './Header';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../../context/auth';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/theme';
import { NotificationsProvider } from '../../context/notifications';

beforeEach(() => {
  localStorage.clear();
});

test('header renders', async () => {
  render(
    <BrowserRouter>
      <MockedProvider>
        <AuthContext.Provider
          value={{ isAuth: true, logout: () => {}, login: () => {} }}
        >
          <ThemeProvider>
            <NotificationsProvider>
              <Header />
            </NotificationsProvider>
          </ThemeProvider>
        </AuthContext.Provider>
      </MockedProvider>
    </BrowserRouter>
  );
  const logo = await screen.findByText('REPEAT');
  expect(logo).toBeInTheDocument();
});

test('log out works', async () => {
  const logout = jest.fn();
  render(
    <AuthContext.Provider
      value={{ isAuth: true, logout: logout, login: () => {} }}
    >
      <BrowserRouter>
        <MockedProvider>
          <ThemeProvider>
            <NotificationsProvider>
              <Header />
            </NotificationsProvider>
          </ThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    </AuthContext.Provider>
  );
  const logoutButton = await screen.findByTitle('Log out');
  fireEvent.click(logoutButton);
  await waitFor(() => expect(logout).toHaveBeenCalled());
});

test('changes theme', async () => {
  render(
    <AuthContext.Provider
      value={{ isAuth: true, logout: () => {}, login: () => {} }}
    >
      <BrowserRouter>
        <MockedProvider>
          <ThemeProvider>
            <NotificationsProvider>
              <Header />
            </NotificationsProvider>
          </ThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    </AuthContext.Provider>
  );
  const settingButton = await screen.findByTitle('Settings');
  fireEvent.click(settingButton);
  fireEvent.click(screen.getByTitle('Switch to light theme'));
  expect(document.documentElement).toHaveClass('light');
  fireEvent.click(screen.getByTitle('Switch to dark theme'));
  expect(document.documentElement).toHaveClass('dark');
  fireEvent.click(screen.getByTitle('Switch to system theme'));
  expect(document.documentElement).not.toHaveClass('light');
  expect(document.documentElement).not.toHaveClass('dark');
});

test('toggles notifications if permission granted', async () => {
  Object.defineProperty(window, 'Notification', {
    writable: true,
    value: {
      permission: 'granted',
      requestPermission: jest.fn().mockResolvedValue('granted'),
    },
  });

  render(
    <AuthContext.Provider
      value={{ isAuth: true, logout: () => {}, login: () => {} }}
    >
      <BrowserRouter>
        <MockedProvider>
          <ThemeProvider>
            <NotificationsProvider>
              <Header />
            </NotificationsProvider>
          </ThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    </AuthContext.Provider>
  );
  const settingButton = await screen.findByTitle('Settings');
  fireEvent.click(settingButton);
  fireEvent.click(screen.getByLabelText('Toggle notifications'));
  expect(localStorage.getItem('notifications')).toEqual('on');
  fireEvent.click(screen.getByLabelText('Toggle notifications'));
  expect(localStorage.getItem('notifications')).toEqual('off');
});

test('asks permission if its not granted', async () => {
  const requestPermission = jest.fn().mockResolvedValue('granted');
  Object.defineProperty(window, 'Notification', {
    writable: true,
    value: {
      permission: 'default',
      requestPermission,
    },
  });

  render(
    <AuthContext.Provider
      value={{ isAuth: true, logout: () => {}, login: () => {} }}
    >
      <BrowserRouter>
        <MockedProvider>
          <ThemeProvider>
            <NotificationsProvider>
              <Header />
            </NotificationsProvider>
          </ThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    </AuthContext.Provider>
  );
  const settingButton = await screen.findByTitle('Settings');
  fireEvent.click(settingButton);
  fireEvent.click(screen.getByLabelText('Toggle notifications'));
  await waitFor(() =>
    expect(screen.getByLabelText('Toggle notifications')).toBeChecked()
  );
  expect(requestPermission).toHaveBeenCalled();
  expect(localStorage.getItem('notifications')).toEqual('on');
});

test('remains off if permission is denied', async () => {
  const requestPermission = jest.fn().mockResolvedValue('denied');
  Object.defineProperty(window, 'Notification', {
    writable: true,
    value: {
      permission: 'default',
      requestPermission,
    },
  });

  render(
    <AuthContext.Provider
      value={{ isAuth: true, logout: () => {}, login: () => {} }}
    >
      <BrowserRouter>
        <MockedProvider>
          <ThemeProvider>
            <NotificationsProvider>
              <Header />
            </NotificationsProvider>
          </ThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    </AuthContext.Provider>
  );
  const settingButton = await screen.findByTitle('Settings');
  fireEvent.click(settingButton);
  fireEvent.click(screen.getByLabelText('Toggle notifications'));
  await waitFor(() => expect(requestPermission).toHaveBeenCalled());
  expect(screen.getByLabelText('Toggle notifications')).not.toBeChecked();
  expect(localStorage.getItem('notifications')).toBeFalsy();
});
