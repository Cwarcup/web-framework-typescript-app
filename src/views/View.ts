import { User } from "../models/User";

interface ModelForView {
  // list out all the properties T is expected to have.
  on(eventName: string, callback: () => void): void;

}

export abstract class View<T extends ModelForView> {
  constructor(public parent: Element, public model: T) {
    this.bindModel();
  }

  abstract eventsMap(): { [key: string]: () => void };
  abstract template(): string;

  bindModel(): void {
    this.model.on('change', () => {
      this.render();
    })
  }

  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();

    for (const eventKey in eventsMap) {
      const [eventName, selector] = eventKey.split(':');

      fragment.querySelectorAll(selector).forEach(element => {
        element.addEventListener(eventName, eventsMap[eventKey]);
      });
    }
    
  }

      //  wants to take the HTML from template, and inserts it into the DOM.
  render(): void {
    this.parent.innerHTML = ''; // empty out parent element
    const templateElement = document.createElement('template');
    templateElement.innerHTML = this.template();

    this.bindEvents(templateElement.content)

    this.parent.append(templateElement.content);
  }
}