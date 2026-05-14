/**
 * La Gaia Custode - Form Validation & Interactivity
 * Gestisce la validazione del form di contatti e le interazioni utente
 */

document.addEventListener('DOMContentLoaded', function() {
  initFormValidation();
  initSmoothScroll();
  initMobileNavigation();
});

/**
 * Inizializza la validazione del form
 */
function initFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Validazione in tempo reale per ogni campo
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('change', validateField);
  });

  // Submit form
  form.addEventListener('submit', handleFormSubmit);
}

/**
 * Valida un singolo campo
 */
function validateField(e) {
  const field = e.target;
  const errorElement = document.getElementById(field.id + '-error');
  
  if (!errorElement) return;

  let isValid = true;
  let errorMessage = '';

  // Validazioni comuni
  if (field.hasAttribute('required') && !field.value.trim()) {
    isValid = false;
    errorMessage = 'Questo campo è obbligatorio';
  }

  // Validazioni specifiche
  if (field.type === 'email' && field.value.trim()) {
    if (!isValidEmail(field.value)) {
      isValid = false;
      errorMessage = 'Inserisci un indirizzo email valido';
    }
  }

  if (field.type === 'tel' && field.value.trim()) {
    if (!isValidPhone(field.value)) {
      isValid = false;
      errorMessage = 'Inserisci un numero di telefono valido';
    }
  }

  if (field.id === 'privacy' && field.type === 'checkbox') {
    if (!field.checked) {
      isValid = false;
      errorMessage = 'Devi accettare la politica sulla privacy';
    }
  }

  // Aggiorna UI
  if (isValid) {
    field.classList.remove('form-input--error');
    errorElement.textContent = '';
    errorElement.setAttribute('aria-invalid', 'false');
  } else {
    field.classList.add('form-input--error');
    errorElement.textContent = errorMessage;
    errorElement.setAttribute('aria-invalid', 'true');
  }

  return isValid;
}

/**
 * Valida l'intero form prima del submit
 */
function validateForm() {
  const form = document.getElementById('contact-form');
  const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
  const privacyCheckbox = document.getElementById('privacy');
  
  let isFormValid = true;

  fields.forEach(field => {
    if (!validateField({ target: field })) {
      isFormValid = false;
    }
  });

  // Valida checkbox privacy
  if (privacyCheckbox && !privacyCheckbox.checked) {
    validateField({ target: privacyCheckbox });
    isFormValid = false;
  }

  return isFormValid;
}

/**
 * Gestisce il submit del form
 */
function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    showFormMessage('Per favore, completa tutti i campi obbligatori', 'error');
    return;
  }

  // Disabilita il bottone durante l'invio
  const submitButton = document.querySelector('.contact-form button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Invio in corso...';

  // Invia il form con Fetch API
  const formData = new FormData(this);

  fetch(this.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      // Successo
      showFormMessage('Messaggio inviato con successo! Ti contatterò presto.', 'success');
      this.reset();
      
      // Rimuovi gli errori visualizzati
      document.querySelectorAll('.form-input--error').forEach(field => {
        field.classList.remove('form-input--error');
      });
      document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
      });

      // Scroll to success message
      setTimeout(() => {
        document.getElementById('form-message').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      throw new Error('Errore nell\'invio del form');
    }
  })
  .catch(error => {
    console.error('Errore:', error);
    showFormMessage('Si è verificato un errore. Per favore, riprova più tardi.', 'error');
  })
  .finally(() => {
    // Riabilita il bottone
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  });
}

/**
 * Mostra un messaggio nel form
 */
function showFormMessage(message, type) {
  const messageElement = document.getElementById('form-message');
  messageElement.textContent = message;
  messageElement.className = `form-message form-message--${type}`;
  messageElement.setAttribute('role', 'alert');
  
  // Rimuovi il messaggio dopo 5 secondi (solo per errori/successi temporanei)
  if (type === 'success') {
    setTimeout(() => {
      messageElement.textContent = '';
      messageElement.className = 'form-message';
    }, 5000);
  }
}

/**
 * Valida formato email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida formato telefono italiano
 */
function isValidPhone(phone) {
  // Accetta formati: +39123456789, 0123456789, +39 123 456789, etc.
  const phoneRegex = /^(\+39|0)[0-9\s]{8,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Scroll fluido per i link di navigazione
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip per il link "Salta al contenuto principale"
      if (href === '#main') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Menu mobile (per future implementazioni responsive)
 */
function initMobileNavigation() {
  // Placeholder per gestione menu mobile
  // Implementa qui la logica per toggle menu su dispositivi mobile
  const nav = document.querySelector('.nav');
  if (nav) {
    // Esempio: chiudi menu al click su link
    const navLinks = nav.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Logica per chiudere menu mobile se aperto
      });
    });
  }
}

/**
 * Utility: Log per debugging (rimuovi in produzione)
 */
function debugLog(message) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[La Gaia Custode]', message);
  }
}

/**
 * Inertia scroll per dispositivi più fluidi
 */
if ('scrollBehavior' in document.documentElement.style === false) {
  // Fallback per browser che non supportano smooth scroll
  const smoothScroll = function() {
    document.documentElement.style.scrollBehavior = 'auto';
  };
  smoothScroll();
}
