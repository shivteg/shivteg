// JavaScript Interactions for Shivteg Portfolio

document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupContactForm();
  setupScrollEffects();
  setupCodeTerminalAnimation();
  setupAuthModal();
});

/**
 * Mobile navigation menu toggling
 */
function setupMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const menuOpenIcon = document.querySelector('.menu-open-icon');
  const menuCloseIcon = document.querySelector('.menu-close-icon');

  function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    menuOpenIcon.classList.toggle('hidden');
    menuCloseIcon.classList.toggle('hidden');
    
    // Prevent body scrolling when menu is open
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    menuOpenIcon.classList.remove('hidden');
    menuCloseIcon.classList.add('hidden');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * Handle Contact Form submission
 */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const statusDiv = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    statusDiv.textContent = 'Sending message...';
    statusDiv.className = 'form-status';

    // Simulate standard frontend form submission delay
    setTimeout(() => {
      // Direct success prompt
      statusDiv.textContent = `Thank you, ${name}! Your message has been sent. I will get back to you at ${email} shortly.`;
      statusDiv.className = 'form-status success';
      
      // Reset the form fields
      form.reset();

      // Clear success status after 6 seconds
      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'form-status';
      }, 6000);
    }, 1200);
  });
}

/**
 * Highlight nav links on scroll & handle header background opacity
 */
function setupScrollEffects() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change navbar appearance on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = 'var(--shadow-md)';
      navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.background = 'rgba(10, 10, 10, 0.8)';
    }

    // Active Section Link Highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        // Find CSS rules in main.css that style .nav-link.active or similar
        // Let's add color class
        link.style.color = 'var(--color-primary-light)';
      } else {
        link.style.color = '';
      }
    });
  });
}

/**
 * Code Terminal Hover Interaction (3D rotation tilt)
 */
function setupCodeTerminalAnimation() {
  const terminal = document.querySelector('.code-terminal');
  if (!terminal) return;

  terminal.addEventListener('mousemove', (e) => {
    const rect = terminal.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate within the element
    const y = e.clientY - rect.top;  // y coordinate within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angle (max 5 degrees)
    const rotateX = ((centerY - y) / centerY) * 4;
    const rotateY = ((x - centerX) / centerX) * 4;

    terminal.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  terminal.addEventListener('mouseleave', () => {
    terminal.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    terminal.style.transition = 'transform 0.5s ease';
  });

  terminal.addEventListener('mouseenter', () => {
    terminal.style.transition = 'none';
  });
}

/**
 * Setup and manage the optional Authentication Modal
 */
function setupAuthModal() {
  const authBtn = document.getElementById('authBtn');
  const mobileAuthBtn = document.getElementById('mobileAuthBtn');
  const authModal = document.getElementById('authModal');
  const closeAuthBtn = document.getElementById('closeAuthBtn');
  
  const tabSignInBtn = document.getElementById('tabSignInBtn');
  const tabSignUpBtn = document.getElementById('tabSignUpBtn');
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  
  const authStatusMessage = document.getElementById('authStatusMessage');
  const authStatusTitle = document.getElementById('authStatusTitle');
  const authStatusDesc = document.getElementById('authStatusDesc');
  const authStatusCloseBtn = document.getElementById('authStatusCloseBtn');

  let isLoggedIn = false;

  if (!authModal) return;

  // Toggle modal open/close
  function openModal() {
    if (isLoggedIn) {
      // If logged in, clicking the button logs out the user
      logOut();
      return;
    }
    authModal.classList.remove('hidden');
    // Reset form display
    showTab('signin');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    authModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function showTab(tab) {
    authStatusMessage.classList.add('hidden');
    if (tab === 'signin') {
      tabSignInBtn.classList.add('active');
      tabSignUpBtn.classList.remove('active');
      signInForm.classList.remove('hidden');
      signUpForm.classList.add('hidden');
    } else {
      tabSignUpBtn.classList.add('active');
      tabSignInBtn.classList.remove('active');
      signUpForm.classList.remove('hidden');
      signInForm.classList.add('hidden');
    }
  }

  function logIn(username) {
    isLoggedIn = true;
    authBtn.textContent = 'Sign Out';
    mobileAuthBtn.textContent = 'Sign Out';
    
    // Add success styling/glow to indicate active state
    authBtn.classList.remove('btn-primary');
    authBtn.classList.add('btn-outline');
    mobileAuthBtn.style.background = 'var(--color-bg-card)';
    mobileAuthBtn.style.color = 'var(--color-primary-light)';
    mobileAuthBtn.style.borderColor = 'var(--color-primary)';
  }

  function logOut() {
    isLoggedIn = false;
    authBtn.textContent = 'Sign In';
    mobileAuthBtn.textContent = 'Sign In';
    
    authBtn.classList.add('btn-primary');
    authBtn.classList.remove('btn-outline');
    mobileAuthBtn.style = '';
    
    alert('Logged out successfully.');
  }

  // Event Listeners
  authBtn.addEventListener('click', openModal);
  if (mobileAuthBtn) {
    mobileAuthBtn.addEventListener('click', () => {
      // Close sidebar menu first
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      const menuOpenIcon = document.querySelector('.menu-open-icon');
      const menuCloseIcon = document.querySelector('.menu-close-icon');
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      menuOpenIcon.classList.remove('hidden');
      menuCloseIcon.classList.add('hidden');
      
      openModal();
    });
  }

  closeAuthBtn.addEventListener('click', closeModal);
  
  // Close modal when clicking outside card
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      closeModal();
    }
  });

  // Tab switching
  tabSignInBtn.addEventListener('click', () => showTab('signin'));
  tabSignUpBtn.addEventListener('click', () => showTab('signup'));

  // Sign In submit
  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signinEmail').value;
    const submitBtn = signInForm.querySelector('.auth-submit-btn');
    
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Mock Success
      submitBtn.textContent = 'Sign In';
      submitBtn.disabled = false;
      signInForm.reset();
      
      signInForm.classList.add('hidden');
      authStatusMessage.classList.remove('hidden');
      authStatusTitle.textContent = 'Welcome Back!';
      authStatusDesc.textContent = `Successfully logged in as ${email}. You now have workspace access.`;
      
      logIn(email.split('@')[0]);
    }, 1000);
  });

  // Sign Up submit
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const submitBtn = signUpForm.querySelector('.auth-submit-btn');
    
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Mock Success
      submitBtn.textContent = 'Create Account';
      submitBtn.disabled = false;
      signUpForm.reset();
      
      signUpForm.classList.add('hidden');
      authStatusMessage.classList.remove('hidden');
      authStatusTitle.textContent = 'Account Created!';
      authStatusDesc.textContent = `Welcome ${name}! Your account has been registered with ${email}.`;
      
      logIn(name);
    }, 1200);
  });

  authStatusCloseBtn.addEventListener('click', closeModal);
}
