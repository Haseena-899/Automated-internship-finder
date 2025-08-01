document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const messageBox = document.getElementById("message");

    // Email Validation
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Form Submit Event
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        let valid = true;

        // Validate Email
        if (!validateEmail(emailInput.value)) {
            emailError.textContent = "Enter a valid email!";
            emailError.style.display = "block";
            valid = false;
        } else {
            emailError.style.display = "none";
        }

        // Validate Password
        if (passwordInput.value.length < 6) {
            passwordError.textContent = "Password must be at least 6 characters!";
            passwordError.style.display = "block";
            valid = false;
        } else {
            passwordError.style.display = "none";
        }

        // Prevent form submission if invalid
        if (!valid) {
            return;
        }

        // API Call to Backend
        try {
            const response = await fetch("http://localhost:3001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ Login success
                messageBox.style.color = "green";
                messageBox.textContent = "Login successful! Redirecting...";

                // ✅ Save token and userId
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.userId);

                // ✅ Redirect to internship.html after a short delay
                setTimeout(() => {
                    window.location.href = "profile.html"; // ✅ Go to internships
                }, 1000);
            } else {
                // ❌ Login failed
                messageBox.style.color = "red";
                messageBox.textContent = data.message || "Login failed!";
            }
        } catch (error) {
            console.error("Error:", error);
            messageBox.style.color = "red";
            messageBox.textContent = "Something went wrong! Please try again.";
        } finally {
            // Clear password field for security after form submission
            passwordInput.value = "";
        }
    });

    // Responsive Input Focus
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener("focus", function () {
            this.style.border = "2px solid #007bff";
        });
        input.addEventListener("blur", function () {
            this.style.border = "1px solid #ccc";
        });
    });

    // Google Button Click (Dummy Function)
    document.querySelector(".google-btn")?.addEventListener("click", function () {
        alert("Google Login Coming Soon!");
    });
});