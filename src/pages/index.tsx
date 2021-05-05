
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react'
import { Button } from '../components/Button';
import { RulesModal } from '../components/RulesModal';
import styles from '../styles/Home.module.scss';
import Cookies from 'js-cookie';

interface HomeProps{
  scoreCookie: number;
}


export default function Home({scoreCookie}: HomeProps) {
  const [score, setScore] = useState(scoreCookie ?? 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<'YOU WIN' | 'YOU LOSE' | 'DRAW'>();
  const [playerChoice, setPlayerChoice] = useState<'paper' | 'scissors' | 'rock'>();
  const [houseChoice, setHouseChoice] = useState<'paper' | 'scissors' | 'rock' | null>(null);
  const possibleResults = ['paper', 'scissors', 'rock'];

  function startPlay(choice: 'paper' | 'scissors' | 'rock'){
      setIsPlaying(true);

      setPlayerChoice(choice);

      setTimeout(() =>{
        const randomResult = Math.floor(Math.random() * possibleResults.length);

        if (possibleResults[randomResult] === 'paper'){
          setHouseChoice('paper');
        }else if(possibleResults[randomResult] === 'scissors'){
          setHouseChoice("scissors")
        }else{
          setHouseChoice("rock")
        }
      },1000)
  }

  function reMatch(){
    setIsPlaying(false);
    setHouseChoice(null);
    setIsFinished(false);
    setResult("DRAW");
  }

  function toggleModal(){
    setShowModal(!showModal);
  }

  useEffect(()=>{
    if(houseChoice){
      setTimeout(()=>{
        matchResults()
      },1000)
    }
  },[houseChoice])

  useEffect(() =>{
    Cookies.set(`scoreCookie`, String(score));
  },[score])

  function matchResults(){
    switch (playerChoice) {
      case "paper":
          if(houseChoice === "rock"){
            setResult('YOU WIN')
            setScore(score + 1)
          }else if(houseChoice === "scissors"){
            setResult('YOU LOSE')
            setScore(score - 1)
          }else{
            setResult('DRAW')
          }
        break;
      case "scissors":
          if(houseChoice === "paper"){
            setResult('YOU WIN')
            setScore(score + 1)
          }else if(houseChoice === "rock"){
            setResult('YOU LOSE')
            setScore(score - 1)
          }else{
            setResult('DRAW')
          }
        break;
      case "rock":
          if(houseChoice === "scissors"){
            setResult('YOU WIN')
            setScore(score + 1)
          }else if(houseChoice === "paper"){
            setResult('YOU LOSE')
            setScore(score - 1)
          }else{
            setResult('DRAW')
          }
        break;
    
      default:
        break;
    }
    setIsFinished(true)
  }
  

  return (
    <div className={styles.container}>
          <header>
              <img src="/logo.svg" alt="Rock Paper Scissors"/>

              <div className={styles.scoreContainer}>
                <p>SCORE</p>
                <span>{score}</span>
              </div>
          </header>

          <main>
            {!isPlaying ?
              <div className={styles.pickContainer}>
                <Button disable={isPlaying} startPlay={startPlay} choice="paper"/>
                <Button disable={isPlaying} startPlay={startPlay} choice="scissors"/>
                <Button disable={isPlaying} startPlay={startPlay} choice="rock"/>
              </div>
              :
              <div className={styles.gamingWrapper}>
                <div className={styles.gamingContainer}>
                  <div className={styles.playerChoiceContainer}>
                      <Button 
                        disable={isPlaying} 
                        choice={playerChoice}
                        result={result === 'YOU WIN'}
                      />
                    <p>YOU PICKED</p>
                  </div>

                  {isFinished &&
                  <div className={styles.resultContainer}>
                        <p>{result}</p>
                        <button type="button" onClick={reMatch}>
                          PLAY AGAIN
                        </button>
                  </div>
                }

                  <div className={styles.houseChoiceContainer}>
                      {!houseChoice ? <span/>
                      :
                      <Button 
                        disable={isPlaying} 
                        choice={houseChoice}
                        result={result === 'YOU LOSE'}
                      />
                      }
                      <p>THE HOUSE PICKED</p>
                  </div>
                </div>

                
              </div>
              
            }
          </main>

          <footer>
              <button type="button" className={styles.rulesButton} onClick={toggleModal}>
                RULES
              </button>
          </footer>

          <RulesModal toggleModal={toggleModal} showModal={showModal}/>
    </div>
  )
}

export const getServerSideProps : GetServerSideProps = async (ctx) =>{
  const{scoreCookie} = ctx.req.cookies;

  return{
    props:{
      scoreCookie: Number (scoreCookie),
    }
  }
}
