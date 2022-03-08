import axios, { AxiosResponse } from "axios";
import { Eventing } from "./Eventing";

export class Collection<T, K> {
  models: T[] = [];
  events: Eventing = new Eventing();

  constructor(
    public rootUrl: string,
    public deserialize: (json: K) => T // take in some json data and turn it into an instance of an object.
    ) {}

  get on() {
    return this.events.on;
  }
  
  get trigger() {
    return this.events.trigger;
  }

  fetch(): void {
    axios.get(this.rootUrl)
      .then((response: AxiosResponse) => {
        response.data.forEach((value: K) => {
          this.models.push(this.deserialize(value));
        });

        this.trigger('change');
      });

  }
}