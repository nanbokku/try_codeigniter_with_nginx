class Event {
  constructor(name) {
    this.name = name;
    this.callbacks = [];
  }

  addCallback(callback) {
    this.callbacks.push(callback);
  }
}

export class Reactor {
  constructor() {
    this.events = {};
  }

  addEventListener(eventName, callback) {
    if (eventName in this.events === false) {
      const event = new Event(eventName);
      this.events[eventName] = event;
    }

    this.events[eventName].addCallback(callback);
  }

  dispatchEvent(eventName, eventArgs) {
    this.events[eventName].callbacks.forEach(callback => {
      callback(eventArgs);
    });
  }
}
