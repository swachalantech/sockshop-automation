/**
 * Selectors - Centralized Locator Definitions
 * ============================================
 * Similar to Page Factory @FindBy annotations in Serenity BDD
 *
 * Benefits:
 * - Single source of truth for all selectors
 * - Easy to maintain when UI changes
 * - Clear documentation for each element
 * - Grouped by page/component
 */

export const Selectors = {
  /**
   * Homepage Selectors
   */
  HomePage: {
    LOGO: '#nav-logo-sprites',
    SEARCH_BOX: '#twotabsearchtextbox',
    SEARCH_BUTTON: '#nav-search-submit-button',
    SIGN_IN_LINK: '#nav-link-accountList',
    CART_LINK: '#nav-cart',
    CART_COUNT: '#nav-cart-count',
    DELIVER_TO: '#nav-global-location-popover-link',
    CATEGORY_DROPDOWN: '#searchDropdownBox',
  },

  /**
   * Login Page Selectors
   */
  LoginPage: {
    // Step 1: Email
    EMAIL_INPUT: '#ap_email',
    CONTINUE_BUTTON: '#continue',

    // Step 2: Password
    PASSWORD_INPUT: '#ap_password',
    SIGN_IN_BUTTON: '#signInSubmit',
    REMEMBER_ME_CHECKBOX: '[name="rememberMe"]',

    // Error Messages
    ERROR_MESSAGE_BOX: '#auth-error-message-box',
    ERROR_MESSAGE_TEXT: '#auth-error-message-box .a-list-item',
    EMAIL_ERROR_ALERT: '#auth-email-invalid-claim-alert, #auth-email-missing-alert',
    PASSWORD_ERROR_ALERT: '#auth-password-missing-alert',
    ALERT_CONTENT: '.a-alert-content',

    // Other Elements
    CREATE_ACCOUNT_LINK: '#createAccountSubmit',
    FORGOT_PASSWORD_LINK: '#auth-fpp-link-bottom',
    AMAZON_LOGO: '.a-icon-logo',
  },

  /**
   * Search Results Page Selectors
   */
  SearchResultsPage: {
    RESULTS_CONTAINER: '.s-main-slot',
    PRODUCT_CARD: '[data-component-type="s-search-result"]',
    PRODUCT_TITLE: '[data-component-type="s-search-result"] h2',
    PRODUCT_PRICE: '[data-component-type="s-search-result"] .a-price-whole',
    PRODUCT_RATING: '[data-component-type="s-search-result"] .a-icon-star-small',
    RESULTS_INFO: '.a-section.a-spacing-small span:has-text("results")',
    NO_RESULTS_MESSAGE: '.a-section:has-text("No results for")',
    SORT_DROPDOWN: '#s-result-sort-select',
    FILTERS_SECTION: '#s-refinements',
    PAGINATION: '.s-pagination-strip',
  },

  /**
   * Product Detail Page Selectors
   */
  ProductDetailPage: {
    TITLE: '#productTitle',
    PRICE: '#priceblock_ourprice, #priceblock_dealprice, .a-price-whole',
    ADD_TO_CART_BUTTON: '#add-to-cart-button',
    BUY_NOW_BUTTON: '#buy-now-button',
    QUANTITY_DROPDOWN: '#quantity',
    RATING: '#acrPopover',
    REVIEWS_COUNT: '#acrCustomerReviewText',
  },

  /**
   * Cart Page Selectors
   */
  CartPage: {
    CART_ITEMS: '.sc-list-item',
    ITEM_TITLE: '.sc-product-title',
    ITEM_PRICE: '.sc-product-price',
    QUANTITY_INPUT: '.sc-quantity-textfield',
    DELETE_BUTTON: '[data-action="delete"]',
    SUBTOTAL: '#sc-subtotal-amount-activecart',
    PROCEED_TO_CHECKOUT: '[name="proceedToRetailCheckout"]',
    EMPTY_CART_MESSAGE: '.sc-empty-cart-page',
  },
} as const;

/**
 * URL Paths
 */
export const Paths = {
  HOME: '/',
  LOGIN: '/ap/signin',
  CART: '/gp/cart/view.html',
  WISHLIST: '/hz/wishlist/ls',
  ORDERS: '/gp/your-account/order-history',
} as const;

/**
 * Full Login URL with OpenID parameters
 */
export const LOGIN_URL = '/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.in%2F%3Fref_%3Dnav_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=inflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0';
