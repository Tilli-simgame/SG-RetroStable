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
            document.getElementById('profile-image').src = 'animals/horses/' + data.gallery[0].filename;
            document.getElementById('profile-image-copy').textContent = data.gallery[0].copyright;
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


            // Fill competition calendar
            const calendar = document.getElementById('competition-calendar');
            data.competition_calendar.forEach(event => {
                const row = document.createElement('div');
                row.classList.add('competition-row');
                
                const dateCell = document.createElement('div');
                dateCell.classList.add('cell');
                dateCell.textContent = event.date;

                const classCell = document.createElement('div');
                classCell.classList.add('cell');
                classCell.textContent = event.class;

                const placeCell = document.createElement('div');
                placeCell.classList.add('cell');
                placeCell.textContent = event.place;

                const placementCell = document.createElement('div');
                placementCell.classList.add('cell');
                placementCell.textContent = event.placement;

                // Append cells to row
                row.appendChild(dateCell);
                row.appendChild(classCell);
                row.appendChild(placeCell);
                row.appendChild(placementCell);

                // Append row to calendar
                calendar.appendChild(row);
            });

            // Haetaan elementti, johon luonnekuvaus lisätään
            const temperamentContainer = document.getElementById('temperament-description');

            // Lisätään jokainen kappale erikseen
            data.temperament.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                temperamentContainer.appendChild(p);
            });

            // Haetaan elementti, johon historia lisätään
            const historyContainer = document.getElementById('history-description');

            // Lisätään jokainen kappale erikseen
            data.history.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                historyContainer.appendChild(p);
            });

            // Fill gallery
            const gallery = document.getElementById('gallery');
            // Käydään läpi kaikki kuvat ja lisätään metatiedot
            data.gallery.forEach(image => {
                // Luodaan figure-elementti
                const figure = document.createElement('figure');

                // Luodaan kuva-elementti
                const img = document.createElement('img');
                img.src = 'animals/horses/' + image.filename;
                img.alt = image.alt;
                img.classList.add('img-thumbnail');

                // Lisätään onclick-funktio kuvalle modaalin avaamista varten
                img.onclick = function() {
                    const modalImage = document.getElementById("modalImage");
                    const modalCaption = document.getElementById("modalCaption");

                    // Asetetaan modaalissa näytettävät kuvan tiedot
                    modalImage.src = this.src;
                    modalCaption.innerHTML = `<p>${image.description}</p><p>${image.copyright}</p>`;

                    // Näytetään Bootstrapin modaali
                    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
                    modal.show();
                };

                // Luodaan figcaption kuvatekstiä varten
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = `${image.alt} - ${image.copyright}`;

                // Liitetään kuva ja kuvateksti figureen
                figure.appendChild(img);
                figure.appendChild(figcaption);

                // Lisätään figure galleriaan
                gallery.appendChild(figure);
            });

            // Now, insert the Utterances script dynamically
            addUtterancesComments(data.nickname);  // Pass the nickname or other unique identifier

            
        })
        .catch(error => {
            document.querySelector('.content').innerHTML = '<p>Virhe ladattaessa hevosen profiilia. Tietoja ei löytynyt.</p>';
            console.error('Ongelma JSON-latauksessa:', error);
        });
}

// Function to dynamically add Utterances script
function addUtterancesComments(issueTerm) {
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.setAttribute('repo', 'Tilli-simgame/SG-RetroStable-Diaries');
    script.setAttribute('issue-term', issueTerm);  // Dynamically set the issue-term based on the horse's nickname
    script.setAttribute('theme', 'github-light');
    script.crossorigin = 'anonymous';

    // Append the script to a suitable place in your HTML, e.g., at the end of the content div
    document.querySelector('.content').appendChild(script);
}



    // Load the sidebar and handle routing on window load
    window.onload = () => {
        loadSidebar(); // Load the sidebar
        handleHashChange(); // Load the correct page based on the current hash
    };

    // Listen for changes in the hash and load the corresponding page
    window.addEventListener('hashchange', handleHashChange);