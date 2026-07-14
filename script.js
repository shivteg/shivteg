// JavaScript Interactions for Shivteg Portfolio

// ==========================================
// SUPABASE CONFIGURATION - REPLACE WITH YOURS
// ==========================================
const SUPABASE_URL = "https://your-project-id.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key-here";

// Initialize Supabase Client
let supabaseObj = null;
const isSupabaseConfigured = SUPABASE_URL && SUPABASE_URL !== "https://your-project-id.supabase.co" && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== "your-anon-key-here";

if (isSupabaseConfigured) {
  try {
    supabaseObj = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase Client initialized successfully!");
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
  }
} else {
  console.log("Supabase is not configured. Running in LocalStorage fallback mode.");
}

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
 * Setup and manage the Authentication Modal (Supabase with LocalStorage fallback)
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
  
  const signinError = document.getElementById('signinError');
  const signupError = document.getElementById('signupError');
  
  const authStatusMessage = document.getElementById('authStatusMessage');
  const authStatusTitle = document.getElementById('authStatusTitle');
  const authStatusDesc = document.getElementById('authStatusDesc');
  const authStatusCloseBtn = document.getElementById('authStatusCloseBtn');

  let isLoggedIn = false;

  if (!authModal) return;

  // Initialize and check persistent session on load
  checkSession();

  async function checkSession() {
    if (isSupabaseConfigured && supabaseObj) {
      try {
        const { data: { session }, error } = await supabaseObj.auth.getSession();
        if (session && session.user) {
          const name = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
          logIn(name);
        } else {
          localStorage.removeItem('auth_session');
        }
      } catch (e) {
        console.error("Supabase session check error:", e);
      }
    } else {
      const session = localStorage.getItem('auth_session');
      if (session) {
        try {
          const userData = JSON.parse(session);
          logIn(userData.name);
        } catch (e) {
          localStorage.removeItem('auth_session');
        }
      }
    }
  }

  // Toggle modal open/close
  function openModal() {
    if (isLoggedIn) {
      // If logged in, clicking the button logs out the user
      logOut();
      return;
    }
    authModal.classList.remove('hidden');
    clearErrors();
    showTab('signin');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    authModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function clearErrors() {
    if (signinError) {
      signinError.textContent = '';
      signinError.classList.add('hidden');
    }
    if (signupError) {
      signupError.textContent = '';
      signupError.classList.add('hidden');
    }
  }

  function showTab(tab) {
    authStatusMessage.classList.add('hidden');
    clearErrors();
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

  function logIn(displayName) {
    isLoggedIn = true;
    authBtn.textContent = 'Sign Out';
    if (mobileAuthBtn) {
      mobileAuthBtn.textContent = 'Sign Out';
      mobileAuthBtn.style.background = 'var(--color-bg-card)';
      mobileAuthBtn.style.color = 'var(--color-primary-light)';
      mobileAuthBtn.style.borderColor = 'var(--color-primary)';
    }
    
    // Add success styling/glow to indicate active state
    authBtn.classList.remove('btn-primary');
    authBtn.classList.add('btn-outline');
  }

  async function logOut() {
    isLoggedIn = false;
    localStorage.removeItem('auth_session');
    
    if (isSupabaseConfigured && supabaseObj) {
      try {
        await supabaseObj.auth.signOut();
      } catch (e) {
        console.error("Supabase signOut error:", e);
      }
    }
    
    authBtn.textContent = 'Sign In';
    authBtn.classList.add('btn-primary');
    authBtn.classList.remove('btn-outline');
    
    if (mobileAuthBtn) {
      mobileAuthBtn.textContent = 'Sign In';
      mobileAuthBtn.style = '';
    }
    
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
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      if (menuOpenIcon) menuOpenIcon.classList.remove('hidden');
      if (menuCloseIcon) menuCloseIcon.classList.add('hidden');
      
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

  // Hide errors on input typing
  const allAuthInputs = authModal.querySelectorAll('.form-input');
  allAuthInputs.forEach(input => {
    input.addEventListener('input', clearErrors);
  });

  // Sign In submit
  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    
    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;
    const submitBtn = signInForm.querySelector('.auth-submit-btn');
    
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;

    if (isSupabaseConfigured && supabaseObj) {
      // Live Supabase Authentication
      try {
        const { data, error } = await supabaseObj.auth.signInWithPassword({
          email: email,
          password: password
        });

        submitBtn.textContent = 'Sign In';
        submitBtn.disabled = false;

        if (error) {
          signinError.textContent = error.message;
          signinError.classList.remove('hidden');
          return;
        }

        const userName = data.user.user_metadata?.full_name || email.split('@')[0];
        localStorage.setItem('auth_session', JSON.stringify({ name: userName, email: data.user.email }));
        signInForm.reset();
        
        signInForm.classList.add('hidden');
        authStatusMessage.classList.remove('hidden');
        authStatusTitle.textContent = 'Welcome Back!';
        authStatusDesc.textContent = `Successfully logged in as ${userName}. You now have workspace access.`;
        
        logIn(userName);
      } catch (err) {
        submitBtn.textContent = 'Sign In';
        submitBtn.disabled = false;
        signinError.textContent = 'An unexpected error occurred. Please try again.';
        signinError.classList.remove('hidden');
      }
    } else {
      // LocalStorage Fallback
      setTimeout(() => {
        submitBtn.textContent = 'Sign In';
        submitBtn.disabled = false;

        const users = JSON.parse(localStorage.getItem('auth_users') || '[]');
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          signinError.textContent = 'User not found. Please Sign Up first (or configure Supabase credentials).';
          signinError.classList.remove('hidden');
          return;
        }

        if (user.password !== password) {
          signinError.textContent = 'Incorrect password. Please try again.';
          signinError.classList.remove('hidden');
          return;
        }

        localStorage.setItem('auth_session', JSON.stringify({ name: user.name, email: user.email }));
        signInForm.reset();
        
        signInForm.classList.add('hidden');
        authStatusMessage.classList.remove('hidden');
        authStatusTitle.textContent = 'Welcome Back!';
        authStatusDesc.textContent = `Successfully logged in as ${user.name}. You now have workspace access.`;
        
        logIn(user.name);
      }, 800);
    }
  });

  // Sign Up submit
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const submitBtn = signUpForm.querySelector('.auth-submit-btn');
    
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    if (isSupabaseConfigured && supabaseObj) {
      // Live Supabase Sign Up
      try {
        const { data, error } = await supabaseObj.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: name
            }
          }
        });

        submitBtn.textContent = 'Create Account';
        submitBtn.disabled = false;

        if (error) {
          signupError.textContent = error.message;
          signupError.classList.remove('hidden');
          return;
        }

        signUpForm.reset();
        signUpForm.classList.add('hidden');
        authStatusMessage.classList.remove('hidden');
        authStatusTitle.textContent = 'Account Created!';
        
        if (data.session) {
          authStatusDesc.textContent = `Welcome ${name}! Your account has been registered and you are logged in.`;
          logIn(name);
          localStorage.setItem('auth_session', JSON.stringify({ name, email }));
        } else {
          authStatusDesc.textContent = `Welcome ${name}! Please check your email inbox to confirm your registration.`;
        }
      } catch (err) {
        submitBtn.textContent = 'Create Account';
        submitBtn.disabled = false;
        signupError.textContent = 'An unexpected error occurred. Please try again.';
        signupError.classList.remove('hidden');
      }
    } else {
      // LocalStorage Fallback
      setTimeout(() => {
        submitBtn.textContent = 'Create Account';
        submitBtn.disabled = false;

        const users = JSON.parse(localStorage.getItem('auth_users') || '[]');
        
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          signupError.textContent = 'This email is already registered. Please Sign In.';
          signupError.classList.remove('hidden');
          return;
        }

        users.push({ name, email, password });
        localStorage.setItem('auth_users', JSON.stringify(users));

        localStorage.setItem('auth_session', JSON.stringify({ name, email }));
        signUpForm.reset();
        
        signUpForm.classList.add('hidden');
        authStatusMessage.classList.remove('hidden');
        authStatusTitle.textContent = 'Account Created!';
        authStatusDesc.textContent = `Welcome ${name}! Your account has been registered.`;
        
        logIn(name);
      }, 1000);
    }
  });

  authStatusCloseBtn.addEventListener('click', closeModal);
}
