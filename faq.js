document.addEventListener('DOMContentLoaded', () => {
    const faqBoxes = document.querySelectorAll('.faqbox');

    faqBoxes.forEach(faqBox => {
        faqBox.addEventListener('click', () => {
            // Close all other FAQ boxes
            faqBoxes.forEach(box => {
                if (box !== faqBox) {
                    box.classList.remove('active');
                }
            });

            // Toggle the clicked FAQ box
            faqBox.classList.toggle('active');
        });
    });
});
