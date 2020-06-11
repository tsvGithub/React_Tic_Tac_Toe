import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

//   2    --------Square (Клетка)-----------------------------
//Компонент Square рендерит элемент <button>
function Square(props) {
  return (
    //Нужен способ, которым Square сможет обновлять состояние
    //Board. Поскольку состояние является приватным для компонента,
    //где оно определено, мы не можем обновить состояние Board
    //напрямую из Square.
    //передадим из Board функцию onClick, и будем её вызывать из Square,
    //когда по Square кликнули.
    // 3
    <button className="square" onClick={props.onClick}>
      {/*Теперь каждый Square получает проп value, который 
        будет, либо 'X' или 'O', либо null для пустых клеток. */}
      {props.value}
    </button>
    //При клике на Square вызывается функция onClick, которая была
    //передана из Board. Т.к. Board передаёт в Square
    //onClick={() => this.handleClick(i)},
    //Square при клике вызывает this.handleClick(i).
  );
}
//   1   ----------Board (Поле)-------------------------
//Компонент Board рендерит 9 компонентов Square
class Board extends React.Component {
  //хранение состояния игры о заполненных клетках в
  //родительском компоненте Board,
  //а не в каждом отдельном Square. Компонент Board может
  //указывать каждому Square, что именно нужно отобразить,
  //передавая проп.
  //   4
  constructor(props) {
    //Добавим конструктор и установим начальное
    //состояние в виде массива из 9 элементов (квадратов),
    //заполненного значениями null.
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      //   7    По-умолчанию первый ход за «X»
      xIsNext: true,
    };
  }
  //   6    заполняeт клетки по клику
  handleClick(i) {
    //мы вызвали .slice() для создания копии массива squares
    //вместо изменения существующего массива
    const squares = this.state.squares.slice();
    //   12
    //выход из функции и игнорировании клика, если кто-то уже
    // победил или если клетка уже заполнена
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    //  8
    //Каждый раз, когда игрок делает ход, xIsNext (булево значение)
    //будет инвертироваться, чтобы обозначить, какой игрок ходит
    //следующим, а состояние игры будет сохраняться.
    //«X» и «O» будут чередоваться
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
  //передать данные из компонента Board в компонент Square.
  renderSquare(i) {
    //value={this.state.squares[i]} ->
    //передать каждому Square его текущее значение ('X', 'O' или null).
    //Мы определили массив squares в конструкторе Board:
    // squares: Array(9).fill(null)
    //Теперь каждый Square получает проп value, который будет,
    //либо 'X' или 'O', либо null для пустых клеток.

    //Kak Square сможет обновлять состояние Board?
    //передадим из Board в Square функцию handleClick(i),
    //и будем её вызывать из Square, когда по тому кликнули.
    //    5
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
  }

  render() {
    //   11   Будем вызывать calculateWinner(squares) чтобы проверять,
    // выиграл ли игрок. Если у нас есть победитель, мы покажем
    //сообщение «Выиграл X» или «Выиграл O»
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = "Game is over!  The winner is " + winner;
    } else {
      //  9     какой игрок ходит следующим
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
//-----------Game (Игра)----------------------------
//Компонент Game рендерит поле c заглушками
class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

//     10
//показать, когда игра закончена и больше нет ходов
//Функция получает массив из 9 клеток, проверяет победителя и
//возвращает 'X', 'O' или null.
//Будем вызывать calculateWinner(squares) внутри метода render класса Board

//---------------------------
// let squares = Array(9).fill(null)
//array of length 9; each of the 9 elements are set to null >>
// [null, null, ..., null]
//squares [0] = 'X'; //simulate player puting X in box 0
// squares [1] = 'X'; //putting X in box 1
// squares [2] = "X"; //and in box 3
// the squares array is now ['X', 'X', 'X', null, null, ..., null]
//-----------------------------
function calculateWinner(squares) {
  //квадратики squares = Array(9)

  // the lines array below is for every winning combination
  // i.e. there is a winner if there is the same letter
  //(i.e 'X') in boxes 0, 1, and 2 (the first combination below)
  const lines = [
    // lines = линии зачёркивания
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    //Синтаксис деструктурирующего присваивания
    // позволяет извлекать данные из массивов или объектов
    //const [a,b,c] = lines[i] === a=0, b=1, c=2;

    // create a new array with the same values as each winning
    //combo. i.e. when i = 0 the new array of [a, b, c] is [0, 1, 2]
    //when i = 1, the new array of [a, b, c] is [3, 4, 5]...
    const [a, b, c] = lines[i]; // берёт все квадратики в линии[i]
    //lets us only look at winning combination lines while we start
    //comparing Square’s values.
    //если квадратик[a]=Х(truthy) и все остальные тоже Х, то вернуть А
    //если квадратик[a]=О(truthy) и все остальные тоже О, то вернуть А

    //Square’s values can only be 'X' , 'O' , or null.
    //if the value can be converted to false (if the value is null)
    //the if statement returns false.
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //The first [a] is needed, we have to test the truthness of [a]
      //first because null==null is returning true.
      return squares[a];
    }
    // the if statement checks if the there are 3 of the same letters
    //for the winning combos
    // i.e. for winning combo [0, 1, 2] it looks up the values in the
    //squares array -> squares[0], squares[1], squares[2]
    // since we've set the array so that index 0, 1, 2 of squares is
    //'X' then the if statement should evaluate to true.
    // here's how it breaks down for the first winning combo [0, 1, 2]
    // in lines
    // since a is 0, then squares[a] is squares[0] and the value of
    //squares [0] is 'X'
    // squares[a] is true since it has a value, the value is 'X'
    // squares[a] === squares[b] is true because the value of
    //squares[b] (i.e. squares[1]) is 'X', the same as squares[a]
    // squares[a] === squares[c] is true because squares[c] (i.e.
    //squares[2] is 'X'), the same as squares [a]
    // since all three parts in the if are true the function returns
    //the value of squares[a], which is 'X' and thus the player 'X'
  }
  return null;
}
// call the calculateWinner(squares) to check
// console.log(calculateWinner(squares));

//check the console, it should print out X
