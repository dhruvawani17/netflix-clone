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
