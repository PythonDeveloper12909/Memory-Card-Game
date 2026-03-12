import "./Game.css";
import { useState, useRef, useEffect, createContext, use } from "react";
function Game() {
  const [cards, setCards] = useState(Array(64).fill(null));
  const [flipped, setFlipped] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [score,setScore]=useState(0)
  const [matched,setMatched]=useState([])
  const [matchsize,setMatchsize]=useState(2)
  const [woncheck,setWoncheck]=useState(false)
  const [timer,setTimer]=useState(0)
  const [running,setRunning]=useState(false)
  useEffect(() => {
    const timerID = setTimeout(() => {
      if(matched.length>=matchsize && emojis[matched.at(-1)]===emojis[matched.at(-2)]){  
        setMatchsize(prev=>prev+2)
        setScore(prev=>prev+ 5)
        return;
      }
      else if(matched.length>=matchsize){
        setFlipped(prev=>prev.slice(0,-2))
        setMatched(prev=>prev.slice(0,-2))
      }
    }, 1000);
     if(matched.length===64){
      setWoncheck(true)
      setRunning(false)
    }
    return () => clearTimeout(timerID);
  }, [flipped,matched]);
  useEffect(()=>{
    const initial = [
      "🍎","🍎","🍌","🍌","🍇","🍇","🍒","🍒",
      "🥝","🥝","🍑","🍑","🍍","🍍","🍉","🍉",
      "🥭","🥭","🍋","🍋","🍊","🍊","🍓","🍓",
      "🥥","🥥","🥑","🥑","🍈","🍈","🍐","🍐",
      "🍏","🍏","🥔","🥔","🌽","🌽","🥕","🥕",
      "🫑","🫑","🍆","🍆","🧄","🧄","🧅","🧅",
      "🍄","🍄","🥦","🥦","🥬","🥬","🥒","🥒",
      "🫛","🫛","🥜","🥜","🌰","🌰","💀","💀"
    ];
    setEmojis(shuffle([...initial]))
},[])
  useEffect(()=>{
    if(!running) return;
    const intervalid=setInterval(() => {
      setTimer(prev=>prev+1)
    }, 1000);
    return ()=>clearInterval(intervalid);
  },[running])
  const shuffle=(emojis)=>{
    for(let i=emojis.length-1;i>0;i--){
              let j=Math.floor(Math.random()*(i+1));

              [emojis[i],emojis[j]]=[emojis[j],emojis[i]]

    }
    return emojis
  }
  const format=(timer)=>{
    const minutes=Math.floor(timer/60)
    const seconds=timer%60
    return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
  }
  const flip = (index) => {
    setFlipped((prev) => prev.includes(index) || prev.length>=matchsize ? prev : [...prev, index]);
    running===false && setRunning(true) 
  };
  const matchcheck=(index)=>{
      setMatched(prev=>prev.length>=matchsize || prev.includes(index) ? prev : [...prev,index])
  } 
  const restart=()=>{
    setCards(Array(64).fill(null));
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setMatchsize(2);
    setWoncheck(false);
    setRunning(true)
    const initial = [
      "🍎","🍎","🍌","🍌","🍇","🍇","🍒","🍒",
      "🥝","🥝","🍑","🍑","🍍","🍍","🍉","🍉",
      "🥭","🥭","🍋","🍋","🍊","🍊","🍓","🍓",
      "🥥","🥥","🥑","🥑","🍈","🍈","🍐","🍐",
      "🍏","🍏","🥔","🥔","🌽","🌽","🥕","🥕",
      "🫑","🫑","🍆","🍆","🧄","🧄","🧅","🧅",
      "🍄","🍄","🥦","🥦","🥬","🥬","🥒","🥒",
      "🫛","🫛","🥜","🥜","🌰","🌰","💀","💀"
    ];
    setEmojis(shuffle([...initial]))
  }
  return (
    <>
    <div className="game_page">
    {woncheck===false ?  
    <>
      <div className="score_display"><h2 className='score'>Score:{score}</h2><h3 className='timer'>{format(timer)}</h3></div>
      <div className="grid">
        {cards.map((card, index) => (
          <div
            className={`block${flipped.includes(index) || matched.includes(index)? "flipped" : ""}`}
            onClick={() => flip(index)}
            key={index}
          >
            <span className='front' onClick={()=>matchcheck(index)}>⭐</span>
            <span className='back'>{emojis[index]}</span>
          </div>
        ))}
      </div>
     </>
    : (<><div className='win_container'><h1 className='won_state'>You won</h1>
          <h2 className='win_score'>Your Score:{score}</h2>
          <h2 className='restart_timer'>{format(timer)}</h2>
      <button className='restart_butt' onClick={restart}>Restart</button></div></>
    )}
    </div>
    </>
  );
}
export default Game;
