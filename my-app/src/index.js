import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
// 3
// нужно, чтобы Board получил пропсы squares и onClick из
//компонента Game.
class Board extends React.Component {
  //  4  Поскольку внутри Board у нас один обработчик кликов для всех
  //Squares, нам достаточно передать позицию для каждого Square в
  //обработчик onClick, чтобы показать по какой клетке мы кликнули.
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
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
//1
//Мы хотим, чтобы компонент Game отображал список последних ходов.
//Для этого ему понадобится доступ к history, поэтому мы поместим
//history в состояние родительского компонента Game.
//Это даст компоненту Game полный контроль над данными Board и
//позволит отдавать команду для Board на рендеринг прошлых ходов
//из history
class Game extends React.Component {
  //   2   ---------------------
  //зададим начальное состояние компонента Game внутри конструктора
  constructor(props) {
    super(props);
    this.state = {
      //массив history будет хранить все состояния поля.
      //От первого до последнего хода
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      //stepNumber для указания номера хода, который сейчас отображается
      stepNumber: 0,
      xIsNext: true,
    };
  }
  handleClick(i) {
    //если мы «вернёмся назад», а затем сделаем новый шаг из этой
    //точки, мы удалим всю «будущую» историю, которая перестала
    //быть актуальной
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    //  7  добавим новые записи истории в history
    //метод concat() не изменяет оригинальный массив
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      //нам нужно обновить stepNumber
      //Это гарантирует, что мы не застрянем, показывая одно и то же
      //после того, как был сделан новый ход
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  //jumpTo для обновления stepNumber
  //установим xIsNext в true, если номер хода, на который мы
  //меняем stepNumber, чётный
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    //   5
    //использовать запись из истории для определения и
    //отображения статуса игры, соответствующий stepNumber
    const history = this.state.history;
    //
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    //Используя метод map, мы можем отобразить историю ходов в
    //React-элементы, представленные кнопками на экране, и
    //отрисовать список кнопок для «перехода» к прошлым ходам.
    const moves = history.map((step, move) => {
      const desc = move ? "Move to " + move + " move" : "Move to Start";
      {
        /*Для каждого хода в истории игры мы создаём элемент списка
         <li>, который содержит кнопку <button>. У кнопки есть обработчик 
        onClick, который вызывает метод this.jumpTo().
        
        В истории игры крестики-нолики каждый прошлый ход имеет уникальный 
        идентификатор: это номер хода в последовательности. Ходы никогда 
        не меняют свой порядок, не удаляются и не добавляются в середину 
        последовательности, так что вполне безопасно пользоваться индексом 
        в качестве ключа.
        <li key={move}>
        */
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    //
    let status;
    if (winner) {
      status = "Won " + winner;
    } else {
      status = "Next player is " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          {/*  6 */}
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          {/*использовать последнюю запись из истории */}
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
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
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
