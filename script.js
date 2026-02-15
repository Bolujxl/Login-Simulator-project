document.addEventListener('DOMContentLoaded', () => {

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');

    // Fake User Credentials (Hardcoded for simulation)
    const fakeUsers = [
        {
            email: 'demo@example.com',
            password: 'Demo@123'
        },
        {
            email: 'john.doe@example.com',
            password: 'John@456'
        },
        {
            email: 'boluwatife.axel@gmail.com',
            password: 'Bolu@123'
        },
        {
            email: 'admin@example.com',
            password: 'Admin@2024'
        }
    ];

    // Blocked Domains
    const blockedDomains = ['tempmail.com', 'mailinator.com', '10minutemail.com'];

    // Validation State
    let isValid = {
        email: false,
        password: false,
    };

    function showError(element, message) {
        element.textContent = message;
        element.style.color = '#ff4d4d';
        element.style.display = 'block';
        element.style.fontSize = '0.75rem';
    }

    function clearError(element) {
        element.textContent = '';
        element.style.display = 'none';
    }


    function checkFormValidity() {
        const isAllValid = Object.values(isValid).every(value => value === true);

        loginBtn.disabled = isAllValid ? false : true;
        loginBtn.style.opacity = isAllValid ? '1' : '0.6';
        loginBtn.style.cursor = isAllValid ? 'pointer' : 'not-allowed';
    }



    // Email Validation
    emailInput.addEventListener('input', () => {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const domain = value.split('@')[1];

        if (!emailRegex.test(value)) {
            showError(emailError, 'Please enter a valid email address.');
            isValid.email = false;
        } else if (blockedDomains.includes(domain)) {
            showError(emailError, 'This email provider is not allowed.');
            isValid.email = false;
        } else {
            clearError(emailError);
            isValid.email = true;
        }
        checkFormValidity();
    });

    // Password Validation
    passwordInput.addEventListener('input', () => {
        const value = passwordInput.value;
        const minLength = value.length >= 8;
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!minLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
            let errorMsg = 'Password must have: ';
            let missing = [];
            if (!minLength) missing.push('8+ characters');
            if (!hasUpper) missing.push('1 uppercase');
            if (!hasLower) missing.push('1 lowercase');
            if (!hasNumber) missing.push('1 number');
            if (!hasSpecial) missing.push('1 special character');

            showError(passwordError, errorMsg + missing.join(', '));
            isValid.password = false;
        } else {
            clearError(passwordError);
            isValid.password = true;
        }

        checkFormValidity();
    });


    // Success Modal Logic
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission

        if (!loginBtn.disabled) {
            // Check if credentials match any user in the array
            const enteredEmail = emailInput.value.trim();
            const enteredPassword = passwordInput.value;

            const matchedUser = fakeUsers.find(user =>
                user.email === enteredEmail && user.password === enteredPassword
            );

            if (matchedUser) {
                // Extract first name from email
                const emailUsername = enteredEmail.split('@')[0]; // Get part before @
                const firstName = emailUsername.split('.')[0]; // Get first part if separated by .
                const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1); // Capitalize

                // Update modal with user's name
                const userNameSpan = document.getElementById('userName');
                userNameSpan.textContent = capitalizedName;

                // Credentials match - show success modal
                clearError(emailError);
                clearError(passwordError);
                successModal.classList.add('show');
            } else {
                // Credentials don't match - check what went wrong
                const formMsg = document.getElementById('formMsg');

                // First, check if the email exists in our system
                const emailExists = fakeUsers.find(user => user.email === enteredEmail);

                if (emailExists) {
                    // Email exists but password is wrong
                    formMsg.textContent = 'Incorrect password. Please try again.';
                } else {
                    // Email doesn't exist in our system
                    formMsg.textContent = 'Hello, you are not registered with us. Please sign up.';
                }

                formMsg.style.color = '#ff4d4d';
                formMsg.style.fontSize = '0.875rem';
            }
        }
    });

    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('show');

        // Reset form to default state
        emailInput.value = '';
        passwordInput.value = '';
        clearError(emailError);
        clearError(passwordError);
        const formMsg = document.getElementById('formMsg');
        formMsg.textContent = '';

        // Reset validation state
        isValid.email = false;
        isValid.password = false;
        checkFormValidity();
    });

    // Close modal if clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('show');
        }
    });

    // Password visibility toggle
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle icon
        togglePassword.textContent = type === 'password' ? 'visibility_off' : 'visibility';
    });

    // Enter key submission
    const formInputs = [emailInput, passwordInput];
    formInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !loginBtn.disabled) {
                e.preventDefault();
                loginBtn.click();
            }
        });
    });

});
