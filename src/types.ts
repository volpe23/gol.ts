export type State = 'dead' | 'alive';
export type Board = State[][];
export type StateObj = {
	state: State;
	color: string;
};
