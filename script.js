
// Get HTML Elements
const form = document.getElementById("expense-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const date = document.getElementById("date");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");

const transactionList = document.getElementById("transaction-list");
const searchInput = document.getElementById("search");
const filterInput = document.getElementById("filter");

// Load transactions from LocalStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Set today's date
date.value = new Date().toISOString().split("T")[0];

// Add Transaction
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const transaction = {
        id: Date.now(),
        description: description.value.trim(),
        amount: Number(amount.value),
        type: type.value,
        category: category.value,
        date: date.value
    };

    if (
        !transaction.description ||
        !Number.isFinite(transaction.amount) ||
        transaction.amount <= 0 ||
        !transaction.date
    ) {
        alert("Please enter valid transaction details.");
        return;
    }

    transactions.push(transaction);

    saveTransactions();

    displayTransactions();

    form.reset();
    date.value = new Date().toISOString().split("T")[0];

});

// Save Transactions
function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

// Calculate Balance
function updateDashboard() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }

    });

    const balance = totalIncome - totalExpense;

    balanceDisplay.textContent = "₹" + balance.toFixed(2);
    incomeDisplay.textContent = "₹" + totalIncome.toFixed(2);
    expenseDisplay.textContent = "₹" + totalExpense.toFixed(2);

}

// Display Transactions
function displayTransactions() {

    transactionList.innerHTML = "";

    const searchValue = searchInput.value.toLowerCase();
    const filterValue = filterInput.value;

    const filteredTransactions = transactions.filter(function(transaction) {

        const matchesSearch =
            transaction.description.toLowerCase().includes(searchValue) ||
            transaction.category.toLowerCase().includes(searchValue);

        const matchesFilter =
            filterValue === "all" ||
            transaction.type === filterValue;

        return matchesSearch && matchesFilter;

    });

    // Show message if no transactions
    if (filteredTransactions.length === 0) {

        const message = document.createElement("li");
        message.textContent = "No transactions found.";
        transactionList.appendChild(message);

        updateDashboard();
        return;
    }

    // Display each transaction
    filteredTransactions.forEach(function(transaction) {

        const li = document.createElement("li");

        const title = document.createElement("strong");
        title.textContent = transaction.description;

        const details = document.createElement("p");
        details.textContent =
            transaction.category + " | " + transaction.date;

        const price = document.createElement("p");

        if (transaction.type === "income") {
            price.textContent = "+ ₹" + transaction.amount.toFixed(2);
            price.style.color = "green";
        } else {
            price.textContent = "- ₹" + transaction.amount.toFixed(2);
            price.style.color = "red";
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            deleteTransaction(transaction.id);

        });

        li.appendChild(title);
        li.appendChild(details);
        li.appendChild(price);
        li.appendChild(deleteButton);

        transactionList.appendChild(li);

    });

    updateDashboard();

}

// Delete Transaction
function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {

        return transaction.id !== id;

    });

    saveTransactions();
    displayTransactions();

}

// Search Transactions
searchInput.addEventListener("input", function() {

    displayTransactions();

});

// Filter Transactions
filterInput.addEventListener("change", function() {

    displayTransactions();

});

// Initial Display
displayTransactions();
