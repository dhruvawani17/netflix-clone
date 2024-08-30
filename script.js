document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#signup-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            // Redirect to the /welcome page
            window.location.href = '/welcome';
        });
    } else {
        console.error('Form not found');
    }
});
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the email value
    const email = document.querySelector('input[name="email"]').value;

    // Store the email in local storage
    localStorage.setItem('userEmail', email);

    // Redirect to id.html
    window.location.href = 'id.html';
});
