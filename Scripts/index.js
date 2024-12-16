function navbarClicked() {
    alert("Navbar clicked - external file");
  }
  
  function updatePValue() {
    document.getElementById("homePageP").innerHTML = "New value";
  }
  
  function logFormInfo(event) {
    event.preventDefault();
  
    let airlineNameValue = document.getElementById("airlineName").value;
    alert("Airline name: " + airlineNameValue);
  }
  
  // setTimeout example: Executes only once after 3 seconds
  setTimeout(() => {
    console.log("This message is shown after 3 seconds.");
  }, 3000);
  
  // setInterval example: Repeats every 2 seconds
  const intervalId = setInterval(() => {
    console.log("This message is shown every 2 seconds.");
  }, 2000);
  
  // Clear the interval after 10 seconds
  setTimeout(() => clearInterval(intervalId), 10000);
  
  // Update the time every second
  setInterval(() => {
    const now = new Date();
    const day = now.getDay() + 1; // Days are 0-based
    const month = now.getMonth() + 1; // Months are 0-based
    const year = now.getFullYear();
  
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
  
    document.getElementById(
      "currentDate"
    ).textContent = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  }, 1000);