document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const locationInput = document.getElementById("location");
    const skillsSelect = document.getElementById("skills");
    const messageBox = document.getElementById("message");
    const profileForm = document.getElementById("profileForm");

    // Dynamically add a manual input field for 'Any Other'
    const manualSkillInput = document.createElement("input");
    manualSkillInput.type = "text";
    manualSkillInput.id = "manualSkill";
    manualSkillInput.placeholder = "Enter your skill";
    manualSkillInput.style.display = "none";
    manualSkillInput.classList.add("input-group", "manual-skill-field");

    // Insert manualSkillInput after skills select
    skillsSelect.parentNode.appendChild(manualSkillInput);

    // Show manual input when "Any Other" is selected
    skillsSelect.addEventListener("change", function () {
        if (skillsSelect.value === "Any Other") {
            manualSkillInput.style.display = "block";
        } else {
            manualSkillInput.style.display = "none";
            manualSkillInput.value = "";
        }
    });

    // ✅ Fetch existing profile
    try {
        const response = await fetch("http://localhost:3001/api/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            locationInput.value = data.location || "";

            // Check if skill is in the dropdown options
            const isPredefined = Array.from(skillsSelect.options).some(opt => opt.value === data.skills);

            if (isPredefined) {
                skillsSelect.value = data.skills;
                manualSkillInput.style.display = "none";
            } else {
                skillsSelect.value = "Any Other";
                manualSkillInput.style.display = "block";
                manualSkillInput.value = data.skills;
            }
        } else {
            messageBox.textContent = data.message || "Failed to fetch profile.";
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        messageBox.textContent = "An error occurred while loading profile.";
    }

    // ✅ Handle form submission
    profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const updatedLocation = locationInput.value.trim();
        const selectedSkill = skillsSelect.value;
        const manualSkill = manualSkillInput.value.trim();
        const finalSkill = selectedSkill === "Any Other" ? manualSkill : selectedSkill;

        if (updatedLocation === "" || finalSkill === "") {
            messageBox.textContent = "Both fields are required!";
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    location: updatedLocation,
                    skills: finalSkill,
                }),
            });

            const data = await response.json();
            messageBox.textContent = data.message || data.error;

            if (response.ok) {
                setTimeout(() => {
                    window.location.href = "internships.html";
                }, 2000);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            messageBox.textContent = "An error occurred while updating.";
        }
    });
});
