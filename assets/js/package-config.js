window.PFINE_PACKAGE_CONFIG = {
  appName: "PFine Point of Sale System",
  desktopAppName: "PFine Point of Sale System",
  desktopWindowTitle: "PFine Point of Sale System | Offline Stock, Staff, and Business Document Tracking",
  supportNote: "This edition stores POS, stock, customer, staff-account, and document data locally on this device. It is structured for future hosted-online growth, but cloud sync, online payments, and server-side accounts are not included in this phase.",
  complianceNote: "This app provides local POS, stock, staff, and document records. It does not provide legal, tax, or accounting advice.",
  hostedOnlineReadinessNote: "Hosted Online POS is future work. It will require user accounts, a server database, sync, roles, billing, and server-side licence activation.",
  editions: {
    demo: {
      label: "Demo",
      maxProducts: 5,
      maxCustomers: 5,
      maxEmployees: 3,
      maxSavedDocuments: 10,
      watermarkEnabled: true,
      allowedFeatures: ["Products and services", "Customers", "Employees", "Receipts", "Invoices", "Print/PDF"]
    },
    starter: {
      label: "Starter POS",
      maxProducts: 250,
      maxCustomers: 250,
      maxEmployees: 10,
      maxSavedDocuments: 500,
      watermarkEnabled: false,
      allowedFeatures: ["Products and services", "Basic stock tracking", "Customers", "POS cart", "Receipts", "Invoices", "Print/PDF", "Local storage"]
    },
    professional: {
      label: "Professional POS",
      maxProducts: 5000,
      maxCustomers: 5000,
      maxEmployees: 100,
      maxSavedDocuments: 20000,
      watermarkEnabled: false,
      allowedFeatures: ["Starter features", "Batch tracking", "Employees/cashiers", "Quotations", "Delivery notes", "Sales history", "Daily summaries", "Backup-ready structure", "Related documents"]
    },
    customBranded: {
      label: "Custom Branded POS",
      maxProducts: 20000,
      maxCustomers: 20000,
      maxEmployees: 300,
      maxSavedDocuments: 50000,
      watermarkEnabled: false,
      allowedFeatures: ["Professional features", "Custom branding defaults", "Custom colours", "Custom footer wording"]
    },
    hosted: {
      label: "Hosted Online POS",
      maxProducts: 0,
      maxCustomers: 0,
      maxEmployees: 0,
      maxSavedDocuments: 0,
      watermarkEnabled: false,
      allowedFeatures: ["Future roadmap only", "Server database", "User accounts", "Roles and permissions", "Cloud sync", "Online backup", "Subscription billing", "Server-side licence activation"]
    }
  },
  currencies: ["USD", "EUR", "GBP", "KES", "CAD", "AUD", "INR", "NGN", "ZAR", "GHS", "Custom"],
  regionPresets: {
    globalGeneric: {
      label: "Global / Generic",
      currency: "USD",
      taxLabel: "Tax",
      taxIdLabel: "Tax ID",
      primaryPaymentLabel: "Bank Details",
      secondaryPaymentLabel: "Payment Details"
    },
    kenya: {
      label: "Kenya",
      currency: "KES",
      taxLabel: "VAT",
      taxIdLabel: "KRA PIN",
      primaryPaymentLabel: "M-PESA Details",
      secondaryPaymentLabel: "Bank Details"
    },
    unitedStates: {
      label: "United States",
      currency: "USD",
      taxLabel: "Sales Tax",
      taxIdLabel: "EIN / Tax ID",
      primaryPaymentLabel: "Bank Details",
      secondaryPaymentLabel: "PayPal / Card Details"
    },
    unitedKingdom: {
      label: "United Kingdom",
      currency: "GBP",
      taxLabel: "VAT",
      taxIdLabel: "VAT Number / UTR",
      primaryPaymentLabel: "Bank Details",
      secondaryPaymentLabel: "Payment Details"
    },
    europeanUnion: {
      label: "European Union",
      currency: "EUR",
      taxLabel: "VAT",
      taxIdLabel: "VAT Number",
      primaryPaymentLabel: "IBAN / Bank Details",
      secondaryPaymentLabel: "Payment Details"
    },
    canada: {
      label: "Canada",
      currency: "CAD",
      taxLabel: "GST/HST",
      taxIdLabel: "Business Number / Tax ID",
      primaryPaymentLabel: "Bank Details",
      secondaryPaymentLabel: "Payment Details"
    },
    australia: {
      label: "Australia",
      currency: "AUD",
      taxLabel: "GST",
      taxIdLabel: "ABN",
      primaryPaymentLabel: "Bank Details",
      secondaryPaymentLabel: "Payment Details"
    },
    india: {
      label: "India",
      currency: "INR",
      taxLabel: "GST",
      taxIdLabel: "GSTIN",
      primaryPaymentLabel: "UPI / Bank Details",
      secondaryPaymentLabel: "Payment Details"
    },
    southAfrica: {
      label: "South Africa",
      currency: "ZAR",
      taxLabel: "VAT",
      taxIdLabel: "VAT Number / Tax ID",
      primaryPaymentLabel: "Bank Details",
      secondaryPaymentLabel: "Payment Details"
    },
    nigeria: {
      label: "Nigeria",
      currency: "NGN",
      taxLabel: "VAT",
      taxIdLabel: "TIN",
      primaryPaymentLabel: "Bank Details",
      secondaryPaymentLabel: "Payment Details"
    },
    ghana: {
      label: "Ghana",
      currency: "GHS",
      taxLabel: "VAT",
      taxIdLabel: "TIN",
      primaryPaymentLabel: "Mobile Money / Bank Details",
      secondaryPaymentLabel: "Payment Details"
    },
    custom: {
      label: "Custom",
      currency: "Custom",
      taxLabel: "Tax",
      taxIdLabel: "Business Tax ID",
      primaryPaymentLabel: "Primary Payment Details",
      secondaryPaymentLabel: "Secondary Payment Details"
    }
  }
};
