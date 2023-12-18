## Artify | Virtual Art Gallery

Artify is a virtual art gallery to explore diversity in the creativity. It is a platform that allows user to explore various pieces of art. From modern abstracts to classical masterpieces, your gallery will be an immersive online experience.

**Functionality**

- The user opens the application and is greeted with the elegant homepage that showcases the feature artworks.
- The user can browse various gallery sections like "Sculptures", "Painting", "Monument" etc. We have identified total 11 gallery sections for showcasing the artwork.
- Upon clicking an individual gallery section, it lists down the latest photos of artwork uploaded under that section. On clicking a photo, a page provide enlarged view of image along with detailed information about artwork such as artist name, tags, portfolio link.
- User can 'favorite'  artworks creating a personalized gallery that they can revisit under 'Prefences' tab. User can also revert the favorite action on artwork removing it from preferences.
- User's favorites are stored locally and are retained when the page is reloaded.
- We used unsplash api for populating all the stuff related to artwork, be it gallery section, photos or photo details. Follow below steps in order to integrate unsplash api with you application.

**Steps to use Unsplash Api**
- Register to https://unsplash.com/. Create application on https://unsplash.com/developers. Copy Access Key under Keys section.
- Install unsplash-js dependency in you application using npm install unsplash-js.
- For using it in the application to search photos from specific gallery section 'monument', use below code:
```
import { createApi } from "unsplash-js";    
  const unsplash = createApi({
    accessKey: YOUR_ACCESS_KEY
});
let result = await unsplash.search.getPhotos({
        'query': 'monument',
        'page': 1,
        'perPage': 10,
        'orientation': 'portrait'
});
``````
> [Working Demo](https://artify-gallery.onrender.com/)
