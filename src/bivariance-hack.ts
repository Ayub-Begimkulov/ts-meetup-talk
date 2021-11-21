type EventHandler = {
  bivarianceHack(event: Event): void;
}['bivarianceHack'];

const addEventListenerIncorrect = (
  target: EventTarget,
  type: string,
  listener: (event: Event) => void
) => {
  return target.addEventListener(type, listener);
};

const addEventListener = (
  target: EventTarget,
  type: string,
  listener: EventHandler
) => {
  return target.addEventListener(type, listener);
};

addEventListener(document.body, 'click', (e: MouseEvent) => {
  console.log(e.pageX + e.pageY);
});

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

const someVariable: Base = new Child();

const baseTest = (fn: Base['handler']) => {
};

baseTest(new Child().handler);

type BivarianceHanlder<Fn extends (...args: any[]) => any> = {
  bivarianceHack(...args: Parameters<Fn>): ReturnType<Fn>;
}['bivarianceHack'];

const addEventListener2 = (
  target: EventTarget,
  type: string,
  listener: BivarianceHanlder<(event: Event) => void>
) => {
  return target.addEventListener(type, listener);
};


addEventListener2(window, 'click', (e: MouseEvent) => {});
