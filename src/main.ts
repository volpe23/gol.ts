import './style.css';
import { Automaton, BB, Board, Cell, GoL, StateObj } from './types';

const WIDTH = 800;
const HEIGHT = WIDTH;
const COLS = 60;
const ROWS = COLS;
const SQUARE_WIDTH = WIDTH / COLS;
const SQUARE_HEIGHT = HEIGHT / ROWS;
const DEFAULT_COLOR = '#101010';
const ALIVE_COLOR = '#ee0505';

const canvas = document.getElementById(
	'gameCanvas'
) as HTMLCanvasElement | null;
if (!canvas) throw new Error('canvas not found');
const nextButton = document.getElementById(
	'next-btn'
) as HTMLButtonElement | null;
if (!nextButton) throw new Error('could not get next button');

const startBtn = document.getElementById(
	'start-btn'
) as HTMLButtonElement | null;
if (!startBtn) throw new Error('could not get start button');

const stopBtn = document.getElementById('stop-btn') as HTMLButtonElement | null;
if (!stopBtn) throw new Error('could not get stop button');

const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('2d context not supported');

const automataPanel = document.getElementById(
	'automata-panel'
) as HTMLDivElement | null;
if (!automataPanel) throw new Error('could not get automata panel');

canvas.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});

nextButton.addEventListener('click', () => {
	cells = currentAutomaton.createNextBoard(cells);

	render(ctx, cells);
});

canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.addEventListener('click', (e) => {
	const c = Math.floor(e.offsetX / SQUARE_WIDTH);
	const r = Math.floor(e.offsetY / SQUARE_HEIGHT);
	cells[r][c] = toggleCellState(cells[r][c]);

	render(ctx, cells);
	// colorRect(ctx, x, y, ALIVE_COLOR);
});

function createAutomaton<T extends string>(
	name: string,
	states: StateObj<T>[]
): Automaton {
	function createNextBoard(board: Board): Board {
		const nextBoard = createNewBoard();
		board.forEach((row, i) => {
			row.forEach((cell, j) => {
				const neighs = countNeighbors<T>(board, j, i, states);
				const state = states[cell];
				if (Object.keys(state.rules).length === 0)
					nextBoard[i][j] = state.default;
				for (const n in neighs) {
					// Check if rule type in rules
					const rule = state.rules[n];
					console.log(rule);
					if (rule) {
						if (rule.includes(neighs[n])) {
							const ind = states.findIndex(
								(state) => state.state === n
							);
							if (ind !== -1) {
								nextBoard[i][j] = states[ind].value;
							}
						} else nextBoard[i][j] = state.default;
					}
				}
			});
		});

		return nextBoard;
	}

	return { name, states, createNextBoard };
}

const GolAutomaton: Automaton = createAutomaton<GoL>('Game of Life', [
	{
		color: DEFAULT_COLOR,
		state: 'dead',
		value: 0,
		rules: {
			alive: [3],
		},
		default: 0,
	},
	{
		color: ALIVE_COLOR,
		state: 'alive',
		value: 1,
		rules: {
			alive: [2, 3],
		},
		default: 0,
	},
]);
const BBAutomaton: Automaton = createAutomaton<BB>("Brian's brain", [
	{
		color: DEFAULT_COLOR,
		state: 'dead',
		value: 0,
		rules: {
			alive: [2],
		},
		default: 0,
	},
	{
		color: ALIVE_COLOR,
		state: 'alive',
		value: 1,
		rules: {},
		default: 2,
	},
	{
		color: '#8805ff',
		state: 'dying',
		default: 0,
		rules: {},
		value: 2,
	},
]);

const automatons = [GolAutomaton, BBAutomaton];

let currentAutomaton: Automaton = BBAutomaton;

(() => {
	automatons.forEach((a) => {
		const id = a.name.toLowerCase().replace(' ', '_');
		const automButton = document.createElement('input');
		automButton.setAttribute('type', 'radio');
		automButton.value = a.name;
		automButton.id = id;
		automButton.name = 'automaton-select';

		if (currentAutomaton === a) automButton.checked = true;

		automButton.addEventListener('change', (e) => {
			const btn = e.target as HTMLInputElement;
			if (btn.checked) {
				currentAutomaton = a;
				ctxReset(ctx);
				boardReset();
			}
		});

		const automLabel = document.createElement('label');
		automLabel.classList.add('radio-label');
		automLabel.setAttribute('for', id);
		automLabel.textContent = a.name;

		automataPanel.append(automLabel, automButton);
	});
})();

function createNewBoard(): Board {
	return Array(ROWS)
		.fill(0)
		.map(() => Array(COLS).fill(0));
}

let cells: Board = createNewBoard();

function toggleCellState(cell: Cell): Cell {
	const ind = currentAutomaton.states.findIndex(
		(state) => state.value === cell
	);
	return (ind + 1) % currentAutomaton.states.length;
}

function countNeighbors<T extends string>(
	cells: Board,
	x: number,
	y: number,
	states: StateObj<T>[]
): Record<T, number> {
	const neighs = states.reduce((obj, stateObj) => {
		obj[stateObj.state] = 0;
		return obj;
	}, {} as { [K in T]: number });
	for (let i = -1; i < 2; i++) {
		const dy = y + i;
		for (let j = -1; j < 2; j++) {
			const dx = x + j;
			if (i !== 0 || j !== 0) {
				if (dx >= 0 && dx < COLS && dy >= 0 && dy < ROWS) {
					// neighs[cells[dy][dx]]++;
					neighs[states[cells[dy][dx]].state]++;
				}
			}
		}
	}
	return neighs;
}

function colorRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	color: string = DEFAULT_COLOR,
	w: number = SQUARE_WIDTH,
	h: number = SQUARE_HEIGHT
) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

function ctxReset(ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = DEFAULT_COLOR;
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function boardReset() {
	cells = createNewBoard();
}

function render(ctx: CanvasRenderingContext2D, board: Board) {
	ctxReset(ctx);
	board.forEach((row, i) => {
		row.forEach((cell, j) => {
			const x = j * SQUARE_WIDTH;
			const y = i * SQUARE_HEIGHT;
			colorRect(
				ctx,
				x,
				y,
				currentAutomaton.states.find((s) => s.value === cell)?.color
			);
		});
	});
}

render(ctx, cells);
