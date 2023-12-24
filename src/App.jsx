import { useEffect, useState} from 'react'
import Die from './components/Die.jsx'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'
import './App.css'

function App() {
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [stopwatch, setStopwatch] = useState(0)

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allDiceSame = dice.every(die => die.value === firstValue)
    if(allHeld && allDiceSame) { 
      setTenzies(true)
      if (startTime) {
        setStopwatch(Date.now() - startTime); 
      }
    }
  }, [dice, startTime])
  
  useEffect(() => {
    let intervalId;
    if (startTime && !tenzies) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime); 
      }, 1000); 
    } else {
      clearInterval(intervalId); 
      setElapsedTime(0); 
      setStartTime(null); 
    }
    return () => clearInterval(intervalId)
  }, [startTime, tenzies])

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
      if (!startTime) {
        setStartTime(Date.now()); 
      }
    } else {
      setTenzies(false)
      setDice(allNewDice())

      const leastRolls = localStorage.getItem("leastRolls")
      if(leastRolls === null || rollCount < leastRolls) {
        localStorage.setItem("leastRolls", rollCount)
      }
      setRollCount(0)

      const timeTaken = Math.floor(stopwatch / 1000)
      const bestTime = localStorage.getItem("bestTimeTakenToWin")

      if(bestTime === null || timeTaken < bestTime) {
        localStorage.setItem("bestTimeTakenToWin", timeTaken)
      }
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
      <div id='points'>
        <section>
        <p className='points-para'>Roll Count: {rollCount}</p>
        <p>Least Rolls: {localStorage.getItem("leastRolls")}</p>
        </section>
        <section>
          {!tenzies && <p className='points-para'>Elapsed Time: {Math.floor(elapsedTime / 1000)} sec</p>}
          {tenzies && <p className='points-para'>Total Time: {Math.floor(stopwatch / 1000)} sec</p>}
          <p>Best Time: {localStorage.getItem("bestTimeTakenToWin")} sec</p>
        </section>
      </div>
    </main>
  )
}

export default App
