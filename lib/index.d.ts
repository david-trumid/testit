export declare type Interaction = {
    coverage?: boolean;
    name: string;
    storyshot?: boolean;
    task: (state: any, story: any) => void;
    workflow?: boolean;
};
export declare function setInteractionState(value: any): void;
export declare function getInteractionState(): any;
export declare const withInteractions: (...args: any) => any;
export default function (): void;
