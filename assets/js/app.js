(function () {
  const STORAGE_KEYS = {
    businessProfile: "pfine-pos-store-profile",
    licence: "pfine-pos-licence-state",
    employees: "pfine-pos-employees",
    customers: "pfine-pos-customers",
    products: "pfine-pos-products",
    batches: "pfine-pos-batches",
    movements: "pfine-pos-stock-movements",
    transactions: "pfine-pos-transactions",
    currentEmployeeId: "pfine-pos-current-employee-id",
    draftDocument: "pfine-pos-draft-document"
  };

  const DOCUMENT_TYPES = {
    invoice: "Invoice",
    quotation: "Quotation",
    receipt: "Receipt",
    deliveryNote: "Delivery Note"
  };

  const PACKAGE = window.PFINE_PACKAGE_CONFIG || {};
  const EDITIONS = PACKAGE.editions || {};
  const REGION_PRESETS = PACKAGE.regionPresets || {};
  const CURRENCIES = PACKAGE.currencies || ["USD", "Custom"];
  const PLAN_DEFINITIONS = {
    monthly: { label: "Monthly plan", durationDays: 30, priceLabel: "USD 35" },
    yearly: { label: "Yearly plan", durationDays: 365, priceLabel: "USD 320" },
    lifetime: { label: "Lifetime plan", durationDays: 0, priceLabel: "USD 950" }
  };
  const MASTER_ACCOUNT = {
    displayName: "System Activation",
    employeeCodeHash: "cbb4fa1699a23b630484c6052549b31ccd3750aa88e5e7787a185451bffa0e6c",
    accessCodeHash: "7342e96ca2d57c722b099044b53b27153f8fba6cbd40ccc40e275f86dc52c4cc",
    nameHash: "31713e6a41fffbfa44f15b2cb077b2efb7b5afac15065645b6b627b2880c192f"
  };

  const elements = mapElements();
  const state = {
    businessProfile: normaliseBusinessProfile(loadFromStorage(STORAGE_KEYS.businessProfile, {})),
    licence: normaliseLicence(loadFromStorage(STORAGE_KEYS.licence, {})),
    employees: loadFromStorage(STORAGE_KEYS.employees, []),
    customers: loadFromStorage(STORAGE_KEYS.customers, []),
    products: loadFromStorage(STORAGE_KEYS.products, []),
    batches: loadFromStorage(STORAGE_KEYS.batches, []),
    movements: loadFromStorage(STORAGE_KEYS.movements, []),
    transactions: loadFromStorage(STORAGE_KEYS.transactions, []),
    currentEmployeeId: localStorage.getItem(STORAGE_KEYS.currentEmployeeId) || "",
    draftDocument: normaliseDocument(loadFromStorage(STORAGE_KEYS.draftDocument, {})),
    activePage: "dashboard",
    activationSessionUnlocked: false,
    historyQuery: "",
    historyRetrieved: false
  };

  const editing = {
    employeeId: "",
    customerId: "",
    productId: "",
    batchId: "",
    transactionId: state.draftDocument.transactionId || ""
  };

  init();

  function mapElements() {
    return {
      appTitle: byId("app-title"),
      brandSummary: byId("brand-summary"),
      pageTitle: byId("page-title"),
      activeEmployeeLabel: byId("active-employee-label"),
      dashboardEdition: byId("dashboard-edition"),
      dashboardCashier: byId("dashboard-cashier"),
      dashboardStoreName: byId("dashboard-store-name"),
      dashboardCurrency: byId("dashboard-currency"),
      dashboardLowStockList: byId("dashboard-low-stock-list"),
      stockAlertBell: byId("stock-alert-bell"),
      stockAlertCount: byId("stock-alert-count"),
      currentPackageName: byId("current-package-name"),
      heroSupportNote: byId("hero-support-note"),
      topbarSupport: byId("topbar-support"),
      staffSessionOverlay: byId("staff-session-overlay"),
      customRowOverlay: byId("custom-row-overlay"),
      closeCustomRowBtn: byId("close-custom-row-btn"),
      saveCustomRowBtn: byId("save-custom-row-btn"),
      customRowName: byId("custom-row-name"),
      customRowDescription: byId("custom-row-description"),
      customRowSku: byId("custom-row-sku"),
      customRowUnit: byId("custom-row-unit"),
      customRowQuantity: byId("custom-row-quantity"),
      customRowUnitPrice: byId("custom-row-unit-price"),
      customRowDiscountPercent: byId("custom-row-discount-percent"),
      customRowDiscountAmount: byId("custom-row-discount-amount"),
      customRowTaxPercent: byId("custom-row-tax-percent"),
      customRowRemarks: byId("custom-row-remarks"),
      activationPlanOverlay: byId("activation-plan-overlay"),
      cancelActivationPlanBtn: byId("cancel-activation-plan-btn"),
      sessionEmployeeCode: byId("session-employee-code"),
      sessionAccessCode: byId("session-access-code"),
      sessionSignInBtn: byId("session-sign-in-btn"),
      sessionOpenStaffSetupBtn: byId("session-open-staff-setup-btn"),
      sessionOpenOwnerPanelBtn: byId("session-open-owner-panel-btn"),
      sessionHelperText: byId("session-helper-text"),
      ownerPanel: byId("owner-panel"),
      closeOwnerPanelBtn: byId("close-owner-panel-btn"),
      signOutBtn: byId("sign-out-btn"),
      historySearch: byId("history-search"),
      retrieveHistoryBtn: byId("retrieve-history-btn"),
      clearHistoryBtn: byId("clear-history-btn"),
      historyList: byId("history-list"),
      statusMessage: byId("status-message"),
      documentPreview: byId("document-preview"),
      lineItemTemplate: byId("line-item-template"),
      lineItemsBody: byId("line-items-body"),
      posProductSearch: byId("pos-product-search"),
      posProductResults: byId("pos-product-results"),
      navButtons: Array.from(document.querySelectorAll("[data-page-target]")),
      appPages: Array.from(document.querySelectorAll("[data-page]")),

      businessLogo: byId("business-logo"),
      businessName: byId("business-name"),
      legalBusinessName: byId("legal-business-name"),
      businessPhone: byId("business-phone"),
      businessEmail: byId("business-email"),
      businessWebsite: byId("business-website"),
      businessAddress: byId("business-address"),
      businessRegion: byId("business-region"),
      businessCurrencySelect: byId("business-currency-select"),
      businessCurrencyCustom: byId("business-currency-custom"),
      businessTaxLabel: byId("business-tax-label"),
      businessTaxDefaultPercent: byId("business-tax-default-percent"),
      businessTaxIdLabel: byId("business-tax-id-label"),
      businessTaxIdValue: byId("business-tax-id-value"),
      primaryPaymentLabel: byId("primary-payment-label"),
      primaryPaymentDetails: byId("primary-payment-details"),
      secondaryPaymentLabel: byId("secondary-payment-label"),
      secondaryPaymentDetails: byId("secondary-payment-details"),
      receiptFooter: byId("receipt-footer"),
      invoiceTermsDefault: byId("invoice-terms-default"),
      quotationTermsDefault: byId("quotation-terms-default"),
      deliveryNoteTermsDefault: byId("delivery-note-terms-default"),
      allowNegativeStock: byId("allow-negative-stock"),
      saveBusinessProfileBtn: byId("save-business-profile-btn"),

      licenceEdition: byId("licence-edition"),
      licenceStatus: byId("licence-status"),
      licenceCustomerName: byId("licence-customer-name"),
      licenceCustomerEmail: byId("licence-customer-email"),
      licenceKey: byId("licence-key"),
      ownerAccessCode: byId("owner-access-code"),
      licenceActivationDate: byId("licence-activation-date"),
      licenceExpiryDate: byId("licence-expiry-date"),
      onlineActivationReady: byId("online-activation-ready"),
      licenceFeaturesSummary: byId("licence-features-summary"),
      licenceLimitSummary: byId("licence-limit-summary"),
      hostedOnlineNote: byId("hosted-online-note"),
      saveLicenceBtn: byId("save-licence-btn"),

      currentEmployeeId: byId("current-employee-id"),
      employeeCode: byId("employee-code"),
      employeeFullName: byId("employee-full-name"),
      employeeRole: byId("employee-role"),
      employeeAccessCode: byId("employee-access-code"),
      employeePhone: byId("employee-phone"),
      employeeEmail: byId("employee-email"),
      employeeActiveStatus: byId("employee-active-status"),
      saveEmployeeBtn: byId("save-employee-btn"),
      clearEmployeeBtn: byId("clear-employee-btn"),
      employeeList: byId("employee-list"),

      customerPicker: byId("customer-picker"),
      customerName: byId("customer-name"),
      customerPhone: byId("customer-phone"),
      customerEmail: byId("customer-email"),
      customerTaxId: byId("customer-tax-id"),
      customerType: byId("customer-type"),
      customerReferenceNumber: byId("customer-reference-number"),
      customerAddress: byId("customer-address"),
      customerNotes: byId("customer-notes"),
      saveCustomerBtn: byId("save-customer-btn"),
      clearCustomerBtn: byId("clear-customer-btn"),
      customerList: byId("customer-list"),

      productSku: byId("product-sku"),
      productBarcode: byId("product-barcode"),
      productType: byId("product-type"),
      productName: byId("product-name"),
      productDescription: byId("product-description"),
      productCategory: byId("product-category"),
      productUnit: byId("product-unit"),
      productUnitPrice: byId("product-unit-price"),
      productCostPrice: byId("product-cost-price"),
      productTaxPercent: byId("product-tax-percent"),
      productStockTrackingEnabled: byId("product-stock-tracking-enabled"),
      productServiceTrackingEnabled: byId("product-service-tracking-enabled"),
      productReorderLevel: byId("product-reorder-level"),
      productActiveStatus: byId("product-active-status"),
      productSearch: byId("product-search"),
      productCategoryFilter: byId("product-category-filter"),
      saveProductBtn: byId("save-product-btn"),
      clearProductBtn: byId("clear-product-btn"),
      productListBody: byId("product-list-body"),

      batchProductId: byId("batch-product-id"),
      batchNumber: byId("batch-number"),
      batchPurchaseDate: byId("batch-purchase-date"),
      batchExpiryDate: byId("batch-expiry-date"),
      batchInitialQuantity: byId("batch-initial-quantity"),
      batchQuantityAvailable: byId("batch-quantity-available"),
      batchUnitCost: byId("batch-unit-cost"),
      batchSellingPriceOverride: byId("batch-selling-price-override"),
      batchSupplierName: byId("batch-supplier-name"),
      batchNotes: byId("batch-notes"),
      batchActiveStatus: byId("batch-active-status"),
      saveBatchBtn: byId("save-batch-btn"),
      clearBatchBtn: byId("clear-batch-btn"),
      batchStockSummary: byId("batch-stock-summary"),
      batchList: byId("batch-list"),
      stockMovementList: byId("stock-movement-list"),

      documentType: byId("document-type"),
      documentNumber: byId("document-number"),
      documentDate: byId("document-date"),
      dueDateLabel: byId("due-date-label"),
      dueDate: byId("due-date"),
      paymentStatus: byId("payment-status"),
      paymentMethod: byId("payment-method"),
      paymentReference: byId("payment-reference"),
      cashierName: byId("cashier-name"),
      documentCustomerId: byId("document-customer-id"),
      projectReference: byId("project-reference"),
      relatedDocumentNumber: byId("related-document-number"),
      sourceDocumentId: byId("source-document-id"),
      deliveryMethod: byId("delivery-method"),
      trackingReference: byId("tracking-reference"),
      deliveredBy: byId("delivered-by"),
      receivedBy: byId("received-by"),
      dateReceived: byId("date-received"),
      showPricesDeliveryNote: byId("show-prices-delivery-note"),
      deliveryAddress: byId("delivery-address"),
      notes: byId("notes"),
      termsConditions: byId("terms-conditions"),
      amountReceived: byId("amount-received"),
      amountPaid: byId("amount-paid"),
      documentDiscountPercent: byId("document-discount-percent"),
      documentDiscountAmount: byId("document-discount-amount"),
      shippingCharge: byId("shipping-charge"),
      serviceCharge: byId("service-charge"),
      otherCharges: byId("other-charges"),
      roundingAdjustment: byId("rounding-adjustment"),
      addLineItemBtn: byId("add-line-item-btn"),
      clearCartBtn: byId("clear-cart-btn"),
      newDocumentBtn: byId("new-document-btn"),
      saveDocumentBtn: byId("save-document-btn"),
      printBtn: byId("print-btn"),
      copyWhatsappBtn: byId("copy-whatsapp-btn"),

      summaryTodaysSales: byId("summary-todays-sales"),
      summaryTransactions: byId("summary-transactions"),
      summaryUnpaid: byId("summary-unpaid"),
      summaryStock: byId("summary-stock"),
      metricItemsCount: byId("metric-items-count"),
      metricTotalQuantity: byId("metric-total-quantity"),
      metricSubtotalBeforeDiscount: byId("metric-subtotal-before-discount"),
      metricTotalLineDiscount: byId("metric-total-line-discount"),
      metricDocumentDiscount: byId("metric-document-discount"),
      metricTaxableSubtotal: byId("metric-taxable-subtotal"),
      metricTotalTax: byId("metric-total-tax"),
      metricShippingCharge: byId("metric-shipping-charge"),
      metricServiceCharge: byId("metric-service-charge"),
      metricOtherCharges: byId("metric-other-charges"),
      metricRoundingAdjustment: byId("metric-rounding-adjustment"),
      metricGrandTotal: byId("metric-grand-total"),
      metricAmountReceived: byId("metric-amount-received"),
      metricAmountPaid: byId("metric-amount-paid"),
      metricChangeGiven: byId("metric-change-given"),
      metricBalanceDue: byId("metric-balance-due"),
      activationStatusLabel: byId("activation-status-label"),
      activationPlanLabel: byId("activation-plan-label"),
      activationExpiryLabel: byId("activation-expiry-label"),
      activationSelectedPlanLabel: byId("activation-selected-plan-label"),
      activationGuidance: byId("activation-guidance"),
      activationPlanButtons: Array.from(document.querySelectorAll("[data-activate-plan]"))
    };
  }

  function init() {
    refreshActivationState();
    applyAppInfo();
    populateStaticSelects();
    bindEvents();
    ensureCurrentEmployee();
    fillBusinessForm();
    fillLicenceForm();
    resetEmployeeForm();
    resetCustomerForm();
    resetProductForm();
    resetBatchForm();
    if (!state.draftDocument.documentNumber) {
      state.draftDocument = createDefaultDocument();
    }
    fillDraftForm(state.draftDocument);
    switchPage(state.employees.length ? "dashboard" : "staff");
    renderAll();
  }

  function applyAppInfo() {
    applyText(elements.appTitle, PACKAGE.appName || "PFine Point of Sale System");
    applyText(elements.brandSummary, "Products, services, batches, staff, sales documents, and print-ready business records in one premium desktop workspace.");
    applyText(elements.heroSupportNote, PACKAGE.supportNote || "");
    applyText(elements.topbarSupport, "Track staff, customers, products, service items, stock batches, sales documents, and printable business records from one desktop app.");
  }

  function populateStaticSelects() {
    populateSelect(elements.businessRegion, Object.keys(REGION_PRESETS).map(function (key) {
      return { value: key, label: REGION_PRESETS[key].label };
    }));
    populateSelect(elements.businessCurrencySelect, CURRENCIES.map(function (currency) {
      return { value: currency, label: currency };
    }));
    populateSelect(elements.documentType, Object.keys(DOCUMENT_TYPES).map(function (key) {
      return { value: key, label: DOCUMENT_TYPES[key] };
    }));
  }

  function bindEvents() {
    elements.saveBusinessProfileBtn.addEventListener("click", saveBusinessProfile);
    elements.businessLogo.addEventListener("change", handleLogoUpload);
    elements.businessRegion.addEventListener("change", applyRegionPresetToForm);
    elements.saveLicenceBtn.addEventListener("click", saveLicenceState);
    elements.licenceEdition.addEventListener("change", fillLicenceDerivedFields);
    elements.sessionSignInBtn.addEventListener("click", attemptStaffSignIn);
    elements.sessionOpenStaffSetupBtn.addEventListener("click", openStaffSetupFromOverlay);
    elements.signOutBtn.addEventListener("click", signOutStaff);
    elements.retrieveHistoryBtn.addEventListener("click", retrieveHistoryResults);
    elements.clearHistoryBtn.addEventListener("click", clearHistoryResults);
    elements.historySearch.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        retrieveHistoryResults();
      }
    });
    elements.stockAlertBell.addEventListener("click", openStockAlertsPanel);
    elements.cancelActivationPlanBtn.addEventListener("click", closeActivationPlanDialog);
    elements.activationPlanButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activatePreparedPlan(button.getAttribute("data-activate-plan"));
      });
    });
    elements.navButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        switchPage(button.getAttribute("data-page-target"));
      });
    });
    document.addEventListener("keydown", handleGlobalShortcuts);

    elements.saveEmployeeBtn.addEventListener("click", saveEmployee);
    elements.clearEmployeeBtn.addEventListener("click", resetEmployeeForm);
    elements.currentEmployeeId.addEventListener("change", handleCurrentEmployeeChange);
    elements.employeeList.addEventListener("click", handleEmployeeActions);

    elements.saveCustomerBtn.addEventListener("click", saveCustomer);
    elements.clearCustomerBtn.addEventListener("click", resetCustomerForm);
    elements.customerPicker.addEventListener("change", handleCustomerPickerChange);
    elements.customerList.addEventListener("click", handleCustomerActions);

    elements.saveProductBtn.addEventListener("click", saveProduct);
    elements.clearProductBtn.addEventListener("click", resetProductForm);
    elements.productSearch.addEventListener("input", renderProducts);
    elements.productCategoryFilter.addEventListener("input", renderProducts);
    elements.productListBody.addEventListener("click", handleProductActions);
    elements.posProductSearch.addEventListener("input", renderPosProductResults);

    elements.saveBatchBtn.addEventListener("click", saveBatch);
    elements.clearBatchBtn.addEventListener("click", resetBatchForm);
    elements.batchProductId.addEventListener("change", function () {
      renderBatchSummary();
      renderBatchList();
      renderMovementList();
      updateWorkspace();
    });
    elements.batchList.addEventListener("click", handleBatchActions);

    elements.documentCustomerId.addEventListener("change", updateWorkspace);
    elements.documentType.addEventListener("change", handleDocumentTypeChange);
    elements.sourceDocumentId.addEventListener("change", syncSourceDocumentSelection);
    elements.addLineItemBtn.addEventListener("click", openCustomRowOverlay);
    elements.clearCartBtn.addEventListener("click", clearCart);
    elements.closeCustomRowBtn.addEventListener("click", closeCustomRowOverlay);
    elements.saveCustomRowBtn.addEventListener("click", saveCustomRow);
    elements.lineItemsBody.addEventListener("click", handleLineItemActions);
    elements.lineItemsBody.addEventListener("input", updateWorkspace);
    elements.lineItemsBody.addEventListener("change", handleLineItemFieldChange);

    elements.newDocumentBtn.addEventListener("click", newDocument);
    elements.saveDocumentBtn.addEventListener("click", saveDocument);
    elements.printBtn.addEventListener("click", handlePrintRequest);
    elements.copyWhatsappBtn.addEventListener("click", copySummary);
    elements.historyList.addEventListener("click", handleHistoryActions);

    [
      elements.businessName, elements.legalBusinessName, elements.businessPhone, elements.businessEmail,
      elements.businessWebsite, elements.businessAddress, elements.businessCurrencySelect, elements.businessCurrencyCustom,
      elements.businessTaxLabel, elements.businessTaxDefaultPercent, elements.businessTaxIdLabel, elements.businessTaxIdValue, elements.primaryPaymentLabel,
      elements.primaryPaymentDetails, elements.secondaryPaymentLabel, elements.secondaryPaymentDetails, elements.receiptFooter,
      elements.invoiceTermsDefault, elements.quotationTermsDefault, elements.deliveryNoteTermsDefault, elements.allowNegativeStock,
      elements.documentType, elements.documentNumber, elements.documentDate, elements.dueDate, elements.paymentStatus,
      elements.paymentMethod, elements.paymentReference, elements.projectReference, elements.relatedDocumentNumber,
      elements.deliveryMethod, elements.trackingReference, elements.deliveredBy, elements.receivedBy, elements.dateReceived,
      elements.showPricesDeliveryNote, elements.deliveryAddress, elements.notes, elements.termsConditions,
      elements.amountReceived, elements.amountPaid, elements.documentDiscountPercent, elements.documentDiscountAmount,
      elements.shippingCharge, elements.serviceCharge, elements.otherCharges, elements.roundingAdjustment
    ].forEach(function (field) {
      field.addEventListener("input", updateWorkspace);
      field.addEventListener("change", updateWorkspace);
    });
  }

  function normaliseBusinessProfile(profile) {
    const region = profile.region && REGION_PRESETS[profile.region] ? profile.region : "globalGeneric";
    const preset = REGION_PRESETS[region] || REGION_PRESETS.globalGeneric || {};
    const desiredCurrency = profile.currency || preset.currency || "USD";
    return {
      storeId: profile.storeId || generateId("store"),
      logoDataUrl: profile.logoDataUrl || "",
      storeName: profile.storeName || profile.name || "",
      legalBusinessName: profile.legalBusinessName || "",
      phone: profile.phone || "",
      email: profile.email || "",
      website: profile.website || "",
      address: profile.address || "",
      region: region,
      currency: CURRENCIES.indexOf(desiredCurrency) >= 0 ? desiredCurrency : "Custom",
      currencyCustom: CURRENCIES.indexOf(desiredCurrency) >= 0 ? (profile.currencyCustom || "") : desiredCurrency,
      taxLabel: profile.taxLabel || preset.taxLabel || "Tax",
      taxDefaultPercent: parseNumber(profile.taxDefaultPercent || preset.taxDefaultPercent || 0),
      taxIdLabel: profile.taxIdLabel || profile.businessTaxIdLabel || preset.taxIdLabel || "Tax ID",
      taxIdValue: profile.taxIdValue || profile.businessTaxIdValue || "",
      primaryPaymentLabel: profile.primaryPaymentLabel || preset.primaryPaymentLabel || "Bank Details",
      primaryPaymentDetails: profile.primaryPaymentDetails || "",
      secondaryPaymentLabel: profile.secondaryPaymentLabel || preset.secondaryPaymentLabel || "Payment Details",
      secondaryPaymentDetails: profile.secondaryPaymentDetails || "",
      receiptFooter: profile.receiptFooter || "Received with thanks.",
      invoiceTerms: profile.invoiceTerms || "Payment is due as stated on this invoice unless otherwise agreed in writing.",
      quotationTerms: profile.quotationTerms || "This quotation is subject to stock availability and written acceptance.",
      deliveryNoteTerms: profile.deliveryNoteTerms || "Please inspect delivered items and sign upon receipt.",
      allowNegativeStock: profile.allowNegativeStock || "no"
    };
  }

  function normaliseLicence(licence) {
    const edition = licence.edition && EDITIONS[licence.edition] ? licence.edition : "demo";
    const rules = EDITIONS[edition] || {};
    return {
      licenceKey: licence.licenceKey || "",
      licenceStatus: licence.licenceStatus || "inactive",
      edition: edition,
      customerName: licence.customerName || "",
      customerEmail: licence.customerEmail || "",
      ownerAccessCode: licence.ownerAccessCode || "",
      selectedPlan: PLAN_DEFINITIONS[licence.selectedPlan] ? licence.selectedPlan : "",
      activationPlan: PLAN_DEFINITIONS[licence.activationPlan] ? licence.activationPlan : "",
      activationDate: licence.activationDate || "",
      expiryDate: licence.expiryDate || "",
      activatedByMaster: licence.activatedByMaster === true,
      allowedFeatures: Array.isArray(licence.allowedFeatures) && licence.allowedFeatures.length ? licence.allowedFeatures : (rules.allowedFeatures || []),
      maxProducts: finiteOrFallback(licence.maxProducts, rules.maxProducts, 0),
      maxCustomers: finiteOrFallback(licence.maxCustomers, rules.maxCustomers, 0),
      maxEmployees: finiteOrFallback(licence.maxEmployees, rules.maxEmployees, 0),
      maxSavedDocuments: finiteOrFallback(licence.maxSavedDocuments, rules.maxSavedDocuments, 0),
      watermarkEnabled: typeof licence.watermarkEnabled === "boolean" ? licence.watermarkEnabled : !!rules.watermarkEnabled,
      onlineActivationReady: licence.onlineActivationReady === true || licence.onlineActivationReady === "true"
    };
  }

  function createDefaultDocument() {
    const employee = getCurrentEmployee();
    return normaliseDocument({
      transactionId: "",
      documentType: "invoice",
      documentNumber: generateDocumentNumber("invoice"),
      documentDate: todayDate(),
      dueDate: todayDate(),
      paymentStatus: "unpaid",
      paymentMethod: "",
      paymentReference: "",
      customerId: "",
      employeeId: employee ? employee.employeeId : "",
      cashierName: employee ? employee.fullName : "",
      projectReference: "",
      relatedDocumentNumber: "",
      sourceDocumentId: "",
      deliveryMethod: "",
      trackingReference: "",
      deliveredBy: "",
      receivedBy: "",
      dateReceived: "",
      showPricesDeliveryNote: "yes",
      deliveryAddress: "",
      notes: "",
      termsConditions: state.businessProfile.invoiceTerms,
      documentDiscountPercent: 0,
      documentDiscountAmount: 0,
      shippingCharge: 0,
      serviceCharge: 0,
      otherCharges: 0,
      roundingAdjustment: 0,
      amountReceived: 0,
      amountPaid: 0,
      items: [createDefaultLineItem()]
    });
  }

  function normaliseDocument(documentData) {
    const base = documentData || {};
    return {
      transactionId: base.transactionId || "",
      documentType: base.documentType || "invoice",
      documentNumber: base.documentNumber || "",
      documentDate: base.documentDate || todayDate(),
      dueDate: base.dueDate || todayDate(),
      paymentStatus: base.paymentStatus || "unpaid",
      paymentMethod: base.paymentMethod || "",
      paymentReference: base.paymentReference || "",
      customerId: base.customerId || "",
      employeeId: base.employeeId || "",
      cashierName: base.cashierName || "",
      projectReference: base.projectReference || "",
      relatedDocumentNumber: base.relatedDocumentNumber || "",
      sourceDocumentId: base.sourceDocumentId || "",
      deliveryMethod: base.deliveryMethod || "",
      trackingReference: base.trackingReference || "",
      deliveredBy: base.deliveredBy || "",
      receivedBy: base.receivedBy || "",
      dateReceived: base.dateReceived || "",
      showPricesDeliveryNote: base.showPricesDeliveryNote || "yes",
      deliveryAddress: base.deliveryAddress || "",
      notes: base.notes || "",
      termsConditions: base.termsConditions || "",
      documentDiscountPercent: parseNumber(base.documentDiscountPercent),
      documentDiscountAmount: parseNumber(base.documentDiscountAmount),
      shippingCharge: parseNumber(base.shippingCharge),
      serviceCharge: parseNumber(base.serviceCharge),
      otherCharges: parseNumber(base.otherCharges),
      roundingAdjustment: parseNumber(base.roundingAdjustment),
      amountReceived: parseNumber(base.amountReceived),
      amountPaid: parseNumber(base.amountPaid),
      items: Array.isArray(base.items) && base.items.length ? base.items.map(normaliseLineItem) : [createDefaultLineItem()]
    };
  }

  function createDefaultLineItem() {
    return normaliseLineItem({
      productId: "",
      batchId: "",
      sku: "",
      barcode: "",
      type: "service",
      name: "",
      description: "",
      quantity: 0,
      unit: "",
      unitPrice: 0,
      costPrice: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: state && state.businessProfile ? parseNumber(state.businessProfile.taxDefaultPercent) : 0,
      quantityDelivered: 0,
      remarks: "",
      stockTrackingEnabled: false
    });
  }

  function resetCustomRowForm() {
    elements.customRowName.value = "";
    elements.customRowDescription.value = "";
    elements.customRowSku.value = "";
    elements.customRowUnit.value = "";
    elements.customRowQuantity.value = "1";
    elements.customRowUnitPrice.value = "0";
    elements.customRowDiscountPercent.value = "0";
    elements.customRowDiscountAmount.value = "0";
    elements.customRowTaxPercent.value = normaliseNumber(parseNumber(state.businessProfile.taxDefaultPercent));
    elements.customRowRemarks.value = "";
  }

  function openCustomRowOverlay() {
    resetCustomRowForm();
    elements.customRowOverlay.classList.remove("hidden");
  }

  function closeCustomRowOverlay() {
    elements.customRowOverlay.classList.add("hidden");
  }

  function saveCustomRow() {
    const name = elements.customRowName.value.trim();
    if (!name) {
      showStatus("Enter the custom item or service name.");
      return;
    }
    const draft = collectDraftFromForm();
    if (cartHasOnlyPlaceholder(draft.items)) {
      draft.items = [];
    }
    draft.items.push(normaliseLineItem({
      productId: "",
      batchId: "",
      sku: elements.customRowSku.value.trim(),
      barcode: "",
      type: "service",
      name: name,
      description: elements.customRowDescription.value.trim(),
      quantity: elements.customRowQuantity.value,
      unit: elements.customRowUnit.value.trim(),
      unitPrice: elements.customRowUnitPrice.value,
      costPrice: 0,
      discountPercent: elements.customRowDiscountPercent.value,
      discountAmount: elements.customRowDiscountAmount.value,
      taxPercent: elements.customRowTaxPercent.value,
      quantityDelivered: elements.customRowQuantity.value,
      remarks: elements.customRowRemarks.value.trim(),
      stockTrackingEnabled: false
    }));
    renderLineItems(draft.items);
    closeCustomRowOverlay();
    updateWorkspace();
    showStatus("Custom row added to cart.");
  }

  function normaliseLineItem(item) {
    const row = item || {};
    return {
      lineId: row.lineId || generateId("line"),
      productId: row.productId || "",
      batchId: row.batchId || "",
      sku: row.sku || "",
      barcode: row.barcode || "",
      type: row.type || "service",
      name: row.name || "",
      description: row.description || "",
      quantity: parseNumber(row.quantity || 1),
      unit: row.unit || "",
      unitPrice: parseNumber(row.unitPrice),
      costPrice: parseNumber(row.costPrice),
      discountPercent: parseNumber(row.discountPercent),
      discountAmount: parseNumber(row.discountAmount),
      taxPercent: parseNumber(row.taxPercent),
      quantityDelivered: parseNumber(row.quantityDelivered || row.quantity || 1),
      remarks: row.remarks || "",
      stockTrackingEnabled: !!row.stockTrackingEnabled,
      stockDeducted: !!row.stockDeducted
    };
  }

  function fillBusinessForm() {
    const profile = state.businessProfile;
    elements.businessName.value = profile.storeName;
    elements.legalBusinessName.value = profile.legalBusinessName;
    elements.businessPhone.value = profile.phone;
    elements.businessEmail.value = profile.email;
    elements.businessWebsite.value = profile.website;
    elements.businessAddress.value = profile.address;
    elements.businessRegion.value = profile.region;
    elements.businessCurrencySelect.value = profile.currency;
    elements.businessCurrencyCustom.value = profile.currencyCustom;
    elements.businessTaxLabel.value = profile.taxLabel;
    elements.businessTaxDefaultPercent.value = normaliseNumber(profile.taxDefaultPercent);
    elements.businessTaxIdLabel.value = profile.taxIdLabel;
    elements.businessTaxIdValue.value = profile.taxIdValue;
    elements.primaryPaymentLabel.value = profile.primaryPaymentLabel;
    elements.primaryPaymentDetails.value = profile.primaryPaymentDetails;
    elements.secondaryPaymentLabel.value = profile.secondaryPaymentLabel;
    elements.secondaryPaymentDetails.value = profile.secondaryPaymentDetails;
    elements.receiptFooter.value = profile.receiptFooter;
    elements.invoiceTermsDefault.value = profile.invoiceTerms;
    elements.quotationTermsDefault.value = profile.quotationTerms;
    elements.deliveryNoteTermsDefault.value = profile.deliveryNoteTerms;
    elements.allowNegativeStock.value = profile.allowNegativeStock;
    syncCurrencyVisibility();
  }

  function fillLicenceForm() {
    elements.licenceEdition.value = state.licence.edition;
    elements.licenceStatus.value = state.licence.licenceStatus;
    elements.licenceCustomerName.value = state.licence.customerName;
    elements.licenceCustomerEmail.value = state.licence.customerEmail;
    elements.licenceKey.value = state.licence.licenceKey;
    elements.ownerAccessCode.value = "";
    elements.licenceActivationDate.value = state.licence.activationDate;
    elements.licenceExpiryDate.value = state.licence.expiryDate;
    elements.onlineActivationReady.value = state.licence.onlineActivationReady ? "true" : "false";
    fillLicenceDerivedFields();
  }

  function fillLicenceDerivedFields() {
    const edition = elements.licenceEdition.value;
    const rules = EDITIONS[edition] || {};
    const activationValid = isActivationValid();
    const activePlan = PLAN_DEFINITIONS[state.licence.activationPlan] || null;
    const selectedPlan = PLAN_DEFINITIONS[state.licence.selectedPlan] || null;
    applyText(elements.currentPackageName, activationValid ? ((activePlan || selectedPlan).label + " | Full access") : "Activation required");
    applyText(elements.licenceFeaturesSummary, activationValid ? "All features unlocked for this activated installation." : (rules.allowedFeatures || []).join(", "));
    applyText(
      elements.licenceLimitSummary,
      activationValid
        ? "Products: Unlimited | Customers: Unlimited | Employees: Unlimited | Saved documents: Unlimited | Watermark: Disabled"
        : "Plan selection is protected and completed only during supplier activation."
    );
    applyText(elements.hostedOnlineNote, activationValid ? activationExpirySummary() : PACKAGE.hostedOnlineReadinessNote || "");
    applyText(elements.dashboardEdition, activationValid ? ((activePlan || selectedPlan || PLAN_DEFINITIONS.monthly).label + " | Full access") : "Not activated");
  }

  function saveBusinessProfile() {
    state.businessProfile = normaliseBusinessProfile({
      storeId: state.businessProfile.storeId,
      logoDataUrl: state.businessProfile.logoDataUrl,
      storeName: elements.businessName.value.trim(),
      legalBusinessName: elements.legalBusinessName.value.trim(),
      phone: elements.businessPhone.value.trim(),
      email: elements.businessEmail.value.trim(),
      website: elements.businessWebsite.value.trim(),
      address: elements.businessAddress.value.trim(),
      region: elements.businessRegion.value,
      currency: elements.businessCurrencySelect.value,
      currencyCustom: elements.businessCurrencyCustom.value.trim(),
      taxLabel: elements.businessTaxLabel.value.trim(),
      taxDefaultPercent: elements.businessTaxDefaultPercent.value,
      taxIdLabel: elements.businessTaxIdLabel.value.trim(),
      taxIdValue: elements.businessTaxIdValue.value.trim(),
      primaryPaymentLabel: elements.primaryPaymentLabel.value.trim(),
      primaryPaymentDetails: elements.primaryPaymentDetails.value.trim(),
      secondaryPaymentLabel: elements.secondaryPaymentLabel.value.trim(),
      secondaryPaymentDetails: elements.secondaryPaymentDetails.value.trim(),
      receiptFooter: elements.receiptFooter.value.trim(),
      invoiceTerms: elements.invoiceTermsDefault.value.trim(),
      quotationTerms: elements.quotationTermsDefault.value.trim(),
      deliveryNoteTerms: elements.deliveryNoteTermsDefault.value.trim(),
      allowNegativeStock: elements.allowNegativeStock.value
    });
    saveToStorage(STORAGE_KEYS.businessProfile, state.businessProfile);
    updateWorkspace();
    showStatus("Store profile saved locally.");
  }

  function handleLogoUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function () {
      state.businessProfile.logoDataUrl = String(reader.result || "");
      saveToStorage(STORAGE_KEYS.businessProfile, state.businessProfile);
      updateWorkspace();
      showStatus("Store logo saved locally.");
    };
    reader.readAsDataURL(file);
  }

  function applyRegionPresetToForm() {
    const preset = REGION_PRESETS[elements.businessRegion.value] || REGION_PRESETS.globalGeneric || {};
    elements.businessCurrencySelect.value = preset.currency || "USD";
    if (preset.currency !== "Custom") {
      elements.businessCurrencyCustom.value = "";
    }
    elements.businessTaxLabel.value = preset.taxLabel || "Tax";
    elements.businessTaxDefaultPercent.value = normaliseNumber(preset.taxDefaultPercent || 0);
    elements.businessTaxIdLabel.value = preset.taxIdLabel || "Tax ID";
    elements.primaryPaymentLabel.value = preset.primaryPaymentLabel || "Bank Details";
    elements.secondaryPaymentLabel.value = preset.secondaryPaymentLabel || "Payment Details";
    syncCurrencyVisibility();
    updateWorkspace();
  }

  function syncCurrencyVisibility() {
    const label = elements.businessCurrencyCustom.closest("label");
    if (label) {
      label.classList.toggle("hidden", elements.businessCurrencySelect.value !== "Custom");
    }
  }

  function saveLicenceState() {
    const edition = elements.licenceEdition.value;
    const rules = EDITIONS[edition] || {};
    state.licence = normaliseLicence({
      licenceKey: elements.licenceKey.value.trim(),
      licenceStatus: elements.licenceStatus.value,
      edition: edition,
      customerName: elements.licenceCustomerName.value.trim(),
      customerEmail: elements.licenceCustomerEmail.value.trim(),
      ownerAccessCode: elements.ownerAccessCode.value.trim() || state.licence.ownerAccessCode || elements.licenceKey.value.trim(),
      activationDate: elements.licenceActivationDate.value,
      expiryDate: elements.licenceExpiryDate.value,
      allowedFeatures: rules.allowedFeatures || [],
      maxProducts: rules.maxProducts,
      maxCustomers: rules.maxCustomers,
      maxEmployees: rules.maxEmployees,
      maxSavedDocuments: rules.maxSavedDocuments,
      watermarkEnabled: !!rules.watermarkEnabled,
      onlineActivationReady: elements.onlineActivationReady.value === "true"
    });
    saveToStorage(STORAGE_KEYS.licence, state.licence);
    fillLicenceForm();
    updateWorkspace();
    showStatus("Owner control settings saved locally.");
  }

  function createDefaultEmployee() {
    return {
      employeeId: "",
      employeeCode: "",
      fullName: "",
      role: "cashier",
      accessCode: "",
      phone: "",
      email: "",
      activeStatus: "active",
      createdAt: "",
      updatedAt: ""
    };
  }

  function resetEmployeeForm() {
    editing.employeeId = "";
    fillEmployeeForm(createDefaultEmployee());
  }

  function fillEmployeeForm(employee) {
    elements.employeeCode.value = employee.employeeCode || "";
    elements.employeeFullName.value = employee.fullName || "";
    elements.employeeRole.value = employee.role || "cashier";
    elements.employeeAccessCode.value = employee.accessCode || "";
    elements.employeePhone.value = employee.phone || "";
    elements.employeeEmail.value = employee.email || "";
    elements.employeeActiveStatus.value = employee.activeStatus || "active";
  }

  function saveEmployee() {
    if (isLimitReached("employees", editing.employeeId)) {
      return;
    }
    const fullName = elements.employeeFullName.value.trim();
    if (!fullName) {
      showStatus("Enter the employee full name before saving.");
      return;
    }
    const now = nowIso();
    const employee = {
      employeeId: editing.employeeId || generateId("emp"),
      employeeCode: elements.employeeCode.value.trim() || ("EMP-" + String(state.employees.length + 1).padStart(3, "0")),
      fullName: fullName,
      role: elements.employeeRole.value,
      accessCode: elements.employeeAccessCode.value.trim(),
      phone: elements.employeePhone.value.trim(),
      email: elements.employeeEmail.value.trim(),
      activeStatus: elements.employeeActiveStatus.value,
      createdAt: editing.employeeId ? findById(state.employees, "employeeId", editing.employeeId).createdAt : now,
      updatedAt: now
    };
    upsert(state.employees, employee, "employeeId");
    saveToStorage(STORAGE_KEYS.employees, state.employees);
    if (!state.currentEmployeeId || employee.activeStatus === "active") {
      state.currentEmployeeId = employee.employeeId;
      localStorage.setItem(STORAGE_KEYS.currentEmployeeId, state.currentEmployeeId);
    }
    resetEmployeeForm();
    renderEmployees();
    updateSessionUI();
    updateWorkspace();
    showStatus("Employee saved locally.");
  }

  function handleCurrentEmployeeChange() {
    state.currentEmployeeId = elements.currentEmployeeId.value;
    localStorage.setItem(STORAGE_KEYS.currentEmployeeId, state.currentEmployeeId);
    updateSessionUI();
    updateWorkspace();
    showStatus("Current cashier session updated.");
  }

  function handleEmployeeActions(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    const employeeId = button.getAttribute("data-id");
    const employee = findById(state.employees, "employeeId", employeeId);
    if (!employee) {
      return;
    }
    if (button.getAttribute("data-action") === "edit") {
      editing.employeeId = employee.employeeId;
      fillEmployeeForm(employee);
      return;
    }
    employee.activeStatus = employee.activeStatus === "active" ? "inactive" : "active";
    employee.updatedAt = nowIso();
    saveToStorage(STORAGE_KEYS.employees, state.employees);
    ensureCurrentEmployee();
    renderEmployees();
    updateSessionUI();
    updateWorkspace();
    showStatus("Employee status updated.");
  }

  function ensureCurrentEmployee() {
    const activeEmployees = state.employees.filter(function (employee) {
      return employee.activeStatus === "active";
    });
    if (state.currentEmployeeId && findById(activeEmployees, "employeeId", state.currentEmployeeId)) {
      return;
    }
    state.currentEmployeeId = activeEmployees.length ? activeEmployees[0].employeeId : "";
    localStorage.setItem(STORAGE_KEYS.currentEmployeeId, state.currentEmployeeId);
  }

  function createDefaultCustomer() {
    return {
      customerId: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      taxId: "",
      customerType: "",
      notes: "",
      referenceNumber: "",
      createdAt: "",
      updatedAt: ""
    };
  }

  function resetCustomerForm() {
    editing.customerId = "";
    fillCustomerForm(createDefaultCustomer());
    elements.customerPicker.value = "";
  }

  function fillCustomerForm(customer) {
    elements.customerName.value = customer.name || "";
    elements.customerPhone.value = customer.phone || "";
    elements.customerEmail.value = customer.email || "";
    elements.customerTaxId.value = customer.taxId || "";
    elements.customerType.value = customer.customerType || "";
    elements.customerReferenceNumber.value = customer.referenceNumber || "";
    elements.customerAddress.value = customer.address || "";
    elements.customerNotes.value = customer.notes || "";
  }

  function saveCustomer() {
    if (isLimitReached("customers", editing.customerId)) {
      return;
    }
    const name = elements.customerName.value.trim();
    if (!name) {
      showStatus("Enter the customer name before saving.");
      return;
    }
    const now = nowIso();
    const customer = {
      customerId: editing.customerId || generateId("cus"),
      name: name,
      phone: elements.customerPhone.value.trim(),
      email: elements.customerEmail.value.trim(),
      address: elements.customerAddress.value.trim(),
      taxId: elements.customerTaxId.value.trim(),
      customerType: elements.customerType.value.trim(),
      notes: elements.customerNotes.value.trim(),
      referenceNumber: elements.customerReferenceNumber.value.trim(),
      createdAt: editing.customerId ? findById(state.customers, "customerId", editing.customerId).createdAt : now,
      updatedAt: now
    };
    upsert(state.customers, customer, "customerId");
    saveToStorage(STORAGE_KEYS.customers, state.customers);
    editing.customerId = customer.customerId;
    renderCustomers();
    elements.documentCustomerId.value = customer.customerId;
    updateWorkspace();
    showStatus("Customer saved locally.");
  }

  function handleCustomerPickerChange() {
    const customer = findById(state.customers, "customerId", elements.customerPicker.value);
    if (!customer) {
      return;
    }
    editing.customerId = customer.customerId;
    fillCustomerForm(customer);
  }

  function handleCustomerActions(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    const customer = findById(state.customers, "customerId", button.getAttribute("data-id"));
    if (!customer) {
      return;
    }
    if (button.getAttribute("data-action") === "edit") {
      editing.customerId = customer.customerId;
      elements.customerPicker.value = customer.customerId;
      fillCustomerForm(customer);
      return;
    }
    if (button.getAttribute("data-action") === "use") {
      elements.documentCustomerId.value = customer.customerId;
      updateWorkspace();
      showStatus("Customer selected for the current document.");
    }
  }

  function createDefaultProduct() {
    return {
      productId: "",
      itemCode: "",
      barcode: "",
      type: "product",
      name: "",
      description: "",
      category: "",
      unit: "",
      defaultSellingPrice: 0,
      costPrice: 0,
      taxRate: state && state.businessProfile ? parseNumber(state.businessProfile.taxDefaultPercent) : 0,
      stockTrackingEnabled: true,
      serviceTrackingEnabled: false,
      activeStatus: "active",
      reorderLevel: 0,
      createdAt: "",
      updatedAt: ""
    };
  }

  function resetProductForm() {
    editing.productId = "";
    fillProductForm(createDefaultProduct());
  }

  function fillProductForm(product) {
    elements.productSku.value = product.itemCode || "";
    elements.productBarcode.value = product.barcode || "";
    elements.productType.value = product.type || "product";
    elements.productName.value = product.name || "";
    elements.productDescription.value = product.description || "";
    elements.productCategory.value = product.category || "";
    elements.productUnit.value = product.unit || "";
    elements.productUnitPrice.value = normaliseNumber(product.defaultSellingPrice);
    elements.productCostPrice.value = normaliseNumber(product.costPrice);
    elements.productTaxPercent.value = normaliseNumber(product.taxRate);
    elements.productStockTrackingEnabled.value = product.stockTrackingEnabled ? "yes" : "no";
    elements.productServiceTrackingEnabled.value = product.serviceTrackingEnabled ? "yes" : "no";
    elements.productReorderLevel.value = normaliseNumber(product.reorderLevel);
    elements.productActiveStatus.value = product.activeStatus || "active";
  }

  function saveProduct() {
    if (isLimitReached("products", editing.productId)) {
      return;
    }
    const name = elements.productName.value.trim();
    if (!name) {
      showStatus("Enter the product or service name before saving.");
      return;
    }
    const now = nowIso();
    const product = {
      productId: editing.productId || generateId("prd"),
      itemCode: elements.productSku.value.trim() || ("SKU-" + String(state.products.length + 1).padStart(4, "0")),
      barcode: elements.productBarcode.value.trim(),
      type: elements.productType.value,
      name: name,
      description: elements.productDescription.value.trim(),
      category: elements.productCategory.value.trim(),
      unit: elements.productUnit.value.trim(),
      defaultSellingPrice: parseNumber(elements.productUnitPrice.value),
      costPrice: parseNumber(elements.productCostPrice.value),
      taxRate: parseNumber(elements.productTaxPercent.value || state.businessProfile.taxDefaultPercent),
      stockTrackingEnabled: elements.productStockTrackingEnabled.value === "yes" && elements.productType.value === "product",
      serviceTrackingEnabled: elements.productServiceTrackingEnabled.value === "yes",
      activeStatus: elements.productActiveStatus.value,
      reorderLevel: parseNumber(elements.productReorderLevel.value),
      createdAt: editing.productId ? findById(state.products, "productId", editing.productId).createdAt : now,
      updatedAt: now
    };
    upsert(state.products, product, "productId");
    saveToStorage(STORAGE_KEYS.products, state.products);
    resetProductForm();
    renderProducts();
    renderBatchSelectors();
    updateWorkspace();
    showStatus("Product or service saved locally.");
  }

  function handleProductActions(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    const product = findById(state.products, "productId", button.getAttribute("data-id"));
    if (!product) {
      return;
    }
    const action = button.getAttribute("data-action");
    if (action === "edit") {
      editing.productId = product.productId;
      fillProductForm(product);
      return;
    }
    if (action === "add") {
      addProductToCart(product.productId);
      return;
    }
    if (action === "batch") {
      elements.batchProductId.value = product.productId;
      renderBatchSummary();
      renderBatchList();
      renderMovementList();
      return;
    }
    product.activeStatus = product.activeStatus === "active" ? "inactive" : "active";
    product.updatedAt = nowIso();
    saveToStorage(STORAGE_KEYS.products, state.products);
    renderProducts();
    updateWorkspace();
    showStatus("Product status updated.");
  }

  function createDefaultBatch() {
    return {
      batchId: "",
      productId: "",
      batchNumber: "",
      purchaseDate: todayDate(),
      expiryDate: "",
      initialQuantity: 0,
      quantityAvailable: 0,
      unitCost: 0,
      sellingPriceOverride: 0,
      supplierName: "",
      notes: "",
      activeStatus: "active",
      createdAt: "",
      updatedAt: ""
    };
  }

  function resetBatchForm() {
    editing.batchId = "";
    fillBatchForm(createDefaultBatch());
  }

  function fillBatchForm(batch) {
    elements.batchProductId.value = batch.productId || elements.batchProductId.value || "";
    elements.batchNumber.value = batch.batchNumber || "";
    elements.batchPurchaseDate.value = batch.purchaseDate || todayDate();
    elements.batchExpiryDate.value = batch.expiryDate || "";
    elements.batchInitialQuantity.value = normaliseNumber(batch.initialQuantity);
    elements.batchQuantityAvailable.value = normaliseNumber(batch.quantityAvailable);
    elements.batchUnitCost.value = normaliseNumber(batch.unitCost);
    elements.batchSellingPriceOverride.value = normaliseNumber(batch.sellingPriceOverride);
    elements.batchSupplierName.value = batch.supplierName || "";
    elements.batchNotes.value = batch.notes || "";
    elements.batchActiveStatus.value = batch.activeStatus || "active";
  }

  function saveBatch() {
    const productId = elements.batchProductId.value;
    const product = findById(state.products, "productId", productId);
    if (!product) {
      showStatus("Select a product before saving a batch.");
      return;
    }
    const quantityAvailable = parseNumber(elements.batchQuantityAvailable.value);
    const initialQuantity = parseNumber(elements.batchInitialQuantity.value);
    const now = nowIso();
    const existing = editing.batchId ? findById(state.batches, "batchId", editing.batchId) : null;
    const batch = {
      batchId: editing.batchId || generateId("bat"),
      productId: productId,
      batchNumber: elements.batchNumber.value.trim() || ("BATCH-" + Date.now().toString().slice(-6)),
      purchaseDate: elements.batchPurchaseDate.value || todayDate(),
      expiryDate: elements.batchExpiryDate.value,
      initialQuantity: initialQuantity,
      quantityAvailable: quantityAvailable,
      unitCost: parseNumber(elements.batchUnitCost.value),
      sellingPriceOverride: parseNumber(elements.batchSellingPriceOverride.value),
      supplierName: elements.batchSupplierName.value.trim(),
      notes: elements.batchNotes.value.trim(),
      activeStatus: elements.batchActiveStatus.value,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now
    };
    upsert(state.batches, batch, "batchId");
    saveToStorage(STORAGE_KEYS.batches, state.batches);
    if (!existing) {
      recordStockMovement({
        productId: product.productId,
        batchId: batch.batchId,
        movementType: "stock-in",
        quantityChange: batch.quantityAvailable,
        quantityBefore: 0,
        quantityAfter: batch.quantityAvailable,
        relatedTransactionId: "",
        relatedDocumentNumber: "",
        employeeId: state.currentEmployeeId,
        notes: "New batch created: " + batch.batchNumber
      });
    } else if (existing.quantityAvailable !== batch.quantityAvailable) {
      recordStockMovement({
        productId: product.productId,
        batchId: batch.batchId,
        movementType: "adjustment",
        quantityChange: batch.quantityAvailable - existing.quantityAvailable,
        quantityBefore: existing.quantityAvailable,
        quantityAfter: batch.quantityAvailable,
        relatedTransactionId: "",
        relatedDocumentNumber: "",
        employeeId: state.currentEmployeeId,
        notes: "Batch quantity adjusted: " + batch.batchNumber
      });
    }
    resetBatchForm();
    renderBatchSummary();
    renderBatchList();
    renderMovementList();
    renderProducts();
    updateWorkspace();
    showStatus("Batch saved locally.");
  }

  function handleBatchActions(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    const batch = findById(state.batches, "batchId", button.getAttribute("data-id"));
    if (!batch) {
      return;
    }
    if (button.getAttribute("data-action") === "edit") {
      editing.batchId = batch.batchId;
      fillBatchForm(batch);
      return;
    }
    batch.activeStatus = batch.activeStatus === "active" ? "inactive" : "active";
    batch.updatedAt = nowIso();
    saveToStorage(STORAGE_KEYS.batches, state.batches);
    renderBatchSummary();
    renderBatchList();
    renderProducts();
    updateWorkspace();
    showStatus("Batch status updated.");
  }

  function fillDraftForm(draft) {
    const employee = getCurrentEmployee();
    elements.documentType.value = draft.documentType;
    elements.documentNumber.value = draft.documentNumber || generateDocumentNumber(draft.documentType);
    elements.documentDate.value = draft.documentDate || todayDate();
    elements.dueDate.value = draft.dueDate || todayDate();
    elements.paymentStatus.value = draft.paymentStatus || "unpaid";
    elements.paymentMethod.value = draft.paymentMethod || "";
    elements.paymentReference.value = draft.paymentReference || "";
    elements.documentCustomerId.value = draft.customerId || "";
    elements.cashierName.value = employee ? employee.fullName : "";
    elements.projectReference.value = draft.projectReference || "";
    elements.relatedDocumentNumber.value = draft.relatedDocumentNumber || "";
    elements.sourceDocumentId.value = draft.sourceDocumentId || "";
    elements.deliveryMethod.value = draft.deliveryMethod || "";
    elements.trackingReference.value = draft.trackingReference || "";
    elements.deliveredBy.value = draft.deliveredBy || "";
    elements.receivedBy.value = draft.receivedBy || "";
    elements.dateReceived.value = draft.dateReceived || "";
    elements.showPricesDeliveryNote.value = draft.showPricesDeliveryNote || "yes";
    elements.deliveryAddress.value = draft.deliveryAddress || "";
    elements.notes.value = draft.notes || "";
    elements.termsConditions.value = draft.termsConditions || defaultTermsForType(draft.documentType);
    elements.documentDiscountPercent.value = normaliseNumber(draft.documentDiscountPercent);
    elements.documentDiscountAmount.value = normaliseNumber(draft.documentDiscountAmount);
    elements.shippingCharge.value = normaliseNumber(draft.shippingCharge);
    elements.serviceCharge.value = normaliseNumber(draft.serviceCharge);
    elements.otherCharges.value = normaliseNumber(draft.otherCharges);
    elements.roundingAdjustment.value = normaliseNumber(draft.roundingAdjustment);
    elements.amountReceived.value = normaliseNumber(draft.amountReceived);
    elements.amountPaid.value = normaliseNumber(draft.amountPaid);
    renderLineItems(draft.items && draft.items.length ? draft.items : [createDefaultLineItem()]);
    syncDocumentTypeLabels(draft.documentType);
  }

  function collectDraftFromForm() {
    const employee = getCurrentEmployee();
    return normaliseDocument({
      transactionId: editing.transactionId || "",
      documentType: elements.documentType.value,
      documentNumber: elements.documentNumber.value.trim() || generateDocumentNumber(elements.documentType.value),
      documentDate: elements.documentDate.value || todayDate(),
      dueDate: elements.dueDate.value || todayDate(),
      paymentStatus: elements.paymentStatus.value,
      paymentMethod: elements.paymentMethod.value,
      paymentReference: elements.paymentReference.value.trim(),
      customerId: elements.documentCustomerId.value,
      employeeId: employee ? employee.employeeId : "",
      cashierName: employee ? employee.fullName : "",
      projectReference: elements.projectReference.value.trim(),
      relatedDocumentNumber: elements.relatedDocumentNumber.value.trim(),
      sourceDocumentId: elements.sourceDocumentId.value,
      deliveryMethod: elements.deliveryMethod.value.trim(),
      trackingReference: elements.trackingReference.value.trim(),
      deliveredBy: elements.deliveredBy.value.trim(),
      receivedBy: elements.receivedBy.value.trim(),
      dateReceived: elements.dateReceived.value,
      showPricesDeliveryNote: elements.showPricesDeliveryNote.value,
      deliveryAddress: elements.deliveryAddress.value.trim(),
      notes: elements.notes.value.trim(),
      termsConditions: elements.termsConditions.value.trim(),
      documentDiscountPercent: elements.documentDiscountPercent.value,
      documentDiscountAmount: elements.documentDiscountAmount.value,
      shippingCharge: elements.shippingCharge.value,
      serviceCharge: elements.serviceCharge.value,
      otherCharges: elements.otherCharges.value,
      roundingAdjustment: elements.roundingAdjustment.value,
      amountReceived: elements.amountReceived.value,
      amountPaid: elements.amountPaid.value,
      items: collectLineItems()
    });
  }

  function handleDocumentTypeChange() {
    syncDocumentTypeLabels(elements.documentType.value);
    if (!elements.termsConditions.value.trim()) {
      elements.termsConditions.value = defaultTermsForType(elements.documentType.value);
    }
    if (!elements.documentNumber.value.trim() || elements.documentNumber.value.indexOf("-") > -1) {
      elements.documentNumber.value = generateDocumentNumber(elements.documentType.value);
    }
    if (elements.documentType.value === "receipt" && elements.paymentStatus.value === "unpaid") {
      elements.paymentStatus.value = "paid";
    }
    updateWorkspace();
  }

  function syncDocumentTypeLabels(documentType) {
    if (documentType === "quotation") {
      applyText(elements.dueDateLabel, "Valid until");
    } else if (documentType === "deliveryNote") {
      applyText(elements.dueDateLabel, "Delivery / reference date");
    } else {
      applyText(elements.dueDateLabel, "Due date");
    }
  }

  function syncSourceDocumentSelection() {
    const source = findById(state.transactions, "transactionId", elements.sourceDocumentId.value);
    if (!source) {
      return;
    }
    elements.relatedDocumentNumber.value = source.documentNumber || "";
    if (!elements.documentCustomerId.value && source.customerId) {
      elements.documentCustomerId.value = source.customerId;
    }
    updateWorkspace();
  }

  function addProductToCart(productId, selectedBatchId) {
    const product = findById(state.products, "productId", productId);
    if (!product) {
      return;
    }
    const draft = collectDraftFromForm();
    if (cartHasOnlyPlaceholder(draft.items)) {
      draft.items = [];
    }
    const batchId = selectedBatchId || firstBatchIdForProduct(product.productId);
    const existingLine = draft.items.find(function (item) {
      return item.productId === product.productId && (item.batchId || "") === (batchId || "");
    });
    if (existingLine) {
      existingLine.quantity = parseNumber(existingLine.quantity) + 1;
      existingLine.quantityDelivered = parseNumber(existingLine.quantityDelivered) + 1;
    } else {
      draft.items.push(normaliseLineItem({
        productId: product.productId,
        batchId: batchId,
        sku: product.itemCode,
        barcode: product.barcode,
        type: product.type,
        name: product.name,
        description: product.description,
        quantity: 1,
        unit: product.unit,
        unitPrice: product.defaultSellingPrice,
        costPrice: product.costPrice,
        discountPercent: 0,
        discountAmount: 0,
        taxPercent: product.taxRate,
        quantityDelivered: 1,
        remarks: "",
        stockTrackingEnabled: !!product.stockTrackingEnabled
      }));
    }
    renderLineItems(draft.items);
    updateWorkspace();
    showStatus((product.name || "Item") + " added to cart.");
  }

  function renderLineItems(items) {
    elements.lineItemsBody.innerHTML = "";
    items.forEach(function (item) {
      const rowItem = normaliseLineItem(item);
      const effectiveTaxPercent = resolveEffectiveTaxPercent(rowItem);
      const row = elements.lineItemTemplate.content.firstElementChild.cloneNode(true);
      row.dataset.lineId = rowItem.lineId;
      row.dataset.productId = rowItem.productId || "";
      row.dataset.barcode = rowItem.barcode || "";
      row.dataset.type = rowItem.type || "service";
      row.dataset.costPrice = String(rowItem.costPrice || 0);
      row.dataset.stockTrackingEnabled = rowItem.stockTrackingEnabled ? "yes" : "no";

      populateLineProductSelect(row.querySelector("[data-field='productId']"), rowItem.productId);
      row.querySelector("[data-field='sku']").value = rowItem.sku || "";
      row.querySelector("[data-field='name']").value = rowItem.name || "";
      row.querySelector("[data-field='description']").value = rowItem.description || "";
      row.querySelector("[data-field='quantity']").value = rowItem.quantity ? normaliseNumber(rowItem.quantity) : "0";
      row.querySelector("[data-field='unit']").value = rowItem.unit || "";
      row.querySelector("[data-field='unitPrice']").value = normaliseNumber(rowItem.unitPrice);
      row.querySelector("[data-field='discountPercent']").value = normaliseNumber(rowItem.discountPercent);
      row.querySelector("[data-field='discountAmount']").value = normaliseNumber(rowItem.discountAmount);
      row.querySelector("[data-field='taxPercent']").value = normaliseNumber(effectiveTaxPercent);
      row.querySelector("[data-field='remarks']").value = rowItem.remarks || "";
      populateBatchSelect(row.querySelector("[data-field='batchId']"), rowItem.productId, rowItem.batchId);
      elements.lineItemsBody.appendChild(row);
    });
  }

  function populateLineProductSelect(select, chosenProductId) {
    const options = [{ value: "", label: "Custom manual item / service" }]
      .concat(state.products.filter(function (product) {
        return product.activeStatus === "active";
      }).map(function (product) {
        const stockLabel = product.stockTrackingEnabled ? " | Stock " + normaliseNumber(getAvailableStock(product.productId)) : " | Service";
        return {
          value: product.productId,
          label: product.name + " (" + product.itemCode + ")" + stockLabel
        };
      }));
    populateSelect(select, options);
    select.value = chosenProductId || "";
  }

  function populateBatchSelect(select, productId, chosenBatchId) {
    const options = [{ value: "", label: productId ? "Auto FIFO" : "No batch" }];
    if (productId) {
      getProductBatches(productId).forEach(function (batch) {
        options.push({
          value: batch.batchId,
          label: batch.batchNumber + " (" + normaliseNumber(batch.quantityAvailable) + " available)"
        });
      });
    }
    populateSelect(select, options);
    select.value = chosenBatchId || "";
  }

  function collectLineItems() {
    return Array.from(elements.lineItemsBody.querySelectorAll(".line-item-card")).map(function (row) {
      const rowProductId = row.querySelector("[data-field='productId']").value;
      const rawTaxPercent = row.querySelector("[data-field='taxPercent']").value;
      const resolvedTaxPercent = resolveEffectiveTaxPercent({
        productId: rowProductId,
        taxPercent: rawTaxPercent
      });
      row.querySelector("[data-field='taxPercent']").value = normaliseNumber(resolvedTaxPercent);
      return normaliseLineItem({
        lineId: row.dataset.lineId,
        productId: rowProductId,
        batchId: row.querySelector("[data-field='batchId']").value,
        sku: row.querySelector("[data-field='sku']").value.trim(),
        barcode: row.dataset.barcode || "",
        type: row.dataset.type || "service",
        name: row.querySelector("[data-field='name']").value.trim(),
        description: row.querySelector("[data-field='description']").value.trim(),
        quantity: row.querySelector("[data-field='quantity']").value,
        unit: row.querySelector("[data-field='unit']").value.trim(),
        unitPrice: row.querySelector("[data-field='unitPrice']").value,
        costPrice: row.dataset.costPrice || 0,
        discountPercent: row.querySelector("[data-field='discountPercent']").value,
        discountAmount: row.querySelector("[data-field='discountAmount']").value,
        taxPercent: resolvedTaxPercent,
        quantityDelivered: row.querySelector("[data-field='quantity']").value,
        remarks: row.querySelector("[data-field='remarks']").value.trim(),
        stockTrackingEnabled: row.dataset.stockTrackingEnabled === "yes"
      });
    });
  }

  function handleLineItemFieldChange(event) {
    const field = event.target;
    const row = field.closest(".line-item-card");
    if (!row) {
      updateWorkspace();
      return;
    }
    if (field.getAttribute("data-field") === "productId") {
      applySelectedProductToRow(row, field.value);
      updateWorkspace();
      return;
    }
    if (field.getAttribute("data-field") === "batchId") {
      row.dataset.productId = row.querySelector("[data-field='productId']").value || "";
    }
    updateWorkspace();
  }

  function applySelectedProductToRow(row, productId) {
    const product = findById(state.products, "productId", productId);
    if (!product) {
      row.dataset.productId = "";
      row.dataset.barcode = "";
      row.dataset.type = "service";
      row.dataset.costPrice = "0";
      row.dataset.stockTrackingEnabled = "no";
      populateBatchSelect(row.querySelector("[data-field='batchId']"), "", "");
      return;
    }
    row.dataset.productId = product.productId;
    row.dataset.barcode = product.barcode || "";
    row.dataset.type = product.type || "service";
    row.dataset.costPrice = String(product.costPrice || 0);
    row.dataset.stockTrackingEnabled = product.stockTrackingEnabled ? "yes" : "no";
    row.querySelector("[data-field='sku']").value = product.itemCode || "";
    row.querySelector("[data-field='name']").value = product.name || "";
    row.querySelector("[data-field='description']").value = product.description || "";
    row.querySelector("[data-field='unit']").value = product.unit || "";
    row.querySelector("[data-field='unitPrice']").value = normaliseNumber(product.defaultSellingPrice);
    row.querySelector("[data-field='taxPercent']").value = normaliseNumber(product.taxRate || state.businessProfile.taxDefaultPercent || 0);
    populateBatchSelect(row.querySelector("[data-field='batchId']"), product.productId, firstBatchIdForProduct(product.productId));
  }

  function handleLineItemActions(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    const row = button.closest(".line-item-card");
    const draft = collectDraftFromForm();
    const index = Array.from(elements.lineItemsBody.children).indexOf(row);
    if (index < 0) {
      return;
    }
    if (button.getAttribute("data-action") === "duplicate") {
      draft.items.splice(index + 1, 0, normaliseLineItem(draft.items[index]));
      draft.items[index + 1].lineId = generateId("line");
      renderLineItems(draft.items);
      updateWorkspace();
      return;
    }
    draft.items.splice(index, 1);
    if (!draft.items.length) {
      draft.items.push(createDefaultLineItem());
    }
    renderLineItems(draft.items);
    updateWorkspace();
  }

  function clearCart() {
    if (!window.confirm("Clear all cart items from the current document?")) {
      return;
    }
    const draft = collectDraftFromForm();
    draft.items = [createDefaultLineItem()];
    renderLineItems(draft.items);
    updateWorkspace();
    showStatus("Cart cleared.");
  }

  function calculateLineItem(item) {
    const quantity = Math.max(0, parseNumber(item.quantity));
    const unitPrice = Math.max(0, parseNumber(item.unitPrice));
    const lineSubtotal = quantity * unitPrice;
    const percentDiscountValue = lineSubtotal * Math.max(0, parseNumber(item.discountPercent)) / 100;
    const fixedDiscountValue = Math.max(0, parseNumber(item.discountAmount));
    const lineDiscountTotal = Math.min(lineSubtotal, percentDiscountValue + fixedDiscountValue);
    const taxableLineBeforeDocumentDiscount = Math.max(0, lineSubtotal - lineDiscountTotal);
    const taxPercent = resolveEffectiveTaxPercent(item);
    const taxAmount = taxableLineBeforeDocumentDiscount * taxPercent / 100;
    const lineTotal = Math.max(0, taxableLineBeforeDocumentDiscount + taxAmount);
    return Object.assign({}, item, {
      quantity: quantity,
      unitPrice: unitPrice,
      discountPercent: Math.max(0, parseNumber(item.discountPercent)),
      discountAmount: Math.max(0, parseNumber(item.discountAmount)),
      taxPercent: taxPercent,
      lineSubtotal: roundMoney(lineSubtotal),
      lineDiscountTotal: roundMoney(lineDiscountTotal),
      taxableLineBeforeDocumentDiscount: roundMoney(taxableLineBeforeDocumentDiscount),
      taxableLine: roundMoney(taxableLineBeforeDocumentDiscount),
      documentDiscountShare: 0,
      taxAmount: roundMoney(taxAmount),
      lineTotal: roundMoney(lineTotal),
      stockAvailable: roundMoney(getAvailableStock(item.productId, item.batchId))
    });
  }

  function calculateDocument(draft) {
    const baseItems = (draft.items || []).map(calculateLineItem);
    const meaningfulBaseItems = baseItems.filter(isMeaningfulItem);
    const subtotalBeforeDiscount = sum(meaningfulBaseItems, "lineSubtotal");
    const lineDiscountTotal = sum(meaningfulBaseItems, "lineDiscountTotal");
    const subtotalAfterLineDiscount = Math.max(0, subtotalBeforeDiscount - lineDiscountTotal);
    const documentDiscountPercentValue = subtotalAfterLineDiscount * Math.max(0, parseNumber(draft.documentDiscountPercent)) / 100;
    const documentDiscountAmountValue = Math.max(0, parseNumber(draft.documentDiscountAmount));
    const documentDiscount = Math.min(subtotalAfterLineDiscount, documentDiscountPercentValue + documentDiscountAmountValue);
    let distributedDiscount = 0;
    const items = baseItems.map(function (item) {
      if (!isMeaningfulItem(item) || !subtotalAfterLineDiscount || !documentDiscount) {
        return Object.assign({}, item);
      }
      const remainingDiscount = documentDiscount - distributedDiscount;
      const proportionalDiscount = meaningfulBaseItems.indexOf(item) === meaningfulBaseItems.length - 1
        ? remainingDiscount
        : roundMoney(documentDiscount * (item.taxableLineBeforeDocumentDiscount / subtotalAfterLineDiscount));
      const safeDocumentDiscountShare = Math.min(item.taxableLineBeforeDocumentDiscount, Math.max(0, proportionalDiscount));
      distributedDiscount += safeDocumentDiscountShare;
      const taxableLine = Math.max(0, item.taxableLineBeforeDocumentDiscount - safeDocumentDiscountShare);
      const taxAmount = taxableLine * item.taxPercent / 100;
      const lineTotal = taxableLine + taxAmount;
      return Object.assign({}, item, {
        documentDiscountShare: roundMoney(safeDocumentDiscountShare),
        taxableLine: roundMoney(taxableLine),
        taxAmount: roundMoney(taxAmount),
        lineTotal: roundMoney(lineTotal)
      });
    });
    const meaningfulItems = items.filter(isMeaningfulItem);
    const taxableSubtotal = sum(meaningfulItems, "taxableLine");
    const totalTax = sum(meaningfulItems, "taxAmount");
    const shippingCharge = Math.max(0, parseNumber(draft.shippingCharge));
    const serviceCharge = Math.max(0, parseNumber(draft.serviceCharge));
    const otherCharges = Math.max(0, parseNumber(draft.otherCharges));
    const roundingAdjustment = parseNumber(draft.roundingAdjustment);
    const grandTotal = Math.max(0, taxableSubtotal + totalTax + shippingCharge + serviceCharge + otherCharges + roundingAdjustment);
    const amountReceived = Math.max(0, parseNumber(draft.amountReceived));
    const amountPaid = Math.max(0, parseNumber(draft.amountPaid));
    const settledAmount = Math.min(grandTotal, Math.max(amountPaid, amountReceived));
    const changeGiven = Math.max(0, amountReceived - grandTotal);
    const balanceDue = Math.max(0, grandTotal - settledAmount);
    const warnings = collectStockWarnings(meaningfulItems);
    return {
      items: items,
      totals: {
        itemsCount: meaningfulItems.length,
        totalQuantity: roundMoney(sum(meaningfulItems, "quantity")),
        subtotalBeforeDiscount: roundMoney(subtotalBeforeDiscount),
        lineDiscountTotal: roundMoney(lineDiscountTotal),
        documentDiscountPercent: Math.max(0, parseNumber(draft.documentDiscountPercent)),
        documentDiscountAmount: roundMoney(documentDiscount),
        taxableSubtotal: roundMoney(taxableSubtotal),
        totalTax: roundMoney(totalTax),
        shippingCharge: roundMoney(shippingCharge),
        serviceCharge: roundMoney(serviceCharge),
        otherCharges: roundMoney(otherCharges),
        roundingAdjustment: roundMoney(roundingAdjustment),
        grandTotal: roundMoney(grandTotal),
        amountReceived: roundMoney(amountReceived),
        amountPaid: roundMoney(amountPaid),
        changeGiven: roundMoney(changeGiven),
        balanceDue: roundMoney(balanceDue)
      },
      warnings: warnings
    };
  }

  function resolveEffectiveTaxPercent(item) {
    const defaultTaxPercent = parseNumber((state.businessProfile || {}).taxDefaultPercent);
    const enteredTaxPercent = Math.max(0, parseNumber((item || {}).taxPercent));
    const productId = (item || {}).productId || "";
    if (productId) {
      const product = findById(state.products, "productId", productId);
      if (product) {
        return Math.max(0, parseNumber(product.taxRate || defaultTaxPercent));
      }
    }
    return enteredTaxPercent || defaultTaxPercent;
  }

  function collectStockWarnings(items) {
    return items.filter(function (item) {
      return item.stockTrackingEnabled && item.quantity > item.stockAvailable;
    }).map(function (item) {
      return item.name + " requested " + normaliseNumber(item.quantity) + " but only " + normaliseNumber(item.stockAvailable) + " is available.";
    });
  }

  function updateWorkspace() {
    syncCurrencyVisibility();
    const employee = getCurrentEmployee();
    elements.cashierName.value = employee ? employee.fullName : "";
    updateSessionUI();
    const draft = collectDraftFromForm();
    state.draftDocument = draft;
    saveToStorage(STORAGE_KEYS.draftDocument, draft);
    const result = calculateDocument(draft);
    syncLineItemOutputs(result.items);
    renderDashboard();
    renderPreview(draft, result);
    renderHistory();
    renderBatchSummary();
    renderMovementList();
    renderProducts();
    renderPosProductResults();
    updateMetrics(result.totals);
    const warning = result.warnings[0];
    if (warning) {
      showStatus(warning);
    }
  }

  function syncLineItemOutputs(items) {
    Array.from(elements.lineItemsBody.querySelectorAll(".line-item-card")).forEach(function (row, index) {
      const item = items[index];
      if (!item) {
        return;
      }
      applyText(row.querySelector("[data-field='taxAmount']"), item.taxAmount.toFixed(2));
      applyText(row.querySelector("[data-field='lineTotal']"), item.lineTotal.toFixed(2));
      const stockOutput = row.querySelector("[data-field='stockAvailable']");
      applyText(stockOutput, item.stockAvailable.toFixed(2));
      stockOutput.classList.toggle("stock-warning", item.stockTrackingEnabled && item.quantity > item.stockAvailable);
    });
  }

  function updateMetrics(totals) {
    applyText(elements.metricItemsCount, String(totals.itemsCount));
    applyText(elements.metricTotalQuantity, normaliseNumber(totals.totalQuantity));
    applyText(elements.metricSubtotalBeforeDiscount, formatCurrency(totals.subtotalBeforeDiscount));
    applyText(elements.metricTotalLineDiscount, formatCurrency(totals.lineDiscountTotal));
    applyText(elements.metricDocumentDiscount, formatCurrency(totals.documentDiscountAmount));
    applyText(elements.metricTaxableSubtotal, formatCurrency(totals.taxableSubtotal));
    applyText(elements.metricTotalTax, formatCurrency(totals.totalTax));
    applyText(elements.metricShippingCharge, formatCurrency(totals.shippingCharge));
    applyText(elements.metricServiceCharge, formatCurrency(totals.serviceCharge));
    applyText(elements.metricOtherCharges, formatCurrency(totals.otherCharges));
    applyText(elements.metricRoundingAdjustment, formatCurrency(totals.roundingAdjustment));
    applyText(elements.metricGrandTotal, formatCurrency(totals.grandTotal));
    applyText(elements.metricAmountReceived, formatCurrency(totals.amountReceived));
    applyText(elements.metricAmountPaid, formatCurrency(totals.amountPaid));
    applyText(elements.metricChangeGiven, formatCurrency(totals.changeGiven));
    applyText(elements.metricBalanceDue, formatCurrency(totals.balanceDue));
  }

  function renderDashboard() {
    const today = todayDate();
    let todaysSales = 0;
    let todaysTransactions = 0;
    let openBalances = 0;
    state.transactions.forEach(function (transaction) {
      const totals = transaction.totals || calculateDocument(normaliseDocument({
        items: transaction.items,
        documentDiscountPercent: transaction.documentDiscountPercent,
        documentDiscountAmount: transaction.documentDiscountAmount,
        shippingCharge: transaction.shippingCharge,
        serviceCharge: transaction.serviceCharge,
        otherCharges: transaction.otherCharges,
        roundingAdjustment: transaction.roundingAdjustment,
        amountReceived: transaction.payment ? transaction.payment.amountReceived : 0,
        amountPaid: transaction.payment ? transaction.payment.amountPaid : 0
      })).totals;
      openBalances += totals.balanceDue;
      if (transaction.documentDate === today) {
        todaysTransactions += 1;
        if (transaction.documentType !== "quotation") {
          todaysSales += totals.grandTotal;
        }
      }
    });
    applyText(elements.summaryTodaysSales, formatCurrency(todaysSales));
    applyText(elements.summaryTransactions, String(todaysTransactions));
    applyText(elements.summaryUnpaid, formatCurrency(openBalances));
    applyText(elements.summaryStock, normaliseNumber(totalTrackedStock()));
    applyText(elements.dashboardCashier, (getCurrentEmployee() || {}).fullName || "-");
    applyText(elements.dashboardStoreName, state.businessProfile.storeName || "-");
    applyText(elements.dashboardCurrency, getActiveCurrency());
    renderLowStockAlerts();
  }

  function renderEmployees() {
    const options = [{ value: "", label: state.employees.length ? "Select active employee" : "Add an employee first" }]
      .concat(state.employees.filter(function (employee) {
        return employee.activeStatus === "active";
      }).map(function (employee) {
        return { value: employee.employeeId, label: employee.fullName + " (" + employee.role + ")" };
      }));
    populateSelect(elements.currentEmployeeId, options);
    elements.currentEmployeeId.value = state.currentEmployeeId || "";

    elements.employeeList.innerHTML = state.employees.map(function (employee) {
      return (
        "<article class='list-card'>" +
          "<div><strong>" + escapeHtml(employee.fullName) + "</strong><p>" + escapeHtml(employee.employeeCode + " | " + employee.role) + "</p><p>" + escapeHtml(employee.accessCode ? "Access code set" : "No access code set") + "</p></div>" +
          "<div class='history-card-actions'>" +
            "<button type='button' class='secondary-button compact-button' data-action='edit' data-id='" + escapeHtml(employee.employeeId) + "'>Edit</button>" +
            "<button type='button' class='secondary-button compact-button' data-action='toggle' data-id='" + escapeHtml(employee.employeeId) + "'>" + (employee.activeStatus === "active" ? "Deactivate" : "Activate") + "</button>" +
          "</div>" +
        "</article>"
      );
    }).join("") || "<p class='helper-text'>No employees added yet.</p>";
  }

  function renderCustomers() {
    const options = [{ value: "", label: state.customers.length ? "Select customer" : "Add a customer first" }]
      .concat(state.customers.map(function (customer) {
        return { value: customer.customerId, label: customer.name + (customer.phone ? " | " + customer.phone : "") };
      }));
    populateSelect(elements.customerPicker, options);
    populateSelect(elements.documentCustomerId, options);

    if (editing.customerId) {
      elements.customerPicker.value = editing.customerId;
    }
    if (state.draftDocument.customerId) {
      elements.documentCustomerId.value = state.draftDocument.customerId;
    }

    elements.customerList.innerHTML = state.customers.map(function (customer) {
      return (
        "<article class='list-card'>" +
          "<div><strong>" + escapeHtml(customer.name) + "</strong><p>" + escapeHtml([customer.phone, customer.email, customer.customerType].filter(Boolean).join(" | ")) + "</p></div>" +
          "<div class='history-card-actions'>" +
            "<button type='button' class='secondary-button compact-button' data-action='use' data-id='" + escapeHtml(customer.customerId) + "'>Use</button>" +
            "<button type='button' class='secondary-button compact-button' data-action='edit' data-id='" + escapeHtml(customer.customerId) + "'>Edit</button>" +
          "</div>" +
        "</article>"
      );
    }).join("") || "<p class='helper-text'>No customers added yet.</p>";
  }

  function renderProducts() {
    const query = elements.productSearch.value.trim().toLowerCase();
    const categoryFilter = elements.productCategoryFilter.value.trim().toLowerCase();
    if (!query && !categoryFilter) {
      elements.productListBody.innerHTML = "<tr><td colspan='9'>Search for a product or filter by category to view inventory.</td></tr>";
      return;
    }
    const filtered = state.products.filter(function (product) {
      const matchesQuery = !query || [product.itemCode, product.barcode, product.name, product.category].join(" ").toLowerCase().indexOf(query) !== -1;
      const matchesCategory = !categoryFilter || (product.category || "").toLowerCase().indexOf(categoryFilter) !== -1;
      return matchesQuery && matchesCategory;
    });
    elements.productListBody.innerHTML = filtered.map(function (product) {
      const stock = getAvailableStock(product.productId);
      const batchCount = getProductBatches(product.productId).length;
      const lowStock = product.stockTrackingEnabled && stock <= parseNumber(product.reorderLevel);
      return (
        "<tr>" +
          "<td>" + escapeHtml(product.itemCode) + "</td>" +
          "<td>" + escapeHtml(product.type) + "</td>" +
          "<td>" + escapeHtml(product.name) + "</td>" +
          "<td>" + escapeHtml(product.category || "-") + "</td>" +
          "<td>" + escapeHtml(formatCurrency(product.defaultSellingPrice)) + "</td>" +
          "<td class='" + (lowStock ? "stock-warning" : "") + "'>" + escapeHtml(normaliseNumber(stock)) + "</td>" +
          "<td>" + escapeHtml(String(batchCount)) + "</td>" +
          "<td>" + escapeHtml(product.activeStatus) + "</td>" +
          "<td><div class='row-actions'>" +
            "<button type='button' class='secondary-button compact-button' data-action='add' data-id='" + escapeHtml(product.productId) + "'>Add to cart</button>" +
            "<button type='button' class='secondary-button compact-button' data-action='batch' data-id='" + escapeHtml(product.productId) + "'>Batches</button>" +
            "<button type='button' class='secondary-button compact-button' data-action='edit' data-id='" + escapeHtml(product.productId) + "'>Edit</button>" +
            "<button type='button' class='danger-button compact-button' data-action='toggle' data-id='" + escapeHtml(product.productId) + "'>" + (product.activeStatus === "active" ? "Deactivate" : "Activate") + "</button>" +
          "</div></td>" +
        "</tr>"
      );
    }).join("") || "<tr><td colspan='9'>No products or services found.</td></tr>";
  }

  function renderPosProductResults() {
    const query = elements.posProductSearch.value.trim().toLowerCase();
    if (!query) {
      elements.posProductResults.innerHTML = "<p class='helper-text'>Search the inventory here to add products or services into the POS cart.</p>";
      return;
    }
    const filtered = state.products.filter(function (product) {
      return product.activeStatus === "active" && [product.itemCode, product.barcode, product.name, product.category].join(" ").toLowerCase().indexOf(query) !== -1;
    }).slice(0, 8);
    elements.posProductResults.innerHTML = filtered.map(function (product) {
      const stock = getAvailableStock(product.productId);
      const lowStock = product.stockTrackingEnabled && stock <= parseNumber(product.reorderLevel);
      const batches = product.stockTrackingEnabled ? getProductBatches(product.productId).slice(0, 4) : [];
      return (
        "<article class='list-card'>" +
          "<div><strong>" + escapeHtml(product.name) + "</strong><p>" + escapeHtml(product.itemCode + " | " + product.type + " | " + formatCurrency(product.defaultSellingPrice)) + "</p><p class='" + (lowStock ? "stock-warning" : "") + "'>" + escapeHtml(product.stockTrackingEnabled ? ("Available stock: " + normaliseNumber(stock)) : "Service item") + "</p>" +
          (batches.length
            ? "<div class='batch-pill-row'>" + batches.map(function (batch) {
                return "<button type='button' class='secondary-button compact-button' data-action='add-batch' data-id='" + escapeHtml(product.productId) + "' data-batch-id='" + escapeHtml(batch.batchId) + "'>" + escapeHtml(batch.batchNumber + " | " + normaliseNumber(batch.quantityAvailable)) + "</button>";
              }).join("") + "</div>"
            : "") +
          "</div>" +
          "<div class='history-card-actions'><button type='button' class='primary-button compact-button' data-action='add' data-id='" + escapeHtml(product.productId) + "'>Add to cart</button></div>" +
        "</article>"
      );
    }).join("") || "<p class='helper-text'>No stocked product or service matched that search.</p>";
    elements.posProductResults.querySelectorAll("button[data-action='add']").forEach(function (button) {
      button.addEventListener("click", function () {
        addProductToCart(button.getAttribute("data-id"));
      });
    });
    elements.posProductResults.querySelectorAll("button[data-action='add-batch']").forEach(function (button) {
      button.addEventListener("click", function () {
        addProductToCart(button.getAttribute("data-id"), button.getAttribute("data-batch-id"));
      });
    });
  }

  function renderBatchSelectors() {
    const productOptions = [{ value: "", label: state.products.length ? "Select product" : "Add a product first" }]
      .concat(state.products.filter(function (product) {
        return product.type === "product";
      }).map(function (product) {
        return { value: product.productId, label: product.name + " (" + product.itemCode + ")" };
      }));
    populateSelect(elements.batchProductId, productOptions);
    if (editing.batchId) {
      const batch = findById(state.batches, "batchId", editing.batchId);
      if (batch) {
        elements.batchProductId.value = batch.productId;
      }
    }
    populateSelect(elements.sourceDocumentId, [{ value: "", label: state.transactions.length ? "Optional source document" : "No source document available yet" }]
      .concat(state.transactions.map(function (tx) {
        return { value: tx.transactionId, label: DOCUMENT_TYPES[tx.documentType] + " " + tx.documentNumber };
      })));
  }

  function renderBatchSummary() {
    const product = findById(state.products, "productId", elements.batchProductId.value);
    if (!product) {
      elements.batchStockSummary.innerHTML = "<p class='helper-text'>Select a product to view batch totals and stock movement.</p>";
      return;
    }
    const batches = getProductBatches(product.productId);
    const totalStock = getAvailableStock(product.productId);
    const stockValue = batches.reduce(function (sumValue, batch) {
      return sumValue + (parseNumber(batch.quantityAvailable) * parseNumber(batch.unitCost));
    }, 0);
    const lowStock = product.stockTrackingEnabled && totalStock <= parseNumber(product.reorderLevel);
    elements.batchStockSummary.innerHTML =
      "<div class='info-grid'>" +
        "<p><strong>Product:</strong> " + escapeHtml(product.name) + "</p>" +
        "<p><strong>Total active stock:</strong> <span class='" + (lowStock ? "stock-warning" : "") + "'>" + escapeHtml(normaliseNumber(totalStock)) + "</span></p>" +
        "<p><strong>Active batches:</strong> " + escapeHtml(String(batches.length)) + "</p>" +
        "<p><strong>Stock value:</strong> " + escapeHtml(formatCurrency(stockValue)) + "</p>" +
        "<p><strong>Reorder level:</strong> " + escapeHtml(normaliseNumber(product.reorderLevel)) + "</p>" +
      "</div>";
  }

  function renderBatchList() {
    const productId = elements.batchProductId.value;
    if (!productId) {
      elements.batchList.innerHTML = "<p class='helper-text'>Select and search for a product first to view its batches.</p>";
      return;
    }
    const batches = getProductBatches(productId);
    elements.batchList.innerHTML = batches.map(function (batch) {
      return (
        "<article class='list-card'>" +
          "<div><strong>" + escapeHtml(batch.batchNumber) + "</strong><p>" +
            escapeHtml("Available: " + normaliseNumber(batch.quantityAvailable) + " | Initial: " + normaliseNumber(batch.initialQuantity) + " | Supplier: " + (batch.supplierName || "-")) +
          "</p></div>" +
          "<div class='history-card-actions'>" +
            "<button type='button' class='secondary-button compact-button' data-action='edit' data-id='" + escapeHtml(batch.batchId) + "'>Edit</button>" +
            "<button type='button' class='secondary-button compact-button' data-action='toggle' data-id='" + escapeHtml(batch.batchId) + "'>" + (batch.activeStatus === "active" ? "Deactivate" : "Activate") + "</button>" +
          "</div>" +
        "</article>"
      );
    }).join("") || "<p class='helper-text'>No batches for this product yet.</p>";
  }

  function renderMovementList() {
    const productId = elements.batchProductId.value;
    if (!productId) {
      elements.stockMovementList.innerHTML = "<p class='helper-text'>Select a product first to view stock movement history.</p>";
      return;
    }
    const entries = state.movements.filter(function (movement) {
      return !productId || movement.productId === productId;
    }).slice(0, 20);
    elements.stockMovementList.innerHTML = entries.map(function (movement) {
      return (
        "<article class='list-card'>" +
          "<div><strong>" + escapeHtml(movement.movementType) + "</strong><p>" +
            escapeHtml("Change: " + normaliseNumber(movement.quantityChange) + " | Before: " + normaliseNumber(movement.quantityBefore) + " | After: " + normaliseNumber(movement.quantityAfter)) +
          "</p><p>" + escapeHtml((movement.relatedDocumentNumber || "-") + " | " + movement.date.slice(0, 19).replace("T", " ")) + "</p></div>" +
        "</article>"
      );
    }).join("") || "<p class='helper-text'>No stock movement entries yet.</p>";
  }

  function renderHistory() {
    if (!state.historyRetrieved) {
      elements.historyList.innerHTML = "<p class='helper-text'>Saved transactions stay hidden to save space. Search and click Retrieve when you need them.</p>";
      return;
    }
    const query = state.historyQuery.trim().toLowerCase();
    const sorted = state.transactions.slice().filter(function (transaction) {
      if (!query) {
        return true;
      }
      const customer = transaction.customerSnapshot ? transaction.customerSnapshot.name : "";
      const employee = transaction.cashierSnapshot ? transaction.cashierSnapshot.fullName : "";
      const haystack = [
        transaction.documentNumber,
        DOCUMENT_TYPES[transaction.documentType] || transaction.documentType,
        customer,
        employee,
        transaction.projectReference,
        transaction.relatedDocumentNumber
      ].join(" ").toLowerCase();
      return haystack.indexOf(query) !== -1;
    }).sort(function (a, b) {
      return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
    }).slice(0, 16);
    elements.historyList.innerHTML = sorted.map(function (transaction) {
      const customer = transaction.customerSnapshot ? transaction.customerSnapshot.name : "No customer";
      const employee = transaction.cashierSnapshot ? transaction.cashierSnapshot.fullName : "-";
      const related = Array.isArray(transaction.relatedDocuments) && transaction.relatedDocuments.length
        ? transaction.relatedDocuments.map(function (entry) { return entry.number; }).join(", ")
        : "-";
      return (
        "<article class='history-card'>" +
          "<h3>" + escapeHtml((DOCUMENT_TYPES[transaction.documentType] || "Document") + " " + (transaction.documentNumber || "")) + "</h3>" +
          "<p>" + escapeHtml(customer) + "</p>" +
          "<p>" + escapeHtml("Total: " + formatCurrency(transaction.totals.grandTotal) + " | Paid: " + formatCurrency(transaction.payment.amountPaid) + " | Balance: " + formatCurrency(transaction.payment.balanceDue)) + "</p>" +
          "<p>" + escapeHtml("Cashier: " + employee + " | Related: " + related) + "</p>" +
          "<div class='history-card-actions'>" +
            "<button type='button' class='secondary-button compact-button' data-action='load' data-id='" + escapeHtml(transaction.transactionId) + "'>Load</button>" +
            "<button type='button' class='secondary-button compact-button' data-action='reprint' data-id='" + escapeHtml(transaction.transactionId) + "'>Reprint</button>" +
            "<button type='button' class='danger-button compact-button' data-action='cancel' data-id='" + escapeHtml(transaction.transactionId) + "'>Cancel</button>" +
            "<button type='button' class='danger-button compact-button' data-action='delete' data-id='" + escapeHtml(transaction.transactionId) + "'>Delete</button>" +
          "</div>" +
        "</article>"
      );
    }).join("") || "<p class='helper-text'>No saved transactions matched that retrieval.</p>";
  }

  function retrieveHistoryResults() {
    state.historyQuery = elements.historySearch.value.trim();
    state.historyRetrieved = true;
    renderHistory();
    showStatus("Saved transactions retrieved.");
  }

  function clearHistoryResults() {
    state.historyQuery = "";
    state.historyRetrieved = false;
    elements.historySearch.value = "";
    renderHistory();
    showStatus("Transaction retrieval list cleared.");
  }

  function newDocument() {
    editing.transactionId = "";
    state.draftDocument = createDefaultDocument();
    fillDraftForm(state.draftDocument);
    updateWorkspace();
    showStatus("New document draft started.");
  }

  function saveDocument() {
    if (!state.currentEmployeeId) {
      showStatus("Add and select a current cashier or employee before saving a document.");
      return;
    }
    if (isLimitReached("transactions", editing.transactionId)) {
      return;
    }
    const draft = collectDraftFromForm();
    if (!draft.customerId) {
      showStatus("Select a customer before saving the document.");
      return;
    }
    const result = calculateDocument(draft);
    if (!draft.items.some(function (item) { return item.name; })) {
      showStatus("Add at least one product or service row before saving.");
      return;
    }
    if (result.warnings.length && state.businessProfile.allowNegativeStock !== "yes") {
      showStatus(result.warnings[0]);
      return;
    }

    const existing = editing.transactionId ? findById(state.transactions, "transactionId", editing.transactionId) : null;
    if (existing && existing.stockApplied) {
      restoreStockForTransaction(existing);
    }

    const customer = findById(state.customers, "customerId", draft.customerId);
    const employee = getCurrentEmployee();
    const now = nowIso();
    const transaction = {
      transactionId: editing.transactionId || generateId("txn"),
      transactionType: mapTransactionType(draft.documentType),
      documentType: draft.documentType,
      documentNumber: draft.documentNumber,
      relatedTransactionId: draft.sourceDocumentId || "",
      relatedInvoiceNumber: draft.documentType === "receipt" ? draft.relatedDocumentNumber : "",
      relatedQuotationNumber: draft.sourceDocumentId && findById(state.transactions, "transactionId", draft.sourceDocumentId) && findById(state.transactions, "transactionId", draft.sourceDocumentId).documentType === "quotation" ? draft.relatedDocumentNumber : "",
      relatedDeliveryNoteNumber: draft.documentType === "deliveryNote" ? draft.documentNumber : "",
      documentDate: draft.documentDate,
      dueDate: draft.dueDate,
      validUntil: draft.documentType === "quotation" ? draft.dueDate : "",
      customerId: customer.customerId,
      customerSnapshot: customer,
      employeeId: employee.employeeId,
      cashierSnapshot: employee,
      projectReference: draft.projectReference,
      relatedDocumentNumber: draft.relatedDocumentNumber,
      items: result.items.map(function (item) {
        return Object.assign({}, item, {
          stockDeducted: false
        });
      }),
      totals: result.totals,
      payment: {
        paymentMethod: draft.paymentMethod,
        amountReceived: result.totals.amountReceived,
        amountPaid: result.totals.amountPaid || result.totals.amountReceived,
        changeGiven: result.totals.changeGiven,
        balanceDue: result.totals.balanceDue,
        paymentReference: draft.paymentReference,
        paymentDate: draft.documentDate,
        paymentStatus: draft.paymentStatus,
        servedByEmployeeId: employee.employeeId,
        cashierNameSnapshot: employee.fullName,
        notes: draft.notes
      },
      delivery: {
        deliveryMethod: draft.deliveryMethod,
        trackingReference: draft.trackingReference,
        deliveredBy: draft.deliveredBy || (employee.role === "delivery" ? employee.fullName : ""),
        receivedBy: draft.receivedBy,
        dateReceived: draft.dateReceived,
        deliveryAddress: draft.deliveryAddress,
        showPrices: draft.showPricesDeliveryNote
      },
      status: draft.paymentStatus,
      notes: draft.notes,
      termsConditions: draft.termsConditions || defaultTermsForType(draft.documentType),
      documentDiscountPercent: draft.documentDiscountPercent,
      documentDiscountAmount: result.totals.documentDiscountAmount,
      shippingCharge: draft.shippingCharge,
      serviceCharge: draft.serviceCharge,
      otherCharges: draft.otherCharges,
      roundingAdjustment: draft.roundingAdjustment,
      sourceDocumentId: draft.sourceDocumentId || "",
      sourceDocumentType: draft.sourceDocumentId ? (findById(state.transactions, "transactionId", draft.sourceDocumentId) || {}).documentType || "" : "",
      relatedDocuments: existing && Array.isArray(existing.relatedDocuments) ? existing.relatedDocuments : [],
      convertedFrom: draft.sourceDocumentId ? draft.sourceDocumentId : "",
      convertedTo: existing && existing.convertedTo ? existing.convertedTo : [],
      stockApplied: false,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now
    };

    if (shouldDeductStock(transaction)) {
      const stockResult = applyStockForTransaction(transaction);
      if (!stockResult.ok) {
        showStatus(stockResult.message);
        return;
      }
      transaction.stockApplied = true;
      transaction.items = stockResult.items;
    }

    upsert(state.transactions, transaction, "transactionId");
    linkRelatedDocuments(transaction);
    saveToStorage(STORAGE_KEYS.transactions, state.transactions);
    saveToStorage(STORAGE_KEYS.batches, state.batches);
    saveToStorage(STORAGE_KEYS.movements, state.movements);
    editing.transactionId = transaction.transactionId;
    state.draftDocument = normaliseDocument(transaction);
    saveToStorage(STORAGE_KEYS.draftDocument, state.draftDocument);
    renderBatchSelectors();
    fillDraftForm(state.draftDocument);
    updateWorkspace();
    showStatus("Transaction saved locally.");
  }

  function shouldDeductStock(transaction) {
    if (transaction.documentType === "receipt") {
      return true;
    }
    if (transaction.documentType === "invoice") {
      return ["paid", "partially paid", "deposit paid", "credit", "instalment"].indexOf(transaction.payment.paymentStatus) !== -1;
    }
    return false;
  }

  function applyStockForTransaction(transaction) {
    const updatedItems = [];
    for (let i = 0; i < transaction.items.length; i += 1) {
      const item = transaction.items[i];
      if (!item.stockTrackingEnabled || !item.productId || item.type !== "product") {
        updatedItems.push(item);
        continue;
      }
      const deduction = deductItemStock(transaction, item);
      if (!deduction.ok) {
        return deduction;
      }
      updatedItems.push(Object.assign({}, item, { stockDeducted: true }));
    }
    return { ok: true, items: updatedItems };
  }

  function deductItemStock(transaction, item) {
    let remaining = parseNumber(item.quantity);
    const allocations = [];
    const batches = item.batchId ? getProductBatches(item.productId).filter(function (batch) {
      return batch.batchId === item.batchId;
    }) : getProductBatches(item.productId);

    if (!batches.length && state.businessProfile.allowNegativeStock !== "yes") {
      return { ok: false, message: "No active stock batch is available for " + item.name + "." };
    }

    batches.sort(function (a, b) {
      return String(a.purchaseDate || "").localeCompare(String(b.purchaseDate || "")) || String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
    });

    batches.forEach(function (batch) {
      if (remaining <= 0) {
        return;
      }
      const available = parseNumber(batch.quantityAvailable);
      const deducted = Math.min(available, remaining);
      if (deducted <= 0) {
        return;
      }
      allocations.push({ batch: batch, quantity: deducted });
      remaining -= deducted;
    });

    if (remaining > 0 && state.businessProfile.allowNegativeStock !== "yes") {
      return { ok: false, message: item.name + " requested " + normaliseNumber(item.quantity) + " but only " + normaliseNumber(parseNumber(item.quantity) - remaining) + " is available." };
    }

    allocations.forEach(function (entry) {
      const before = parseNumber(entry.batch.quantityAvailable);
      entry.batch.quantityAvailable = roundMoney(before - entry.quantity);
      entry.batch.updatedAt = nowIso();
      recordStockMovement({
        productId: item.productId,
        batchId: entry.batch.batchId,
        movementType: "sale",
        quantityChange: -entry.quantity,
        quantityBefore: before,
        quantityAfter: entry.batch.quantityAvailable,
        relatedTransactionId: transaction.transactionId,
        relatedDocumentNumber: transaction.documentNumber,
        employeeId: transaction.employeeId,
        notes: "Sold via " + DOCUMENT_TYPES[transaction.documentType]
      });
    });
    return { ok: true };
  }

  function restoreStockForTransaction(transaction) {
    state.movements.filter(function (movement) {
      return movement.relatedTransactionId === transaction.transactionId && movement.movementType === "sale";
    }).forEach(function (movement) {
      const batch = findById(state.batches, "batchId", movement.batchId);
      if (batch) {
        const before = parseNumber(batch.quantityAvailable);
        batch.quantityAvailable = roundMoney(before + Math.abs(parseNumber(movement.quantityChange)));
        batch.updatedAt = nowIso();
        recordStockMovement({
          productId: movement.productId,
          batchId: movement.batchId,
          movementType: "sale-cancelled",
          quantityChange: Math.abs(parseNumber(movement.quantityChange)),
          quantityBefore: before,
          quantityAfter: batch.quantityAvailable,
          relatedTransactionId: transaction.transactionId,
          relatedDocumentNumber: transaction.documentNumber,
          employeeId: state.currentEmployeeId,
          notes: "Previous stock deduction restored."
        });
      }
    });
    transaction.stockApplied = false;
  }

  function recordStockMovement(movement) {
    state.movements.unshift({
      movementId: generateId("mov"),
      productId: movement.productId || "",
      batchId: movement.batchId || "",
      movementType: movement.movementType || "adjustment",
      quantityChange: roundMoney(movement.quantityChange),
      quantityBefore: roundMoney(movement.quantityBefore),
      quantityAfter: roundMoney(movement.quantityAfter),
      relatedTransactionId: movement.relatedTransactionId || "",
      relatedDocumentNumber: movement.relatedDocumentNumber || "",
      employeeId: movement.employeeId || "",
      date: nowIso(),
      notes: movement.notes || ""
    });
  }

  function linkRelatedDocuments(transaction) {
    if (!transaction.sourceDocumentId) {
      return;
    }
    const source = findById(state.transactions, "transactionId", transaction.sourceDocumentId);
    if (!source) {
      return;
    }
    source.relatedDocuments = Array.isArray(source.relatedDocuments) ? source.relatedDocuments : [];
    const alreadyLinked = source.relatedDocuments.some(function (entry) {
      return entry.id === transaction.transactionId;
    });
    if (!alreadyLinked) {
      source.relatedDocuments.push({
        id: transaction.transactionId,
        type: transaction.documentType,
        number: transaction.documentNumber
      });
    }
    source.convertedTo = Array.isArray(source.convertedTo) ? source.convertedTo : [];
    if (source.convertedTo.indexOf(transaction.documentType) === -1) {
      source.convertedTo.push(transaction.documentType);
    }
  }

  function handleHistoryActions(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    const transaction = findById(state.transactions, "transactionId", button.getAttribute("data-id"));
    if (!transaction) {
      return;
    }
    const action = button.getAttribute("data-action");
    if (action === "load") {
      editing.transactionId = transaction.transactionId;
      state.draftDocument = normaliseDocument({
        transactionId: transaction.transactionId,
        documentType: transaction.documentType,
        documentNumber: transaction.documentNumber,
        documentDate: transaction.documentDate,
        dueDate: transaction.dueDate,
        paymentStatus: transaction.payment.paymentStatus,
        paymentMethod: transaction.payment.paymentMethod,
        paymentReference: transaction.payment.paymentReference,
        customerId: transaction.customerId,
        employeeId: transaction.employeeId,
        cashierName: transaction.cashierSnapshot.fullName,
        projectReference: transaction.projectReference,
        relatedDocumentNumber: transaction.relatedDocumentNumber || transaction.relatedInvoiceNumber || transaction.relatedQuotationNumber || "",
        sourceDocumentId: transaction.sourceDocumentId,
        deliveryMethod: transaction.delivery.deliveryMethod,
        trackingReference: transaction.delivery.trackingReference,
        deliveredBy: transaction.delivery.deliveredBy,
        receivedBy: transaction.delivery.receivedBy,
        dateReceived: transaction.delivery.dateReceived,
        showPricesDeliveryNote: transaction.delivery.showPrices,
        deliveryAddress: transaction.delivery.deliveryAddress,
        notes: transaction.notes,
        termsConditions: transaction.termsConditions,
        documentDiscountPercent: transaction.documentDiscountPercent,
        documentDiscountAmount: transaction.documentDiscountAmount,
        shippingCharge: transaction.shippingCharge,
        serviceCharge: transaction.serviceCharge,
        otherCharges: transaction.otherCharges,
        roundingAdjustment: transaction.roundingAdjustment,
        amountReceived: transaction.payment.amountReceived,
        amountPaid: transaction.payment.amountPaid,
        items: transaction.items
      });
      fillDraftForm(state.draftDocument);
      updateWorkspace();
      return;
    }
    if (action === "reprint") {
      editing.transactionId = transaction.transactionId;
      state.draftDocument = normaliseDocument({
        transactionId: transaction.transactionId,
        documentType: transaction.documentType,
        documentNumber: transaction.documentNumber,
        documentDate: transaction.documentDate,
        dueDate: transaction.dueDate,
        paymentStatus: transaction.payment.paymentStatus,
        paymentMethod: transaction.payment.paymentMethod,
        paymentReference: transaction.payment.paymentReference,
        customerId: transaction.customerId,
        employeeId: transaction.employeeId,
        cashierName: transaction.cashierSnapshot.fullName,
        projectReference: transaction.projectReference,
        relatedDocumentNumber: transaction.relatedDocumentNumber || "",
        sourceDocumentId: transaction.sourceDocumentId,
        deliveryMethod: transaction.delivery.deliveryMethod,
        trackingReference: transaction.delivery.trackingReference,
        deliveredBy: transaction.delivery.deliveredBy,
        receivedBy: transaction.delivery.receivedBy,
        dateReceived: transaction.delivery.dateReceived,
        showPricesDeliveryNote: transaction.delivery.showPrices,
        deliveryAddress: transaction.delivery.deliveryAddress,
        notes: transaction.notes,
        termsConditions: transaction.termsConditions,
        documentDiscountPercent: transaction.documentDiscountPercent,
        documentDiscountAmount: transaction.documentDiscountAmount,
        shippingCharge: transaction.shippingCharge,
        serviceCharge: transaction.serviceCharge,
        otherCharges: transaction.otherCharges,
        roundingAdjustment: transaction.roundingAdjustment,
        amountReceived: transaction.payment.amountReceived,
        amountPaid: transaction.payment.amountPaid,
        items: transaction.items
      });
      fillDraftForm(state.draftDocument);
      updateWorkspace();
      handlePrintRequest();
      return;
    }
    if (action === "delete") {
      if (!window.confirm("Delete this saved transaction permanently and remove it from retrieval history?")) {
        return;
      }
      if (transaction.stockApplied) {
        restoreStockForTransaction(transaction);
      }
      state.transactions = state.transactions.filter(function (entry) {
        return entry.transactionId !== transaction.transactionId;
      });
      if (editing.transactionId === transaction.transactionId) {
        editing.transactionId = "";
      }
      saveToStorage(STORAGE_KEYS.transactions, state.transactions);
      saveToStorage(STORAGE_KEYS.batches, state.batches);
      saveToStorage(STORAGE_KEYS.movements, state.movements);
      renderHistory();
      updateWorkspace();
      showStatus("Transaction deleted.");
      return;
    }
    if (!window.confirm("Cancel this transaction and restore stock if it was deducted?")) {
      return;
    }
    if (transaction.stockApplied) {
      restoreStockForTransaction(transaction);
    }
    transaction.status = "cancelled";
    transaction.payment.paymentStatus = "cancelled";
    transaction.updatedAt = nowIso();
    saveToStorage(STORAGE_KEYS.transactions, state.transactions);
    saveToStorage(STORAGE_KEYS.batches, state.batches);
    saveToStorage(STORAGE_KEYS.movements, state.movements);
    updateWorkspace();
    showStatus("Transaction cancelled.");
  }

  function renderPreview(draft, result) {
    const customer = findById(state.customers, "customerId", draft.customerId) || {};
    const employee = findById(state.employees, "employeeId", draft.employeeId) || getCurrentEmployee() || {};
    const totals = result.totals;
    const showPrices = draft.documentType !== "deliveryNote" || draft.showPricesDeliveryNote === "yes";
    const columns = draft.documentType === "deliveryNote"
      ? (showPrices
        ? ["Item", "Description", "Qty ordered", "Qty delivered", "Unit", "Unit price", "Tax", "Line total", "Remarks"]
        : ["Item", "Description", "Qty ordered", "Qty delivered", "Unit", "Remarks"])
      : ["SKU", "Item / service", "Description", "Qty", "Unit", "Unit price", "Discount", "Tax", "Line total"];

    const rows = result.items.map(function (item) {
      if (draft.documentType === "deliveryNote") {
        if (showPrices) {
          return [item.name, item.description, normaliseNumber(item.quantity), normaliseNumber(item.quantityDelivered), item.unit, formatCurrency(item.unitPrice), formatCurrency(item.taxAmount), formatCurrency(item.lineTotal), item.remarks || "-"];
        }
        return [item.name, item.description, normaliseNumber(item.quantity), normaliseNumber(item.quantityDelivered), item.unit, item.remarks || "-"];
      }
      return [
        item.sku || "-",
        item.name || "-",
        item.description || "-",
        normaliseNumber(item.quantity),
        item.unit || "-",
        formatCurrency(item.unitPrice),
        formatCurrency(item.lineDiscountTotal),
        formatCurrency(item.taxAmount),
        formatCurrency(item.lineTotal)
      ];
    });

    const title = DOCUMENT_TYPES[draft.documentType] || "Document";
    const roleLabel = draft.documentType === "receipt"
      ? "Cashier / served by"
      : (draft.documentType === "deliveryNote" ? "Prepared by / delivered by" : "Prepared by / served by");
    const docSpecificIntro = {
      invoice: "Invoice with tracked payment status, paid amount, balance due, and served-by record.",
      quotation: "Quotation with validity date, pricing, terms, and prepared-by record.",
      receipt: "Receipt confirming payment received, change given, balance due if any, and cashier record.",
      deliveryNote: "Delivery note with delivery details, related document reference, and optional pricing."
    }[draft.documentType] || "";
    const receiptFooter = draft.documentType === "receipt" ? (state.businessProfile.receiptFooter || "Received with thanks.") : "";
    const relatedDocs = draft.sourceDocumentId ? "<p><strong>Source document:</strong> " + escapeHtml(labelForSourceDocument(draft.sourceDocumentId)) + "</p>" : "";
    const watermark = !isActivationValid() ? "<div class='preview-watermark'>Activation Required</div>" : "";

    elements.documentPreview.innerHTML =
      "<article class='document-sheet" + (draft.documentType === "receipt" ? " document-sheet--receipt" : "") + "'>" +
        watermark +
        "<div class='document-letterhead'><div class='document-letterhead-bar'></div><div class='document-brand-stamp'><img src='assets/icons/pfine-business-invoice-quote-maker-mark.svg' alt='PFine Point of Sale System mark' class='document-brand-mark'><div><strong>PFine Point of Sale System</strong><p>Inventory, payments, staff, and document workflow</p></div></div></div>" +
        "<header class='document-header'>" +
          "<div class='business-brand'>" +
            (state.businessProfile.logoDataUrl ? "<img src='" + escapeAttribute(state.businessProfile.logoDataUrl) + "' alt='Store logo' class='logo-preview'>" : "") +
            "<div>" +
              "<h2>" + escapeHtml(state.businessProfile.storeName || "Your store name") + "</h2>" +
              "<p class='document-subtitle'>" + escapeHtml(docSpecificIntro) + "</p>" +
              "<p>" + escapeHtml(state.businessProfile.legalBusinessName || "") + "</p>" +
              "<p>" + escapeHtml(state.businessProfile.address || "") + "</p>" +
              "<p>" + escapeHtml([state.businessProfile.phone, state.businessProfile.email, state.businessProfile.website].filter(Boolean).join(" | ")) + "</p>" +
              "<p>" + escapeHtml((state.businessProfile.taxIdLabel || "Tax ID") + ": " + (state.businessProfile.taxIdValue || "-")) + "</p>" +
            "</div>" +
          "</div>" +
          "<div class='document-meta'>" +
            "<p class='document-title'>" + escapeHtml(title) + "</p>" +
            "<p><strong>No:</strong> " + escapeHtml(draft.documentNumber) + "</p>" +
            "<p><strong>Date:</strong> " + escapeHtml(draft.documentDate) + "</p>" +
            "<p><strong>" + escapeHtml(elements.dueDateLabel.textContent) + ":</strong> " + escapeHtml(draft.dueDate || "-") + "</p>" +
            "<p><strong>Status:</strong> " + escapeHtml(toTitleCase(draft.paymentStatus || "-")) + "</p>" +
            "<p><strong>Payment method:</strong> " + escapeHtml(draft.paymentMethod || "-") + "</p>" +
            "<p><strong>Reference:</strong> " + escapeHtml(draft.paymentReference || "-") + "</p>" +
          "</div>" +
        "</header>" +
        "<section class='document-columns'>" +
          "<div class='detail-card'>" +
            "<h3>" + escapeHtml(draft.documentType === "quotation" ? "Quotation for" : (draft.documentType === "deliveryNote" ? "Deliver to" : (draft.documentType === "receipt" ? "Received from" : "Bill to"))) + "</h3>" +
            "<p><strong>" + escapeHtml(customer.name || "-") + "</strong></p>" +
            "<p>" + escapeHtml(customer.address || "-") + "</p>" +
            "<p>" + escapeHtml([customer.phone, customer.email].filter(Boolean).join(" | ")) + "</p>" +
            "<p>" + escapeHtml((customer.taxId ? ((state.businessProfile.taxLabel || "Tax") + " ID: " + customer.taxId) : "")) + "</p>" +
          "</div>" +
          "<div class='detail-card'>" +
            "<h3>Reference and delivery details</h3>" +
            "<p><strong>Project / reference:</strong> " + escapeHtml(draft.projectReference || "-") + "</p>" +
            "<p><strong>Related document:</strong> " + escapeHtml(draft.relatedDocumentNumber || "-") + "</p>" +
            relatedDocs +
            "<p><strong>Delivery method:</strong> " + escapeHtml(draft.deliveryMethod || "-") + "</p>" +
            "<p><strong>Tracking:</strong> " + escapeHtml(draft.trackingReference || "-") + "</p>" +
            "<p><strong>Delivery address:</strong> " + escapeHtml(draft.deliveryAddress || "-") + "</p>" +
            "<p><strong>Delivered by:</strong> " + escapeHtml(draft.deliveredBy || "-") + "</p>" +
            "<p><strong>Received by:</strong> " + escapeHtml(draft.receivedBy || "-") + "</p>" +
          "</div>" +
        "</section>" +
        "<table class='preview-table'><thead><tr>" + columns.map(function (column) {
          return "<th>" + escapeHtml(column) + "</th>";
        }).join("") + "</tr></thead><tbody>" + (rows.length ? rows.map(function (cells) {
          return "<tr>" + cells.map(function (cell) {
            return "<td>" + escapeHtml(cell) + "</td>";
          }).join("") + "</tr>";
        }).join("") : "<tr><td colspan='" + columns.length + "'>Add at least one item.</td></tr>") + "</tbody></table>" +
        "<section class='totals-card'>" +
          "<div class='totals-row'><span>Items count</span><strong>" + escapeHtml(String(totals.itemsCount)) + "</strong></div>" +
          "<div class='totals-row'><span>Total quantity</span><strong>" + escapeHtml(normaliseNumber(totals.totalQuantity)) + "</strong></div>" +
          (showPrices ? (
            "<div class='totals-row'><span>Subtotal before discount</span><strong>" + escapeHtml(formatCurrency(totals.subtotalBeforeDiscount)) + "</strong></div>" +
            "<div class='totals-row'><span>Line discount total</span><strong>" + escapeHtml(formatCurrency(totals.lineDiscountTotal)) + "</strong></div>" +
            "<div class='totals-row'><span>Document discount</span><strong>" + escapeHtml(formatCurrency(totals.documentDiscountAmount)) + "</strong></div>" +
            "<div class='totals-row'><span>Taxable subtotal</span><strong>" + escapeHtml(formatCurrency(totals.taxableSubtotal)) + "</strong></div>" +
            "<div class='totals-row'><span>Total " + escapeHtml((state.businessProfile.taxLabel || "tax").toLowerCase()) + "</span><strong>" + escapeHtml(formatCurrency(totals.totalTax)) + "</strong></div>" +
            "<div class='totals-row'><span>Shipping charge</span><strong>" + escapeHtml(formatCurrency(totals.shippingCharge)) + "</strong></div>" +
            "<div class='totals-row'><span>Service charge</span><strong>" + escapeHtml(formatCurrency(totals.serviceCharge)) + "</strong></div>" +
            "<div class='totals-row'><span>Other charges</span><strong>" + escapeHtml(formatCurrency(totals.otherCharges)) + "</strong></div>" +
            "<div class='totals-row grand-total'><span>" + escapeHtml(draft.documentType === "quotation" ? "Quotation total" : (draft.documentType === "deliveryNote" ? "Delivery value" : "Grand total")) + "</span><strong>" + escapeHtml(formatCurrency(totals.grandTotal)) + "</strong></div>" +
            "<div class='totals-row'><span>Amount received</span><strong>" + escapeHtml(formatCurrency(totals.amountReceived)) + "</strong></div>" +
            "<div class='totals-row'><span>Amount paid</span><strong>" + escapeHtml(formatCurrency(totals.amountPaid)) + "</strong></div>" +
            "<div class='totals-row'><span>Change given</span><strong>" + escapeHtml(formatCurrency(totals.changeGiven)) + "</strong></div>" +
            "<div class='totals-row'><span>Balance due</span><strong>" + escapeHtml(formatCurrency(totals.balanceDue)) + "</strong></div>"
          ) : "<div class='totals-row grand-total'><span>Delivery summary</span><strong>Pricing hidden</strong></div>") +
        "</section>" +
        "<section class='document-detail-grid'>" +
          "<article class='detail-card'><h3>Terms</h3><p>" + nl2br(escapeHtml(draft.termsConditions || defaultTermsForType(draft.documentType))) + "</p></article>" +
          "<article class='detail-card'><h3>" + escapeHtml(roleLabel) + "</h3><p>" + escapeHtml(employee.fullName || draft.cashierName || "-") + "</p><p>" + escapeHtml(employee.role || "") + "</p><p>" + escapeHtml(receiptFooter) + "</p></article>" +
        "</section>" +
        "<section class='notes-section'><h3>Notes / remarks</h3><p>" + nl2br(escapeHtml(draft.notes || "-")) + "</p></section>" +
        "<section class='signature-grid'>" +
          "<div class='signature-card'><h3>Payment details</h3><p>" + escapeHtml((state.businessProfile.primaryPaymentLabel || "Primary payment details") + ": " + (state.businessProfile.primaryPaymentDetails || "-")) + "</p><p>" + escapeHtml((state.businessProfile.secondaryPaymentLabel || "Secondary payment details") + ": " + (state.businessProfile.secondaryPaymentDetails || "-")) + "</p><p>Powered by PFine Point of Sale System</p></div>" +
          "<div class='signature-card'><h3>Confirmation</h3><p>" + escapeHtml(draft.documentType === "quotation" ? "Acceptance signature: ____________________" : (draft.documentType === "deliveryNote" ? "Receiver signature: ____________________" : "Received with thanks")) + "</p><p>" + escapeHtml("Date: " + (draft.dateReceived || draft.documentDate || "-")) + "</p></div>" +
        "</section>" +
      "</article>";
  }

  function labelForSourceDocument(transactionId) {
    const tx = findById(state.transactions, "transactionId", transactionId);
    return tx ? (DOCUMENT_TYPES[tx.documentType] + " " + tx.documentNumber) : "-";
  }

  function copySummary() {
    const draft = collectDraftFromForm();
    const customer = findById(state.customers, "customerId", draft.customerId) || {};
    const totals = calculateDocument(draft).totals;
    const message = [
      (DOCUMENT_TYPES[draft.documentType] || "Document") + ": " + (draft.documentNumber || "-"),
      "Customer: " + (customer.name || "-"),
      "Grand total: " + formatCurrency(totals.grandTotal),
      "Amount paid: " + formatCurrency(totals.amountPaid),
      "Balance due: " + formatCurrency(totals.balanceDue),
      "Payment details: " + (state.businessProfile.primaryPaymentLabel || "Primary payment") + " - " + (state.businessProfile.primaryPaymentDetails || "Not provided")
    ].join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).then(function () {
        showStatus("Summary copied.");
      }).catch(function () {
        fallbackCopy(message);
      });
      return;
    }
    fallbackCopy(message);
  }

  async function handlePrintRequest() {
    const draft = collectDraftFromForm();
    if (window.pfineDesktop && typeof window.pfineDesktop.printDocument === "function") {
      try {
        const result = await window.pfineDesktop.printDocument({
          documentType: draft.documentType,
          documentTypeLabel: DOCUMENT_TYPES[draft.documentType] || "Document",
          documentNumber: draft.documentNumber || ""
        });
        if (result && result.ok) {
          if (result.message) {
            showStatus(result.message);
          }
          return;
        }
        if (result && result.message) {
          showStatus(result.message);
          return;
        }
      } catch (error) {
        // Fall through.
      }
    }
    try {
      window.print();
    } catch (error) {
      showStatus("Print could not be started. Please try again.");
    }
  }

  function fallbackCopy(text) {
    const helper = document.createElement("textarea");
    helper.value = text;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
    showStatus("Summary copied.");
  }

  function renderAll() {
    renderEmployees();
    renderCustomers();
    renderProducts();
    renderBatchSelectors();
    renderBatchSummary();
    renderBatchList();
    renderMovementList();
    renderHistory();
    renderPosProductResults();
    renderActivationStatus();
    updateSessionUI();
    updateWorkspace();
  }

  function renderActivationStatus() {
    const selectedPlan = PLAN_DEFINITIONS[state.licence.selectedPlan] || null;
    const activePlan = PLAN_DEFINITIONS[state.licence.activationPlan] || null;
    const activationValid = isActivationValid();
    applyText(elements.activationStatusLabel, activationValid ? "Activated" : "Activation required");
    applyText(elements.activationPlanLabel, activationValid ? (activePlan ? activePlan.label : "Full access") : "Not activated");
    applyText(elements.activationExpiryLabel, activationExpirySummary());
    applyText(elements.activationSelectedPlanLabel, activationValid ? (activePlan ? activePlan.label : "Full access") : "Plan assigned during authorised setup");
    applyText(
      elements.activationGuidance,
      activationValid
        ? "This installation has full feature access. A fresh authorised setup can apply a different plan when a new licensed term is required."
        : "Available plans are shown here for reference. Plan assignment is completed during authorised setup."
    );
  }

  function renderLowStockAlerts() {
    const lowStockProducts = getLowStockProducts();
    applyText(elements.stockAlertCount, String(lowStockProducts.length));
    elements.stockAlertBell.classList.toggle("stock-alert-active", lowStockProducts.length > 0);
    elements.dashboardLowStockList.innerHTML = lowStockProducts.map(function (product) {
      const available = getAvailableStock(product.productId);
      return "<article class='list-card'><div><strong>" + escapeHtml(product.name) + "</strong><p class='stock-warning'>" + escapeHtml("Low stock: " + normaliseNumber(available) + " remaining | Reorder level: " + normaliseNumber(product.reorderLevel)) + "</p></div></article>";
    }).join("") || "<p class='helper-text'>No low-stock alerts right now.</p>";
  }

  function getLowStockProducts() {
    return state.products.filter(function (product) {
      return product.activeStatus === "active" && product.stockTrackingEnabled && getAvailableStock(product.productId) <= parseNumber(product.reorderLevel);
    });
  }

  function isMeaningfulItem(item) {
    return !!(item && (item.productId || item.name || item.sku) && (parseNumber(item.quantity) > 0 || parseNumber(item.unitPrice) > 0));
  }

  function cartHasOnlyPlaceholder(items) {
    return Array.isArray(items) && items.length === 1 && !isMeaningfulItem(items[0]);
  }

  function updateSessionUI() {
    const employee = getCurrentEmployee();
    applyText(elements.activeEmployeeLabel, employee ? (employee.fullName + " (" + employee.role + ")") : "No active staff session");
    const activationValid = isActivationValid();
    const showOverlay = !employee && !state.activationSessionUnlocked;
    elements.staffSessionOverlay.classList.toggle("hidden", !showOverlay);
    if (!activationValid && !state.activationSessionUnlocked) {
      applyText(elements.sessionHelperText, "Software activation is required before standard sign-in can continue. Please contact your authorised software provider.");
      elements.sessionSignInBtn.disabled = false;
      elements.sessionOpenStaffSetupBtn.classList.add("hidden");
    } else if (!state.employees.length) {
      applyText(elements.sessionHelperText, "No staff account exists yet. Use 'Set up first staff account' to create the first cashier or administrator profile.");
      elements.sessionSignInBtn.disabled = !!state.activationSessionUnlocked;
      elements.sessionOpenStaffSetupBtn.classList.remove("hidden");
    } else if (!employee) {
      applyText(elements.sessionHelperText, "Enter an employee code and access code to start a staff session.");
      elements.sessionSignInBtn.disabled = false;
      elements.sessionOpenStaffSetupBtn.classList.add("hidden");
    } else {
      applyText(elements.sessionHelperText, "");
      elements.sessionSignInBtn.disabled = false;
      elements.sessionOpenStaffSetupBtn.classList.add("hidden");
    }
  }

  async function attemptStaffSignIn() {
    const rawEmployeeCode = elements.sessionEmployeeCode.value.trim();
    const employeeCode = rawEmployeeCode.toLowerCase();
    const accessCode = elements.sessionAccessCode.value.trim();
    if (await isMasterActivationLogin(rawEmployeeCode, accessCode)) {
      openActivationPlanDialog();
      return;
    }
    if (!isActivationValid()) {
      showStatus("Software activation is required before regular staff sign-in.");
      return;
    }
    const employee = state.employees.find(function (entry) {
      return entry.activeStatus === "active" && String(entry.employeeCode || "").trim().toLowerCase() === employeeCode;
    });
    if (!employee) {
      showStatus("No active staff account matches that employee code.");
      return;
    }
    if ((employee.accessCode || "") !== accessCode) {
      showStatus("The access code is not correct for that staff account.");
      return;
    }
    state.currentEmployeeId = employee.employeeId;
    state.activationSessionUnlocked = false;
    localStorage.setItem(STORAGE_KEYS.currentEmployeeId, state.currentEmployeeId);
    elements.currentEmployeeId.value = employee.employeeId;
    elements.sessionEmployeeCode.value = "";
    elements.sessionAccessCode.value = "";
    updateSessionUI();
    updateWorkspace();
    showStatus("Staff session started.");
  }

  function signOutStaff() {
    state.currentEmployeeId = "";
    state.activationSessionUnlocked = false;
    localStorage.removeItem(STORAGE_KEYS.currentEmployeeId);
    elements.currentEmployeeId.value = "";
    updateSessionUI();
    updateWorkspace();
    showStatus("Staff session signed out.");
  }

  function openStaffSetupFromOverlay() {
    if (!isActivationValid() && !state.activationSessionUnlocked) {
      showStatus("Software activation is required before staff setup can continue.");
      return;
    }
    closeOwnerPanel();
    switchPage("staff");
    elements.staffSessionOverlay.classList.add("hidden");
    showStatus("Create the first staff account, then sign in.");
  }

  function switchPage(pageName) {
    state.activePage = pageName || "dashboard";
    elements.appPages.forEach(function (page) {
      page.classList.toggle("active", page.getAttribute("data-page") === state.activePage);
    });
    elements.navButtons.forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-page-target") === state.activePage);
    });
    const activeButton = elements.navButtons.find(function (button) {
      return button.getAttribute("data-page-target") === state.activePage;
    });
    applyText(elements.pageTitle, activeButton ? activeButton.textContent : "Dashboard");
  }

  function handleGlobalShortcuts(event) {
    if (event.key === "Escape" && !elements.ownerPanel.classList.contains("hidden")) {
      closeOwnerPanel();
    }
  }

  function openOwnerPanel() {
    return;
  }

  function openStockAlertsPanel() {
    switchPage("stock");
    if (getLowStockProducts().length) {
      showStatus("Low-stock items are ready for review in Stock & Batches.");
      return;
    }
    showStatus("There are no low-stock alerts right now.");
  }

  async function isMasterActivationLogin(employeeCode, accessCode) {
    if (!employeeCode || !accessCode || !(window.crypto && window.crypto.subtle)) {
      return false;
    }
    const employeeHash = await sha256Hex("PFINE::employeeCode::" + employeeCode);
    const accessHash = await sha256Hex("PFINE::accessCode::" + accessCode);
    return employeeHash === MASTER_ACCOUNT.employeeCodeHash && accessHash === MASTER_ACCOUNT.accessCodeHash;
  }

  function openActivationPlanDialog() {
    elements.activationPlanOverlay.classList.remove("hidden");
  }

  function closeActivationPlanDialog() {
    elements.activationPlanOverlay.classList.add("hidden");
    showStatus("Activation was cancelled.");
  }

  function activatePreparedPlan(planKey) {
    if (!PLAN_DEFINITIONS[planKey]) {
      showStatus("A valid activation plan is required.");
      return;
    }
    const expiryDate = calculatePlanExpiry(todayDate(), planKey);
    state.licence = normaliseLicence(Object.assign({}, state.licence, {
      licenceStatus: "active",
      edition: "customBranded",
      selectedPlan: planKey,
      activationPlan: planKey,
      activationDate: todayDate(),
      expiryDate: expiryDate,
      activatedByMaster: true,
      watermarkEnabled: false,
      maxProducts: 0,
      maxCustomers: 0,
      maxEmployees: 0,
      maxSavedDocuments: 0
    }));
    state.activationSessionUnlocked = true;
    closeActivationPlanDialogSilently();
    saveToStorage(STORAGE_KEYS.licence, state.licence);
    fillLicenceForm();
    renderActivationStatus();
    updateWorkspace();
    elements.sessionEmployeeCode.value = "";
    elements.sessionAccessCode.value = "";
    if (!state.employees.length) {
      switchPage("staff");
      showStatus((PLAN_DEFINITIONS[planKey] || {}).label + " activated. Create the first staff account to continue.");
      return;
    }
    switchPage("plans");
    showStatus((PLAN_DEFINITIONS[planKey] || {}).label + " activated successfully on this installation.");
  }

  function closeActivationPlanDialogSilently() {
    elements.activationPlanOverlay.classList.add("hidden");
  }

  function refreshActivationState() {
    if (!state || !state.licence) {
      return;
    }
    const activationValid = isActivationValid();
    state.licence.watermarkEnabled = !activationValid;
    if (!activationValid && state.licence.activationPlan && state.licence.expiryDate && state.licence.activationPlan !== "lifetime") {
      state.licence.licenceStatus = "expired";
      saveToStorage(STORAGE_KEYS.licence, state.licence);
    }
  }

  function isActivationValid() {
    if (state.licence.licenceStatus !== "active" || !state.licence.activationPlan) {
      return false;
    }
    if (state.licence.activationPlan === "lifetime") {
      return true;
    }
    if (!state.licence.expiryDate) {
      return false;
    }
    return state.licence.expiryDate >= todayDate();
  }

  function calculatePlanExpiry(startDate, planKey) {
    const plan = PLAN_DEFINITIONS[planKey] || PLAN_DEFINITIONS.monthly;
    if (!plan.durationDays) {
      return "";
    }
    const expiry = new Date(startDate + "T00:00:00");
    expiry.setDate(expiry.getDate() + plan.durationDays);
    return expiry.toISOString().slice(0, 10);
  }

  function activationExpirySummary() {
    if (!isActivationValid()) {
      return state.licence.licenceStatus === "expired" ? "Expired" : "Activation required";
    }
    if (state.licence.activationPlan === "lifetime") {
      return "Lifetime access";
    }
    return state.licence.expiryDate || "Activation required";
  }

  function closeOwnerPanel() {
    elements.ownerPanel.classList.add("hidden");
    elements.ownerPanel.setAttribute("aria-hidden", "true");
  }

  function getCurrentEmployee() {
    return findById(state.employees, "employeeId", state.currentEmployeeId) || null;
  }

  function getProductBatches(productId) {
    return state.batches.filter(function (batch) {
      return batch.productId === productId && batch.activeStatus === "active";
    });
  }

  function getAvailableStock(productId, batchId) {
    if (!productId) {
      return 0;
    }
    if (batchId) {
      const batch = findById(state.batches, "batchId", batchId);
      return batch && batch.activeStatus === "active" ? parseNumber(batch.quantityAvailable) : 0;
    }
    return getProductBatches(productId).reduce(function (sumValue, batch) {
      return sumValue + parseNumber(batch.quantityAvailable);
    }, 0);
  }

  function firstBatchIdForProduct(productId) {
    const batches = getProductBatches(productId).slice().sort(function (a, b) {
      return String(a.purchaseDate || "").localeCompare(String(b.purchaseDate || ""));
    });
    return batches.length ? batches[0].batchId : "";
  }

  function totalTrackedStock() {
    return state.products.filter(function (product) {
      return product.stockTrackingEnabled;
    }).reduce(function (sumValue, product) {
      return sumValue + getAvailableStock(product.productId);
    }, 0);
  }

  function defaultTermsForType(documentType) {
    if (documentType === "quotation") {
      return state.businessProfile.quotationTerms;
    }
    if (documentType === "deliveryNote") {
      return state.businessProfile.deliveryNoteTerms;
    }
    return state.businessProfile.invoiceTerms;
  }

  function isLimitReached(entityType, editingId) {
    if (isActivationValid()) {
      return false;
    }
    const licence = state.licence;
    if (licence.edition === "hosted") {
      showStatus("Hosted Online POS is future work only in this phase.");
      return true;
    }
    const limitMap = {
      products: licence.maxProducts,
      customers: licence.maxCustomers,
      employees: licence.maxEmployees,
      transactions: licence.maxSavedDocuments
    };
    const countMap = {
      products: state.products.length,
      customers: state.customers.length,
      employees: state.employees.length,
      transactions: state.transactions.length
    };
    const limit = parseNumber(limitMap[entityType]);
    if (editingId || !limit) {
      return false;
    }
    if (countMap[entityType] >= limit) {
      showStatus("The current " + (EDITIONS[licence.edition] || {}).label + " limit for " + entityType + " has been reached.");
      return true;
    }
    return false;
  }

  function mapTransactionType(documentType) {
    return {
      invoice: "invoice",
      quotation: "quotation",
      receipt: "receipt",
      deliveryNote: "delivery-note"
    }[documentType] || "sale";
  }

  function populateSelect(select, options) {
    select.innerHTML = options.map(function (option) {
      return "<option value='" + escapeAttribute(option.value) + "'>" + escapeHtml(option.label) + "</option>";
    }).join("");
  }

  function findById(collection, key, value) {
    return collection.find(function (entry) {
      return entry[key] === value;
    }) || null;
  }

  function upsert(collection, item, key) {
    const index = collection.findIndex(function (entry) {
      return entry[key] === item[key];
    });
    if (index >= 0) {
      collection[index] = item;
      return;
    }
    collection.unshift(item);
  }

  function applyText(target, value) {
    if (target) {
      target.textContent = value || "";
    }
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadFromStorage(key, fallbackValue) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallbackValue;
    } catch (error) {
      return fallbackValue;
    }
  }

  function showStatus(message) {
    if (!message) {
      return;
    }
    elements.statusMessage.textContent = message;
    elements.statusMessage.classList.add("visible");
    clearTimeout(showStatus.timeoutId);
    showStatus.timeoutId = setTimeout(function () {
      elements.statusMessage.classList.remove("visible");
    }, 2600);
  }

  function generateId(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function generateDocumentNumber(documentType) {
    const prefixMap = {
      invoice: "INV",
      quotation: "QUO",
      receipt: "REC",
      deliveryNote: "DEL"
    };
    return (prefixMap[documentType] || "DOC") + "-" + Date.now().toString().slice(-6);
  }

  async function sha256Hex(input) {
    const encoded = new TextEncoder().encode(String(input || ""));
    const digest = await window.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest)).map(function (byte) {
      return byte.toString(16).padStart(2, "0");
    }).join("");
  }

  function todayDate() {
    return new Date().toISOString().slice(0, 10);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function getActiveCurrency() {
    if (elements.businessCurrencySelect.value === "Custom") {
      return elements.businessCurrencyCustom.value.trim() || "USD";
    }
    return elements.businessCurrencySelect.value || state.businessProfile.currency || "USD";
  }

  function formatCurrency(value) {
    return getActiveCurrency() + " " + roundMoney(value).toFixed(2);
  }

  function parseNumber(value) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function normaliseNumber(value) {
    return roundMoney(value).toString();
  }

  function roundMoney(value) {
    return Math.round(parseNumber(value) * 100) / 100;
  }

  function sum(collection, key) {
    return roundMoney(collection.reduce(function (total, item) {
      return total + parseNumber(item[key]);
    }, 0));
  }

  function finiteOrFallback(candidate, fallbackValue, finalFallback) {
    const primary = Number.isFinite(candidate) ? candidate : parseNumber(candidate);
    if (Number.isFinite(primary) && primary > 0) {
      return primary;
    }
    const fallback = Number.isFinite(fallbackValue) ? fallbackValue : parseNumber(fallbackValue);
    if (Number.isFinite(fallback) && fallback > 0) {
      return fallback;
    }
    return finalFallback;
  }

  function limitLabel(value) {
    return parseNumber(value) ? String(value) : "Future / manual";
  }

  function toTitleCase(value) {
    return String(value || "").replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  function nl2br(value) {
    return String(value || "").replace(/\n/g, "<br>");
  }
})();
