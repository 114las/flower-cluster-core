# Flower Cluster Core

Small, dependency-free JavaScript helpers for four-way matching tile puzzles. Extracted and rewritten from the Bloom Pop prototype, with assistance from OpenAI Codex.

Use this when you need to find matching connected tiles, score a cluster, or compact and refill a rectangular board. This is an algorithm example, not a complete game engine. No accounts, analytics, advertising SDKs or external assets are included.

[Play the complete Bloom Pop game](https://play.imageworkflowlab.com/?utm_source=github&utm_medium=referral&utm_campaign=bloom_pop_channel_lab).

[Try the interactive algorithm demo](https://114las.github.io/flower-cluster-core/demo/) without installing anything.

## Run

Requires Node.js 20 or later for tests. No installation is needed:

```sh
node --test
```

For the browser example, serve this repository root with a static HTTP server and open `/demo/`. For example, if Python is installed:

```sh
python -m http.server 8080
```

Then open `http://localhost:8080/demo/`. Opening the file directly may prevent browser ES module loading.

## API example

```js
import { findCluster, clusterScore, applyMove } from './src/index.js';

const board = [0, 0, 1, 2, 1, 2]; // 3 columns, 2 rows
findCluster(board, 3, 0); // [0, 1]
clusterScore(2); // 40
const result = applyMove(board, 3, 0, { colorCount: 3 });
// { board: [...], removed: [0, 1], score: 40, moved: true }
```

- `findCluster(board, width, index)` returns sorted matching indices, including a singleton. Adjacency is horizontal/vertical, never diagonal or wrapped across rows.
- `hasMove(board, width, minSize = 2)` checks whether any connected cluster meets the threshold.
- `clusterScore(size)` returns zero below two tiles, otherwise `size * size * 10`.
- `applyMove(board, width, index, { colorCount = 5, rng = Math.random })` preserves survivor order within each column, refills above and returns a new board. Singleton selections do nothing. It does not force a playable next board; call `hasMove` and implement your own shuffle rule.

Boards are non-empty rectangular row-major arrays of non-negative integer tile types. `width` must divide the array length. RNG returns a finite value in `[0, 1)`. Invalid inputs throw. Inputs are never modified. Inject a seeded RNG if reproducible gameplay is required; the default is not seeded. This package is not designed for gambling or cryptographic randomness.

## Status and reuse

Initial experimental release. The GitHub source can be used directly; npm publication is planned but not yet verified. No install command is advertised until registry publication is confirmed. `private: true` prevents accidental npm publication during preparation.

Tests cover adjacency boundaries, rectangular boards, scoring, gravity, no-op moves, immutability and input validation. The demo is deliberately small and does not include persistence, animation or platform SDK integration.

MIT licensed. The license covers the files distributed in this repository; it does not grant rights to third-party platforms or their SDKs. See [LICENSE](LICENSE).

