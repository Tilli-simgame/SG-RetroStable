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
                document.querySelector('.content').innerHTML = '<p>Error loading content.</p>';
                console.error('There was a problem with the fetch operation:', error);
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
    function handleHashChange() {
        const hash = window.location.hash.substring(1); // Remove the # symbol

        // If no hash or an invalid hash, set it to 'home'
        const page = hash ? `${hash}.html` : 'home.html';

        // Load the corresponding page
        loadPage(page);
    }

    // Load the sidebar and handle routing on window load
    window.onload = () => {
        loadSidebar(); // Load the sidebar
        handleHashChange(); // Load the correct page based on the current hash
    };

    // Listen for changes in the hash and load the corresponding page
    window.addEventListener('hashchange', handleHashChange);