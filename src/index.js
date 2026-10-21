/** Four-way cluster helpers for rectangular puzzle boards. No dependencies. */
function validate(board, width) {
  if (!Array.isArray(board) || !Number.isInteger(width) || width < 1 ||
      board.length === 0 || board.length % width !== 0 ||
      Array.from(board).some(x => !Number.isInteger(x) || x < 0)) {
    throw new TypeError('Expected a non-empty rectangular array of non-negative integer tiles.');
  }
}
function checkIndex(board, index) {
  if (!Number.isInteger(index) || index < 0 || index >= board.length) {
    throw new RangeError('Tile index is outside the board.');
  }
}
function neighbors(index, width, length) {
  const x = index % width;
  return [x > 0 ? index - 1 : -1, x < width - 1 ? index + 1 : -1,
    index - width, index + width].filter(i => i >= 0 && i < length);
}
function visit(board, width, index) {
  const seen = new Set([index]), pending = [index];
  while (pending.length) {
    for (const next of neighbors(pending.pop(), width, board.length)) {
      if (!seen.has(next) && board[next] === board[index]) {
        seen.add(next); pending.push(next);
      }
    }
  }
  return [...seen].sort((a, b) => a - b);
}
export function findCluster(board, width, index) {
  validate(board, width); checkIndex(board, index);
  return visit(board, width, index);
}
export function hasMove(board, width, minSize = 2) {
  validate(board, width);
  if (!Number.isInteger(minSize) || minSize < 1) throw new RangeError('minSize must be positive.');
  const visited = new Set();
  for (let i = 0; i < board.length; i++) {
    if (visited.has(i)) continue;
    const cluster = visit(board, width, i);
    if (cluster.length >= minSize) return true;
    cluster.forEach(x => visited.add(x));
  }
  return false;
}
export function clusterScore(size) {
  if (!Number.isSafeInteger(size) || size < 0 || size > Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER / 10))) {
    throw new RangeError('size must be a non-negative integer with a safe score.');
  }
  return size < 2 ? 0 : size * size * 10;
}
/** Remove a matching cluster, compact downward and refill above. Never mutates input. */
export function applyMove(board, width, index, { colorCount = 5, rng = Math.random } = {}) {
  validate(board, width); checkIndex(board, index);
  if (!Number.isInteger(colorCount) || colorCount < 1 || board.some(x => x >= colorCount)) {
    throw new RangeError('colorCount must include every tile type.');
  }
  if (typeof rng !== 'function') throw new TypeError('rng must be a function.');
  const removed = visit(board, width, index);
  if (removed.length < 2) return { board: board.slice(), removed: [], score: 0, moved: false };
  const removedSet = new Set(removed), next = board.slice(), height = board.length / width;
  for (let x = 0; x < width; x++) {
    const column = [];
    for (let y = height - 1; y >= 0; y--) if (!removedSet.has(y * width + x)) column.push(board[y * width + x]);
    while (column.length < height) {
      const random = rng();
      if (!Number.isFinite(random) || random < 0 || random >= 1) throw new RangeError('rng must return a number in [0, 1).');
      column.push(Math.floor(random * colorCount));
    }
    for (let y = height - 1; y >= 0; y--) next[y * width + x] = column[height - 1 - y];
  }
  return { board: next, removed, score: clusterScore(removed.length), moved: true };
}
