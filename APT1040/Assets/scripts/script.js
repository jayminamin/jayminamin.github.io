document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents page reload

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const responseMsg = document.getElementById('responseMessage');

    // Email Regex Pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // This object is what you would send to your database/API in the future
    const formData = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString()
    };

    // Show success message
    responseMsg.textContent = "Thank you, " + name + ". We will contact you soon!";
    responseMsg.style.display = "block";

    // Clear form
    document.getElementById('contactForm').reset();
});