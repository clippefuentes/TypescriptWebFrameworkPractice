import { AxiosPromise, AxiosResponse } from "axios";
import { Callback } from "./Eventing";
import { HasId } from "./ApiSync";

export interface ModelAttributes<T> {
    set(value:T): void;
    getAll(): T;
    get<K extends keyof T>(keyL: K): T[K];
}

export interface Sync<T> {
    fetch(id: number): AxiosPromise;
    save(data: T): AxiosPromise;
}

export interface Events {
    on(eventName: string, callback: Callback): void;
    trigger(eventName: string): void;
}

export class Model<T extends HasId> {
    constructor(
        private attributes: ModelAttributes<T>,
        private events: Events,
        private sync: Sync<T>
    ) {}
  
    on = this.events.on;
    trigger = this.events.trigger
    get = this.attributes.get

    set (update: T): void {
        this.attributes.set(update);
        this.events.trigger('change');
    }

    fetch(): void {
        const id = this.attributes.get('id');

        if (typeof id !== 'number') {
            throw new Error('Cannot fetch without Id')
        }

        this.sync.fetch(id)
            .then((res: AxiosResponse): void => {
                this.set(res.data)
            })
    }

    save(): void {
        this.sync.save(this.attributes.getAll())
            .then((res: AxiosResponse) => {
                this.trigger('save')
            })
            .catch(() => {
                this.trigger('error')
            })
    }
}