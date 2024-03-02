let users = JSON.parse(localStorage.getItem('users')) || []; // Retrieve users from localStorage
let loggedInUser = null; // Currently logged in user

function showRegister() {
    document.getElementById('options').style.display = 'none';
    document.getElementById('registration').style.display = 'block';
}

function showLogin() {
    document.getElementById('options').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

function register() {
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!firstName || !lastName || !phoneNumber || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (users.find(user => user.phoneNumber === phoneNumber)) {
        alert("You are already registered. Please login.");
        showLogin();
        return;
    }

    // Add user to the list
    users.push({ firstName, middleName, lastName, phoneNumber, password });

    // Save users to localStorage after registration
    localStorage.setItem('users', JSON.stringify(users));

    // Show login section
    showLogin();
    alert("Congratulations! You got $100 on your balance.");
}

function login() {
    const phoneNumber = document.getElementById('loginPhoneNumber').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.phoneNumber === phoneNumber && user.password === password);
    if (!user) {
        alert("Invalid phone number or password.");
        return;
    }

    loggedInUser = user;
    document.getElementById('loggedInUser').innerText = `${user.firstName} ${user.lastName}`;

    // Load user balance from localStorage
    document.getElementById('userBalance').innerText = localStorage.getItem('balance') || "100";

    document.getElementById('login').style.display = 'none';
    document.getElementById('wallet').style.display = 'block';
}

function sendMoney() {
    const amount = parseFloat(document.getElementById('amount').value);
    const receiverPhoneNumber = document.getElementById('receiver').value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const receiver = users.find(user => user.phoneNumber === receiverPhoneNumber);
    if (!receiver) {
        alert("User not found.");
        return;
    }

    if (receiver.phoneNumber === loggedInUser.phoneNumber) {
        alert("You cannot send money to yourself.");
        return;
    }

    const senderBalance = parseFloat(document.getElementById('userBalance').innerText);

    if (amount > senderBalance) {
        alert("Insufficient balance.");
        return;
    }

    // Show receiver's details
    document.getElementById('receiverName').innerText = `Receiver: ${receiver.firstName} ${receiver.lastName}`;
    document.getElementById('transferAmount').innerText = `Amount: $${amount}`;
    document.getElementById('receiverDetails').style.display = 'block';
}

function confirmTransfer() {
    // Perform the transfer
    const amount = parseFloat(document.getElementById('amount').value);
    const receiverPhoneNumber = document.getElementById('receiver').value;

    // Deduct amount from sender's balance
    const senderBalance = parseFloat(document.getElementById('userBalance').innerText);
    const newSenderBalance = senderBalance - amount;
    document.getElementById('userBalance').innerText = newSenderBalance.toString();

    // Add amount to receiver's balance in localStorage
    const receiver = users.find(user => user.phoneNumber === receiverPhoneNumber);
    const receiverBalance = parseFloat(localStorage.getItem('balance')) || 100;
    const newReceiverBalance = receiverBalance + amount;
    localStorage.setItem('balance', newReceiverBalance.toString());

    alert(`Successfully sent $${amount} to ${receiver.firstName} ${receiver.lastName}.`);

    // Reset input fields and hide receiver details
    document.getElementById('amount').value = '';
    document.getElementById('receiver').value = '';
    document.getElementById('receiverDetails').style.display = 'none';
}

function cancelTransfer() {
    // Reset input fields and hide receiver details
    document.getElementById('amount').value = '';
    document.getElementById('receiver').value = '';
    document.getElementById('receiverDetails').style.display = 'none';
}

function logout() {
    loggedInUser = null;

    // Reset balance on logout
    document.getElementById('userBalance').innerText = "100";

    document.getElementById('options').style.display = 'block';
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('wallet').style.display = 'none';
}