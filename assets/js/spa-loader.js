    // Function to load external content using Fetch API
    function loadPage(page) {
        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                document.querySelector('.content').innerHTML = data;
            })
            .catch(error => {
                document.querySelector('.content').innerHTML = '<p>Virhe ladattaessa sivua. Sivua ei löytynyt.</p>';
                console.error('Ongelma fetch-operaatiossa:', error);
            });
    }

    // Function to load the sidebar content dynamically
    function loadSidebar() {
        fetch('sidebar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('sidebar').innerHTML = data;
                // Add event listeners to dynamically loaded sidebar links
                addNavEventListeners();
            })
            .catch(error => {
                document.getElementById('sidebar').innerHTML = '<p>Error loading sidebar.</p>';
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Function to add event listeners to navigation links
    function addNavEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const page = this.getAttribute('href').substring(1); // Get the page name from href (without #)
                window.location.hash = page; // Set the hash in the URL
            });
        });
    }

    // Function to handle hash-based routing
    // Function to handle hash-based routing by directly constructing the URL
    // Function to handle hash-based routing by directly constructing the URL
    function handleHashChange() {
        const hash = window.location.hash.substring(1); // Remove the # symbol
    
        // Check if it's a profile page request
        if (hash.startsWith('hevonen#')) {
            const horseName = hash.split('#')[1]; // Extract the horse name after 'profiili#'
            const jsonFile = `animals/horses/${horseName}.json`; // Construct the path to the horse JSON file
            loadHorseProfile(jsonFile); // Load the horse profile from the JSON file
        } else {
            // If it's a normal page (like #henkilokunta, #tarhaus, etc.)
            const page = hash ? `${hash}.html` : 'home.html';
            loadPage(page);
        }
    }

    // Function to load horse profile using JSON data and HTML template
function loadHorseProfile(jsonFile) {
    // Fetch the HTML template
    fetch('horse-profile-template.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(template => {
            // Insert the template into the content div
            document.querySelector('.content').innerHTML = template;

            // Now fetch the JSON data for the horse profile
            return fetch(jsonFile);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Fill the HTML template with JSON data
            document.getElementById('nickname').textContent = data.nickname;
            document.getElementById('profile-image').src = 'animals/horses/' + data.gallery[0];
            document.getElementById('official-name').textContent = data.official_name;
            document.getElementById('nickname-text').textContent = data.nickname;
            document.getElementById('sex').textContent = data.sex;
            document.getElementById('birthdate').textContent = data.birthdate;
            document.getElementById('age').textContent = data.age;
            document.getElementById('breed').textContent = data.breed;
            document.getElementById('description').textContent = data.description;

            // Fill pedigree
            document.getElementById('father').textContent = data.pedigree.father;
            document.getElementById('mother').textContent = data.pedigree.mother;
            document.getElementById('father-father').textContent = data.pedigree.father_father;
            document.getElementById('father-mother').textContent = data.pedigree.father_mother;
            document.getElementById('mother-father').textContent = data.pedigree.mother_father;
            document.getElementById('mother-mother').textContent = data.pedigree.mother_mother;

            // Fill competition calendar
            const calendar = document.getElementById('competition-calendar');
            data.competition_calendar.forEach(event => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${event.date}</td><td>${event.class}</td><td>${event.placement}</td>`;
                calendar.appendChild(row);
            });

            // Fill gallery
            const gallery = document.getElementById('gallery');
            data.gallery.forEach(image => {
                const img = document.createElement('img');
                img.src = 'animals/horses/' + image;
                img.alt = data.nickname;
                gallery.appendChild(img);
            });
        })
        .catch(error => {
            document.querySelector('.content').innerHTML = '<p>Virhe ladattaessa hevosen profiilia. Tietoja ei löytynyt.</p>';
            console.error('Ongelma JSON-latauksessa:', error);
        });
}



    // Load the sidebar and handle routing on window load
    window.onload = () => {
        loadSidebar(); // Load the sidebar
        handleHashChange(); // Load the correct page based on the current hash
    };

    // Listen for changes in the hash and load the corresponding page
    window.addEventListener('hashchange', handleHashChange);