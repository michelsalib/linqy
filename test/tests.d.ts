declare function describe(message: string, desription: Function): void;
declare function it(message: string, description: Function): void;

declare module Chai {
    export var assert: any;
}

declare module 'chai' {
    export = Chai;
}
