let pendingBooking = null;

// Load available destinations based on selected date
const loadDestinationsForDate = (event) => {
    event.preventDefault();
    const selectedDate = $('#flightDate').val();
    const destinations = JSON.parse(localStorage.getItem('destinations')) || [];
    const $destinationSelect = $('#destination');
    $destinationSelect.empty();

    // Filter destinations for the selected date
    const filteredDestinations = destinations.filter(dest => dest.date === selectedDate);

    // If no destinations for the selected date, show alert
    if (filteredDestinations.length === 0) {
        alert("No destinations available for the selected date.");
        return;
    }

    // Populate destination options
    filteredDestinations.forEach((destination, index) => {
        const option = new Option(`${destination.city} (${destination.airline}) - $${destination.price}, ${destination.travelTime} hrs`, index);
        $destinationSelect.append(option);
    });

    $('#bookingForm').removeClass('d-none');
};

// Show appropriate modal based on flight price
const showAppropriateModal = () => {
    const passengerName = $('#passengerName').val();
    const selectedDestinationIndex = $('#destination').val();
    const destinations = JSON.parse(localStorage.getItem('destinations')) || [];

    // Check if a destination was selected
    if (!selectedDestinationIndex) {
        alert("Please select a destination.");
        return;
    }

    // Get the selected destination
    const selectedDestination = destinations[selectedDestinationIndex];

    // Check if passenger name is entered
    if (!passengerName) {
        alert("Please enter the passenger name.");
        return;
    }


    pendingBooking = { passengerName, destination: selectedDestination };


    if (pendingBooking.destination.price > 500) {
        $('#highPriceModal').modal('show');
    } else {
        $('#confirmationModal').modal('show');
    }
};

// Add booking to localStorage
const confirmBooking = () => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push({ passengerName: pendingBooking.passengerName, destination: pendingBooking.destination });
    localStorage.setItem('bookings', JSON.stringify(bookings));

    $('#passengerName').val('');
    loadBookings();

    
    $('#confirmationModal').modal('hide');
};

// Confirm high-price booking and proceed
const confirmHighPriceBooking = () => {
    confirmBooking();

    $('#highPriceModal').modal('hide');
};

// Load bookings from localStorage and display in the table
const loadBookings = () => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const $bookingsList = $('#bookingsList');
    $bookingsList.empty();

    bookings.forEach((booking, index) => {
        $bookingsList.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${booking.passengerName}</td>
                <td>${booking.destination.city}</td>
                <td>${booking.destination.airline}</td>
                <td>$${booking.destination.price}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteBooking(${index})">Delete</button>
                </td>
            </tr>
        `);
    });
};

// Delete booking
const deleteBooking = (index) => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.splice(index, 1);  // Remove the booking at the given index
    localStorage.setItem('bookings', JSON.stringify(bookings));
    loadBookings();
};

$('#dateForm').on('submit', loadDestinationsForDate);
$('#confirmBooking').on('click', confirmBooking);
$('#confirmHighPriceBooking').on('click', confirmHighPriceBooking);
loadBookings();
