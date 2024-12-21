function loco() {
  gsap.registerPlugin(ScrollTrigger);

  // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update);

  // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();
}
loco();

gsap.to("#page>video", {
  scrollTrigger: {
    trigger: `#page>video`,
    start: `2% top`,
    end: `bottom top`,
    scroller: `#main`,
  },
  onStart: () => {
    document.querySelector("#page>video").play();
  },
});

gsap.to("#page", {
  scrollTrigger: {
    trigger: `#page`,
    start: `top top`,
    end: `bottom top`,
    scroller: `#main`,
    pin: true,
  },
});

gsap.to("#page-bottom", {
  scrollTrigger: {
    trigger: `#page-bottom`,
    start: `10% top`,
    end: `bottom top`,
    scroller: `#main`,
    scrub: 0.5,
  },
  opacity: 0,
});
var tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#page1",
    start: "top top", // Trigger at the start of the page
    end: "bottom top", // Trigger when the page scrolls out of view
    scrub: 1,
    scroller: "#main", // Optional, if you have a scroll container
    pin: true, // Pin the section while scrolling
    onEnter: () => {
      gsap.to("#overlay", { opacity: 1 }); // Show overlay when entering the section
    },
    onLeave: () => {
      gsap.to("#overlay", { opacity: 0 }); // Hide overlay when leaving the section
    },
    onEnterBack: () => {
      gsap.to("#overlay", { opacity: 1 }); // Show overlay again when re-entering
    },
    onLeaveBack: () => {
      gsap.to("#overlay", { opacity: 0 }); // Hide overlay when leaving the section back
    },
  },
});

tl.to("#page1 > h1", {
  top: "-50%", // Move the h1 text up
});

// Video element
const visionVideo = document.getElementById("vision-video");
const videoDuration = 4; // 4 seconds video duration

// Set initial video time to 4 seconds (end of video)
visionVideo.currentTime = videoDuration;

// Create ScrollTrigger for controlling video playback
ScrollTrigger.create({
  trigger: "#page2",
  start: "top top", // When the top of the section reaches the top of the viewport
  end: "bottom top", // When the bottom of the section reaches the top of the viewport
  scroller: "#main",
  onEnter: () => {
    // Play video forward when entering the section
    visionVideo.play();
  },
  onLeave: () => {
    // Pause video when leaving the section
    visionVideo.pause();
  },
  onUpdate: (self) => {
    const currentTime = videoDuration * self.progress;

    if (self.direction === 1) {
      // Scroll down (play forward from 4s to 0s)
      visionVideo.currentTime = videoDuration - currentTime;
    } else if (self.direction === -1) {
      // Scroll up (play in reverse from current point)
      visionVideo.currentTime = videoDuration - currentTime;
    }
  },
});
// ====================================================================================================================
// ====================================================================================================================
// Function to shrink the video
function shrinkVideo() {
  gsap.to("#page4 > video", {
    scale: 0.94,
    duration: 0.5, // Duration of the shrink animation
    ease: "power2.out", // Easing for a smooth effect
    onComplete: () => {
      console.log("Video has shrunk."); // Optional: log when the video has shrunk
    }
  });
}

// Function to expand the video back to its original size
function expandVideo() {
  gsap.to("#page4 > video", {
    scale: 1, // Scale back to original size
    duration: 0.5, // Duration of the expand animation
    ease: "power2.out", // Easing for a smooth effect
    onComplete: () => {
      console.log("Video has expanded back to original size."); // Optional: log when the video has expanded
    }
  });
}

// Updated ScrollTrigger configuration
var tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: `#page4`,
    start: `top top`,
    scrub: 1,
    scroller: `#main`,
    pin: true,
    onEnter: () => {
      gsap.to("#overlay", { opacity: 1 }); // Show overlay when entering the section
    },
    onLeave: () => {
      gsap.to("#overlay", { opacity: 0, onComplete: shrinkVideo }); // Hide overlay and then shrink video
    },
    onEnterBack: () => {
      gsap.to("#overlay", { opacity: 1 }); // Show overlay again when re-entering
      expandVideo(); // Expand video back to original size
    },
  },
});

tl2.to("#page4>#center-page4", {
  top: `-50%`,
});
// ===============================================================================
// ===============================================================================

// navbar
const navIcon = document.querySelector(".nav-icon");
const nav = document.querySelector("nav");
const header = document.getElementById("header");

navIcon.onclick = function () {
  nav.classList.toggle("show");
  header.style.zIndex = "-1";
};
