import { AxiosPromise, AxiosResponse } from "axios";

interface ModelAttributes<T> {
    set(value: T): void;
    getAll(): T;
    get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {

    fetch(id: number): AxiosPromise;
    save(data: T): AxiosPromise;

}

interface Events {

    on(event: string, callback: () => void): void;
    trigger(event: string): void;

}

//Gets rid of "Argument of type 'string' is not assignable to parameter of type 'keyof T'"" on id.
interface HasId {
    id?: number;
}


export class Model<T extends HasId> {

    constructor(
        private attributes: ModelAttributes<T>,
        private events: Events,
        private sync: Sync<T>
    ){}

    //This works because these are already being initialized before constructor in User Class. Othwerwise, these three would have undefined value
    on = this.events.on;
    trigger = this.events.trigger;
    get = this.attributes.get;

    set(update: T): void {
        this.attributes.set(update);
        this.events.trigger('change')
    }

    fetch(): void {
        const id = this.attributes.get('id');

        if(typeof id != 'number') {
            throw new Error('Cannot fetch without id');
        }

        this.sync.fetch(id).then((response: AxiosResponse): void => {
            this.set(response.data);
        });
    }

    save(): void {
        this.sync.save(this.attributes.getAll())
            .then((response: AxiosResponse): void => {
            this.trigger('save');
        })
        .catch(() => {
            this.trigger('error');
        })
    }

}