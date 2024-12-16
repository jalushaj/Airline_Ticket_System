  const $destinationForm = $("#destinationForm");
  const $destinationCityInput = $("#destinationCity");
  const $priceInput = $("#price");
  const $dateInput = $("#date");
  const $airlineSelect = $("#airline");
  const $travelTimeInput = $("#travelTime");
  const $destinationIndexInput = $("#destinationIndex");
  const $addDestinationBtn = $("#addDestinationBtn");
  const $updateDestinationBtn = $("#updateDestinationBtn");
  const $destinationsList = $("#destinationsList");

  // Generate a unique ID using Math
  function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15);
  }

  // Load airlines from Local Storage
  function loadAirlines() {
    const airlines = JSON.parse(localStorage.getItem("airlines")) || [];
    $airlineSelect.empty();
    $airlineSelect.append("<option value=''>Select an Airline</option>");
    airlines.forEach((airline) => {
      $airlineSelect.append(`<option value="${airline.id}">${airline.name}</option>`);
    });
  }

  // Load destinations from Local Storage
  function loadDestinations() {
    const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
    displayDestinations(destinations);
  }

  // Display destinations in the table
  function displayDestinations(destinations) {
    $destinationsList.empty();
    destinations.forEach((destination, index) => {
      const row = `
        <tr>
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
        </tr>
      `;
      $destinationsList.append(row);
    });
  }

  // Save a new or updated destination
  function saveDestination(event) {
    event.preventDefault();
    const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
    const city = $destinationCityInput.val().trim();
    const price = parseFloat($priceInput.val());
    const date = $dateInput.val();
    const airlineId = $airlineSelect.val();
    const travelTime = parseFloat($travelTimeInput.val());
    const id = $destinationIndexInput.val() || generateUniqueId();

    const airlines = JSON.parse(localStorage.getItem("airlines")) || [];
    const selectedAirline = airlines.find((airline) => airline.id === airlineId);
    const airlineName = selectedAirline ? selectedAirline.name : "Unknown";

    if ($destinationIndexInput.val()) {
      // Update existing destination by ID
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
      // Add new destination
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
  window.editDestination = function (id) {
    const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
    const destination = destinations.find((dest) => dest.id === id);
    if (destination) {
      $destinationCityInput.val(destination.city);
      $priceInput.val(destination.price);
      $dateInput.val(destination.date);
      $airlineSelect.val(destination.airlineId);
      $travelTimeInput.val(destination.travelTime);
      $destinationIndexInput.val(id);
      $addDestinationBtn.addClass("d-none");
      $updateDestinationBtn.removeClass("d-none");
    }
  };

  // Delete a destination
  window.deleteDestination = function (id) {
    const destinations = JSON.parse(localStorage.getItem("destinations")) || [];
    const updatedDestinations = destinations.filter((destination) => destination.id !== id);
    localStorage.setItem("destinations", JSON.stringify(updatedDestinations));
    loadDestinations();
  };

  // Reset the form
  function resetForm() {
    $destinationCityInput.val("");
    $priceInput.val("");
    $dateInput.val("");
    $airlineSelect.val("");
    $travelTimeInput.val("");
    $destinationIndexInput.val("");
    $addDestinationBtn.removeClass("d-none");
    $updateDestinationBtn.addClass("d-none");
  }

  // Event listeners
  $destinationForm.on("submit", saveDestination);
  $updateDestinationBtn.on("click", saveDestination);

  // Initialize the app
  loadAirlines();
  loadDestinations();
