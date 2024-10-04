function filterHorses() {
    const breedFilter = document.getElementById('breedFilter').value;
    const sexFilter = document.getElementById('sexFilter').value;
    const ageFilter = document.getElementById('ageFilter').value;

    const horses = document.querySelectorAll('.horse-card');
    let horsesFound = false;

    horses.forEach(horse => {
        const breed = horse.getAttribute('data-breed');
        const sex = horse.getAttribute('data-sex');
        const age = parseInt(horse.getAttribute('data-age'));

        let ageMatch = true;
        if (ageFilter !== 'all') {
            const ageRange = ageFilter.split('-');
            ageMatch = age >= parseInt(ageRange[0]) && age <= parseInt(ageRange[1]);
        }

        const breedMatch = breedFilter === 'all' || breed === breedFilter;
        const sexMatch = sexFilter === 'all' || sex === sexFilter;

        if (breedMatch && sexMatch && ageMatch) {
            horse.style.display = 'flex';
            horsesFound = true;  // Hevonen löytyi
        } else {
            horse.style.display = 'none';
        }
    });

    // Näytetään tai piilotetaan virheviesti sen mukaan, löytyikö hevosia
    const errorMessage = document.getElementById('error-message');
    if (horsesFound) {
        errorMessage.style.display = 'none';
    } else {
        errorMessage.style.display = 'block';
    }
}

function resetFilters() {
    // Palautetaan filtteröintivalinnat oletusarvoihin
    document.getElementById('breedFilter').value = 'all';
    document.getElementById('sexFilter').value = 'all';
    document.getElementById('ageFilter').value = 'all';

    // Näytetään kaikki hevoskortit uudelleen
    const horses = document.querySelectorAll('.horse-card');
    horses.forEach(horse => {
        horse.style.display = 'flex';
    });

    // Piilotetaan virheviesti
    document.getElementById('error-message').style.display = 'none';
}