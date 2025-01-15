/*const books = [
    { id: 1, title: "1984", author: "George Orwell", genre: "Fiction", price: 45 },
    { id: 2, title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-fiction", price: 90 },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", price: 5 },
    { id: 4, title: "The Subtle Art of Not Giving a Fuck", author: "Mark Manson", genre: "Self-help", price: 55 },
    { id: 5, title: "Unfuck Yourself", author: "Gary John Bishop", genre: "Self-help", price: 40 },
    { id: 6, title: "Promised Land", author: "Barack Obama", genre: "Non-fiction", price: 100 },
];

let bookListContainer = document.querySelector('.book-list');
let resultContainer = document.getElementById('result');
let searchBar = document.getElementById('search-bar');


const describeBooks = () => {
    const descriptions = books.map(book => 
        `Title: ${book.title}, Author: ${book.author}, Genre: ${book.genre}, Price: $${book.price}`
    );

    descriptions.forEach(description => console.log(description));
};

describeBooks();

const displayBooks = (booksToDisplay) => {
    bookListContainer.innerHTML = ""; 

    booksToDisplay.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book'); 
        bookElement.textContent = `${book.title} by ${book.author} [${book.genre}] - $${book.price}`;
        bookListContainer.appendChild(bookElement);
    });
};

const searchBooks = () => {
    const searchText = searchBar.value.trim().toLowerCase(); 
    if (searchText) {
        const searchResults = books.filter(book =>
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText) ||
            book.genre.toLowerCase().includes(searchText)
        );
        if (searchResults.length > 0) {
            displayBooks(searchResults); 
            resultContainer.textContent = `${searchResults.length} result(s) found.`;
            return searchResults; 
        } else {
            bookListContainer.innerHTML = ""; 
            resultContainer.textContent = "No results found.";
            return []; 
        }
    } else {
        displayBooks(books); 
        resultContainer.textContent = ""; 
        return books; 
    }
};

const calculateTotalPrice = (filteredBooks) => {
    const booksToCalculate = filteredBooks || books;
    const totalPrice = booksToCalculate.reduce((total, book) => total + book.price, 0);
    resultContainer.textContent = `Total Price of Selected Books: $${totalPrice}`;
};

document.getElementById('search-title').addEventListener('click', () => {
    const searchResults = searchBooks();
    calculateTotalPrice(searchResults);
});

displayBooks(books);

document.getElementById('calculate-price').addEventListener('click', () => calculateTotalPrice());*/


document.addEventListener('DOMContentLoaded', () => {
    const MclassSelect = document.getElementById('Mclass');
    const MnameSelect = document.getElementById('Mname');
    const MListBtn = document.getElementById('MListBtn');
    const addBtn = document.getElementById('addBtn');
    const drugTableBody = document.getElementById('drugTableBody');
    const emptyRow = document.getElementById('emptyRow');
    const doneBtn = document.getElementById('doneBtn');
    const dropdown = document.getElementById('dropdown');
    const actionInput = document.getElementById('actionInput');
    const saveActionBtn = document.getElementById('saveActionBtn');

    // Function to fetch medicine classes and populate MclassSelect
    async function fetchMedicineClasses() {
        try {
            const response = await fetch('https://cliniqueplushealthcare.com.ng/prescriptions/drug_class');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const classes = await response.json();
            MclassSelect.innerHTML = '<option value="">Select medicine class</option>'; // Reset options
            classes.forEach(mclass => {
                MclassSelect.innerHTML += `<option value="${mclass.id}">${mclass.name}</option>`;
            });
        } catch (error) {
            console.error('Error fetching medicine classes:', error);
            MclassSelect.innerHTML = '<option value="">Error fetching classes</option>'; // Error handling
        }
    }

    // Function to fetch medicine names based on selected class
    async function fetchMedicineNames(classId) {
        try {
            const response = await fetch(`https://cliniqueplushealthcare.com.ng/prescriptions/get_drug_class_by_id/${classId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const medicines = await response.json();
            console.log("Medicines:", medicines); // Debugging log to verify API response

            // Populate MnameSelect
            if (Array.isArray(medicines) && medicines.length > 0) {
                MnameSelect.innerHTML = '<option value="">Select medicine name</option>'; // Clear existing options
                medicines.forEach(medicine => {
                    MnameSelect.innerHTML += `<option value="${medicine.medicine_id}">${medicine.medicine_name}</option>`;
                });
            } else {
                MnameSelect.innerHTML = '<option value="">No medicines found</option>'; // No medicines found
            }
        } catch (error) {
            console.error('Error fetching medicine names:', error);
            MnameSelect.innerHTML = '<option value="">Error fetching medicine names</option>'; // Error handling
        }
    }

    // Event listener for MListBtn to fetch medicine classes
    MListBtn.addEventListener('click', fetchMedicineClasses);

    // Event listener for MclassSelect change
    MclassSelect.addEventListener('change', () => {
        const classId = MclassSelect.value;
        console.log('Selected Class ID:', classId); // Debugging log
        if (classId) {
            fetchMedicineNames(classId); // Fetch medicines based on selected class
        } else {
            MnameSelect.innerHTML = '<option value="">Select medicine name</option>'; // Reset if no class is selected
        }
    });

    // Add button functionality to add selected medicine to the table
    addBtn.addEventListener('click', () => {
        const selectedMedicine = MnameSelect.options[MnameSelect.selectedIndex];
        const dose = document.getElementById('dose').value;
        const interval = document.getElementById('interval').value;
        const duration = document.getElementById('duration').value;
        const instruction = document.getElementById('instruction').value;

        if (selectedMedicine && selectedMedicine.value && dose && interval && duration && instruction) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td class="Col1">${drugTableBody.children.length + 1}</td>
                <td class="Col2">${selectedMedicine.text}</td>
                <td class="Col3">${dose}</td>
                <td class="Col4">${interval}</td>
                <td class="Col5">${instruction}</td>
                <td class="Col6"><button class="removeBtn">Remove</button></td>
            `;
            drugTableBody.appendChild(newRow);
            emptyRow.style.display = 'none'; // Hide empty row if any drugs are added

            const removeBtn = newRow.querySelector('.removeBtn');
            removeBtn.addEventListener('click', () => {
                drugTableBody.removeChild(newRow);
                if (drugTableBody.children.length === 0) {
                    emptyRow.style.display = ''; // Show empty row if no drugs left
                }
            });
        } else {
            alert('Please fill in all fields before adding a drug.');
        }
    });

    // Toggle dropdown display for actions
    doneBtn.addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });

    // Save action functionality
    saveActionBtn.addEventListener('click', () => {
        const action = actionInput.value;
        if (action) {
            console.log(`Action saved: ${action}`);
            actionInput.value = ''; // Clear input after saving
            dropdown.style.display = 'none'; // Hide dropdown
        } else {
            alert('Please enter an action before saving.');
        }
    });

    // Initialize medicine classes on page load
    fetchMedicineClasses();
});

