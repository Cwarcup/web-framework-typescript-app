// implement class responsible for events tied to a User

type Callback = () => void;

export class Eventing {
  events: { [key: string]: Callback[] } = {};

  on(eventName: string, callback: Callback): void {
    const handlers = this.events[eventName] || []; //can be undefined when User is first created
    handlers.push(callback);
    this.events[eventName] = handlers;
  }

  trigger(eventName: string): void {
    const handlers = this.events[eventName]; 
    
    //can be undefined when User is first created
    if(!handlers || handlers.length === 0) {
      return;
    }

    handlers.forEach((callback: Callback) => {
      callback();
    })
  }
}