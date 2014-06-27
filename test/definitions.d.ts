interface mocha {
    (message: string, desription: Function): void;
    only(message: string, desription: Function): void;
    skip(message: string, desription: Function): void;
}

declare var it: mocha;
declare var describe: mocha;

declare module Chai {
    export var assert: any;
}

declare module 'chai' {
    export = Chai;
}
