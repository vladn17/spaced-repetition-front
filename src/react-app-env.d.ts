declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly API_ENDPOINT: string;
  }
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// declarations for experimental features
type TimestampTrigger = {
  timestamp: number;
};

interface TimestampTriggerConstructor {
  new (time: number): TimestampTrigger;
}

declare const TimestampTrigger: TimestampTriggerConstructor;

interface NotificationOptions {
  showTrigger: TimestampTrigger;
}

interface GetNotificationOptions {
  includeTriggered: boolean;
}

interface WorkerGlobalScopeEventMap {
  notificationclick: NotificationEvent;
}
