import React, { useState } from 'react';
import './App.css';
import { useEffect } from 'react';

const PlayNumber = props => (
  <button 
    className="number"
    style={{backgroundColor: colors[props.status]}}
    onClick={() => props.onClick(props.number, props.status)}>{props.number}
  </button>
);

const StarsDisplay = props => (
  <>
    {utils.range(1, props.count).map(starId => <div key={starId} className="star"/>)}
  </>
);

const PlayAgain = props => (
  <div className="game-done">
    <p style={{color: props.gameStatus === 'lost' ? 'red' : 'green'}}>{props.gameStatus === 'lost' ? 'Game over' : 'You win'}</p>
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

const StarMatch = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if(secondsLeft > 0 && availableNums.length > 0)
    {
      const timeId = setTimeout( () => {
        setSecondsLeft(secondsLeft - 1);
      } , 1000);
      return () => clearTimeout(timeId);
    }
  })

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  const gameStatus = availableNums.length === 0 
    ? 'won'
    : secondsLeft === 0 ? 'lost' : 'active';

  const resetGame = () => {
    setStars(utils.random(1, 9));
    setAvailableNums(utils.range(1, 9));
    setCandidateNums([]);
    setSecondsLeft(10);
  };

  const numberStatus = number => {
    if (!availableNums.includes(number)){
      return 'used';
    }
    else if (candidateNums.includes(number)){
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }

    return 'availabe';
  };

  const onNumberClick = (number, currentStatus) => {
    if (currentStatus === 'used' || gameStatus !== 'active')
      return;

    //candidateNums
    const newCandidates = 
      currentStatus === 'availabe'
      ? candidateNums.concat(number)
      : candidateNums.filter(n => n !== number);

    if (utils.sum(newCandidates) !== stars){
      setCandidateNums(newCandidates);
    }
    else {
      //reset candidates
      const newAvailableNums = availableNums.filter(
        n => !newCandidates.includes(n)
      );
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
      setStars(utils.randomSumIn(newAvailableNums, 9));
    }
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
        {
          gameStatus !== 'active' ? 
            <PlayAgain gameStatus={gameStatus} onClick={resetGame} /> 
            : <StarsDisplay count={stars} />
        }
        </div>
        <div className="right">
          {utils.range(1, 9).map(number => (
            <PlayNumber
              key={number}
              status={numberStatus(number)}
              number={number}
              onClick={onNumberClick}
            />
          ))}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

function App() {
  return (
    <StarMatch />
  );
}

export default App;
