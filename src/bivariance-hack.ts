type EventHandler = {
  bivarianceHack(event: Event): void;
}['bivarianceHack'];

const addEvent = (el: Element, type: string, cb: EventHandler) => {};

addEvent(document.body, 'click', (e: MouseEvent) => {});

export {};

class Base {
  a = 1;
  handler(object: Base) {}
}

class Child extends Base {
  b = 2;
  // a = 'asdf';

  handler(object: Child) {}
}
