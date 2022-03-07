export class UserForm {
  constructor(public parent: Element) {}
      // returns a string that contains some amount of HTML we want to show to the user
  template(): string {
    return `
    <div>
      <h1>User Form</h1>
      <input />
    </div>
    `;
  }
      //  wants to take the HTML from template, and inserts it into the DOM.
  render(): void {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = this.template();

    this.parent.append(templateElement.content);
  }
}