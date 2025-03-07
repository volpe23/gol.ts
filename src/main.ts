import './style.css';
import { Board, State, StateObj } from './types';

const canvas = document.getElementById(
	'gameCanvas'
) as HTMLCanvasElement | null;
if (!canvas) throw new Error('canvas not found');
const nextButton = document.getElementById(
	'next-state'
) as HTMLButtonElement | null;
if (!nextButton) throw new Error('could not get next button');

const WIDTH = 600;
const HEIGHT = WIDTH;
const COLS = 30;
const ROWS = COLS;
const SQUARE_WIDTH = WIDTH / COLS;
const SQUARE_HEIGHT = HEIGHT / ROWS;
const DEFAULT_COLOR = '#101010';
const ALIVE_COLOR = '#ee0505';

const DEAD: StateObj = {
	state: 'dead',
	rules: {
		// alive: [2, 3],
		// dead: []
	},
	color: DEFAULT_COLOR,
} as const;

const ALIVE: StateObj = {
	state: 'alive',
	color: ALIVE_COLOR,
} as const;

const states: StateObj[] = [DEAD, ALIVE];

const ctx = canvas.getContext('2d');

if (!ctx) throw new Error('2d context not supported');

function createNewBoard(): Board {
	return Array(ROWS)
		.fill(0)
		.map(() => Array(COLS).fill('dead'));
}

let cells: Board = createNewBoard();
let nextBoard: Board = createNewBoard();

canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.addEventListener('click', (e) => {
	const c = Math.floor(e.offsetX / SQUARE_WIDTH);
	const r = Math.floor(e.offsetY / SQUARE_HEIGHT);
	cells[r][c] = 'alive';

	render(ctx, cells);
	// colorRect(ctx, x, y, ALIVE_COLOR);
});

nextButton.addEventListener('click', () => {
	cells = computeNextBoard(cells);

	render(ctx, cells);
});

function countNeighbors(
	cells: Board,
	x: number,
	y: number
): Record<State, number> {
	const neighs: Record<State, number> = {
		alive: 0,
		dead: 0,
	};
	for (let i = -1; i < 2; i++) {
		const dy = y + i;
		for (let j = -1; j < 2; j++) {
			const dx = x + j;
			if (i !== 0 || j !== 0) {
				if (dx >= 0 && dx < COLS && dy >= 0 && dy < ROWS) {
					console.log(dx, dy);
					neighs[cells[dy][dx]]++;
				}
			}
		}
	}
	console.log(neighs);
	return neighs;
}

function computeNextBoard(cells: Board) {
	const next = createNewBoard();
	cells.forEach((row, i) => {
		row.forEach((cell, j) => {
			const neighbors = countNeighbors(cells, j, i);
			switch (cell) {
				case 'alive':
					if (neighbors.alive < 2 || neighbors.alive > 3) {
						next[i][j] = 'dead';
					} else next[i][j] = 'alive';
					break;
				case 'dead':
					if (neighbors.alive === 3) next[i][j] = 'alive';
					break;
			}
		});
	});
	return next;
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
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function render(ctx: CanvasRenderingContext2D, cells: Board) {
	ctxReset(ctx);
	cells.forEach((row, i) => {
		row.forEach((cell, j) => {
			const x = j * SQUARE_WIDTH;
			const y = i * SQUARE_HEIGHT;
			colorRect(ctx, x, y, states.find((s) => s.state === cell)?.color);
		});
	});
}

render(ctx, cells);
