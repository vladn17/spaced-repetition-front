import * as React from 'react';
import Toast from '../components/Toast';
import { ToastsContainer } from '../components/Toast/Toast';

type ActionType =
  | {
      type: 'SHOW';
      message: string;
    }
  | {
      type: 'CLOSE';
      key: number;
    };

type ToastItem = {
  key: number;
  message: string;
};

export const ToastsContext = React.createContext<
  React.Dispatch<ActionType> | undefined
>(undefined);

function reducer(state: ToastItem[], action: ActionType): ToastItem[] {
  switch (action.type) {
    case 'SHOW': {
      return [
        {
          key: Math.floor(Math.random() * Date.now()),
          message: action.message,
        },
        ...state,
      ];
    }
    case 'CLOSE': {
      return state.filter((toast) => toast.key !== action.key);
    }
  }
}

export function ToastsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, []);
  const toastsListItems = state.map((toast) => (
    <Toast key={toast.key} toast={toast} />
  ));
  return (
    <ToastsContext.Provider value={dispatch}>
      {children}
      <ToastsContainer>{toastsListItems}</ToastsContainer>
    </ToastsContext.Provider>
  );
}

export function useToasts(): React.Dispatch<ActionType> {
  const ctx = React.useContext(ToastsContext);
  if (ctx === undefined) {
    throw new Error('useToasts must be used inside ToastsProvider');
  }
  return ctx;
}
