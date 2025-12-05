(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

// Simple thumbnail click switching

document.addEventListener("DOMContentLoaded", () => {

  const mainImg = document.getElementById("mainPreview");
  const mainVideo = document.getElementById("mainVideo");

  // If video tag does not exist, do nothing
  if (!mainImg) return;

  // Image thumbnails
  document.querySelectorAll("#imageThumbnails .thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
      const url = thumb.dataset.url;

      // Show image
      mainImg.style.display = "block";
      mainImg.src = url;

      // Hide video
      if (mainVideo) {
        mainVideo.pause();
        mainVideo.style.display = "none";
      }
    });
  });

  // Video thumbnails
  document.querySelectorAll("#videoThumbnails .video-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
      const url = thumb.dataset.url;

      // Hide image
      mainImg.style.display = "none";

      // Show video
      if (mainVideo) {
        mainVideo.style.display = "block";
        mainVideo.src = url;
        mainVideo.load();
        mainVideo.play().catch(() => {});
      }
    });
  });

});

