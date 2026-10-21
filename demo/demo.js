import { applyMove, hasMove } from '../src/index.js';
const initial=[0,0,1,2,2,3, 1,2,1,3,4,3, 2,2,4,0,4,1, 3,4,0,0,1,1, 4,0,2,3,2,4, 1,1,2,4,0,0];
const colors=['#efaa91','#d6d993','#a8cebe','#bbb3d7','#ebcd8a'];
const symbols=['✿','●','◆','✦','■'];
let board=initial.slice();
function render(){
  document.getElementById('board').replaceChildren(...board.map((value,index)=>{
    const button=document.createElement('button'); button.className='tile';button.style.background=colors[value];button.textContent=symbols[value];
    button.setAttribute('aria-label',`Type ${value}, row ${Math.floor(index/6)+1}, column ${index%6+1}`);
    button.onclick=()=>{const result=applyMove(board,6,index);board=result.board;render();document.getElementById('result').textContent=JSON.stringify({removed:result.removed,score:result.score,moved:result.moved,hasMove:hasMove(board,6)},null,2);};
    return button;
  }));
}
document.getElementById('reset').onclick=()=>{board=initial.slice();render();document.getElementById('result').textContent='Choose a matching cluster.';};render();
