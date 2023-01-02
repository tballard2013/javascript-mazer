export default class Maze {
    player = {
        x: 0, y: 0, xx: 0, yy: 0
    }
    raf = null;

    constructor(instance, el) {
        this.instance = instance;
        this.el = el;

        // const board = `
        // XXXXXXXXXXXXXXXXX|
        // SP..............X
        // X.XXX.XXX.XXX.XXX
        // X.X.X.X.X.X.XXX.X
        // X...X.X.X.......X
        // XXXXX.X.XXXXXXX.X
        // X............X...
        // XXXXXXXXXXXXXXXXX
        // `;

        const board = `
        .................|
        SP12313464515615.
        .1...1...1...1...
        .6.1.7.6.8.9...1.
        .741.1.1.1611811.
        .....2.9.......1.
        .132143154165.17E
        .................
        `;

        this.drawBoard(board);

        // listed for keydown/up
        document.addEventListener('keydown', ev => this.processInput(ev, true));
        document.addEventListener('keyup', ev => this.processInput(ev, false));

        window.requestAnimationFrame(this.gameLoop);

    }    

    processInput(ev, v) {
        console.log('got ', ev, v);
        let k = `${ev.key}:${v}`
        switch (k) {
            case 'ArrowDown:true' : this.player.yy = 1; break;
            case 'ArrowDown:false' : this.player.yy = 0; break;
            case 'ArrowUp:true' : this.player.yy = -1; break;
            case 'ArrowUp:false' : this.player.yy = 0; break;
            case 'ArrowLeft:true' : this.player.xx = -1; break;
            case 'ArrowLeft:false' : this.player.xx = 0; break;
            case 'ArrowRight:true' : this.player.xx = 1; break;
            case 'ArrowRight:false' : this.player.xx = 0; break;
        }
    }

    drawBoard = (board) => {
        let html = '';
        let data = board.replace(/\s+/gim, '');
        let cols = data.indexOf('|'); // the indicator for the end of the first row of data in the game board
        let x = 0;
        let y = 0;
    
        data = data.replace('|', ''); // remove the | in prep to consume the board data and draw it in UI
    
        html += `<table border="1"><tr>`;
        for (let i = 0; i < data.length; i++) {
            let char = this.fillPosition(data.charAt(i), x, y);
            html += `<td>${char}</td>`;

            // end a row? (start a new row?)
            if (++x === cols) {
                y++; x = 0; html += '</tr>';
                
                if (i < data.length) {
                    html += '<tr>'
                }
            }
        }
        html += `</tr></table>`;
    
        const el = this.el || document.querySelector('#game');
        el.innerHTML = html;
    }

    setFeaturesVars(char, col, row) {
        switch(char) {
            // set player x,y and other features discovered from board data during parse/draw
            case 'P': 
                this.player.x = col;
                this.player.y = row;
                console.log('PLAYER: ', this.player);
                break;
        }
    }

    fillPosition = (s, i, j) => {
        let html = s;
        switch (s) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                html = `<div data-xy="${i},${j}" class="block floor${s}"></div>`;
                break;
            case 'P':
                html = `<div data-xy="${i},${j}" class="block floor1 player"></div>`;
                this.setFeaturesVars(s, i, j);
                break;
            case 'S':
                html = `<div data-xy="${i},${j}" class="block start impassable"></div>`;
                break;
            case 'E':
                html = `<div data-xy="${i},${j}" class="block floor1 end"></div>`;
                break;
            case '.':
                html = `<div data-xy="${i},${j}" class="block chasm impassable"></div>`;
                break;
        }
        return html;
    }

    gameLoop = () => {
        // console.log('loop...');

        let tempx = this.player.x + this.player.xx;
        let tempy = this.player.y + this.player.yy;
        if (tempx != this.player.x || tempy != this.player.y) {
            let el = document.querySelector(`[data-xy="${this.player.x},${this.player.y}"]`)
            let blockxy = document.querySelector(`[data-xy="${tempx},${tempy}"]`);
            console.log('move to: ', tempx, tempy, blockxy, blockxy.classList);
            if (blockxy.classList.contains('end')) {
                this.winGame();
            }
            if (!blockxy.classList.contains('impassable')) {
                // move the player to the new block
                el.classList.remove('player');
                blockxy.classList.add('player');
                this.player.x = tempx;
                this.player.y = tempy;
            }
        }

        if (!this.gameover) {
            this.raf = window.requestAnimationFrame(this.gameLoop);
        } else {
            window.cancelAnimationFrame(this.raf);
        }

    }

    winGame() {
        this.gameover = true;
        alert('You Win!');
        
    }


}

