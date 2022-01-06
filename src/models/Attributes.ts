import { UserProps } from './User';

export class Attributes<T> {

    constructor(private data: T) { }

    // K can only be elements of T. Take whatever K is in T and return its respective type
    get = <K extends keyof T>(key: K): T[K] => {
        return this.data[key];
    };

    set(update: T): void {
        Object.assign(this.data, update)
    }

    getAll(): T {
        return this.data;
    }

}
