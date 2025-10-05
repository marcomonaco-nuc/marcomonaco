// script.js

const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const caption = lightbox.querySelector('.caption');
const spotifyPlayer = lightbox.querySelector('.spotify-player');
const galleryImages = document.querySelectorAll('.gallery img');

function shuffleGallery() {
  const gallery = document.getElementById('gallery');
  const images = Array.from(gallery.children);
  const shuffled = images.sort(() => Math.random() - 0.5); // shuffle array
  gallery.innerHTML = ''; // clear current images
  shuffled.forEach(img => gallery.appendChild(img));
}

window.addEventListener('DOMContentLoaded', () => {
  shuffleGallery(); // keep random order

  const wrappers = document.querySelectorAll('.img-wrapper'); // !!! only wrappers
  wrappers.forEach((wrapper, i) => {
    wrapper.style.opacity = 0;
    wrapper.style.transform = 'translateY(20px)';
    setTimeout(() => {
      wrapper.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      wrapper.style.opacity = 1;
      wrapper.style.transform = 'translateY(0)';
    }, i * 20); // stagger 100ms per image
  });
});


// Open lightbox on click
document.querySelectorAll('.img-wrapper img').forEach(img => {
  img.addEventListener('click', () => {
    lightbox.classList.add('active');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    caption.textContent = img.dataset.description || img.alt;

   // !!! new: Spotify embed logic
    if (img.dataset.spotify) {
      spotifyPlayer.innerHTML = `
        <iframe
          src="${img.dataset.spotify}" 
          style="border-radius:12px" 
          frameborder="0" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy">
        </iframe>
      `;
    } else {
      spotifyPlayer.innerHTML = ''; // clear if no song
    }

  });
});

// Fade out when clicking outside image
lightbox.addEventListener('click', e => {
  if (e.target !== lightboxImg) {
    lightbox.classList.remove('active');
    // Wait a bit before fully hiding (for fade-out)
    setTimeout(() => {
      lightboxImg.src = '';
      caption.textContent = '';
      spotifyPlayer.innerHTML = ''; // !!! new
    }, 300);
  }
});

