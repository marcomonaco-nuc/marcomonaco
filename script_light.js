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
  // create a shuffled order of wrappers
  const shuffledWrappers = Array.from(wrappers).sort(() => Math.random() - 0.5);

  shuffledWrappers.forEach((wrapper, i) => {
    wrapper.style.opacity = 0;
    wrapper.style.transform = 'translateY(20px)';
    setTimeout(() => {
      wrapper.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      wrapper.style.opacity = 1;
      wrapper.style.transform = 'translateY(0)';
    }, i * 25); // constant delay (100ms per image)
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
        <div class="spotify-placeholder" aria-hidden="true">Loading track...</div>
        <div class="spotify-iframe-wrapper" aria-hidden="true"></div>
      `;

      const placeholder = spotifyPlayer.querySelector('.spotify-placeholder');
      const wrapper = spotifyPlayer.querySelector('.spotify-iframe-wrapper');

      const iframe = document.createElement('iframe');
      iframe.src = img.dataset.spotify;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute(
        'allow',
        'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
      );
      iframe.loading = 'lazy';
      iframe.style.width = '100%';
      iframe.style.maxWidth = '400px';
      iframe.style.height = '100px';
      iframe.style.borderRadius = '12px';
      iframe.style.display = 'block';

      let loadedOnce = false;

      iframe.addEventListener('load', () => {
        // prevent flickering loop
        if (loadedOnce) return;
        loadedOnce = true;

        // append iframe inside wrapper if not already
        if (!wrapper.contains(iframe)) wrapper.appendChild(iframe);

        requestAnimationFrame(() => {
          wrapper.style.opacity = '1';
          placeholder.style.opacity = '0';
        });

        placeholder.addEventListener(
          'transitionend',
          () => {
            if (placeholder.parentNode) placeholder.remove();
            wrapper.removeAttribute('aria-hidden');
          },
          { once: true }
        );
      });

      // append iframe now so it starts loading
      wrapper.appendChild(iframe);

      // fallback: after 8s, if never loaded, show clickable message
      setTimeout(() => {
        if (!loadedOnce) {
          placeholder.textContent = 'Player blocked or slow — open in Spotify';
          placeholder.style.cursor = 'pointer';
          const nonEmbed = img.dataset.spotify.replace('/embed', '');
          placeholder.addEventListener(
            'click',
            () => window.open(nonEmbed, '_blank'),
            { once: true }
          );
        }
      }, 8000);
    } else {
      spotifyPlayer.innerHTML = '';
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

