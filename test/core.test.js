import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findCluster, hasMove, clusterScore, applyMove } from '../src/index.js';

test('orthogonal connectivity crosses a chain, not diagonals or row edges', () => {
  assert.deepEqual(findCluster([0,1,0, 1,0,0], 3, 2), [2,4,5]);
  assert.deepEqual(findCluster([0,0,1, 1,2,2], 3, 2), [2]);
});
test('single column and rectangular boards are supported', () => {
  assert.deepEqual(findCluster([1,1,0,1], 1, 0), [0,1]);
  assert.deepEqual(findCluster([0,0,0,0,0,0,0,0], 4, 0), [0,1,2,3,4,5,6,7]);
});
test('move existence and scoring match game rules', () => {
  assert.equal(hasMove([0,1,1,0],2), false);
  assert.equal(hasMove([0,0,1,2],2), true);
  assert.equal(hasMove([0,0,1,2],2,3), false);
  assert.equal(clusterScore(1),0); assert.equal(clusterScore(3),90);
});
test('gravity keeps survivor order, fills above, and leaves input unchanged', () => {
  const original = Object.freeze([0,1,2, 0,2,1, 2,1,0]);
  const result = applyMove(original,3,0,{colorCount:3,rng:()=>0.5});
  assert.deepEqual(result.board,[1,1,2, 1,2,1, 2,1,0]);
  assert.deepEqual(result.removed,[0,3]); assert.equal(result.score,40);
  assert.equal(result.moved,true); assert.deepEqual(original,[0,1,2,0,2,1,2,1,0]);
});
test('singleton is a no-op without consuming randomness', () => {
  const original=[0,1,1,0];
  const result=applyMove(original,2,0,{colorCount:2,rng:()=>{throw new Error('unexpected RNG');}});
  assert.deepEqual(result,{board:original,removed:[],score:0,moved:false});
  assert.notEqual(result.board,original);
});
test('invalid shape, sparse data, tile, index, threshold and RNG are rejected', () => {
  for (const board of [[],[0,1,2],[0,-1],[0,NaN],new Array(2)]) assert.throws(()=>findCluster(board,2,0));
  assert.throws(()=>findCluster([0,1],2,2),RangeError);
  assert.throws(()=>hasMove([0,1],2,0),RangeError);
  assert.throws(()=>clusterScore(Number.MAX_SAFE_INTEGER),RangeError);
  for (const value of [-0.1,1,NaN,Infinity]) assert.throws(()=>applyMove([0,0],2,0,{rng:()=>value}),RangeError);
  assert.throws(()=>applyMove([0,5],2,0),RangeError);
});
