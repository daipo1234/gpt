export const SHAPES = [ [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[0,1,1],[1,1,0]], [[1,1,0],[0,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]] ];
export const COLORS=['#91cee0','#e7cd77','#b6a0db','#a8cd82','#da9387','#83a8da','#dda778'];
export function rotate(matrix){return matrix[0].map((_,i)=>matrix.map(row=>row[i]).reverse());}
export class Game{
 constructor(random=Math.random){this.random=random;this.reset();}
 reset(){this.board=Array.from({length:20},()=>Array(10).fill(0));this.bag=[];this.queue=[];this.score=0;this.lines=0;this.level=1;this.held=null;this.usedHold=false;this.over=false;while(this.queue.length<4)this.queue.push(this.draw());this.spawn();}
 draw(){if(!this.bag.length){this.bag=[0,1,2,3,4,5,6];for(let i=6;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]];}}return this.bag.pop();}
 spawn(type){const id=type??this.queue.shift();if(type===undefined)this.queue.push(this.draw());this.piece={id,matrix:SHAPES[id].map(r=>r.slice()),x:Math.floor((10-SHAPES[id][0].length)/2),y:0};if(this.collides(this.piece))this.over=true;}
 collides(p){return p.matrix.some((r,y)=>r.some((v,x)=>v&&(p.x+x<0||p.x+x>=10||p.y+y>=20||(p.y+y>=0&&this.board[p.y+y][p.x+x]))));}
 move(dx,dy){const p={...this.piece,x:this.piece.x+dx,y:this.piece.y+dy};if(this.collides(p))return false;this.piece=p;return true;}
 turn(){const matrix=rotate(this.piece.matrix);for(const dx of [0,-1,1,-2,2]){const p={...this.piece,matrix,x:this.piece.x+dx};if(!this.collides(p)){this.piece=p;return true;}}return false;}
 lock(){for(let y=0;y<this.piece.matrix.length;y++)for(let x=0;x<this.piece.matrix[y].length;x++)if(this.piece.matrix[y][x]){if(this.piece.y+y<0){this.over=true;return 0;}this.board[this.piece.y+y][this.piece.x+x]=this.piece.id+1;}const remaining=this.board.filter(r=>r.some(v=>!v));const cleared=20-remaining.length;while(remaining.length<20)remaining.unshift(Array(10).fill(0));this.board=remaining;this.score+=([0,100,300,500,800][cleared]||0)*this.level;this.lines+=cleared;this.level=1+Math.floor(this.lines/10);this.usedHold=false;this.spawn();return cleared;}
 step(){if(!this.move(0,1))return this.lock();return 0;}
 drop(){let distance=0;while(this.move(0,1))distance++;this.score+=distance*2;return this.lock();}
 hold(){if(this.usedHold)return false;const id=this.piece.id;this.spawn(this.held??undefined);this.held=id;this.usedHold=true;return true;}
 ghost(){const p={...this.piece};while(!this.collides({...p,y:p.y+1}))p.y++;return p;}
}
