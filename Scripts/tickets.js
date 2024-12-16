let pendingBooking = null;

// Load available destinations based on selected date
const loadDestinationsForDate = (event) => {
    event.preventDefault();
    const selectedDate = document.getElementById('flightDate').value;
    const destinations = JSON.parse(localStorage.getItem('destinations')) || [];
    const destinationSelect = document.getElementById('destination');
    destinationSelect.innerHTML = '';

    // Filter destinations for the selected date
    const filteredDestinations = destinations.filter(dest => dest.date === selectedDate);

    // If no destinations for the selected date, show alert
    if (filteredDestinations.length === 0) {
        alert("No destinations available for the selected date.");
        return;
    }

    // Populate destination options
    filteredDestinations.forEach((destination, index) => {
        const option = document.createElement('option');
        option.text = `${destination.city} (${destination.airline}) - $${destination.price}, ${destination.travelTime} hrs`;
        option.value = index;  // Set value to index to uniquely identify
        destinationSelect.add(option);
    });

    // Show booking form
    document.getElementById('bookingForm').classList.remove('d-none');
};

// Show appropriate modal based on flight price
const showAppropriateModal = () => {
    const passengerName = document.getElementById('passengerName').value;
    const selectedDestinationIndex = document.getElementById('destination').value;
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

    // Store pending booking data
    pendingBooking = { passengerName, destination: selectedDestination };

    // Show the appropriate modal
    if (pendingBooking.destination.price > 500) {
        const highPriceModal = new bootstrap.Modal(document.getElementById('highPriceModal'));
        highPriceModal.show();
    } else {
        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        confirmationModal.show();
    }
};

// Confirm and add booking to localStorage
const confirmBooking = () => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push({ passengerName: pendingBooking.passengerName, destination: pendingBooking.destination });
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Reset form and reload bookings
    document.getElementById('passengerName').value = '';
    loadBookings();

    // Close confirmation modal
    const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
    confirmationModal.hide();
};

// Confirm high-price booking and proceed
const confirmHighPriceBooking = () => {
    confirmBooking();

    // Close high price modal
    const highPriceModal = bootstrap.Modal.getInstance(document.getElementById('highPriceModal'));
    highPriceModal.hide();
};

// Load bookings from localStorage and display in the table
const loadBookings = () => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = '';

    bookings.forEach((booking, index) => {
        bookingsList.innerHTML += `
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
        `;
    });
};

// Delete booking
const deleteBooking = (index) => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.splice(index, 1);  // Remove the booking at the given index
    localStorage.setItem('bookings', JSON.stringify(bookings));
    loadBookings();
};

// Initialize page by setting up event listeners
document.getElementById('dateForm').addEventListener('submit', loadDestinationsForDate);
document.getElementById('confirmBooking').addEventListener('click', confirmBooking);
document.getElementById('confirmHighPriceBooking').addEventListener('click', confirmHighPriceBooking);

// Load bookings when the page loads
loadBookings();
