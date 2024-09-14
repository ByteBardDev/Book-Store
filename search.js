let data = [[]];
const itemsPerPage = 10;
let currentPage = 1;

// Initialize data array
function init_data(n) {
  for (let i = 0; i < n; i++) {
    data[i] = [];
  }
}

// Fetch data from the Open Library API
function dont_dothis() {
  const baseURL = "https://openlibrary.org/subjects/fiction.json?limit=50";

  fetch(baseURL)
    .then((res) => res.json())
    .then((res) => {
      console.log(res); // Check if the response is being fetched correctly

      init_data(res.works.length);

      let str = ""; // Create an empty string to hold the HTML content

      for (let i = 0; i < res.works.length; i++) {
        const book = res.works[i];
        const coverImage = book.cover_id
          ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
          : "https://via.placeholder.com/150"; // Placeholder if no cover available
        const price = Math.floor(Math.random() * 1000); // Random price

        str += `
          <div class="flex-item">
            <img src="${coverImage}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>Author: ${book.authors && book.authors[0] ? book.authors[0].name : 'Unknown'}</p>
            <p>First Published: ${book.first_publish_year ? book.first_publish_year : 'N/A'}</p>
            <p>Price: ${price} Rs</p>
          </div>
        `;

        // Update data array with more information
        data[i][0] = coverImage;
        data[i][1] = book.title;
        data[i][2] = i + 1; // Assign rank based on index
        data[i][3] = price; // Random price for simulation
        data[i][4] = book.authors && book.authors[0] ? book.authors[0].name : 'Unknown'; // Author name
        data[i][5] = book.first_publish_year ? book.first_publish_year : 'N/A'; // Year published
      }

      renderData(); // Render the first page

      document.getElementById("fetchButton").hidden = true;
      document.getElementById("drop").hidden = false;
      document.getElementById("drop2").hidden = false;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Render data into the flexbox container
function renderData(filteredData = data) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
  const pageData = filteredData.slice(startIndex, endIndex);

  let str = "";

  for (let i = 0; i < pageData.length; i++) {
    str += `
      <div class="flex-item">
        <img src="${pageData[i][0]}" alt="${pageData[i][1]}">
        <h3>${pageData[i][1]}</h3>
        <p>Author: ${pageData[i][4]}</p>
        <p>First Published: ${pageData[i][5]}</p>
        <p>Price: ${pageData[i][3]} Rs</p>
      </div>
    `;
  }

  const container = document.getElementById("con-2");
  container.innerHTML = str;

  updatePaginationControls(filteredData.length);
}

// Update pagination controls
function updatePaginationControls(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let controls = "";

  if (totalPages > 1) {
    controls += `<button class="pagination-button" onclick="changePage(1)">First</button>`;
    controls += `<button class="pagination-button" onclick="changePage(${Math.max(currentPage - 1, 1)})">Previous</button>`;

    for (let i = 1; i <= totalPages; i++) {
      controls += `<button class="pagination-button ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    controls += `<button class="pagination-button" onclick="changePage(${Math.min(currentPage + 1, totalPages)})">Next</button>`;
    controls += `<button class="pagination-button" onclick="changePage(${totalPages})">Last</button>`;
  }

  document.getElementById("pagination-controls").innerHTML = controls;
}

// Change page
function changePage(page) {
  currentPage = page;
  renderData(); // Re-render data for the selected page
}

// Sorting function
function sort_it_out() {
  const sort_by = document.getElementById("sort_by").value;

  if (sort_by === "Alphabets") {
    // Sort by book title alphabetically
    data.sort((a, b) => a[1].localeCompare(b[1]));
  } 
  else if (sort_by === "Author") {
    // Sort by author name alphabetically
    data.sort((a, b) => a[4].localeCompare(b[4]));  // Assuming author name is at index 4
  } 
  else if (sort_by === "Year") {
    // Sort by year published in ascending order
    data.sort((a, b) => {
        const yearA = a[5] === 'N/A' ? Infinity : a[5];  // Assuming year is at index 5
        const yearB = b[5] === 'N/A' ? Infinity : b[5];
        return yearA - yearB;
    });
  } 
  else {
    // Default sorting by rank (numerical order)
    data.sort((a, b) => a[2] - b[2]);  // Assuming rank is at index 2
  }

  renderData(); // Re-render sorted data after applying the sort
}


// Filtering function
function filter_it_out() {
  const filter_by = document.getElementById("filter_it").value;
  let filteredData = [];

  if (filter_by === "above_499") {
    // Filter books with price above or equal to 500 Rs
    filteredData = data.filter((book) => book[3] >= 500);
  } else if (filter_by === "below_500") {
    // Filter books with price below 500 Rs
    filteredData = data.filter((book) => book[3] < 500);
  } else {
    // No filter, show all
    filteredData = data;
  }

  renderData(filteredData); // Re-render filtered data
}
// Initialize Google Sign-In client
window.onload = function() {
  google.accounts.id.initialize({
    client_id: '8975256834-aamv49ru0tt8s433ujv10ahrofa1sbq9.apps.googleusercontent.com', // Replace with your Google Client ID
    callback: handleCredentialResponse
  });

  google.accounts.id.renderButton(
    document.querySelector(".g_id_signin"),
    { theme: "outline", size: "large" }  // Customize button style here
  );
};

// Handle Google Sign-In response
function handleCredentialResponse(response) {
  const id_token = response.credential;
  console.log("ID Token: " + id_token);

  // Use the ID token to authenticate with your server or handle as needed
  // For example, send the ID token to your server
  fetch('/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id_token })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Handle successful authentication here
    window.location.href = 'file:///C:/Users/AWS/Desktop/MCA/Web%20Development/Web_App_Programs/search.html'; // Redirect after sign-in
  })
  .catch(error => console.error('Error:', error));
}
