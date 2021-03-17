import { useState } from 'react';
import './NonoGame.css';

const LIVES_INIT = 3;

function Field(props) {
  const [currentClass, setCurrentClass] = useState(props.value.class);
  const [currentFilled, setCurrentFilled] = useState(props.value.isFilled);
  const [currentUncovered, setCurrentUncovered] = useState(false)

  const [gameState, setGameState] = useState(props.gameState);

  let x = '';
  if (props.value.isFilled) {
    x = 'x';
  }

  const handleClick = function () {
    setCurrentUncovered(true)
    if (props.gameState !== 'gameover') {
      if (props.value.isFilled) {
        props.changeLives(0);
      } else {
        props.changeLives(-1);
      }
      props.clicked(props.fieldId[0], props.fieldId[1]);

    } else {

    }
  }
  // console.log('class:',props.value.class,props.value.updateClass);
  return (
    <div key={props.value.class} onClick={handleClick} className={props.classN + " " + props.value.class + " " + currentClass}>{x}</div>
  );
}

function Tip(props) {
  return (
    <div className={props.classN}>{props.value}</div>
  );
}

function Board(props) {
  const [initedBoard, setInitedBoard] = useState(props.currentGame);

  const checkIfWin = function () {
    for (let i = 0; i < initedBoard.length; i++) {
      for (let j = 0; j < initedBoard[i].length; j++) {
        if (initedBoard[i][j].isFilled) { //if is filled
          if (!initedBoard[i][j].isUncovered) { //and this filled is not uncovered yet
            return false; //it meant that it's not win state
          }
        }
      }
    }
    return true; //if didn't return false it means it's win state
  }

  const checkIfLose = function () {
    let countBadClick = 0;
    for (let i = 0; i < initedBoard.length; i++) {
      for (let j = 0; j < initedBoard[i].length; j++) {
        if (!initedBoard[i][j].isFilled) { //if is empty
          if (initedBoard[i][j].isUncovered) { //and this empty is uncovered
            countBadClick++;
            if (countBadClick >= LIVES_INIT) {
              return true; //it meant that it's gameover
            }
          }
        }
      }
    }
    return false; //if didn't return true it means it's still in game state or won
  }

  const clickOnField = function (x, y) {
    let temp = initedBoard;
    temp[x][y].isUncovered = true;
    if (checkIfWin() || checkIfLose()) {
      if (temp[x][y].isUncovered) {
        temp[x][y].class = temp[x][y].isFilled ? 'goodClick' : 'badClick';
      } else {
        temp[x][y].class = temp[x][y].isFilled ? 'goodClickRevealed' : 'badClickRevealed';
      }
    } else {
      temp[x][y].class = temp[x][y].isFilled ? 'goodClick' : 'badClick';
    }
    setInitedBoard(temp);
    if (checkIfWin()) {
      props.setResult('You won!');
      generateEndOfGameBoard(temp);
    }
    if (checkIfLose()) {
      props.setResult('Gameover');
      generateEndOfGameBoard(temp);
    }
  }

  function generateEndOfGameBoard(temp) {
    for (let i = 0; i < initedBoard.length; i++) {
      for (let j = 0; j < initedBoard[i].length; j++) {
        if (initedBoard[i][j].isFilled) { //if is filled
          if (initedBoard[i][j].isUncovered) { //and this filled is not uncovered yet
            temp[i][j].class = 'goodClick';
          } else {
            temp[i][j].class = 'goodClickRevealed';
          }
        }
        if (!initedBoard[i][j].isFilled) { //if is filled
          if (initedBoard[i][j].isUncovered) { //and this filled is not uncovered yet
            temp[i][j].class = 'badClick';
          } else {
            temp[i][j].class = 'badClickRevealed';
          }
        }
      }
    }
    setInitedBoard(temp);
  }

  const changeLives = function (value) {
    props.upperChangeLives(value);
  }

  const updateClass = function (x, y) {
    return initedBoard[x][y].class;
  }

  return (
    <div>
      {
        initedBoard.map((item, rowId) => {
          return (
            <div className="row">
              {
                item.map((subitem, index2) => {
                  console.log(subitem, index2);
                  return (
                    <Field classN="field" clicked={clickOnField} updateClass={updateClass} changeLives={changeLives} gameState={props.gameState} fieldId={[rowId, index2]} value={subitem} key={{ subitem, index2 }} board={initedBoard}></Field>
                  );
                })
              }
            </div>
          )
        })
      }
    </div>
  );
}

function Lives(props) {

  function initHearts() {
    let hearts = '';
    for (let i = 0; i < props.heartNumber; i++) {
      hearts += '❤';
    }
    return hearts;
  }

  return (
    <div className='deeppink' >
      {
        initHearts()
      }
    </div>
  );
}
function GameResults(props) {
  return (
    <div className='aqua'>
      {props.result}
    </div>
  );
}

function StartGameButton(props) {
  let restartGameClick = function () {

  }
  return (
    <button onClick={restartGameClick}>Restart Game</button>
  );
}

function Toolbar(props) {
  let restartGameClick = function () {

  }
  return (
    <div>
      <GameResults result={props.result}></GameResults>
      <Lives heartNumber={props.hearts}></Lives>
    </div>
  );
}

function TipsLeft(props) {
  const currentGame = props.currentGame;
  const emptyBoard = generateEmptyBoard(10, 5);
  const initedTipsLeft = emptyBoard.map((row, rowIndex) => {
    let sum = 0;
    const resultArray = [];
    for (let i = 0; i < currentGame.length; i++) {
      if (currentGame[rowIndex][i].isFilled) {
        sum++;
        if (i === currentGame.length - 1) {
          resultArray.push(sum);
        }
      } else {
        resultArray.push(sum);
        sum = 0;
      }
    }
    let idx = 0;
    while (idx > -1) {
      idx = resultArray.indexOf(0);
      if (idx > -1) {
        resultArray.splice(idx, 1);
      }
    }
    for (let i = resultArray.length; i < 5; i++) {
      resultArray.unshift('');
    }
    return resultArray;
  });
  return (
    <div>
      {
        initedTipsLeft.map((item) => {
          return (
            <div className="row">
              {
                item.map((subitem, index2) => {
                  return (
                    <Tip classN="tip-field" value={subitem} key={index2}></Tip>
                  );
                })
              }
            </div>
          )
        })
      }

    </div>
  );
}

function TipsUpper(props) {
  const currentGame = props.currentGame;
  const emptyBoard = generateEmptyBoard(5, 10);
  const initedTipsUpper = emptyBoard[0].map((row, rowIndex) => {
    let sum = 0;
    const resultArray = [];
    for (let i = 0; i < currentGame.length; i++) {
      if (currentGame[i][rowIndex].isFilled) {
        sum++;
        if (i === currentGame.length - 1) {
          resultArray.push(sum);
        }
      } else {
        resultArray.push(sum);
        sum = 0;
      }
    }
    let idx = 0;
    while (idx > -1) {
      idx = resultArray.indexOf(0);
      if (idx > -1) {
        resultArray.splice(idx, 1);
      }
    }
    for (let i = resultArray.length; i < 5; i++) {
      resultArray.unshift('');
    }
    return resultArray;
  });
  initedTipsUpper.reverse();
  return (
    <div className="right">
      <div className="rotated">
        {
          initedTipsUpper.map((item) => {
            return (
              <div className="row">
                {
                  item.map((subitem, index2) => {
                    return (
                      <Tip classN="tip-field innerRotated" value={subitem} key={index2}></Tip>
                    );
                  })
                }
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

function Theme(props){
  return(
    <div>
      <details>
      <summary className='aqua'>Themes</summary>
      <button className='theme1' onClick='setTheme(1)'>Theme1</button>
      <button className='theme2' onClick='setTheme(2)'>Theme1</button>
      <button className='theme3' onClick='setTheme(3)'>Theme1</button>
      <button className='theme4' onClick='setTheme(4)'>Theme1</button>
      <button className='theme5' onClick='setTheme(5)'>Theme1</button>
      </details>
    </div>
  );
}

function NonoGame(props) {
  const [result, setResult] = useState("game started");
  const emptyBoard = generateEmptyBoard(10, 10);
  const initBoard = function () {
    return (
      emptyBoard.map((row) => {
        return row.map(() => {
          return ({
            isFilled: randomBool(),
            isUncovered: false,
            class: ''
          });
        }
        )
      })
    );
  }
  const [currentNumberOfHearts, setHearts] = useState(LIVES_INIT);
  const [stateOfGame, setStateOfGame] = useState('start');
  const [initedBoard, setInitedBoard] = useState(() => {
    return initBoard();
  });

  let restartGameClick = function () {
    if (stateOfGame === 'start') {
      setStateOfGame('start2');
    } else {
      setStateOfGame('start');
    }
    setInitedBoard(initBoard());
    setHearts(LIVES_INIT)
    setResult('game started');
  }

  const handleLives = function (value) {
    if (value === 0) {

    } else {

      setHearts(currentNumberOfHearts + value);
      if (currentNumberOfHearts === 1) {
        setStateOfGame('gameover');
      }
    }
  }
  return ( // tu musi to być wpakowane w div, bo moze być tylko jeden parent element
    <div className="game">
      <div className="row right">
        <TipsUpper currentGame={initedBoard}></TipsUpper>
      </div>
      <div className="row">
        <TipsLeft currentGame={initedBoard}></TipsLeft>
        <Board key={initedBoard, stateOfGame} setResult={setResult} currentGame={initedBoard} gameState={stateOfGame} upperChangeLives={handleLives}></Board>
      </div><Toolbar result={result} hearts={currentNumberOfHearts}></Toolbar>
      <button className="blue-pink" onClick={restartGameClick}>restart</button>
      <Theme></Theme>
    </div>

  );
}

export default NonoGame;

function generateEmptyBoard(sizeX, sizeY) {
  return Array(sizeX).fill(Array(sizeY).fill());
}
function randomBool() {
  return (Math.random() < 0.5);
}