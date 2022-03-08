import { User, UserProps } from "../models/User";
import { View } from "./View";

export class UserEdit extends View<User, UserProps> {
regionsMap(): { [key: string]: string} {
  return {
    userShow: '.user-show',
    useForm: '.user-form'
  }
}

  template(): string {
    return `
      <div>
        <div class="user-show"></div>
        <div class="user-form"></div>
      </div>
    `
  }
}