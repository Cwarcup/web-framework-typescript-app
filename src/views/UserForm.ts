import { User } from "../models/User";

export class UserForm {
  constructor(public parent: Element, public model: User) {
    this.bindModel();
  }

  bindModel(): void {
    this.model.on('change', () => {
      this.render();
    })
  }

  eventsMap(): { [key: string]: () => void } {
    return {
      'click:.set-age': this.onSetAgeClick,
      'click:.set-name': this.onSetNameClick
    }
  }

  onSetAgeClick = ():void => {
    this.model.setRandomAge();
  }

  onSetNameClick = ():void => {
    const input = this.parent.querySelector('input');
    if(input) {
      const name = input.value;
      this.model.set({name});
    }
  }

      // returns a string that contains some amount of HTML we want to show to the user
  template(): string {
    return `
    <div>
      <h1>User Form</h1>
      <div>User name: ${this.model.get('name')}</div>
      <div>User age: ${this.model.get('age')}</div>

      <input />
      <button class="set-age">Set Random Age</button>
      <button class="set-name">Change Name</button>
    </div>
    `;
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