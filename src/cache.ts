import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    switch(object.__typename) {
      case 'ScheduleCardPayload': return `Card:${object.id}`
      case 'EditCardPayload': return `Card:${object.id}`
      default: return defaultDataIdFromObject(object);
    }
  }
})

export default cache;
