/**
 * ==========================================================================
 * PORTFÓLIO PESSOAL — MELISSA
 * Scripts Principais & Interatividade
 * Desenvolvido com Antigravity
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Elementos Principais do DOM
  // ------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const btnResetForm = document.getElementById('btn-reset-form');

  // Elementos do Personalizador de Foto
  const btnOpenPhotoModal = document.getElementById('btn-open-photo-modal');
  const photoModalBackdrop = document.getElementById('photo-modal');
  const btnClosePhotoModal = document.getElementById('btn-close-photo-modal');
  const photoFileInput = document.getElementById('photo-file-input');
  const personalPhotoImg = document.getElementById('personal-photo-img');
  const btnRestoreDefaultPhoto = document.getElementById('btn-restore-default-photo');

  // ------------------------------------------------------------------------
  // 2. Cabeçalho Fixo com Efeito ao Rolar (Sticky Glass Header)
  // ------------------------------------------------------------------------
  const handleHeaderScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ------------------------------------------------------------------------
  // 3. Menu Mobile (Hambúrguer) Acessível
  // ------------------------------------------------------------------------
  const toggleMobileMenu = (forceState) => {
    const isCurrentlyOpen = navMobile.classList.contains('is-open');
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;

    if (shouldOpen) {
      navMobile.classList.add('is-open');
      menuToggle.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Impede rolagem do fundo
    } else {
      navMobile.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (menuToggle && navMobile) {
    menuToggle.addEventListener('click', () => toggleMobileMenu());

    // Fechar ao pressionar a tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMobile.classList.contains('is-open')) {
        toggleMobileMenu(false);
      }
    });
  }

  // Fechar o menu mobile ao clicar em qualquer link de navegação
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        toggleMobileMenu(false);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 4. Scrollspy Inteligente (Destaque da Seção Ativa na Barra de Navegação)
  // ------------------------------------------------------------------------
  const highlightActiveSection = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightActiveSection, { passive: true });
  highlightActiveSection();

  // ------------------------------------------------------------------------
  // 5. Revelação Suave de Elementos ao Rolar (Scroll Reveal com IntersectionObserver)
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback gracioso para navegadores antigos
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // ------------------------------------------------------------------------
  // 6. Formulário de Contato com Validação & Modo Demonstrativo
  // ------------------------------------------------------------------------
  if (contactForm) {
    const inputNome = document.getElementById('nome');
    const inputEmail = document.getElementById('email');
    const inputMensagem = document.getElementById('mensagem');

    // Validador de Formato de E-mail
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Validador individual de campo
    const validateField = (input, isValid) => {
      if (!isValid) {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        return false;
      } else {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        return true;
      }
    };

    // Remove estado de erro ao digitar
    [inputNome, inputEmail, inputMensagem].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
          input.removeAttribute('aria-invalid');
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNomeValid = validateField(inputNome, inputNome.value.trim().length >= 2);
      const isEmailValid = validateField(inputEmail, isValidEmail(inputEmail.value.trim()));
      const isMensagemValid = validateField(inputMensagem, inputMensagem.value.trim().length >= 6);

      if (isNomeValid && isEmailValid && isMensagemValid) {
        // Exibe mensagem de confirmação do modo demonstrativo
        if (formFeedback) {
          formFeedback.classList.add('is-active');
          formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Desabilita campos temporariamente para simular processamento
        contactForm.querySelectorAll('input, textarea, button[type="submit"]').forEach((el) => {
          el.disabled = true;
        });
      }
    });

    // Botão para redefinir o formulário e testar novamente
    if (btnResetForm) {
      btnResetForm.addEventListener('click', () => {
        contactForm.reset();
        contactForm.querySelectorAll('input, textarea, button[type="submit"]').forEach((el) => {
          el.disabled = false;
        });
        if (formFeedback) {
          formFeedback.classList.remove('is-active');
        }
        inputNome.focus();
      });
    }
  }

  // ------------------------------------------------------------------------
  // 7. Personalização de Foto Pessoal (Visualização em Tempo Real para Melissa)
  // ------------------------------------------------------------------------
  const defaultPlaceholderSrc = 'assets/images/avatar-placeholder.svg';

  // Verifica se o usuário já havia carregado uma foto no navegador
  const savedPhoto = localStorage.getItem('melissa_portfolio_custom_photo');
  if (savedPhoto && personalPhotoImg) {
    personalPhotoImg.src = savedPhoto;
  }

  const openPhotoModal = () => {
    if (photoModalBackdrop) {
      photoModalBackdrop.classList.add('is-open');
    }
  };

  const closePhotoModal = () => {
    if (photoModalBackdrop) {
      photoModalBackdrop.classList.remove('is-open');
    }
  };

  if (btnOpenPhotoModal) {
    btnOpenPhotoModal.addEventListener('click', openPhotoModal);
  }

  if (btnClosePhotoModal) {
    btnClosePhotoModal.addEventListener('click', closePhotoModal);
  }

  if (photoModalBackdrop) {
    photoModalBackdrop.addEventListener('click', (e) => {
      if (e.target === photoModalBackdrop) {
        closePhotoModal();
      }
    });
  }

  // Leitura do arquivo de imagem selecionado pelo usuário
  if (photoFileInput && personalPhotoImg) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target.result;
          personalPhotoImg.src = result;
          try {
            localStorage.setItem('melissa_portfolio_custom_photo', result);
          } catch (err) {
            // Se exceder a quota do localStorage, mantém apenas na sessão em memória
            console.info('Foto aplicada para a sessão atual.');
          }
          closePhotoModal();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Restaurar o placeholder delicado padrão
  if (btnRestoreDefaultPhoto && personalPhotoImg) {
    btnRestoreDefaultPhoto.addEventListener('click', () => {
      personalPhotoImg.src = defaultPlaceholderSrc;
      localStorage.removeItem('melissa_portfolio_custom_photo');
      if (photoFileInput) {
        photoFileInput.value = '';
      }
      closePhotoModal();
    });
  }

  // Log informativo para Melissa e avaliação escolar
  console.log(
    '%c✦ Portfólio Melissa ✦\n%cDesenvolvido com identidade visual delicada e código semântico.',
    'color: #C84B71; font-size: 14px; font-weight: bold;',
    'color: #6E6165; font-size: 11px;'
  );
});
