//Unsplash Api Initialization
import { createApi } from "unsplash-js";
const unsplash = createApi({
    accessKey: 'NjndX8n36P_kMDVOMhYmt6W0md3kiZmXk-OaGZ5N2vg'
});

//Variables
let gallerySections = [
    {
        id: 1,
        title: 'sculptures',
        url: '../images/sculpture.jpg'
    },
    {
        id: 2,
        title: 'painting',
        url: '../images/painting.jpg'
    },
    {
        id: 3,
        title: 'sketch art',
        url: '../images/sketch.jpg'
    },
    {
        id: 4,
        title: 'monument',
        url: '../images/monument.jpg'
    },
    {
        id: 5,
        title: 'textures',
        url: '../images/textures.jpg'
    },
    {
        id: 6,
        title: 'animation',
        url: '../images/animations.jpg'
    },
    {
        id: 7,
        title: 'architecture',
        url: '../images/architecture.jpg'
    },
    {
        id: 8,
        title: 'fine art',
        url: '../images/fine_art.jpg'
    },
    {
        id: 9,
        title: 'modern art',
        url: '../images/modern_art.jpg'
    },
    {
        id: 10,
        title: 'caves',
        url: '../images/caves.jpg'
    },
    {
        id: 11,
        title: 'classic art',
        url: '../images/classic_art.jpg'
    }
];
const main = document.querySelector('#main');
const artworkDetails = document.querySelector('#artworkDetails');
let gallerySectionsByClass = [];
let backButton = document.getElementById('back');
let homeButton = document.getElementById('home');
let preferencesButton = document.getElementById('preferences');
let gallerySectionName;
let paragraphMsg = document.querySelector('#message p');
let existingFavoritedPhotos = [];
let storedPreferences = JSON.parse(localStorage.getItem('photos'));
let logo = document.getElementById('logo');

//Gallery Sections
function loadGallerySections() {
    if (preferencesButton.classList.contains('active')) {
        preferencesButton.classList.remove("active");
        homeButton.classList.add("active");
    }
    paragraphMsg.innerHTML = `Click below on any gallery window and open the door to incredible artwork.`;
    let sections = gallerySections.map((section) => {
        return `<div class='section' sectionname="${section.title}">
                    <img src="${section.url}" sectionname="${section.title}"/>
                    <span sectionname="${section.title}">${section.title}</span>                
                </div>`;
    });
    artworkDetails.innerHTML = '';
    main.innerHTML = sections.join('');
    getGallerySectionsByClass();
}

function getGallerySectionsByClass() {
    gallerySectionsByClass = document.querySelectorAll('.section');
    gallerySectionsByClass.forEach((section) => {
        section.addEventListener('click', function (event) {
            gallerySectionName = event.target.getAttribute('sectionname');
            loadPhotos();
        });
    });
}

async function loadPhotos() {
    if (preferencesButton.classList.contains('active')) {
        preferencesButton.classList.remove("active");
        homeButton.classList.add("active");
    }
    let result = await unsplash.search.getPhotos({
        'query': gallerySectionName,
        'page': 1,
        'perPage': 10,
        'orientation': 'portrait'
    });
    if (result.type === 'success') {
        const photos = result.response.results;
        const getUrls = photos.map((i) => {
            return `<div class='artwork'>
                        <div class='favorite' photoId="${i.id}" photoUrl="${i.urls.small}" title='Mark as Favourite' action='add'>&#128077;</div>
                        <img src="${i.urls.small}" id="${i.id}"/>
                    </div>`;
        });
        let artName = gallerySectionName.toUpperCase();
        main.innerHTML = getUrls.join('');
        paragraphMsg.innerHTML = `For detailed view of the ${artName}, click on the images.`;
        getArtWorkDetails();
        getFavouritesByClass();
        if (homeButton.classList.contains('active')) {
            getBackButton();
        }
        preferencesButton.classList.remove("active");
        homeButton.classList.add("active");
    }
}

logo.addEventListener('click', loadGallerySections);

loadGallerySections();

//ArtWork Detail View
async function loadArtWorkDetails(photoId) {
    let result = await unsplash.photos.get({
        'photoId': photoId
    });
    if (result.type === 'success') {
        const photoDetails = result.response;
        let tagDetails = photoDetails.tags.map((value, index) => value.title);
        let artworkImage = `<div id="photoImage">
                                <img src="${photoDetails.urls.small}"/>
                            </div>`;
        let artworkInfo = `<table id="artworkInfo">
                                <thead>
                                        <tr><th colspan="2"><b>Artwork Information<b></th></tr>
                                </thead>
                                <tbody>
                                        <tr><td><b>Art</b></td><td>${gallerySectionName}</td></tr>
                                        <tr><td><b>Artist</b></td><td>${photoDetails.user.name}</td></tr>
                                        <tr><td><b>Tags</b></td><td>${tagDetails.join(',')}</td></tr>
                                        <tr><td><b>Portfolio URL</b></td><td><a href="${photoDetails.user.portfolio_url}">${photoDetails.user.portfolio_url ? photoDetails.user.portfolio_url : 'Not Available'}</td></tr>
                                        <tr><td><b>Instagram Username</b></td><td>${photoDetails.user.instagram_username}</td></tr>
                                </tbody>
                             </table>`;
        main.innerHTML = '';
        paragraphMsg.innerHTML = 'This is how you get exposure to artify yourself.';
        artworkDetails.innerHTML = artworkImage + artworkInfo;
        if (homeButton.classList.contains('active')) {
            getBackButton();
        }
    }
}

function getArtWorkDetails() {
    let artWorkByClass = document.querySelectorAll('.artwork');
    artWorkByClass.forEach((artwork) => {
        artwork.addEventListener('click', function (event) {
            let photoId = event.target.id;
            gallerySectionName = (event.target.getAttribute('section')) ? event.target.getAttribute('section') : gallerySectionName;
            if (photoId) {
                loadArtWorkDetails(photoId);
            }
        });
    })
}

//Preferences
function getFavouritesByClass() {
    let favoritesByClass = document.querySelectorAll('.favorite');
    favoritesByClass.forEach((button) => {
        button.addEventListener('click', function (event) {
            let action = event.target.getAttribute('action');
            if (action === 'remove') {
                if (confirm('Want to remove this from favorites?')) {
                    let tempIndex = -1;
                    storedPreferences.forEach((value, index) => {
                        if (value.id === event.target.getAttribute('photoId')) {
                            tempIndex = index;
                        }
                    });
                    storedPreferences.splice(tempIndex, 1);
                    alert('Removed from Favorites.');
                    localStorage.setItem('photos', JSON.stringify(storedPreferences));
                    loadPreferences();
                }
            } else {
                existingFavoritedPhotos = localStorage.getItem('photos') ? JSON.parse(localStorage.getItem('photos')) : [];
                if (existingFavoritedPhotos &&
                    isAlreadyMarkedAsFavorite(event.target.getAttribute('photoId'))) {
                    alert('Already marked as favorite.');
                    return false;
                }
                if (confirm('Want to mark this as favorite?')) {
                    let favoritedPhoto = {
                        id: event.target.getAttribute('photoId'),
                        url: event.target.getAttribute('photoUrl'),
                        section: gallerySectionName
                    };
                    existingFavoritedPhotos.push(favoritedPhoto);
                    localStorage.setItem('photos', JSON.stringify(existingFavoritedPhotos));
                    alert('Marked as favourite.See Preferences.');
                }
            }
        });
    });
}

function isAlreadyMarkedAsFavorite(photoId) {
    let flag = false;
    if (storedPreferences) {
        storedPreferences.forEach((photo) => {
            if (photo.id === photoId) {
                flag = true;
            }
        });
    }
    return flag;
}

function loadPreferences() {
    main.innerHTML = '';
    paragraphMsg.innerHTML = `These are all the listed artworks under your favorites. To remove from favorites, click &#128078; icon.`;
    storedPreferences = JSON.parse(localStorage.getItem('photos'));
    if (storedPreferences && storedPreferences.length) {
        let prefs = storedPreferences.map((artwork) => {
            return `<div class='artwork'>
            <div class='favorite' photoId="${artwork.id}" title='Remove from Favourites' action='remove'>&#128078;</div> 
                   <img src="${artwork.url}" id="${artwork.id}" section="${artwork.section}"/>
                   </div>`
        })
        main.innerHTML = prefs.join('');
        getArtWorkDetails();
        getFavouritesByClass();
    } else {
        artworkDetails.innerHTML = 'You have not marked your favourite artworks yet. You can go to gallery sections and click &#128077; icon on artworks to mark them as your favourite.';
    }
    backButton.style.display = 'none';
}

//Navigation
function getBackButton() {
    backButton.style.display = 'inline';
    backButton.addEventListener('click', function () {
        if (main.childNodes.length === 0) {
            loadPhotos();
        } else {
            paragraphMsg.innerHTML = `Click below on any gallery window and open the door to incredible artwork.`;
            loadGallerySections();
        }
        backButton.style.display = 'none';
        artworkDetails.innerHTML = '';
    });
}

homeButton.addEventListener('click', function () {
    preferencesButton.classList.remove("active");
    homeButton.classList.add("active");
    loadGallerySections();
});

preferencesButton.addEventListener('click', function () {
    homeButton.classList.remove("active");
    preferencesButton.classList.add("active");
    artworkDetails.innerHTML = '';
    loadPreferences();
});