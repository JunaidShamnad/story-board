  // Define elements and create Lenis instance
  const mobileVideo = document.querySelector('.playing-video-tag.mobile');
  const desktopVideo = document.querySelector('.playing-video-tag.desktop');
  
  // Initial selection based on screen width
  const isMobile = window.innerWidth < 768; // Customize this threshold as needed
  if (isMobile) {
    mobileVideo.style.display = 'block';
    desktopVideo.style.display = 'none';
  } else {
    mobileVideo.style.display = 'none';
    desktopVideo.style.display = 'block';
  }
  
  // Event handler for window resize
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth < 768;
    if (isMobile !== newIsMobile) {
      isMobile = newIsMobile;
  
      if (isMobile) {
        mobileVideo.style.display = 'block';
        desktopVideo.style.display = 'none';
        // Pause and seek desktop video if it was playing
        desktopVideo.pause();
        desktopVideo.currentTime = 0;
      } else {
        mobileVideo.style.display = 'none';
        desktopVideo.style.display = 'block';
        // Pause and seek mobile video if it was playing
        mobileVideo.pause();
        mobileVideo.currentTime = 0;
      }
    }
  });
  
  // Rest of your existing scroll animation logic using a single 'vid' variable to reference the currently active video:
  
  const vid = isMobile ? mobileVideo : desktopVideo; // Dynamically assign the active video
  
  // ... rest of your animation code referencing 'vid' ...
  
  // Optional error handling:
  mobileVideo.addEventListener('error', () => {
    console.error('Error playing mobile video:', mobileVideo.error);
  });
  desktopVideo.addEventListener('error', () => {
    console.error('Error playing desktop video:', desktopVideo.error);
  });
  
 


  const section = document.querySelector('.page-holder');

  const contentHolders = document.querySelectorAll('.content-holder');

  const lenis = new Lenis({
    smooth: true, // Enable smooth scrolling with Lenis
    rafRaf: true, // Use requestAnimationFrame for smoother animation
    rafMinThreshold: 2 // Adjust threshold for reduced CPU usage
  });

  // Calculate duration per content section
  const totalVideoDuration = 96; // Replace with actual video duration


  // Function to update video playback and active content section
  const updateVideoPlaybackAndContent = () => {
    // Use lenis.scroll for smooth scroll position
    const distance = lenis.scroll - section.offsetTop;
    const total = section.clientHeight - window.innerHeight;
    let percentage = distance / total;
    percentage = Math.max(0, percentage);
    percentage = Math.min(percentage, 1);

    // Update video playback based on scroll progress
    const currentTime = totalVideoDuration * percentage;
    vid.currentTime = currentTime;

    // Update active content section
    contentHolders.forEach((contentHolder, index) => {
      const sectionStart = index * total / contentHolders.length;
      const sectionEnd = (index + 1) * total / contentHolders.length;
      contentHolder.classList.toggle('active', currentTime >= sectionStart && currentTime < sectionEnd);
    });
  };

  // ScrollTrigger with optimizations
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: updateVideoPlaybackAndContent,
    // Adjust steps for smoother animation
    snap: {
      snapTo: 'labels', // Use labels for smoother snapping
      duration: 0.02, // Shorten snap duration for responsiveness
      delay: 0.0, // Remove delay for immediate interaction
      ease: "power3.inOut", // Consider lighter easing for performance
    },
    markers: false, // Remove markers unless needed for debugging
    toggleActions: "play pause resume pause", // Precise video playback control
  });

  // GSAP animations with performance optimizations
  contentHolders.forEach((contentHolder, index) => {
    // Use more performant ScrollTrigger options
    gsap.fromTo(contentHolder, {
      scale: 0.4,
      y: 20, // Adjust vertical offset as needed
      opacity: 0,
    }, {
      scale: 1,
      y: 0,
      opacity: 1,
      duration: 0.5, // Reduce animation duration
      ease: "back.out(1.7)", // Use linear easing for less CPU usage
      scrollTrigger: {
        trigger: contentHolder,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true, // Update animation on scroll changes
      }
    });

    gsap.to(contentHolder, {
      scale: 0.4, // Adjust scale factor for desired exit appearance
      y: -20, // Adjust vertical offset as needed
      opacity: 0,
      duration: 0.8, // Reduce animation duration
      ease: "back.out(1.7)", // Use linear easing for less CPU usage
      scrollTrigger: {
        trigger: contentHolder,
        start: 'bottom bottom-=50%',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true, // Update animation on scroll changes
      }
    });
  });


   // Typewriter effect for content-text within content-holder divs
  //  contentHolders.forEach((contentHolder) => {
  //   const contentText = contentHolder.querySelector('.content-text');
  //   if (contentText) { // Ensure content-text element exists
  //     const text = contentText.textContent.trim();
  //     contentText.innerHTML = ''; // Clear existing content

  //     // Create typewriter effect using character-by-character reveal
  //     let i = 0;
  //     const typingSpeed = 40; // Adjust typing speed as needed
  //     const interval = setInterval(() => {
  //       if (i < text.length) {
  //         contentText.textContent += text[i];
  //         i++;
  //       } else {
  //         clearInterval(interval);
  //       }
  //     }, typingSpeed);
  //   }
  // });


  // Pause video initially
  vid.pause();

  // Event listener for play/pause based on section visibility
  section.addEventListener('scroll', () => {
    if (ScrollTrigger.getById(section.id).isActive()) {
      vid.play();
    } else {
      vid.pause();
    }
  });

  // Handle Lenis smooth scrolling and ScrollTrigger updates
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Additional optimizations:
  // - Use lazy loading for images/content not immediately visible.
  // - Minify and compress the code for smaller file size.
  // - Profile performance in your browser's developer tools and fine-tune further.

});
