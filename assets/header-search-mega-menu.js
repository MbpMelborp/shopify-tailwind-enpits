class HeaderSearchMegaMenu extends HTMLElement {
  constructor() {
    super();

    // Use more specific selectors to avoid conflicts with other search forms
    this.desktopInput = this.querySelector('[id*="mega-menu"][id*="desktop"]');
    this.mobileInput = this.querySelector('[id*="mega-menu"][id*="mobile"]');
    this.desktopResetButton = this.querySelector(
      '.inline-search-wrapper button[type="reset"]',
    );
    this.mobileResetButton = this.querySelector(
      '.search-modal button[type="reset"]',
    );
    this.desktopForm = this.querySelector('.inline-search-form');
    this.mobileForm = this.querySelector('.search-modal__form');

    // Only initialize if elements exist and are within this component
    this.initializeDesktopSearch();
    this.initializeMobileSearch();
  }

  initializeDesktopSearch() {
    if (
      this.desktopInput &&
      this.contains(this.desktopInput) &&
      this.desktopInput.id.includes('mega-menu')
    ) {
      // Prevent conflicts with other search forms
      this.desktopInput.addEventListener(
        'input',
        debounce((event) => {
          this.onDesktopChange(event);
        }, 300).bind(this),
      );
    }
  }

  initializeMobileSearch() {
    if (
      this.mobileInput &&
      this.contains(this.mobileInput) &&
      this.mobileInput.id.includes('mega-menu')
    ) {
      // Prevent conflicts with other search forms
      this.mobileInput.form.addEventListener(
        'reset',
        this.onMobileFormReset.bind(this),
      );
      this.mobileInput.addEventListener(
        'input',
        debounce((event) => {
          this.onMobileChange(event);
        }, 300).bind(this),
      );
    }
  }

  toggleDesktopResetButton() {
    if (!this.desktopResetButton) return;

    const resetIsHidden = this.desktopResetButton.classList.contains('hidden');
    if (this.desktopInput.value.length > 0 && resetIsHidden) {
      this.desktopResetButton.classList.remove('hidden');
    } else if (this.desktopInput.value.length === 0 && !resetIsHidden) {
      this.desktopResetButton.classList.add('hidden');
    }
  }

  toggleMobileResetButton() {
    if (!this.mobileResetButton) return;

    const resetIsHidden = this.mobileResetButton.classList.contains('hidden');
    if (this.mobileInput.value.length > 0 && resetIsHidden) {
      this.mobileResetButton.classList.remove('hidden');
    } else if (this.mobileInput.value.length === 0 && !resetIsHidden) {
      this.mobileResetButton.classList.add('hidden');
    }
  }

  onDesktopChange() {
    this.toggleDesktopResetButton();
  }

  onMobileChange() {
    this.toggleMobileResetButton();
  }

  shouldResetForm() {
    // Check for predictive search selections within this component only
    return !this.querySelector('[aria-selected="true"] a');
  }

  onMobileFormReset(event) {
    // Prevent default so the form reset doesn't set the value gotten from the url on page load
    event.preventDefault();
    // Don't reset if the user has selected an element on the predictive search dropdown
    if (this.shouldResetForm()) {
      this.mobileInput.value = '';
      this.mobileInput.focus();
      this.toggleMobileResetButton();
    }
  }

  // Method to sync search terms between desktop and mobile inputs
  syncSearchTerms() {
    if (this.desktopInput && this.mobileInput) {
      const currentValue = this.desktopInput.value || this.mobileInput.value;
      this.desktopInput.value = currentValue;
      this.mobileInput.value = currentValue;
      this.toggleDesktopResetButton();
      this.toggleMobileResetButton();
    }
  }

  // Method to handle modal opening/closing
  handleModalToggle() {
    // Sync search terms when modal opens
    this.syncSearchTerms();
  }
}

customElements.define('header-search-mega-menu', HeaderSearchMegaMenu);
