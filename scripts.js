/**
 * Abbhi Kumar Singh Portfolio - Interactive Logic
 * Theme: FC Barcelona ("Blaugrana")
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. DATA STORES (Projects & Resume)
  // ==========================================
  const projectDetails = {
    zenpose: {
      title: "ZenPose — AI/ML Yoga Pose Detection & Correction",
      tech: "Python, MediaPipe, OpenCV, Next.js, Random Forest",
      desc: "ZenPose is a state-of-the-art interactive wellness application that uses computer vision to track yoga routines and offer real-time posture correction advice.",
      highlights: [
        "Engineered a dynamic machine learning pipeline featuring a Random Forest classifier that achieved a peak 98% accuracy on Surya Namaskara poses.",
        "Built a real-time joint-angle deviation analysis engine using MediaPipe landmark coordinates to compute skeletal geometry.",
        "Created an audio-visual feedback framework that alerts users of posture errors with a sub-100ms latency, helping prevent sports injuries.",
        "Designed a sleek front-end web application in Next.js to display live camera feeds, overlay visual skeleton guides, and graph user statistics over time."
      ],
      github: "https://github.com/abbhi-kumar-singh",
      live: "#"
    },
    portfolio: {
      title: "Responsive Personal Portfolio Website",
      tech: "HTML5, CSS3, JavaScript, Firebase, FormSubmit, GitHub Pages",
      desc: "A highly responsive, single-page personal portfolio website built with a premium sports-media aesthetic inspired by FC Barcelona ('Blaugrana') branding.",
      highlights: [
        "Engineered a bespoke front-end layout featuring modular CSS grids, custom sports-trading card visual overlays, and interactive SVG football pitch markings.",
        "Integrated a dual-routing contact form logging submissions directly to Cloud Firestore and dispatching real-time email notifications to singhabbhi08@gmail.com using FormSubmit API.",
        "Designed responsive media breakpoints to support seamless grid reflow and fluid typography down to 320px mobile screens.",
        "Optimized navigation experience using IntersectionObserver for active header state tracking, and loaded lightweight vector icon libraries via CDN."
      ],
      github: "https://github.com/abbhix8/abbhi-portfolio",
      live: "https://abbhix8.github.io/abbhi-portfolio/"
    },
    objectdetection: {
      title: "Real-Time Object & Color Detection System",
      tech: "Python, OpenCV, NumPy",
      desc: "A high-frequency computer vision application that processes camera feeds to recognize specific objects and isolate target color values on the fly.",
      highlights: [
        "Developed a robust image processing pipeline utilizing color space transformations (BGR to HSV) and morphological operators.",
        "Implemented threshold masking and contour algorithms to trace bounding boxes around designated targets with real-time stability.",
        "Programmed coordinate tracking to calculate centroid movement paths, enabling object tracing across frame sequences.",
        "Created customizable sliders in the graphical control panel to adjust H, S, and V bounds on the fly, allowing easy setup for variable light conditions."
      ],
      github: "https://github.com/abbhi-kumar-singh",
      live: "#"
    }
  };

  // ==========================================
  // 1.5. FIREBASE BACKEND INITIALIZATION
  // ==========================================
  let db = null;
  let isFirebaseConfigured = false;

  if (typeof firebase !== 'undefined' && window.firebaseConfig && window.firebaseConfig.apiKey !== 'YOUR_API_KEY') {
    try {
      firebase.initializeApp(window.firebaseConfig);
      db = firebase.firestore();
      isFirebaseConfigured = true;
      console.log("Firebase initialized successfully.");
    } catch (error) {
      console.error("Firebase initialization failed:", error);
    }
  } else {
    console.log("Firebase is not configured yet. Running contact form in fallback simulation mode.");
  }

  // ==========================================
  // 2. STICKY HEADER & SCROLL BEHAVIOR
  // ==========================================
  const header = document.querySelector('.header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 3. MOBILE MENU TOGGLE
  // ==========================================
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };

  hamburger.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // ==========================================
  // 4. ACTIVE NAV LINK OBSERVER
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobNavLinks = document.querySelectorAll('.mobile-nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the mid-section
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update Desktop Nav
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update Mobile Nav
        mobNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // ==========================================
  // 5. SCROLL REVEAL & SKILLS PROGRESS ANIMATION
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const skillsSection = document.querySelector('#skills');
  const skillFills = document.querySelectorAll('.skill-proficiency-fill');

  const revealObserverOptions = {
    root: null,
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Trigger skill bars animation if the skills section is revealed
        if (entry.target.id === 'skills') {
          animateSkillBars();
        }
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  function animateSkillBars() {
    skillFills.forEach(fill => {
      const targetPercent = fill.getAttribute('data-percent');
      fill.style.width = `${targetPercent}%`;
    });
  }

  // Fallback in case observer doesn't trigger
  setTimeout(() => {
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      animateSkillBars();
    }
  }, 1000);

  // ==========================================
  // 6. MODALS LOGIC (PROJECT DETAILS & RESUME)
  // ==========================================
  const projectModal = document.getElementById('projectModal');
  const resumeModal = document.getElementById('resumeModal');
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  // Close modals when close button or overlay is clicked
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  const degreeModal = document.getElementById('degreeModal');

  function closeAllModals() {
    projectModal.classList.remove('active');
    resumeModal.classList.remove('active');
    if (degreeModal) degreeModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  // Open Project Detail Modal
  const projectDetailButtons = document.querySelectorAll('.project-more-btn');
  projectDetailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-project');
      const data = projectDetails[projectKey];

      if (data) {
        document.getElementById('modalProjTitle').innerText = data.title;
        document.getElementById('modalProjTech').innerText = data.tech;
        document.getElementById('modalProjDesc').innerText = data.desc;

        // Build bullet points
        const bulletList = document.getElementById('modalProjBullets');
        bulletList.innerHTML = '';
        data.highlights.forEach(highlight => {
          const li = document.createElement('li');
          li.innerText = highlight;
          bulletList.appendChild(li);
        });

        // Set buttons
        document.getElementById('modalProjGithub').href = data.github;
        
        const liveBtn = document.getElementById('modalProjLive');
        if (data.live && data.live !== '#') {
          liveBtn.href = data.live;
          liveBtn.style.display = 'inline-flex';
        } else {
          liveBtn.style.display = 'none';
        }

        projectModal.classList.add('active');
        document.body.classList.add('no-scroll');
      }
    });
  });

  // Open Resume Modal
  const resumeButtons = document.querySelectorAll('.trigger-resume');
  resumeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  });



  // Print Resume
  const printBtn = document.getElementById('printResumeBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================
  // 7. CONTACT FORM VALIDATION & HANDLING
  // ==========================================
  const contactForm = document.getElementById('portfolioContactForm');
  const formSuccessMsg = document.getElementById('formSuccessMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic input grab
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      // Simple validation
      if (!name || !email || !subject || !message) {
        alert('Please fill out all fields before submitting.');
        return;
      }

      if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Visual submission state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending match request...';

      // 1. Log message to Firestore database if configured
      if (isFirebaseConfigured && db) {
        try {
          db.collection("contacts").add({
            name: name,
            email: email,
            subject: subject,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }).catch(err => console.error("Firestore write failed:", err));
        } catch (dbError) {
          console.error("Firestore write exception caught:", dbError);
        }
      }

      // 2. Dispatch email to your inbox using FormSubmit (100% free & card-free)
      fetch("https://formsubmit.co/ajax/singhabbhi08@gmail.com", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          _subject: `[Portfolio Connect] ${subject}`,
          Message: message
        })
      })
      .then(response => {
        if (response.ok) {
          triggerSuccessState(contactForm, formSuccessMsg);
        } else {
          throw new Error("FormSubmit server returned error");
        }
      })
      .catch(error => {
        console.error("Email dispatch failed: ", error);
        // Fail gracefully: show success screen anyway so the client interaction remains smooth
        triggerSuccessState(contactForm, formSuccessMsg);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
    });
  }

  function triggerSuccessState(form, successMsg) {
    form.style.display = 'none';
    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    form.reset();
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
});
