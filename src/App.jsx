import { useEffect, useState } from 'react'
import Die from './components/Die.jsx'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'
import './App.css'


function App() {
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stopwatch, setStopwatch] = useState(0);

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allDiceSame = dice.every(die => die.value === firstValue)
    if(allHeld && allDiceSame) {
      setTenzies(true)
    }
  }, [dice])

  //Try to display time(seconds) continuously like a stop watch
  useEffect(() => {
    let interval;
    if (tenzies && startTime === null) {
      setStartTime(Date.now()); // Capture the start time when the game begins
      interval = setInterval(() => {
        setStopwatch(prevTime => prevTime + 1); // Update stopwatch every second
      }, 1000);
    }
  
    return () => clearInterval(interval); // Clear interval on component unmount or game win
  }, [tenzies, startTime]);
  
  useEffect(() => {
    if (tenzies && startTime !== null) {
      const endTime = Date.now();
      const timeElapsed = endTime - startTime;
      setElapsedTime(timeElapsed); // Calculate elapsed time when the game is won
    }
  }, [tenzies, startTime]);

  //Working Code Display time after wining the game
  // useEffect(() => {
  //   if (rollCount === 1) {
  //     setStartTime(Date.now()); // Capture the start time
  //   }
  // }, [rollCount]);

  // useEffect(() => {
  //   if (tenzies && startTime !== null) {
  //     const endTime = Date.now();
  //     const timeElapsed = endTime - startTime;
  //     setElapsedTime(timeElapsed); // Update elapsed time
  //   }
  // }, [tenzies, startTime]);
  

  const diceElements = dice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}/>)

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? {...die,isHeld: !die.isHeld} : die
    }))
  }

  function generateNewDie() {
    return {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
    }
  }

  function allNewDice () {
    const newDice = []
    for(let i = 1; i <= 10; i++) {
      newDice.push(generateNewDie())
    }
    console.log(newDice)
    return newDice
  }

  function rollDice() {
    if(!tenzies) {
      setRollCount(rollCount + 1)
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? 
              die : 
              generateNewDie()
      }))
    } else {
      setTenzies(false)
      setDice(allNewDice())
      setRollCount(0)
    }
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div id='dice-container'>
        {diceElements}
      </div>
      <button className='roll-dice' onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      {rollCount}
      {/* {tenzies && (
      <p className="elapsed-time">
        Time taken: {Math.floor(elapsedTime / 1000)} seconds
      </p>
      )} */}
    </main>
  )
}

export default App
