export type State = 'dead' | 'alive';
export type Board = State[][];
export type StateObj = {
	state: State;
	rules: {
		[key in State]?: number[]
	},
	color: string;
};
type RequireAtLeastOne<T extends string> = {
  [K in T]?: number[];
} & {
  [K in T as K extends keyof T ? never : K]: never;
};

type S1<T extends GoL> = {
	state: T;
	color: string;
};

type ObjectFromUnion<T extends string> = { state: T };

const gol: ObjectFromUnion<GoL> = {
	state: 'dead',
};

// export type GoL = 'dead' | 'alive';

type Automaton = NexState[];
type NexState = {};

type Union<T extends any[]> = T[number];
type GoL = Union<['dead', 'alive']>;

type T0 = Union<[1, 2, 3]>;
