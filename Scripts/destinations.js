const destinationForm = document.getElementById("destinationForm");
const destinationCityInput = document.getElementById("destinationCity");
const priceInput = document.getElementById("price");
const dateInput = document.getElementById("date");
const airlineSelect = document.getElementById("airline");
const travelTimeInput = document.getElementById("travelTime");
const destinationIndexInput = document.getElementById("destinationIndex");
const addDestinationBtn = document.getElementById("addDestinationBtn");
const updateDestinationBtn = document.getElementById("updateDestinationBtn");
const destinationsList = document.getElementById("destinationsList");

function generateUniqueId() {
  return Math.random().toString(36).substring(2, 15);
}

function loadAirlines() {
  const airlines = JSON.parse(localStorage.getItem("airlines")) || [];
  airlineSelect.innerHTML = "<option value=''>Select an Airline</option>";
  airlines.forEach((airline) => {
    const option = document.createElement("option");
    option.value = airline.id;
    option.textContent = airline.name;
    airlineSelect.appendChild(option);
  });
}
function loadDestinations() {
  const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
  displayDestinations(destinations);
}
function displayDestinations(destinations) {
  destinationsList.innerHTML = "";
  destinations.forEach((destination, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${destination.city}</td>
      <td>${destination.airlineName}</td>
      <td>$${destination.price.toFixed(2)}</td>
      <td>${destination.travelTime} hours</td>
      <td>${destination.date}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editDestination('${destination.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteDestination('${destination.id}')">Delete</button>
      </td>
    `;
    destinationsList.appendChild(row);
  });
}


function saveDestination(event) {
  event.preventDefault();
  const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
  const city = destinationCityInput.value.trim();
  const price = parseFloat(priceInput.value);
  const date = dateInput.value;
  const airlineId = airlineSelect.value;
  const travelTime = parseFloat(travelTimeInput.value);
  const id = destinationIndexInput.value || generateUniqueId();


  const airlines = JSON.parse(localStorage.getItem("airlines")) || [];
  const selectedAirline = airlines.find((airline) => airline.id === airlineId);
  const airlineName = selectedAirline ? selectedAirline.name : "Unknown";

  if (destinationIndexInput.value) {
   
    const destination = destinations.find((dest) => dest.id === id);
    if (destination) {
      destination.city = city;
      destination.price = price;
      destination.date = date;
      destination.airlineId = airlineId;
      destination.airlineName = airlineName;
      destination.travelTime = travelTime;
    }
  } else {

    destinations.push({
      id,
      city,
      price,
      date,
      airlineId,
      airlineName,
      travelTime,
    });
  }

  localStorage.setItem("destinations", JSON.stringify(destinations));
  loadDestinations();
  resetForm();
}

// Edit a destination
function editDestination(id) {
  const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
  const destination = destinations.find((dest) => dest.id === id);
  if (destination) {
    destinationCityInput.value = destination.city;
    priceInput.value = destination.price;
    dateInput.value = destination.date;
    airlineSelect.value = destination.airlineId;
    travelTimeInput.value = destination.travelTime;
    destinationIndexInput.value = id;
    addDestinationBtn.classList.add("d-none");
    updateDestinationBtn.classList.remove("d-none");
  }
}

// Delete a destination
function deleteDestination(id) {
  const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
  const updatedDestinations = destinations.filter((destination) => destination.id !== id);
  localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
  loadDestinations();
}

// Reset the form
function resetForm() {
  destinationCityInput.value = "";
  priceInput.value = "";
  dateInput.value = "";
  airlineSelect.value = "";
  travelTimeInput.value = "";
  destinationIndexInput.value = "";
  addDestinationBtn.classList.remove("d-none");
  updateDestinationBtn.classList.add("d-none");
}

// Event Listeners
destinationForm.addEventListener("submit", saveDestination);
updateDestinationBtn.addEventListener("click", saveDestination);

// Initialize the app
loadAirlines();
loadDestinations();
