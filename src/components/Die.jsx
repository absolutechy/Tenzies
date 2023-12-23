function Die(props) {
    const styles = {
      backgroundColor: props.isHeld ? "#59E391" : "white"
    };
  
    const renderDots = () => {
      const dots = [];
      for (let i = 0; i < props.value; i++) {
        dots.push(<div className="dot" key={i}></div>);
      }
      return dots;
    };
  
    return (
      <div className="die-face" style={styles} onClick={props.holdDice}>
        <div className="dots-container">{renderDots()}</div>
      </div>
    );
  }
  
  export default Die;
  