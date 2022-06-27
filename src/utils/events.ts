export interface IObserver {
    subscriber: Set<ISubscriber>;
    subscribe(subscriber: ISubscriber): void;
    unsubscribe(subscriber: ISubscriber): void;
    send(message: string): void;
}

export interface ISubscriber {
    addObserver(observer: IObserver): void;
    notify(name: String): void;
}