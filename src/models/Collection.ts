import { User, UserProps } from "./User";
import { Eventing } from "./Eventing";
import axios, { AxiosResponse } from "axios";

export class Collection<T, K> {
    models: T[] = [];
    events: Eventing = new Eventing();

    constructor(
        public rootUrl: string,
        public deserialize: (json: K) => T
    ) {}

    get on() {
        return this.events.on
    }

    get trigger() {
        return this.events.trigger
    }

    fetch(): void {
        axios.get(this.rootUrl)
            .then((res: AxiosResponse) => {
                res.data.forEach((v: K) => {
                   this.models.push(this.deserialize(v))
                })
                this.trigger('change')
            })
    }
}