import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,rotate} from './engine.js';
test('each bag contains all seven pieces',()=>{const g=new Game();g.bag=[];assert.equal(new Set(Array.from({length:7},()=>g.draw())).size,7);});
test('walls and floor stop movement',()=>{const g=new Game();while(g.move(-1,0)){}assert.equal(g.move(-1,0),false);while(g.move(0,1)){}assert.equal(g.move(0,1),false);assert.equal(g.collides(g.piece),false);});
test('hard drop locks blocks and awards distance points',()=>{const g=new Game();g.drop();assert.equal(g.board.flat().filter(Boolean).length,4);assert.ok(g.score>0);});
test('four-line clear scores a tetris and advances level',()=>{const g=new Game();g.lines=6;for(let y=16;y<20;y++)g.board[y]=Array.from({length:10},(_,x)=>x===4?0:2);g.piece={id:0,matrix:[[1],[1],[1],[1]],x:4,y:16};assert.equal(g.lock(),4);assert.equal(g.score,800);assert.equal(g.lines,10);assert.equal(g.level,2);assert.equal(g.board.flat().some(Boolean),false);});
test('hold can be used once per locked piece',()=>{const g=new Game(),id=g.piece.id;assert.equal(g.hold(),true);assert.equal(g.held,id);assert.equal(g.hold(),false);g.drop();assert.equal(g.hold(),true);assert.equal(g.piece.id,id);});
test('spawn collision ends the game',()=>{const g=new Game();g.board[0].fill(1);g.spawn(1);assert.equal(g.over,true);});
test('ghost lands at last valid row without moving active piece',()=>{const g=new Game(),y=g.piece.y,p=g.ghost();assert.equal(g.piece.y,y);assert.equal(g.collides(p),false);assert.equal(g.collides({...p,y:p.y+1}),true);});
test('four rotations restore a piece',()=>{const m=[[0,1,0],[1,1,1]];assert.deepEqual(rotate(rotate(rotate(rotate(m)))),m);});

test('clockwise and counterclockwise rotations have correct directions',()=>{const m=[[1,0,0],[1,1,1]];assert.deepEqual(rotate(m),[[1,1],[1,0],[1,0]]);assert.deepEqual(rotate(m,-1),[[0,1],[0,1],[1,1]]);assert.deepEqual(rotate(rotate(m),-1),m);});
test('game supports counterclockwise rotation',()=>{const g=new Game();g.spawn(5);const original=g.piece.matrix.map(r=>r.slice());assert.equal(g.turn(-1),true);assert.deepEqual(g.piece.matrix,rotate(original,-1));assert.equal(g.turn(1),true);assert.deepEqual(g.piece.matrix,original);});
