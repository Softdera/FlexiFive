const books = [
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

document.getElementById('calculate-price').addEventListener('click', () => calculateTotalPrice());
