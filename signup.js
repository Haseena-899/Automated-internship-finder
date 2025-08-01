document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const messageBox = document.getElementById("message");

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        let valid = true;

        // Name
        if (nameInput.value.trim() === "") {
            nameError.textContent = "Name is required!";
            nameError.style.display = "block";
            valid = false;
        } else {
            nameError.style.display = "none";
        }

        // Email
        if (!validateEmail(emailInput.value)) {
            emailError.textContent = "Enter a valid email!";
            emailError.style.display = "block";
            valid = false;
        } else {
            emailError.style.display = "none";
        }

        // Password
        if (!validatePassword(passwordInput.value)) {
            passwordError.textContent = "Password must be at least 6 characters!";
            passwordError.style.display = "block";
            valid = false;
        } else {
            passwordError.style.display = "none";
        }

        // Confirm Password
        if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordError.textContent = "Passwords do not match!";
            confirmPasswordError.style.display = "block";
            valid = false;
        } else {
            confirmPasswordError.style.display = "none";
        }

        if (!valid) return;

        try {
            const response = await fetch("http://localhost:3001/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value,
                }),
            });

            const data = await response.json();
            messageBox.textContent = data.message || data.error;

            if (response.status === 201) {
                // ✅ If token is returned on signup
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userId", data.userId);
                    setTimeout(() => {
                        window.location.href = "profile.html"; // 👈 redirect to profile
                    }, 2000);
                } else {
                    // ✅ If token not returned, redirect to login instead
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 2000);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            messageBox.textContent = "Something went wrong!";
        }
    });

    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener("focus", function () {
            this.style.border = "2px solid #007bff";
        });
        input.addEventListener("blur", function () {
            this.style.border = "1px solid #ccc";
        });
    });
});
