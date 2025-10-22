class PredictiveSearchMegaMenu extends HeaderSearchMegaMenu {
  constructor() {
    super();
    this.cachedResults = {};
    this.predictiveSearchResults = this.querySelector(
      '[data-predictive-search]',
    );
    this.allPredictiveSearchInstances = document.querySelectorAll(
      'predictive-search-mega-menu',
    );
    this.isOpen = false;
    this.abortController = new AbortController();
    this.searchTerm = '';

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Setup desktop form events
    if (this.desktopForm) {
      this.desktopForm.addEventListener('submit', this.onFormSubmit.bind(this));
    }

    // Setup mobile form events
    if (this.mobileForm) {
      this.mobileForm.addEventListener('submit', this.onFormSubmit.bind(this));
    }

    // Setup input events for both desktop and mobile
    if (this.desktopInput) {
      this.desktopInput.addEventListener('focus', this.onFocus.bind(this));
      this.desktopInput.addEventListener(
        'input',
        debounce((event) => {
          this.onChange();
        }, 300).bind(this),
      );
    }

    if (this.mobileInput) {
      this.mobileInput.addEventListener('focus', this.onFocus.bind(this));
      this.mobileInput.addEventListener(
        'input',
        debounce((event) => {
          this.onChange();
        }, 300).bind(this),
      );
    }

    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.addEventListener('keyup', this.onKeyup.bind(this));
    this.addEventListener('keydown', this.onKeydown.bind(this));
  }

  getQuery() {
    // Get query from active input (desktop or mobile)
    const activeInput =
      document.activeElement === this.mobileInput
        ? this.mobileInput
        : this.desktopInput;
    return activeInput ? activeInput.value.trim() : '';
  }

  onChange() {
    // Call the appropriate change method based on active input
    const activeInput =
      document.activeElement === this.mobileInput
        ? this.mobileInput
        : this.desktopInput;
    if (activeInput === this.desktopInput) {
      this.onDesktopChange();
    } else if (activeInput === this.mobileInput) {
      this.onMobileChange();
    }

    const newSearchTerm = this.getQuery();
    if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
      // Remove the results when they are no longer relevant for the new search term
      // so they don't show up when the dropdown opens again
      this.querySelector('#predictive-search-results-groups-wrapper')?.remove();
    }

    // Update the term asap, don't wait for the predictive search query to finish loading
    this.updateSearchForTerm(this.searchTerm, newSearchTerm);

    this.searchTerm = newSearchTerm;

    if (!this.searchTerm.length) {
      this.close(true);
      return;
    }

    this.getSearchResults(this.searchTerm);
  }

  onFormSubmit(event) {
    if (
      !this.getQuery().length ||
      this.querySelector('[aria-selected="true"] a')
    )
      event.preventDefault();
  }

  onFormReset(event) {
    // Call the appropriate reset method based on active input
    const activeInput =
      document.activeElement === this.mobileInput
        ? this.mobileInput
        : this.desktopInput;
    if (activeInput === this.mobileInput) {
      this.onMobileFormReset(event);
    } else {
      // For desktop, prevent default and handle reset
      event.preventDefault();
      if (this.shouldResetForm()) {
        if (this.desktopInput) this.desktopInput.value = '';
        if (this.desktopInput) this.desktopInput.focus();
        this.toggleDesktopResetButton();
      }
    }

    if (this.shouldResetForm()) {
      this.searchTerm = '';
      this.abortController.abort();
      this.abortController = new AbortController();
      this.closeResults(true);
    }
  }

  onFocus() {
    const currentSearchTerm = this.getQuery();

    if (!currentSearchTerm.length) return;

    if (this.searchTerm !== currentSearchTerm) {
      // Search term was changed from other search input, treat it as a user change
      this.onChange();
    } else if (this.getAttribute('results') === 'true') {
      this.open();
    } else {
      // If there's a search term but no results loaded, trigger a new search
      this.searchTerm = currentSearchTerm;
      this.getSearchResults(this.searchTerm);
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onKeyup(event) {
    if (!this.getQuery().length) this.close(true);
    event.preventDefault();

    switch (event.code) {
      case 'ArrowUp':
        this.switchOption('up');
        break;
      case 'ArrowDown':
        this.switchOption('down');
        break;
      case 'Enter':
        this.selectOption();
        break;
    }
  }

  onKeydown(event) {
    // Prevent the cursor from moving in the input when using the up and down arrow keys
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      event.preventDefault();
    }
  }

  updateSearchForTerm(previousTerm, newTerm) {
    const searchForTextElement = this.querySelector(
      '[data-predictive-search-search-for-text]',
    );
    const currentButtonText = searchForTextElement?.innerText;
    if (currentButtonText) {
      if (currentButtonText.match(new RegExp(previousTerm, 'g')).length > 1) {
        // The new term matches part of the button text and not just the search term, do not replace to avoid mistakes
        return;
      }
      const newButtonText = currentButtonText.replace(previousTerm, newTerm);
      searchForTextElement.innerText = newButtonText;
    }
  }

  switchOption(direction) {
    if (!this.getAttribute('open')) return;

    const moveUp = direction === 'up';
    const selectedElement = this.querySelector('[aria-selected="true"]');

    // Filter out hidden elements (duplicated page and article resources) thanks
    // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    const allVisibleElements = Array.from(
      this.querySelectorAll('li, button.predictive-search__item'),
    ).filter((element) => element.offsetParent !== null);
    let activeElementIndex = 0;

    if (moveUp && !selectedElement) return;

    let selectedElementIndex = -1;
    let i = 0;

    while (selectedElementIndex === -1 && i <= allVisibleElements.length) {
      if (allVisibleElements[i] === selectedElement) {
        selectedElementIndex = i;
      }
      i++;
    }

    this.statusElement.textContent = '';

    if (!moveUp && selectedElement) {
      activeElementIndex =
        selectedElementIndex === allVisibleElements.length - 1
          ? 0
          : selectedElementIndex + 1;
    } else if (moveUp) {
      activeElementIndex =
        selectedElementIndex === 0
          ? allVisibleElements.length - 1
          : selectedElementIndex - 1;
    }

    if (activeElementIndex === selectedElementIndex) return;

    const activeElement = allVisibleElements[activeElementIndex];

    activeElement.setAttribute('aria-selected', true);
    if (selectedElement) selectedElement.setAttribute('aria-selected', false);

    // Update aria-activedescendant on the active input
    const activeInput =
      document.activeElement === this.mobileInput
        ? this.mobileInput
        : this.desktopInput;
    if (activeInput) {
      activeInput.setAttribute('aria-activedescendant', activeElement.id);
    }
  }

  selectOption() {
    const selectedOption = this.querySelector(
      '[aria-selected="true"] a, button[aria-selected="true"]',
    );

    if (selectedOption) selectedOption.click();
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(' ', '-').toLowerCase();
    this.setLiveRegionLoadingState();

    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }

    fetch(
      `${window.routes.predictive_search_url}?q=${encodeURIComponent(
        searchTerm,
      )}&section_id=predictive-search-mega-menu`,
      { signal: this.abortController.signal },
    )
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector(
            '#shopify-section-predictive-search-mega-menu',
          ).innerHTML;
        // Save bandwidth keeping the cache in all instances synced
        this.allPredictiveSearchInstances.forEach(
          (predictiveSearchInstance) => {
            predictiveSearchInstance.cachedResults[queryKey] = resultsMarkup;
          },
        );
        this.renderSearchResults(resultsMarkup);
      })
      .catch((error) => {
        if (error?.code === 20) {
          // Code 20 means the call was aborted
          return;
        }
        this.close();
        throw error;
      });
  }

  setLiveRegionLoadingState() {
    this.statusElement =
      this.statusElement || this.querySelector('.predictive-search-status');
    this.loadingText =
      this.loadingText || this.getAttribute('data-loading-text');

    this.setLiveRegionText(this.loadingText);
    this.setAttribute('loading', true);
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute('aria-hidden', 'false');
    this.statusElement.textContent = statusText;

    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', 'true');
    }, 1000);
  }

  renderSearchResults(resultsMarkup) {
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.setAttribute('results', true);

    this.setLiveRegionResults();
    this.open();
  }

  setLiveRegionResults() {
    this.removeAttribute('loading');
    this.setLiveRegionText(
      this.querySelector('[data-predictive-search-live-region-count-value]')
        .textContent,
    );
  }

  getResultsMaxHeight() {
    this.resultsMaxHeight =
      window.innerHeight -
      document.querySelector('.section-header')?.getBoundingClientRect().bottom;
    return this.resultsMaxHeight;
  }

  open() {
    this.predictiveSearchResults.style.maxHeight =
      this.resultsMaxHeight || `${this.getResultsMaxHeight()}px`;
    this.setAttribute('open', true);

    // Update aria-expanded on both inputs
    if (this.desktopInput) {
      this.desktopInput.setAttribute('aria-expanded', true);
    }
    if (this.mobileInput) {
      this.mobileInput.setAttribute('aria-expanded', true);
    }

    this.isOpen = true;
  }

  close(clearSearchTerm = false) {
    this.closeResults(clearSearchTerm);
    this.isOpen = false;
  }

  closeResults(clearSearchTerm = false) {
    if (clearSearchTerm) {
      if (this.desktopInput) this.desktopInput.value = '';
      if (this.mobileInput) this.mobileInput.value = '';
      this.removeAttribute('results');
    }
    const selected = this.querySelector('[aria-selected="true"]');

    if (selected) selected.setAttribute('aria-selected', false);

    // Clear aria-activedescendant on both inputs
    if (this.desktopInput) {
      this.desktopInput.setAttribute('aria-activedescendant', '');
      this.desktopInput.setAttribute('aria-expanded', false);
    }
    if (this.mobileInput) {
      this.mobileInput.setAttribute('aria-activedescendant', '');
      this.mobileInput.setAttribute('aria-expanded', false);
    }

    this.removeAttribute('loading');
    this.removeAttribute('open');
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute('style');
  }
}

customElements.define('predictive-search-mega-menu', PredictiveSearchMegaMenu);
