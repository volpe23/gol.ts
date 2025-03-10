export type Cell = number;
export type State = string;
export type Board = Cell[][];

export type GoL = Union<['dead', 'alive']>;
export type BB = Union<['dead', 'alive', 'dying']>;
export type StateObj<T extends string> = {
	state: T;
	value: Cell;
	rules: {
		[key in T]?: number[];
	};
	color: string;
	default: number;
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

export type Automaton = {
	name: string;
	states: StateObj<string>[];
	createNextBoard: (b: Board) => Board;
};
type NexState = {};

export type Union<T extends any[]> = T[number];

type T0 = Union<[1, 2, 3]>;
