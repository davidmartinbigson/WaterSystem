import { useEffect, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Bell, Boxes, Building2,
  CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
  Clock3, Copy, CreditCard, Droplets, Eye, EyeOff, FileBarChart2, FileText, Globe2, Mail,
  MapPin, MessageCircle, Pencil, Send,
  LayoutDashboard, Languages, LogOut, Menu, MoreHorizontal, Package, Plus, Search,
  Settings, ShieldCheck, Sparkles, Truck, Users, Wallet, X, Zap,
} from 'lucide-react';
import {
  businessPlans, initialComms, initialCustomers, initialExpenses, initialInventory, initialLicenses,
  initialOrders, initialPricing, initialRoutes,
} from './data.js';
import { createLicenseCode, normalizeLicenseCode, parsePortableLicense } from './license.js';
import { buildDeliveryReport, calculateDeliveryBalances, whatsappNumber } from './delivery.js';

const dictionaries = {
  en: {
    navHome: 'Home', navFeatures: 'Features', navPlans: 'Plans', navSignIn: 'Sign in', startFree: 'Get started',
    heroEyebrow: 'The operating system for water delivery', heroFirst: 'Keep every', heroAccent: 'drop in motion.',
    heroCopy: 'Orders, routes, returnable cans and cash flow — finally working together in one beautifully simple workspace.',
    exploreDemo: 'Explore the live demo', seeHow: 'See how it works', trusted: 'MADE FOR THE PEOPLE WHO KEEP WATER MOVING',
    featureEyebrow: 'A little less chaos. A lot more clarity.', featureTitle: 'Your whole water business, in one place.',
    featureCopy: 'From the first customer call to the last empty can of the day, know what is happening and what needs your attention.',
    featureOrders: 'Orders that stay on track', featureOrdersCopy: 'Capture orders in seconds, see what is due and follow every delivery until it reaches the doorstep.',
    featureCustomers: 'Customers who come back', featureCustomersCopy: 'Keep delivery preferences, can balances and payment history close at hand. No more scattered notebooks.',
    featureStock: 'Stock you can trust', featureStockCopy: 'Track filled and empty cans, bottled water and packaging before a low-stock surprise slows the team down.',
    featureRoutes: 'Routes made for real life', featureRoutesCopy: 'Put the right stops in each driver’s day, follow progress and make every trip count.',
    featureFinance: 'Money, made visible', featureFinanceCopy: 'See collections, unpaid invoices and daily expenses together so you can make the next call with confidence.',
    featureBilingual: 'English or Urdu. Your call.', featureBilingualCopy: 'A comfortable, bilingual workspace your whole team can actually use — on a laptop or a phone.',
    platformEyebrow: 'BUILT AROUND YOUR DAILY RUN', platformTitle: 'From plant floor to front door.', platformCopy: 'One place for the details that keep a dependable water service running: who ordered, what left the depot, which cans came back, and what got paid.',
    platformOrders: 'A clear view of every order', platformRoutes: 'Drivers know the next stop', platformCans: 'No can gets left behind',
    planEyebrow: 'STRAIGHTFORWARD PLANS', planTitle: 'Room to grow, without the guesswork.', planCopy: 'Choose a subscription that fits your operation. Your platform administrator can issue monthly, quarterly, yearly or custom access keys.',
    choosePlan: 'Choose this plan', askAdmin: 'Talk to your administrator', priceNote: 'Subscriptions are activated by a license key from your master administrator.',
    footerLine: 'Made for the people who keep every sip moving.', footerProduct: 'Product', footerGetStarted: 'Get started', footerSignIn: 'Sign in',
    authWelcome: 'Water, in good hands.', authAsideCopy: 'A calmer way to run your delivery business — from customer orders to the last can returned.',
    authAsideFoot: 'Operations that flow.', authLoginTitle: 'Welcome back', authLoginCopy: 'Sign in to your AquaFlow workspace.', authSignupTitle: 'Create your workspace', authSignupCopy: 'Enter your details and an access key from your master administrator.',
    email: 'Email address', password: 'Password', fullName: 'Your name', businessName: 'Business name', licenseKey: 'License key',
    emailPlaceholder: 'you@business.com', passwordPlaceholder: 'Enter your password', namePlaceholder: 'e.g. Hamza Khan', businessPlaceholder: 'e.g. BlueSpring Water Co.', keyPlaceholder: 'AQF-XXXX-XXXX-XXXX',
    remember: 'Remember me', forgot: 'Forgot password?', loginButton: 'Sign in to workspace', signupButton: 'Create account & activate', noAccount: 'New to AquaFlow?', haveAccount: 'Already have an account?', signUp: 'Create account', signIn: 'Sign in',
    demoAccess: 'Try a demo workspace', demoOwner: 'Explore as water supplier', demoAdmin: 'Open master admin', demoCredentials: 'Demo access', ownerAccess: 'Supplier · owner@aquaflow.pk · demo1234', masterAccess: 'Master admin · admin@aquaflow.pk · AquaAdmin2026!', availableDemoKey: 'Available demo key', useDemoKey: 'Use key', noAvailableKeys: 'No unused keys. Sign in as master admin to generate one.',
    masterHint: 'Master administrator', keyHint: 'Your key activates a subscription when you create your workspace.', backHome: 'Back to website',
    overview: 'Overview', orders: 'Orders', customers: 'Customers', deliveries: 'Deliveries & routes', inventory: 'Inventory', billing: 'Billing & expenses', reports: 'Reports', settings: 'Settings',
    workspace: 'WORKSPACE', operations: 'OPERATIONS', finance: 'FINANCE', system: 'SYSTEM',
    hello: 'Good morning', todaySummary: 'Here’s what’s happening with your water business today.', todayDeliveries: 'Today’s deliveries', monthlyRevenue: 'Monthly revenue', activeCustomers: 'Active customers', cansCirculating: 'Cans in circulation', vsLastWeek: 'vs last week', onSchedule: 'on schedule', collectedThisMonth: 'collected this month', returnableCans: 'returnable cans',
    newOrder: 'New order', addCustomer: 'Add customer', dispatchRoutes: 'View routes', viewAll: 'View all', recentOrders: 'Recent orders', liveOperations: 'Live operations', revenueOverview: 'Revenue overview', last7Days: 'Last 7 days', routeProgress: 'Route progress', onTheRoad: 'on the road', stockNeedsAttention: 'Stock needs attention', allInventory: 'All inventory', lowStock: 'Low stock', filledCans: 'Filled cans', emptyCans: 'Empty cans', returnedToday: 'returned today', outForDelivery: 'Out for delivery',
    search: 'Search anything…', notifications: 'Notifications', platformAdmin: 'Platform admin', demoWorkspace: 'Demo workspace', signOut: 'Sign out', switchLanguage: 'اردو',
    pageOrdersCopy: 'Capture, track and complete every water order.', pageCustomersCopy: 'Keep delivery preferences, contact details and can balances together.', pageDeliveriesCopy: 'Dispatch routes, follow drivers and keep every stop moving.', pageInventoryCopy: 'Know what is ready to go, what came back and what needs a top-up.', pageBillingCopy: 'Collections, customer balances and operating expenses at a glance.', pageReportsCopy: 'A closer look at delivery volume, revenue and route performance.', pageSettingsCopy: 'Make AquaFlow fit the way your water business works.',
    order: 'Order', customer: 'Customer', items: 'Cans', delivery: 'Delivery', amount: 'Amount', payment: 'Payment', status: 'Status', actions: 'Actions', route: 'Route', phone: 'Phone', address: 'Address', balance: 'Balance', cadence: 'Delivery rhythm', since: 'Customer since',
    delivered: 'Delivered', pending: 'Pending', onTheWay: 'On the way', paid: 'Paid', unpaid: 'Unpaid', cashOnDelivery: 'Cash on delivery', monthlyInvoice: 'Monthly invoice', markDelivered: 'Mark delivered', exportCsv: 'Export CSV', filterAll: 'All status',
    routeStops: 'stops', completed: 'completed', driver: 'Driver', vehicle: 'Vehicle', cansToday: 'Cans today', routeStatus: 'Route status',
    item: 'Item', category: 'Category', inStock: 'In stock', reorderAt: 'Reorder at', movement: 'Today’s movement', adjustStock: 'Adjust stock', addStock: 'Add stock', stockAdjustment: 'Stock adjustment', quantity: 'Quantity', add: 'Add', remove: 'Remove', saveAdjustment: 'Save adjustment',
    invoice: 'Invoice', invoices: 'Invoices', expenses: 'Expenses', addExpense: 'Add expense', expenseName: 'Expense name', categoryName: 'Category', paidBy: 'Paid by', recordExpense: 'Record expense', totalCollected: 'Total collected', outstanding: 'Outstanding balance', monthlyExpenses: 'Monthly expenses',
    reportVolume: 'Delivery volume', topRoutes: 'Top routes', performance: 'Performance', cansDelivered: 'Cans delivered', revenue: 'Revenue', thisMonth: 'This month', avgOrder: 'Average order', deliveryRate: 'On-time delivery',
    businessProfile: 'Business profile', businessProfileCopy: 'The information shown to your team in this workspace.', preferences: 'Preferences', preferencesCopy: 'Choose how you want AquaFlow to feel day to day.', notificationsSettings: 'Notifications', notificationsCopy: 'Get a heads-up for low stock, new orders and expiring subscriptions.', language: 'Workspace language', saveChanges: 'Save changes', saved: 'Changes saved', owner: 'Workspace owner', timezone: 'Time zone', currency: 'Currency', pricingSettings: 'Product pricing', pricingMode: 'Pricing method', perLitre: 'Per litre', per19LCan: 'Per 19L can', perLitreRate: 'Price per litre (Rs)', perCanRate: '19L can price (Rs)', bottlePackPrice: '1.5L pack price (Rs)', bottleCartonPrice: '500ml carton price (Rs)', commsSettings: 'Delivery messages', channelLink: 'WhatsApp channel link', contactPhone: 'Support phone number', queryWindow: 'Query window (hours)', emailAddress: 'Customer email', bottleBalance: 'Bottle balance', bottlesDelivered: 'Bottles delivered', bottlesReturned: 'Empty bottles returned', paymentReceived: 'Payment received', previousBalance: 'Previous balance', totalBalance: 'Total balance', sendWhatsApp: 'Send WhatsApp report', sendEmail: 'Email report', copyReport: 'Copy report', reportPreview: 'Delivery report preview', createRoute: 'Add route', editRoute: 'Edit route', routeFormCopy: 'Set up a delivery route and assign it to customers or orders.', routeName: 'Route name', zoneName: 'Zone / area', driverName: 'Driver name', vehicleNumber: 'Vehicle number', plannedStops: 'Planned stops', routeAdded: 'Route added.', deliveryCompleted: 'Delivery marked complete.', completeDelivery: 'Complete delivery', deliveryCompletionCopy: 'Record payment and empty-can returns. A ready-to-send customer report opens next.', orderTotal: 'Order total', bottlesUnit: 'bottles', nineteenLCan: '19L can', smtpLimit: 'WhatsApp opens a ready-to-send message. Email opens a draft; automatic SMTP delivery requires a secure backend.',
    monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly', custom: 'Custom days', available: 'Available', active: 'Active', expired: 'Expired', revoked: 'Revoked', waterVolume: 'Water volume on orders', gallons: 'US gallons', liters: 'litres', unitsTracked: 'delivery units tracked', conversionNote: '1 US gal = 3.785 litres', generateKey: 'Generate license key', licenseKeys: 'License keys', businesses: 'Workspaces', activeLicenses: 'Active licenses', availableKeys: 'Keys available', renewalsSoon: 'Renewals soon', collectedMonth: 'Collected this month', createKey: 'Create license key', plan: 'Plan', duration: 'Duration', generatedFor: 'Prepared for', emailOptional: 'Business email (optional)', customDays: 'Number of days', generate: 'Generate key', copyKey: 'Copy key', copied: 'Copied', expires: 'Expires', created: 'Created', usage: 'Usage', noResults: 'No matching records found.', licenseIntro: 'Issue, track and revoke access for water supplier workspaces.', adminOverview: 'Platform overview', adminOverviewCopy: 'Your subscription network at a glance.', workspaceCount: 'Registered workspaces', keyPool: 'Ready-to-use keys', upcomingRenewals: 'Subscriptions ending soon', recentKeys: 'Recent license activity', createWorkspaceAccess: 'Create workspace access', keyWarning: 'Generated AQF keys validate in a new browser profile; activation, revocation and account records remain local to this browser.', secureBackendNote: 'For a production service, use a shared API and hosted database for account and license enforcement.', shareKeysSafely: 'Share each generated key securely with its intended supplier.',
    createNewOrder: 'Create a new order', orderFormCopy: 'Add the delivery details and we’ll put it straight into the queue.', selectCustomer: 'Select customer', chooseCustomer: 'Choose a customer', product: 'Product', deliveryDate: 'Delivery date', notes: 'Delivery notes', notesPlaceholder: 'Gate code, preferred time, can exchange…', createOrder: 'Add to delivery queue', orderAdded: 'Order added to your delivery queue.', createNewCustomer: 'Add a customer', editCustomer: 'Edit customer', customerFormCopy: 'Add a delivery address and the details your team needs.', customerAdded: 'Customer added to your workspace.', saveCustomer: 'Save customer', frequency: 'Delivery frequency', selectRoute: 'Assign a route', createExpense: 'Record a new expense', expenseFormCopy: 'Keep your day-to-day operating costs in one place.', saveExpense: 'Save expense', expenseAdded: 'Expense recorded.', customDaysLabel: 'Custom duration', keyCreated: 'License key created.', signupSuccess: 'Workspace activated. Welcome to AquaFlow!', keyInvalid: 'That key is not available. Check the key or ask your administrator for a new one.', emailExists: 'An account with this email already exists.', invalidLogin: 'Email or password did not match. Try the demo access below.', missingFields: 'Please complete all required fields.',
    weeklyDispatch: 'Weekly dispatch', busiestRoute: 'Busiest route', stockValue: 'Stock value', smallBusiness: 'Water delivery operations',
    inFlow: 'On track', needAttention: 'Needs attention', confirmRevoke: 'Revoke this license key?', revoke: 'Revoke', cancel: 'Cancel', close: 'Close', total: 'Total', today: 'Today', yesterday: 'Yesterday', showingSample: 'Sample workspace data · saved in this browser',
    signInAdmin: 'Master administrator sign in', signInOwner: 'Water supplier sign in', passwordRule: 'At least 6 characters', noKey: 'Need a key? Sign in as master admin and create one.', ratePerCan: 'Rs 140 / 19L can', newWorkspace: 'New workspace', subscriptionUnavailable: 'This workspace subscription is inactive or has expired.', contactAdmin: 'Please contact your AquaFlow platform administrator to renew or restore access.',

  },
  ur: {
    navHome: 'ہوم', navFeatures: 'خصوصیات', navPlans: 'پلانز', navSignIn: 'لاگ اِن', startFree: 'شروع کریں',
    heroEyebrow: 'واٹر ڈیلیوری کا مکمل نظام', heroFirst: 'ہر قطرے کو', heroAccent: 'روانی سے چلائیں۔',
    heroCopy: 'آرڈرز، روٹس، واپس آنے والے کین اور آمدن — سب ایک خوبصورت اور آسان ورک اسپیس میں۔',
    exploreDemo: 'لائیو ڈیمو دیکھیں', seeHow: 'یہ کیسے کام کرتا ہے', trusted: 'پانی پہنچانے والی ٹیموں کے لیے بنایا گیا',
    featureEyebrow: 'کم الجھن۔ زیادہ وضاحت۔', featureTitle: 'آپ کا پورا واٹر بزنس، ایک جگہ۔',
    featureCopy: 'پہلی کسٹمر کال سے دن کے آخری خالی کین تک، ہر کام کی صورتحال ایک نظر میں جانیں۔',
    featureOrders: 'آرڈرز ہمیشہ قابو میں', featureOrdersCopy: 'آرڈر فوری درج کریں، واجب ڈیلیوری دیکھیں اور ہر آرڈر کو دروازے تک ٹریک کریں۔',
    featureCustomers: 'کسٹمرز کی مکمل تفصیل', featureCustomersCopy: 'ڈیلیوری ترجیحات، کین بیلنس اور ادائیگی کا ریکارڈ ساتھ رکھیں۔',
    featureStock: 'اسٹاک کی درست گنتی', featureStockCopy: 'بھرے اور خالی کین، بوتلیں اور پیکنگ سامان ٹریک کریں۔',
    featureRoutes: 'حقیقی روٹس کی منصوبہ بندی', featureRoutesCopy: 'ہر ڈرائیور کے لیے درست اسٹاپس، پیش رفت اور بہتر ڈیلیوری۔',
    featureFinance: 'حساب کتاب واضح', featureFinanceCopy: 'وصولی، بقایا انوائس اور روزانہ اخراجات ایک جگہ دیکھیں۔',
    featureBilingual: 'اردو یا English، آپ کی مرضی۔', featureBilingualCopy: 'آپ کی پوری ٹیم کے لیے آسان دو لسانی نظام، موبائل اور کمپیوٹر دونوں پر۔',
    platformEyebrow: 'آپ کے روزمرہ کام کے مطابق', platformTitle: 'پلانٹ سے گاہک کے دروازے تک۔', platformCopy: 'آرڈر کس نے کیا، ڈپو سے کیا نکلا، کتنے کین واپس آئے اور ادائیگی کس نے کی — سب ایک جگہ۔',
    platformOrders: 'ہر آرڈر واضح نظر آئے', platformRoutes: 'ڈرائیور کو اگلا اسٹاپ معلوم ہو', platformCans: 'کوئی کین گم نہ ہو',
    planEyebrow: 'آسان سبسکرپشن پلان', planTitle: 'بغیر الجھن کے کاروبار بڑھائیں۔', planCopy: 'اپنے کاروبار کے مطابق سبسکرپشن منتخب کریں۔ ماسٹر ایڈمن ماہانہ، سہ ماہی، سالانہ یا حسبِ ضرورت ایکسس کی دے سکتا ہے۔',
    choosePlan: 'یہ پلان منتخب کریں', askAdmin: 'اپنے ایڈمن سے رابطہ کریں', priceNote: 'سبسکرپشن ماسٹر ایڈمن کی جاری کردہ لائسنس کی سے فعال ہوتی ہے۔',
    footerLine: 'پانی کی ہر ڈیلیوری کو آسان بنانے کے لیے۔', footerProduct: 'پروڈکٹ', footerGetStarted: 'شروع کریں', footerSignIn: 'لاگ اِن',
    authWelcome: 'پانی، بہتر انتظام کے ساتھ۔', authAsideCopy: 'کسٹمر آرڈر سے لے کر آخری کین واپسی تک، اپنے ڈیلیوری بزنس کو آسانی سے چلائیں۔', authAsideFoot: 'کاروبار روانی سے چلائیں۔', authLoginTitle: 'واپس خوش آمدید', authLoginCopy: 'اپنے AquaFlow ورک اسپیس میں لاگ اِن کریں۔', authSignupTitle: 'اپنا ورک اسپیس بنائیں', authSignupCopy: 'تفصیلات اور ماسٹر ایڈمن کی لائسنس کی درج کریں۔',
    email: 'ای میل ایڈریس', password: 'پاس ورڈ', fullName: 'آپ کا نام', businessName: 'کاروبار کا نام', licenseKey: 'لائسنس کی', emailPlaceholder: 'you@business.com', passwordPlaceholder: 'پاس ورڈ درج کریں', namePlaceholder: 'مثلاً حمزہ خان', businessPlaceholder: 'مثلاً بلیو اسپرنگ واٹر', keyPlaceholder: 'AQF-XXXX-XXXX-XXXX', remember: 'مجھے یاد رکھیں', forgot: 'پاس ورڈ بھول گئے؟', loginButton: 'ورک اسپیس میں لاگ اِن', signupButton: 'اکاؤنٹ بنائیں اور فعال کریں', noAccount: 'AquaFlow پر نئے ہیں؟', haveAccount: 'پہلے سے اکاؤنٹ ہے؟', signUp: 'اکاؤنٹ بنائیں', signIn: 'لاگ اِن',
    demoAccess: 'ڈیمو ورک اسپیس آزمائیں', demoOwner: 'واٹر سپلائر ڈیمو', demoAdmin: 'ماسٹر ایڈمن کھولیں', demoCredentials: 'ڈیمو لاگ اِن', ownerAccess: 'سپلائر · owner@aquaflow.pk · demo1234', masterAccess: 'ماسٹر ایڈمن · admin@aquaflow.pk · AquaAdmin2026!', availableDemoKey: 'دستیاب ڈیمو کی', useDemoKey: 'کی استعمال کریں', noAvailableKeys: 'کوئی غیر استعمال شدہ کی نہیں۔ ماسٹر ایڈمن میں لاگ اِن کر کے نئی کی بنائیں۔', masterHint: 'ماسٹر ایڈمنسٹریٹر', keyHint: 'اکاؤنٹ بناتے وقت یہ کی آپ کی سبسکرپشن فعال کرے گی۔', backHome: 'ویب سائٹ پر واپس',
    overview: 'جائزہ', orders: 'آرڈرز', customers: 'کسٹمرز', deliveries: 'ڈیلیوری اور روٹس', inventory: 'انوینٹری', billing: 'بلنگ اور اخراجات', reports: 'رپورٹس', settings: 'ترتیبات', workspace: 'ورک اسپیس', operations: 'آپریشنز', finance: 'فنانس', system: 'سسٹم',
    hello: 'صبح بخیر', todaySummary: 'آج آپ کے واٹر بزنس میں کیا ہو رہا ہے، ایک نظر میں۔', todayDeliveries: 'آج کی ڈیلیوریز', monthlyRevenue: 'ماہانہ آمدن', activeCustomers: 'فعال کسٹمرز', cansCirculating: 'گردش میں کین', vsLastWeek: 'گزشتہ ہفتے سے', onSchedule: 'وقت پر', collectedThisMonth: 'اس ماہ وصولی', returnableCans: 'واپس آنے والے کین', newOrder: 'نیا آرڈر', addCustomer: 'کسٹمر شامل کریں', dispatchRoutes: 'روٹس دیکھیں', viewAll: 'سب دیکھیں', recentOrders: 'حالیہ آرڈرز', liveOperations: 'لائیو آپریشنز', revenueOverview: 'آمدن کا جائزہ', last7Days: 'گزشتہ 7 دن', routeProgress: 'روٹ کی پیش رفت', onTheRoad: 'راستے میں', stockNeedsAttention: 'اسٹاک پر توجہ دیں', allInventory: 'مکمل انوینٹری', lowStock: 'کم اسٹاک', filledCans: 'بھرے کین', emptyCans: 'خالی کین', returnedToday: 'آج واپس آئے', outForDelivery: 'ڈیلیوری کے لیے روانہ',
    search: 'تلاش کریں…', notifications: 'نوٹیفکیشنز', platformAdmin: 'پلیٹ فارم ایڈمن', demoWorkspace: 'ڈیمو ورک اسپیس', signOut: 'لاگ آؤٹ', switchLanguage: 'English',
    pageOrdersCopy: 'ہر واٹر آرڈر درج کریں، ٹریک کریں اور مکمل کریں۔', pageCustomersCopy: 'ڈیلیوری، رابطہ اور کین بیلنس کی تفصیل ساتھ رکھیں۔', pageDeliveriesCopy: 'روٹس بھیجیں، ڈرائیورز کو ٹریک کریں اور ہر اسٹاپ مکمل کریں۔', pageInventoryCopy: 'جانیں کیا تیار ہے، کیا واپس آیا اور کس چیز کا اسٹاک کم ہے۔', pageBillingCopy: 'وصولی، کسٹمر بقایا اور کاروباری اخراجات ایک نظر میں۔', pageReportsCopy: 'ڈیلیوری، آمدن اور روٹس کی کارکردگی کا جائزہ۔', pageSettingsCopy: 'AquaFlow کو اپنے واٹر بزنس کے مطابق بنائیں۔',
    order: 'آرڈر', customer: 'کسٹمر', items: 'کین', delivery: 'ڈیلیوری', amount: 'رقم', payment: 'ادائیگی', status: 'حالت', actions: 'ایکشن', route: 'روٹ', phone: 'فون', address: 'پتہ', balance: 'بقایا', cadence: 'ڈیلیوری کا شیڈول', since: 'کسٹمر بنے',
    delivered: 'ڈیلیور ہو گیا', pending: 'باقی', onTheWay: 'راستے میں', paid: 'ادا شدہ', unpaid: 'بقایاجات', cashOnDelivery: 'ڈیلیوری پر نقد', monthlyInvoice: 'ماہانہ انوائس', markDelivered: 'ڈیلیوری مکمل کریں', exportCsv: 'CSV ڈاؤن لوڈ', filterAll: 'تمام حالتیں',
    routeStops: 'اسٹاپس', completed: 'مکمل', driver: 'ڈرائیور', vehicle: 'گاڑی', cansToday: 'آج کے کین', routeStatus: 'روٹ کی حالت', item: 'آئٹم', category: 'کیٹیگری', inStock: 'اسٹاک میں', reorderAt: 'دوبارہ آرڈر', movement: 'آج کی تبدیلی', adjustStock: 'اسٹاک تبدیل کریں', addStock: 'اسٹاک بڑھائیں', stockAdjustment: 'اسٹاک ایڈجسٹمنٹ', quantity: 'تعداد', add: 'شامل کریں', remove: 'کم کریں', saveAdjustment: 'تبدیلی محفوظ کریں',
    invoice: 'انوائس', invoices: 'انوائسز', expenses: 'اخراجات', addExpense: 'اخراجات شامل کریں', expenseName: 'خرچ کی تفصیل', categoryName: 'کیٹیگری', paidBy: 'ادائیگی بذریعہ', recordExpense: 'اخراجات درج کریں', totalCollected: 'کل وصولی', outstanding: 'بقایا رقم', monthlyExpenses: 'ماہانہ اخراجات', reportVolume: 'ڈیلیوری کی تعداد', topRoutes: 'بہترین روٹس', performance: 'کارکردگی', cansDelivered: 'ڈیلیور کین', revenue: 'آمدن', thisMonth: 'اس ماہ', avgOrder: 'اوسط آرڈر', deliveryRate: 'وقت پر ڈیلیوری',
    businessProfile: 'کاروبار کی پروفائل', businessProfileCopy: 'اس ورک اسپیس میں ٹیم کو دکھائی دینے والی تفصیلات۔', preferences: 'ترجیحات', preferencesCopy: 'AquaFlow کو اپنی روزمرہ ضرورت کے مطابق منتخب کریں۔', notificationsSettings: 'نوٹیفکیشنز', notificationsCopy: 'کم اسٹاک، نئے آرڈرز اور ختم ہوتی سبسکرپشن کی اطلاع لیں۔', language: 'ورک اسپیس کی زبان', saveChanges: 'تبدیلیاں محفوظ کریں', saved: 'تبدیلیاں محفوظ ہو گئیں', owner: 'ورک اسپیس مالک', timezone: 'ٹائم زون', currency: 'کرنسی', pricingSettings: 'پروڈکٹ کی قیمتیں', pricingMode: 'قیمت کا طریقہ', perLitre: 'فی لیٹر', per19LCan: 'فی 19 لیٹر کین', perLitreRate: 'فی لیٹر قیمت (روپے)', perCanRate: '19 لیٹر کین کی قیمت (روپے)', bottlePackPrice: '1.5 لیٹر پیک کی قیمت (روپے)', bottleCartonPrice: '500 ملی لیٹر کارٹن کی قیمت (روپے)', commsSettings: 'ڈیلیوری پیغامات', channelLink: 'واٹس ایپ چینل لنک', contactPhone: 'رابطہ فون نمبر', queryWindow: 'سوال کے لیے وقت (گھنٹے)', emailAddress: 'کسٹمر ای میل', bottleBalance: 'بوتلوں کا بقایا', bottlesDelivered: 'ڈیلیور بوتلیں', bottlesReturned: 'واپس خالی بوتلیں', paymentReceived: 'وصول شدہ ادائیگی', previousBalance: 'پچھلا بقایا', totalBalance: 'کل بقایا', sendWhatsApp: 'واٹس ایپ رپورٹ بھیجیں', sendEmail: 'ای میل رپورٹ', copyReport: 'رپورٹ کاپی کریں', reportPreview: 'ڈیلیوری رپورٹ کا جائزہ', createRoute: 'روٹ شامل کریں', editRoute: 'روٹ میں ترمیم', routeFormCopy: 'ڈیلیوری روٹ بنائیں اور اسے کسٹمرز یا آرڈرز کے ساتھ منسلک کریں۔', routeName: 'روٹ کا نام', zoneName: 'علاقہ / زون', driverName: 'ڈرائیور کا نام', vehicleNumber: 'گاڑی نمبر', plannedStops: 'مقررہ اسٹاپس', routeAdded: 'روٹ شامل ہو گیا۔', deliveryCompleted: 'ڈیلیوری مکمل درج ہو گئی۔', completeDelivery: 'ڈیلیوری مکمل کریں', deliveryCompletionCopy: 'وصول شدہ ادائیگی اور واپس آنے والے خالی کین درج کریں۔ اس کے بعد کسٹمر رپورٹ تیار ہوگی۔', orderTotal: 'آرڈر کی کل رقم', bottlesUnit: 'بوتلیں', nineteenLCan: '19 لیٹر کین', smtpLimit: 'واٹس ایپ تیار پیغام کھولتا ہے۔ ای میل ڈرافٹ کھولتی ہے؛ خودکار SMTP کے لیے محفوظ بیک اینڈ درکار ہے۔',
    monthly: 'ماہانہ', quarterly: 'سہ ماہی', yearly: 'سالانہ', custom: 'حسبِ ضرورت دن', available: 'دستیاب', active: 'فعال', expired: 'ختم شدہ', revoked: 'منسوخ', waterVolume: 'آرڈرز میں پانی کی مقدار', gallons: 'امریکی گیلن', liters: 'لیٹر', unitsTracked: 'ڈیلیوری یونٹس ٹریک ہو رہے ہیں', conversionNote: '1 امریکی گیلن = 3.785 لیٹر', generateKey: 'لائسنس کی بنائیں', licenseKeys: 'لائسنس کیز', businesses: 'ورک اسپیسز', activeLicenses: 'فعال لائسنس', availableKeys: 'دستیاب کیز', renewalsSoon: 'جلد ختم ہونے والے', collectedMonth: 'اس ماہ وصولی', createKey: 'لائسنس کی بنائیں', plan: 'پلان', duration: 'مدت', generatedFor: 'کس کے لیے', emailOptional: 'کاروباری ای میل (اختیاری)', customDays: 'دنوں کی تعداد', generate: 'کی بنائیں', copyKey: 'کی کاپی کریں', copied: 'کاپی ہو گیا', expires: 'ختم ہونے کی تاریخ', created: 'بنائی گئی', usage: 'استعمال', noResults: 'کوئی ریکارڈ نہیں ملا۔', licenseIntro: 'واٹر سپلائر ورک اسپیس کے لیے ایکسس جاری کریں، ٹریک اور منسوخ کریں۔', adminOverview: 'پلیٹ فارم کا جائزہ', adminOverviewCopy: 'آپ کے سبسکرپشن نیٹ ورک کی ایک نظر میں تفصیل۔', workspaceCount: 'رجسٹرڈ ورک اسپیسز', keyPool: 'استعمال کے لیے تیار کیز', upcomingRenewals: 'جلد ختم ہوتی سبسکرپشنز', recentKeys: 'حالیہ لائسنس سرگرمی', createWorkspaceAccess: 'ورک اسپیس ایکسس بنائیں', keyWarning: 'بنائی گئی AQF کیز نئے براؤزر پروفائل میں بھی درست ہیں؛ اکاؤنٹ، فعال کرنے اور منسوخی کا ریکارڈ اسی براؤزر میں رہتا ہے۔', secureBackendNote: 'حقیقی سروس کے لیے اکاؤنٹ اور لائسنس کی تصدیق کو مشترکہ API اور ہوسٹڈ ڈیٹابیس سے جوڑیں۔', shareKeysSafely: 'ہر کی صرف متعلقہ سپلائر کے ساتھ محفوظ طریقے سے شیئر کریں۔',
    createNewOrder: 'نیا آرڈر بنائیں', orderFormCopy: 'ڈیلیوری کی تفصیل درج کریں، ہم اسے فوراً فہرست میں شامل کریں گے۔', selectCustomer: 'کسٹمر منتخب کریں', chooseCustomer: 'کسٹمر منتخب کریں', product: 'پروڈکٹ', deliveryDate: 'ڈیلیوری کی تاریخ', notes: 'ڈیلیوری نوٹس', notesPlaceholder: 'گیٹ کوڈ، وقت، کین کی واپسی…', createOrder: 'ڈیلیوری قطار میں شامل کریں', orderAdded: 'آرڈر ڈیلیوری قطار میں شامل ہو گیا۔', createNewCustomer: 'کسٹمر شامل کریں', editCustomer: 'کسٹمر میں ترمیم', customerFormCopy: 'ڈیلیوری کے پتے اور ٹیم کی ضروری تفصیلات درج کریں۔', customerAdded: 'کسٹمر ورک اسپیس میں شامل ہو گیا۔', saveCustomer: 'کسٹمر محفوظ کریں', frequency: 'ڈیلیوری کی فریکوئنسی', selectRoute: 'روٹ منتخب کریں', createExpense: 'نیا خرچ درج کریں', expenseFormCopy: 'روزمرہ کاروباری اخراجات کا ریکارڈ رکھیں۔', saveExpense: 'خرچ محفوظ کریں', expenseAdded: 'خرچ درج ہو گیا۔', customDaysLabel: 'حسبِ ضرورت مدت', keyCreated: 'لائسنس کی بن گئی۔', signupSuccess: 'ورک اسپیس فعال ہو گیا۔ AquaFlow میں خوش آمدید!', keyInvalid: 'یہ کی دستیاب نہیں۔ دوبارہ دیکھیں یا ایڈمن سے نئی کی لیں۔', emailExists: 'اس ای میل پر اکاؤنٹ پہلے سے موجود ہے۔', invalidLogin: 'ای میل یا پاس ورڈ درست نہیں۔ نیچے ڈیمو لاگ اِن آزمائیں۔', missingFields: 'تمام ضروری خانے پُر کریں۔',
    weeklyDispatch: 'ہفتہ وار ڈیلیوری', busiestRoute: 'مصروف ترین روٹ', stockValue: 'اسٹاک کی مالیت', inFlow: 'درست چل رہا ہے', needAttention: 'توجہ درکار', confirmRevoke: 'کیا یہ لائسنس کی منسوخ کرنی ہے؟', revoke: 'منسوخ کریں', cancel: 'منسوخ', close: 'بند کریں', total: 'کل', today: 'آج', yesterday: 'کل', showingSample: 'ڈیمو ورک اسپیس کا ڈیٹا · اسی براؤزر میں محفوظ', signInAdmin: 'ماسٹر ایڈمن لاگ اِن', signInOwner: 'واٹر سپلائر لاگ اِن', passwordRule: 'کم از کم 6 حروف', noKey: 'کی نہیں؟ ماسٹر ایڈمن میں لاگ اِن کر کے نئی کی بنائیں۔', ratePerCan: 'روپے 140 / 19 لیٹر کین', newWorkspace: 'نیا ورک اسپیس', subscriptionUnavailable: 'اس ورک اسپیس کی سبسکرپشن غیر فعال یا ختم ہو چکی ہے۔', contactAdmin: 'رسائی بحال کرنے کے لیے AquaFlow پلیٹ فارم ایڈمن سے رابطہ کریں۔',
  },
};

const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => readStored(key, fallback));
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage can be unavailable */ }
  }, [key, value]);
  useEffect(() => {
    const syncFromAnotherTab = (event) => {
      if (event.storageArea !== localStorage || event.key !== key) return;
      if (event.newValue === null) {
        setValue(fallback);
        return;
      }
      try { setValue(JSON.parse(event.newValue)); } catch { setValue(fallback); }
    };
    window.addEventListener('storage', syncFromAnotherTab);
    return () => window.removeEventListener('storage', syncFromAnotherTab);
  }, [key]);
  return [value, setValue];
}

const money = (amount) => `Rs ${Number(amount || 0).toLocaleString('en-PK')}`;
const litresPerOrderUnit = (product = '') => /1\.5\s*l/i.test(product) ? 18 : /500\s*ml/i.test(product) ? 12 : 19;
const priceForUnit = (product, pricing = initialPricing) => {
  if (pricing.mode === 'per-litre') return Number(pricing.pricePerLitre || 0) * litresPerOrderUnit(product);
  if (/1\.5\s*l/i.test(product)) return Number(pricing.bottlePackPrice || 0);
  if (/500\s*ml/i.test(product)) return Number(pricing.bottleCartonPrice || 0);
  return Number(pricing.pricePerCan || 0);
};
const calculateOrderAmount = (product, quantity, pricing) => Math.round(priceForUnit(product, pricing) * Number(quantity || 0));
const shortDate = (value) => {
  if (!value) return '—';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
};
const statusKey = (status) => ({ Delivered: 'delivered', Pending: 'pending', 'On the way': 'onTheWay', Active: 'active', Available: 'available', Expired: 'expired', Revoked: 'revoked' }[status] || status);
const group = (value) => String(value).toLocaleString('en-PK');
const localISODate = (value = new Date()) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const relativeISO = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localISODate(date);
};
const isLicenseExpired = (license) => Boolean(license?.expiresAt && new Date(`${license.expiresAt}T23:59:59`) < new Date());
const licenseUnavailable = (license) => license && (license.status !== 'Active' || isLicenseExpired(license));

function Brand({ light = false, onClick }) {
  return (
    <button className={`brand ${light ? 'brand-light' : ''}`} type="button" onClick={onClick} aria-label="AquaFlow home">
      <span className="brand-mark"><Droplets size={21} strokeWidth={2.2} /></span>
      <span className="brand-text"><strong>Aqua<span>Flow</span></strong><small>WATER OPERATIONS</small></span>
    </button>
  );
}

function LanguageButton({ language, setLanguage }) {
  return (
    <button className="language-button" type="button" onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')} aria-label="Switch language">
      <Languages size={16} /><span>{language === 'en' ? 'اردو' : 'English'}</span>
    </button>
  );
}

function App() {
  const [language, setLanguage] = useStoredState('aquaflow-language', 'en');
  const [screen, setScreen] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [session, setSession] = useStoredState('aquaflow-session', null);
  const [accounts, setAccounts] = useStoredState('aquaflow-accounts', []);
  const [licenses, setLicenses] = useStoredState('aquaflow-licenses', initialLicenses);
  const [orders, setOrders] = useStoredState('aquaflow-orders', initialOrders);
  const [customers, setCustomers] = useStoredState('aquaflow-customers', initialCustomers);
  const [inventory, setInventory] = useStoredState('aquaflow-inventory', initialInventory);
  const [expenses, setExpenses] = useStoredState('aquaflow-expenses', initialExpenses);
  const [routes, setRoutes] = useStoredState('aquaflow-routes', initialRoutes);
  const [pricing, setPricing] = useStoredState('aquaflow-pricing', initialPricing);
  const [comms, setComms] = useStoredState('aquaflow-comms', initialComms);
  const t = (key) => dictionaries[language]?.[key] ?? dictionaries.en[key] ?? key;

  useEffect(() => {
    document.documentElement.lang = language === 'ur' ? 'ur' : 'en';
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.body.classList.toggle('urdu-mode', language === 'ur');
  }, [language]);

  useEffect(() => {
    document.title = 'AquaFlow — Water, in good hands.';
  }, []);

  const openAuth = (mode = 'login') => { setAuthMode(mode); setScreen('auth'); };
  const demoLogin = (role) => {
    setSession(role === 'master'
      ? { role: 'master', name: 'AquaFlow Platform', email: 'admin@aquaflow.pk' }
      : { role: 'owner', name: 'Hamza Khan', business: 'BlueSpring Water Co.', email: 'owner@aquaflow.pk', license: 'AQF-8H4K-2M6P-9X7C' });
    setScreen('app');
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === 'admin@aquaflow.pk' && password === 'AquaAdmin2026!') {
      demoLogin('master');
      return { ok: true };
    }
    if (normalizedEmail === 'owner@aquaflow.pk' && password === 'demo1234') {
      demoLogin('owner');
      return { ok: true };
    }
    const account = accounts.find((entry) => entry.email.toLowerCase() === normalizedEmail && entry.password === password);
    if (account) {
      const accountLicense = licenses.find((entry) => entry.code === account.license);
      if (licenseUnavailable(accountLicense)) return { ok: false, error: t('subscriptionUnavailable') };
      setSession({ role: 'owner', name: account.name, business: account.business, email: account.email, license: account.license });
      setScreen('app');
      return { ok: true };
    }
    return { ok: false, error: t('invalidLogin') };
  };

  const signup = ({ name, business, email, password, licenseKey }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim() || !business.trim() || !cleanEmail || password.length < 6 || !licenseKey.trim()) return { ok: false, error: t('missingFields') };
    if (accounts.some((account) => account.email.toLowerCase() === cleanEmail) || cleanEmail === 'owner@aquaflow.pk' || cleanEmail === 'admin@aquaflow.pk') return { ok: false, error: t('emailExists') };
    const normalizedKey = normalizeLicenseCode(licenseKey);
    const existingKey = licenses.find((entry) => normalizeLicenseCode(entry.code) === normalizedKey);
    if (existingKey && existingKey.status !== 'Available') return { ok: false, error: t('keyInvalid') };
    const portableKey = existingKey ? null : parsePortableLicense(licenseKey);
    const key = existingKey || (portableKey && { ...portableKey, id: `LIC-${Date.now()}`, status: 'Available', business: 'Portable demo key', email: '', createdAt: localISODate(), expiresAt: '' });
    if (!key) return { ok: false, error: t('keyInvalid') };
    const expiry = relativeISO(Number(key.days) || 30);
    const createdAccount = { name: name.trim(), business: business.trim(), email: cleanEmail, password, license: key.code };
    const activatedKey = { ...key, status: 'Active', business: business.trim(), email: cleanEmail, expiresAt: expiry, createdAt: localISODate() };
    setAccounts((previous) => [...previous, createdAccount]);
    setLicenses((previous) => previous.some((entry) => normalizeLicenseCode(entry.code) === normalizedKey)
      ? previous.map((entry) => normalizeLicenseCode(entry.code) === normalizedKey ? activatedKey : entry)
      : [activatedKey, ...previous]);
    setSession({ role: 'owner', name: name.trim(), business: business.trim(), email: cleanEmail, license: key.code });
    setScreen('app');
    return { ok: true };
  };

  const logout = () => { setSession(null); setScreen('landing'); };

  if (session?.role === 'master') {
    return <MasterDashboard session={session} language={language} setLanguage={setLanguage} t={t} licenses={licenses} setLicenses={setLicenses} onLogout={logout} onOpenDemo={() => demoLogin('owner')} />;
  }
  const signedInLicense = session?.role === 'owner' && session.license ? licenses.find((entry) => entry.code === session.license) : null;
  if (session?.role === 'owner' && licenseUnavailable(signedInLicense)) {
    return <SubscriptionExpired t={t} license={signedInLicense} onLogout={logout} />;
  }
  if (session?.role === 'owner') {
    return <BusinessDashboard session={session} language={language} setLanguage={setLanguage} t={t} orders={orders} setOrders={setOrders} customers={customers} setCustomers={setCustomers} inventory={inventory} setInventory={setInventory} expenses={expenses} setExpenses={setExpenses} routes={routes} setRoutes={setRoutes} pricing={pricing} setPricing={setPricing} comms={comms} setComms={setComms} onUpdateProfile={(profile) => { setSession((previous) => ({ ...previous, ...profile })); setAccounts((previous) => previous.map((account) => account.email === session.email ? { ...account, ...profile } : account)); }} onLogout={logout} />;
  }
  if (screen === 'auth') {
    return <AuthPage t={t} language={language} setLanguage={setLanguage} initialMode={authMode} availableKeys={licenses.filter((entry) => entry.status === 'Available')} onBack={() => setScreen('landing')} onLogin={login} onSignup={signup} onDemoOwner={() => demoLogin('owner')} onDemoAdmin={() => demoLogin('master')} />;
  }
  return <LandingPage t={t} language={language} setLanguage={setLanguage} onLogin={() => openAuth('login')} onSignup={() => openAuth('signup')} onDemo={() => demoLogin('owner')} />;
}

function SubscriptionExpired({ t, license, onLogout }) {
  return <main className="expired-page"><div className="expired-card"><Brand onClick={onLogout} /><span className="expired-icon"><ShieldCheck size={25} /></span><h1>{t('subscriptionUnavailable')}</h1><p>{t('contactAdmin')}</p><div className="expired-license"><span>License key</span><strong>{license?.code || 'AquaFlow workspace'}</strong><small>{license?.expiresAt ? `${t('expires')}: ${shortDate(license.expiresAt)}` : t(statusKey(license?.status || 'Revoked'))}</small></div><button className="button button-primary" type="button" onClick={onLogout}><LogOut size={15} />{t('signOut')}</button></div></main>;
}

function LandingPage({ t, language, setLanguage, onLogin, onSignup, onDemo }) {
  return (
    <div className="landing-page">
      <header className="site-nav">
        <Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <nav className="site-links" aria-label="Main navigation">
          <a href="#features">{t('navFeatures')}</a><a href="#how-it-works">{t('navHome')}</a><a href="#plans">{t('navPlans')}</a>
        </nav>
        <div className="site-actions"><LanguageButton language={language} setLanguage={setLanguage} /><button className="nav-login" type="button" onClick={onLogin}>{t('navSignIn')}</button><button className="button button-primary button-small" type="button" onClick={onSignup}>{t('startFree')}<ArrowRight size={15} /></button></div>
      </header>
      <main>
        <section className="landing-hero">
          <div className="hero-copy animate-in">
            <div className="eyebrow"><span className="eyebrow-dot" />{t('heroEyebrow')}</div>
            <h1>{t('heroFirst')} <em>{t('heroAccent')}</em></h1>
            <p>{t('heroCopy')}</p>
            <div className="hero-actions"><button className="button button-primary button-large" type="button" onClick={onDemo}>{t('exploreDemo')}<ArrowRight size={17} /></button><a className="text-link" href="#features">{t('seeHow')}<ArrowRight size={15} /></a></div>
            <div className="hero-trust"><div className="avatar-stack"><span>H</span><span>A</span><span>S</span><span>+</span></div><div><div className="trust-stars">★★★★★</div><small>Built for real water delivery teams</small></div></div>
          </div>
          <HeroIllustration t={t} />
          <div className="hero-footnote"><span className="tiny-wave">≈</span>{t('trusted')}</div>
        </section>
        <section className="logo-strip"><span className="strip-label">{t('trusted')}</span><div className="strip-brands"><span><Droplets size={17} /> BLUE<span>SPRING</span></span><span><span className="brand-dot" /> crystal drop</span><span>FRESH<span className="brand-light-text">sip</span></span><span><Zap size={15} /> PURE<span>PATH</span></span></div></section>
        <section className="feature-section" id="features">
          <div className="section-head"><div><div className="eyebrow">{t('featureEyebrow')}</div><h2>{t('featureTitle')}</h2></div><p>{t('featureCopy')}</p></div>
          <div className="features-grid">
            <FeatureCard icon={ClipboardIcon} number="01" title={t('featureOrders')} copy={t('featureOrdersCopy')} className="feature-tint-mint" />
            <FeatureCard icon={Users} number="02" title={t('featureCustomers')} copy={t('featureCustomersCopy')} className="feature-tint-cream" />
            <FeatureCard icon={Package} number="03" title={t('featureStock')} copy={t('featureStockCopy')} className="feature-tint-blue" />
            <FeatureCard icon={Truck} number="04" title={t('featureRoutes')} copy={t('featureRoutesCopy')} className="feature-tint-lavender" />
            <FeatureCard icon={Wallet} number="05" title={t('featureFinance')} copy={t('featureFinanceCopy')} className="feature-tint-peach" />
            <FeatureCard icon={Languages} number="06" title={t('featureBilingual')} copy={t('featureBilingualCopy')} className="feature-tint-lemon" />
          </div>
        </section>
        <section className="platform-section" id="how-it-works">
          <div className="platform-visual">
            <div className="platform-board"><div className="platform-board-top"><span className="board-dot" /><span className="board-dot" /><span className="board-dot" /><small>Today at BlueSpring</small></div><div className="mini-board-head"><span>Today’s run</span><span className="mini-badge">On track</span></div><div className="mini-route-line"><i /><i /><i /><i /></div><div className="mini-route-steps"><span>Plant</span><span>Clifton</span><span>DHA</span><span>Home</span></div><div className="mini-board-stats"><div><strong>128</strong><small>Deliveries</small></div><div><strong>486</strong><small>Cans ready</small></div><div><strong>94%</strong><small>On-time</small></div></div></div>
            <div className="platform-float float-cans"><Package size={18} /><span><strong>Every can accounted for</strong><small>Returns updated live</small></span><CheckCircle2 size={17} /></div>
            <div className="platform-float float-driver"><span className="driver-avatar">NK</span><span><strong>Naveed is on route</strong><small>Clifton · 8 stops left</small></span><span className="live-pulse" /></div>
          </div>
          <div className="platform-copy"><div className="eyebrow">{t('platformEyebrow')}</div><h2>{t('platformTitle')}</h2><p>{t('platformCopy')}</p><ul><li><span><Check size={15} /></span>{t('platformOrders')}</li><li><span><Check size={15} /></span>{t('platformRoutes')}</li><li><span><Check size={15} /></span>{t('platformCans')}</li></ul><button className="button button-primary" type="button" onClick={onDemo}>{t('exploreDemo')}<ArrowRight size={16} /></button></div>
        </section>
        <section className="plans-section" id="plans"><div className="plans-intro"><div className="eyebrow">{t('planEyebrow')}</div><h2>{t('planTitle')}</h2><p>{t('planCopy')}</p></div><div className="plans-grid">{businessPlans.map((plan) => <article key={plan.name} className={`plan-card ${plan.recommended ? 'plan-recommended' : ''}`}>{plan.recommended && <span className="plan-ribbon">MOST POPULAR</span>}<div className="plan-name">{plan.name}</div><div className="plan-price">{plan.price}<small>{plan.period}</small></div><p>{plan.description}</p><div className="plan-divider" />{plan.features.map((feature) => <div className="plan-feature" key={feature}><Check size={15} />{feature}</div>)}<button className={`button ${plan.recommended ? 'button-primary' : 'button-outline'} plan-button`} type="button" onClick={onSignup}>{plan.name === 'Pro' ? t('askAdmin') : t('choosePlan')}<ArrowRight size={15} /></button></article>)}</div><div className="plan-note"><ShieldCheck size={15} />{t('priceNote')}</div></section>
        <section className="landing-cta"><div className="cta-glow" /><div className="cta-content"><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" />AQUAFLOW DEMO</div><h2>Ready to make your next delivery day easier?</h2><p>Explore the workspace, try a few orders and see the whole operation come together.</p><button className="button button-white" type="button" onClick={onDemo}>{t('exploreDemo')}<ArrowRight size={16} /></button></div><div className="cta-drop"><Droplets size={110} strokeWidth={1.1} /></div></section>
      </main>
      <footer className="site-footer"><div className="footer-top"><Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} /><span>{t('footerLine')}</span><div className="footer-links"><a href="#features">{t('footerProduct')}</a><button type="button" onClick={onSignup}>{t('footerGetStarted')}</button><button type="button" onClick={onLogin}>{t('footerSignIn')}</button></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} AquaFlow. Built for better water delivery.</span><span>Water, in good hands. <Droplets size={14} /></span></div></footer>
    </div>
  );
}

function ClipboardIcon(props) { return <FileText {...props} />; }

function HeroIllustration({ t }) {
  return (
    <div className="hero-visual animate-in animate-delay" aria-label="AquaFlow delivery dashboard illustration">
      <div className="hero-visual-grid" /><div className="hero-blob hero-blob-one" /><div className="hero-blob hero-blob-two" />
      <div className="hero-visual-label"><span className="status-live" />LIVE WORKSPACE <span> · </span> KARACHI</div>
      <div className="water-can"><div className="can-cap" /><div className="can-neck" /><div className="can-shoulder" /><div className="can-body"><div className="can-shine" /><div className="can-label"><Droplets size={20} /><strong>PURE<br />WATER</strong><small>19 LITRES</small></div><div className="can-waterline" /></div><div className="can-base" /></div>
      <div className="visual-card visual-deliveries"><div className="visual-card-icon"><Truck size={17} /></div><div><small>DELIVERIES TODAY</small><strong>128 <span>+12.8%</span></strong></div><div className="tiny-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
      <div className="visual-card visual-stock"><div className="stock-icon"><Package size={16} /></div><div><strong>486 cans ready</strong><small>Stock looks good <CheckCircle2 size={12} /></small></div></div>
      <div className="visual-route"><div className="route-avatar">NK</div><div><strong>Naveed is on route</strong><small>Clifton · 8 stops left</small></div><span className="route-chevron"><ArrowUpRight size={15} /></span></div>
      <div className="bubble bubble-one" /><div className="bubble bubble-two" /><div className="bubble bubble-three" />
      <div className="visual-corner-note">A good day<br />starts with a plan<span>↗</span></div>
    </div>
  );
}

function FeatureCard({ icon: Icon, number, title, copy, className }) {
  return <article className={`feature-card ${className}`}><div className="feature-card-top"><span className="feature-icon"><Icon size={20} /></span><span className="feature-number">{number}</span></div><h3>{title}</h3><p>{copy}</p><span className="feature-arrow"><ArrowUpRight size={16} /></span></article>;
}

function AuthPage({ t, language, setLanguage, initialMode, availableKeys = [], onBack, onLogin, onSignup, onDemoOwner, onDemoAdmin }) {
  const [mode, setMode] = useState(initialMode || 'login');
  const [form, setForm] = useState({ name: '', business: '', email: '', password: '', licenseKey: initialMode === 'signup' ? availableKeys[0]?.code || '' : '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const submit = (event) => {
    event.preventDefault(); setError('');
    const result = mode === 'login' ? onLogin(form) : onSignup(form);
    if (!result?.ok) setError(result?.error || t('missingFields'));
  };
  const toggleMode = (next) => {
    setError('');
    if (next === 'signup' && !form.licenseKey && availableKeys[0]) update('licenseKey', availableKeys[0].code);
    setMode(next);
  };
  return (
    <div className="auth-page">
      <header className="auth-topbar"><Brand onClick={onBack} /><div className="auth-top-actions"><LanguageButton language={language} setLanguage={setLanguage} /><button className="back-site" type="button" onClick={onBack}><ArrowLeft size={15} />{t('backHome')}</button></div></header>
      <main className="auth-shell">
        <section className="auth-story"><div className="auth-story-shape shape-a" /><div className="auth-story-shape shape-b" /><div className="auth-story-content"><div className="auth-kicker"><span className="eyebrow-dot" />AQUAFLOW WORKSPACE</div><h1>{t('authWelcome')}</h1><p>{t('authAsideCopy')}</p><div className="auth-illustration"><div className="auth-can"><div className="auth-can-top" /><div className="auth-can-body"><Droplets size={26} /><span>PURE<br />WATER</span><small>19 L</small></div><div className="auth-can-base" /></div><div className="auth-orbit orbit-a" /><div className="auth-orbit orbit-b" /><div className="auth-wave wave-a" /><div className="auth-wave wave-b" /><div className="auth-mini-stat"><span className="mini-stat-icon"><Check size={15} /></span><div><strong>Delivery complete</strong><small>Clifton · just now</small></div></div><div className="auth-mini-chip"><span className="status-live" /> 24 routes active</div></div><div className="auth-story-foot"><span>01</span><div /><span>{t('authAsideFoot')}</span></div></div></section>
        <section className="auth-form-section"><div className="auth-form-card"><div className="auth-form-heading"><div className="auth-mode-switch"><button className={mode === 'login' ? 'selected' : ''} type="button" onClick={() => toggleMode('login')}>{t('signIn')}</button><button className={mode === 'signup' ? 'selected' : ''} type="button" onClick={() => toggleMode('signup')}>{t('signUp')}</button></div><h2>{mode === 'login' ? t('authLoginTitle') : t('authSignupTitle')}</h2><p>{mode === 'login' ? t('authLoginCopy') : t('authSignupCopy')}</p></div>
          <form className="auth-form" onSubmit={submit}>
            {mode === 'signup' && <><FormField label={t('fullName')} icon={Users}><input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder={t('namePlaceholder')} required /></FormField><FormField label={t('businessName')} icon={Building2}><input value={form.business} onChange={(event) => update('business', event.target.value)} placeholder={t('businessPlaceholder')} required /></FormField></>}
            <FormField label={t('email')} icon={Globe2}><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder={t('emailPlaceholder')} required autoComplete="email" /></FormField>
            <FormField label={t('password')} icon={ShieldCheck}><div className="password-wrap"><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => update('password', event.target.value)} placeholder={t('passwordPlaceholder')} required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Show password">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></FormField>
            {mode === 'login' ? <div className="form-row"><label className="check-label"><input type="checkbox" defaultChecked />{t('remember')}</label><button className="text-button" type="button" onClick={() => setError(t('noKey'))}>{t('forgot')}</button></div> : <><FormField label={t('licenseKey')} icon={ShieldCheck} hint={t('keyHint')}><input value={form.licenseKey} onChange={(event) => update('licenseKey', event.target.value.toUpperCase())} placeholder={t('keyPlaceholder')} required autoCapitalize="characters" /></FormField><div className="available-key-helper">{availableKeys[0] ? <><span><small>{t('availableDemoKey')}</small><code>{availableKeys[0].code}</code></span><button type="button" onClick={() => update('licenseKey', availableKeys[0].code)}>{t('useDemoKey')}</button></> : <small>{t('noAvailableKeys')}</small>}</div></>}
            {error && <div className="form-error"><X size={15} />{error}</div>}
            <button className="button button-primary button-full" type="submit">{mode === 'login' ? t('loginButton') : t('signupButton')}<ArrowRight size={16} /></button>
          </form>
          {mode === 'login' ? <div className="demo-access"><div className="demo-access-heading"><span><Sparkles size={15} />{t('demoAccess')}</span><span className="demo-pill">NO SETUP</span></div><button type="button" className="demo-choice" onClick={onDemoOwner}><span className="demo-choice-icon"><Droplets size={16} /></span><span><strong>{t('demoOwner')}</strong><small>{t('ownerAccess')}</small></span><ChevronRight size={16} /></button><button type="button" className="demo-choice" onClick={onDemoAdmin}><span className="demo-choice-icon admin-demo"><ShieldCheck size={16} /></span><span><strong>{t('demoAdmin')}</strong><small>{t('masterAccess')}</small></span><ChevronRight size={16} /></button></div> : <div className="signup-note"><ShieldCheck size={16} /><span>{t('noKey')}</span></div>}
          <div className="auth-switch-copy">{mode === 'login' ? t('noAccount') : t('haveAccount')} <button type="button" onClick={() => toggleMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? t('signUp') : t('signIn')}</button></div>
        </div><div className="auth-secure"><ShieldCheck size={14} /> Your workspace is protected by AquaFlow access controls</div></section>
      </main>
    </div>
  );
}

function FormField({ label, icon: Icon, children, hint }) {
  return <label className="form-field"><span className="field-label">{label}</span><span className="field-control">{children}{Icon && <span className="field-icon"><Icon size={16} /></span>}</span>{hint && <small className="field-hint">{hint}</small>}</label>;
}

const businessNavGroups = [
  { label: 'workspace', items: [{ id: 'overview', key: 'overview', icon: LayoutDashboard }] },
  { label: 'operations', items: [{ id: 'orders', key: 'orders', icon: ClipboardListIcon }, { id: 'customers', key: 'customers', icon: Users }, { id: 'deliveries', key: 'deliveries', icon: Truck }, { id: 'inventory', key: 'inventory', icon: Package }] },
  { label: 'finance', items: [{ id: 'billing', key: 'billing', icon: Wallet }, { id: 'reports', key: 'reports', icon: FileBarChart2 }] },
  { label: 'system', items: [{ id: 'settings', key: 'settings', icon: Settings }] },
];
function ClipboardListIcon(props) { return <FileText {...props} />; }

function BusinessDashboard({ session, language, setLanguage, t, orders, setOrders, customers, setCustomers, inventory, setInventory, expenses, setExpenses, routes, setRoutes, pricing, setPricing, comms, setComms, onUpdateProfile, onLogout }) {
  const [section, setSection] = useState('overview');
  const [modal, setModal] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [toast, setToast] = useState('');
  const title = t(section === 'overview' ? 'overview' : section);
  const showToast = (text) => { setToast(text); window.setTimeout(() => setToast(''), 2800); };
  const createOrder = (data) => {
    const customer = customers.find((entry) => entry.id === data.customerId);
    if (!customer) { showToast(t('chooseCustomer')); return; }
    const nextNumber = Math.max(1286, ...orders.map((order) => Number(order.id.replace(/\D/g, '')) || 0)) + 1;
    const order = { id: `ORD-${nextNumber}`, customer: customer.name, phone: customer.phone, address: customer.address, cans: Number(data.cans), product: data.product, amount: Number(data.amount ?? calculateOrderAmount(data.product, data.cans, pricing)), payment: data.payment, status: 'Pending', time: 'Just now', route: data.route || customer.route, date: data.deliveryDate || localISODate(), notes: data.notes };
    setOrders((previous) => [order, ...previous]); setModal(null); setSection('orders'); showToast(t('orderAdded'));
  };
  const createCustomer = (data) => {
    if (data.id) {
      setCustomers((previous) => previous.map((entry) => entry.id === data.id ? { ...entry, ...data, bottleBalance: Number(data.bottleBalance) || 0 } : entry));
      setModal(null); setSection('customers'); showToast(t('saved')); return;
    }
    const nextNumber = Math.max(821, ...customers.map((entry) => Number(entry.id.replace(/\D/g, '')) || 0)) + 1;
    setCustomers((previous) => [{ ...data, id: `CUS-${String(nextNumber).padStart(4, '0')}`, balance: 0, cans: 0, bottleBalance: Number(data.bottleBalance) || 0, since: new Date().toLocaleDateString('en-PK', { month: 'short', year: 'numeric' }) }, ...previous]);
    setModal(null); setSection('customers'); showToast(t('customerAdded'));
  };
  const createRoute = (data) => {
    if (data.id) {
      const oldRoute = routes.find((route) => route.id === data.id);
      const updatedRoute = { ...oldRoute, ...data, stops: Number(data.stops) || oldRoute?.stops || 1 };
      setRoutes((previous) => previous.map((route) => route.id === data.id ? updatedRoute : route));
      const routeLabel = `${data.name} · ${data.id}`;
      setCustomers((previous) => previous.map((customer) => customer.route?.includes(data.id) ? { ...customer, route: routeLabel } : customer));
      setOrders((previous) => previous.map((order) => order.route?.includes(data.id) ? { ...order, route: routeLabel } : order));
      setModal(null); showToast(t('saved')); return;
    }
    const nextNumber = Math.max(0, ...routes.map((route) => Number(String(route.id).replace(/\D/g, '')) || 0)) + 1;
    const colors = ['mint', 'blue', 'orange', 'purple'];
    setRoutes((previous) => [{ ...data, id: `R${nextNumber}`, stops: Number(data.stops) || 0, done: 0, cans: 0, status: 'Ready to dispatch', color: colors[nextNumber % colors.length] }, ...previous]);
    setModal(null); setSection('deliveries'); showToast(t('routeAdded'));
  };
  const adjustStock = ({ id, amount, action }) => {
    setInventory((previous) => previous.map((item) => item.id === id ? { ...item, stock: Math.max(0, item.stock + (action === 'add' ? amount : -amount)), movement: action === 'add' ? `+${amount} today` : `−${amount} today` } : item));
    setModal(null); showToast(t('saved'));
  };
  const createExpense = (data) => {
    setExpenses((previous) => [{ ...data, id: `EXP-${String(Date.now()).slice(-3)}`, date: localISODate() }, ...previous]);
    setModal(null); setSection('billing'); showToast(t('expenseAdded'));
  };
  const markDelivered = (id) => {
    const order = orders.find((entry) => entry.id === id);
    if (order) setModal({ type: 'complete-delivery', order });
  };
  const completeDelivery = ({ orderId, paymentReceived, bottlesReturned }) => {
    const order = orders.find((entry) => entry.id === orderId);
    if (!order) return;
    const customer = customers.find((entry) => entry.name === order.customer || entry.phone === order.phone);
    const received = Number(paymentReceived) || 0;
    const previousBalance = Number(customer?.balance) || 0;
    const previousBottles = Number(customer?.bottleBalance) || 0;
    const returned = Number(bottlesReturned) || 0;
    const { bottleBalance, totalBalance } = calculateDeliveryBalances({ previousBalance, bottleBalance: previousBottles, orderAmount: order.amount, bottlesDelivered: order.cans, paymentReceived: received, bottlesReturned: returned });
    const deliveredAt = localISODate();
    const updatedOrder = { ...order, status: 'Delivered', time: 'Just now', date: deliveredAt, paymentReceived: received, previousBalance, emptyReturned: returned, bottleBalance, totalBalance, payment: received >= Number(order.amount || 0) ? 'Paid' : 'Unpaid' };
    const updatedCustomer = customer ? { ...customer, balance: totalBalance, bottleBalance } : null;
    setOrders((previous) => previous.map((entry) => entry.id === orderId ? updatedOrder : entry));
    if (customer) setCustomers((previous) => previous.map((entry) => entry.id === customer.id ? updatedCustomer : entry));
    setInventory((previous) => previous.map((item) => item.id === 'INV-01'
      ? { ...item, stock: Math.max(0, item.stock - Number(order.cans || 0)), movement: `−${Number(order.cans || 0)} delivered` }
      : item.id === 'INV-02' ? { ...item, stock: item.stock + returned, movement: `+${returned} returned` } : item));
    const routeId = String(order.route || '').match(/R\d+/)?.[0];
    if (routeId) setRoutes((previous) => previous.map((route) => route.id === routeId ? { ...route, done: Math.min(route.stops, Number(route.done || 0) + 1), cans: Number(route.cans || 0) + Number(order.cans || 0), status: Number(route.done || 0) + 1 >= Number(route.stops || 0) ? 'Completed' : 'In progress' } : route));
    setModal({ type: 'delivery-report', order: updatedOrder, customer: updatedCustomer || { name: order.customer, phone: order.phone, email: '' } });
    showToast(t('deliveryCompleted'));
  };
  const openDeliveryReport = (order) => {
    const customer = customers.find((entry) => entry.name === order.customer || entry.phone === order.phone) || { name: order.customer, phone: order.phone, email: '' };
    setModal({ type: 'delivery-report', order, customer });
  };
  const currentPageTitle = section === 'overview' ? t('overview') : title;
  const currentDescription = ({ orders: 'pageOrdersCopy', customers: 'pageCustomersCopy', deliveries: 'pageDeliveriesCopy', inventory: 'pageInventoryCopy', billing: 'pageBillingCopy', reports: 'pageReportsCopy', settings: 'pageSettingsCopy' })[section];
  return (
    <div className="app-shell">
      <BusinessSidebar session={session} section={section} setSection={(value) => { setSection(value); setMobileNav(false); }} t={t} onLogout={onLogout} mobileNav={mobileNav} onClose={() => setMobileNav(false)} />
      <div className="app-workspace">
        <AppTopbar title={currentPageTitle} language={language} setLanguage={setLanguage} t={t} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} noticeOpen={noticeOpen} setNoticeOpen={setNoticeOpen} onMenu={() => setMobileNav(true)} onNew={() => setModal({ type: 'order' })} lowStock={inventory.filter((item) => item.stock < item.reorder).length} pending={orders.filter((order) => order.status !== 'Delivered').length} />
        <main className="dashboard-content">
          {section !== 'overview' && <PageHeading title={currentPageTitle} description={currentDescription ? t(currentDescription) : ''} action={section === 'orders' ? <button className="button button-primary" onClick={() => setModal({ type: 'order' })}><Plus size={16} />{t('newOrder')}</button> : section === 'customers' ? <button className="button button-primary" onClick={() => setModal({ type: 'customer' })}><Plus size={16} />{t('addCustomer')}</button> : section === 'deliveries' ? <button className="button button-primary" onClick={() => setModal({ type: 'route' })}><Plus size={16} />{t('createRoute')}</button> : section === 'inventory' ? <button className="button button-primary" onClick={() => setModal({ type: 'stock' })}><Plus size={16} />{t('adjustStock')}</button> : section === 'billing' ? <button className="button button-primary" onClick={() => setModal({ type: 'expense' })}><Plus size={16} />{t('addExpense')}</button> : null} />}
          {section === 'overview' && <OverviewPage t={t} session={session} orders={orders} customers={customers} inventory={inventory} routes={routes} onNewOrder={() => setModal({ type: 'order' })} onNewCustomer={() => setModal({ type: 'customer' })} onNewRoute={() => setModal({ type: 'route' })} onGoTo={setSection} onMarkDelivered={markDelivered} onSendReport={openDeliveryReport} />}
          {section === 'orders' && <OrdersPage t={t} orders={orders} query={globalSearch} onMarkDelivered={markDelivered} onSendReport={openDeliveryReport} onNewOrder={() => setModal({ type: 'order' })} />}
          {section === 'customers' && <CustomersPage t={t} customers={customers} query={globalSearch} onAdd={() => setModal({ type: 'customer' })} onEdit={(customer) => setModal({ type: 'customer', customer })} />}
          {section === 'deliveries' && <DeliveriesPage t={t} orders={orders} routes={routes} onMarkDelivered={markDelivered} onSendReport={openDeliveryReport} onEditRoute={(route) => setModal({ type: 'route', route })} />}
          {section === 'inventory' && <InventoryPage t={t} inventory={inventory} onAdjust={() => setModal({ type: 'stock' })} />}
          {section === 'billing' && <BillingPage t={t} orders={orders} customers={customers} expenses={expenses} onAddExpense={() => setModal({ type: 'expense' })} />}
          {section === 'reports' && <ReportsPage t={t} orders={orders} routes={routes} expenses={expenses} />}
          {section === 'settings' && <SettingsPage t={t} language={language} setLanguage={setLanguage} session={session} onUpdateProfile={onUpdateProfile} pricing={pricing} setPricing={setPricing} comms={comms} setComms={setComms} onToast={showToast} />}
          <div className="demo-disclaimer"><Sparkles size={13} />{t('showingSample')}</div>
        </main>
      </div>
      {mobileNav && <button type="button" className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileNav(false)} />}
      {modal?.type === 'order' && <NewOrderModal t={t} customers={customers} routes={routes} pricing={pricing} onClose={() => setModal(null)} onSubmit={createOrder} />}
      {modal?.type === 'customer' && <NewCustomerModal t={t} routes={routes} customer={modal.customer} onClose={() => setModal(null)} onSubmit={createCustomer} />}
      {modal?.type === 'route' && <NewRouteModal t={t} route={modal.route} onClose={() => setModal(null)} onSubmit={createRoute} />}
      {modal?.type === 'complete-delivery' && <CompleteDeliveryModal t={t} order={modal.order} customer={customers.find((entry) => entry.name === modal.order.customer || entry.phone === modal.order.phone)} onClose={() => setModal(null)} onSubmit={completeDelivery} />}
      {modal?.type === 'delivery-report' && <DeliveryReportModal t={t} order={modal.order} customer={modal.customer} businessName={session.business} comms={comms} language={language} onClose={() => setModal(null)} />}
      {modal?.type === 'stock' && <StockModal t={t} inventory={inventory} onClose={() => setModal(null)} onSubmit={adjustStock} />}
      {modal?.type === 'expense' && <ExpenseModal t={t} onClose={() => setModal(null)} onSubmit={createExpense} />}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function BusinessSidebar({ session, section, setSection, t, onLogout, mobileNav, onClose }) {
  return (
    <aside className={`app-sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand-row"><Brand light onClick={() => setSection('overview')} /><button className="sidebar-close" onClick={onClose} aria-label="Close menu"><X size={18} /></button></div>
      <button className="workspace-picker" type="button"><span className="workspace-avatar">{(session.business || 'BlueSpring').slice(0, 1).toUpperCase()}</span><span className="workspace-picker-copy"><small>{t('smallBusiness')}</small><strong>{session.business || 'BlueSpring Water Co.'}</strong></span><ChevronDown size={15} /></button>
      <nav className="sidebar-nav">{businessNavGroups.map((groupEntry) => <div className="nav-group" key={groupEntry.label}><div className="nav-group-label">{t(groupEntry.label)}</div>{groupEntry.items.map((item) => <button key={item.id} className={`sidebar-link ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)} type="button"><item.icon size={17} strokeWidth={1.8} /><span>{t(item.key)}</span>{item.id === 'orders' && <span className="nav-count">8</span>}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-plan-card"><div className="plan-card-label"><span><Sparkles size={13} /> GROWTH PLAN</span><span className="plan-live-dot" /></div><div className="plan-card-caption">Workspace active</div><div className="sidebar-progress"><span /></div><div className="sidebar-plan-foot"><span>Subscription</span><strong>Quarterly</strong></div></div><div className="sidebar-user"><span className="user-avatar">{(session.name || 'H').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span><span className="user-meta"><strong>{session.name || 'Hamza Khan'}</strong><small>{session.email || 'owner@aquaflow.pk'}</small></span><button className="logout-button" type="button" onClick={onLogout} title={t('signOut')}><LogOut size={16} /></button></div></div>
    </aside>
  );
}

function AppTopbar({ title, language, setLanguage, t, globalSearch, setGlobalSearch, noticeOpen, setNoticeOpen, onMenu, onNew, lowStock = 0, pending = 0 }) {
  return (
    <header className="app-topbar"><div className="topbar-left"><button className="mobile-menu-button" type="button" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button><div className="topbar-breadcrumb"><span>AquaFlow</span><ChevronRight size={14} /><strong>{title}</strong></div></div><div className="topbar-actions"><label className="global-search"><Search size={16} /><input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder={t('search')} /><kbd>⌘ K</kbd></label><LanguageButton language={language} setLanguage={setLanguage} /><div className="notification-wrap"><button className={`icon-button notification-button ${noticeOpen ? 'is-open' : ''}`} type="button" onClick={() => setNoticeOpen(!noticeOpen)} aria-label={t('notifications')}><Bell size={18} />{(lowStock || pending) > 0 && <i />}</button>{noticeOpen && <div className="notification-popover"><div className="popover-heading"><strong>{t('notifications')}</strong><span className="mini-count">{lowStock + pending}</span></div>{lowStock > 0 && <div className="notification-item"><span className="notification-icon warning"><Package size={15} /></span><span><strong>{lowStock} low-stock item{lowStock > 1 ? 's' : ''}</strong><small>Review inventory before dispatch</small></span></div>}{pending > 0 && <div className="notification-item"><span className="notification-icon info"><Truck size={15} /></span><span><strong>{pending} orders need attention</strong><small>Pending and in-progress deliveries</small></span></div>}<span className="notification-footer">You're all caught up with the live demo.</span></div>}</div><button className="button button-primary topbar-new-button" type="button" onClick={onNew}><Plus size={16} /><span>{t('newOrder')}</span></button></div></header>
  );
}

function PageHeading({ title, description, action }) {
  return <div className="page-heading"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-heading-action">{action}</div>}</div>;
}

function OverviewPage({ t, session, orders, customers, inventory, routes, onNewOrder, onNewCustomer, onNewRoute, onGoTo, onMarkDelivered, onSendReport }) {
  const deliveredCount = orders.filter((order) => order.status === 'Delivered').length;
  const pendingCount = orders.filter((order) => order.status !== 'Delivered').length;
  const lowItems = inventory.filter((item) => item.stock < item.reorder);
  const recent = orders.slice(0, 5);
  const litresOnOrders = orders.reduce((sum, order) => sum + Number(order.cans || 0) * litresPerOrderUnit(order.product), 0);
  const gallonsOnOrders = Math.round(litresOnOrders / 3.785411784);
  const deliveryUnits = orders.reduce((sum, order) => sum + Number(order.cans || 0), 0);
  const dashboardRevenue = 1284600 + orders.filter((order) => order.time === 'Just now').reduce((sum, order) => sum + order.amount, 0);
  return (
    <div className="overview-page">
      <section className="welcome-banner"><div className="welcome-content"><div className="welcome-date"><span className="welcome-dot" />{new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long' })} <span>·</span> Karachi, PK</div><h1>{t('hello')}, {session.name?.split(' ')[0] || 'Hamza'} <span className="wave-hand">✦</span></h1><p>{t('todaySummary')}</p><div className="welcome-actions"><button className="button button-primary" type="button" onClick={onNewOrder}><Plus size={16} />{t('newOrder')}</button><button className="button button-soft" type="button" onClick={onNewCustomer}><Plus size={15} />{t('addCustomer')}</button><button className="button button-soft" type="button" onClick={onNewRoute}><Plus size={15} />{t('createRoute')}</button></div></div><div className="welcome-graphic"><div className="welcome-water-ring ring-one" /><div className="welcome-water-ring ring-two" /><div className="welcome-swoosh" /><div className="welcome-drop"><Droplets size={72} strokeWidth={1.2} /></div><div className="welcome-art-tag"><span className="status-live" />ALL ROUTES ACTIVE</div><div className="welcome-art-bottom"><div><span>Today's dispatch</span><strong>{pendingCount + deliveredCount + 120} <small>stops</small></strong></div><div className="welcome-art-avatar"><Truck size={18} /></div></div></div><div className="welcome-decoration deco-one" /><div className="welcome-decoration deco-two" /></section>
      <section className="stats-grid"><MetricCard icon={Truck} label={t('todayDeliveries')} value={String(128 + Math.max(0, orders.length - initialOrders.length))} suffix="orders" trend="12.8%" trendLabel={t('vsLastWeek')} color="mint" chart="up" /><MetricCard icon={Wallet} label={t('monthlyRevenue')} value={money(dashboardRevenue)} trend="8.4%" trendLabel={t('collectedThisMonth')} color="blue" chart="up" /><MetricCard icon={Users} label={t('activeCustomers')} value={group(1248 + Math.max(0, customers.length - initialCustomers.length))} trend="6.2%" trendLabel={t('vsLastWeek')} color="lilac" chart="up" /><MetricCard icon={Package} label={t('cansCirculating')} value={group(inventory.find((item) => item.id === 'INV-02')?.stock || 1620)} trend={t('returnableCans')} trendLabel="" color="peach" chart="steady" /></section>
      <section className="volume-summary-strip"><span className="volume-summary-icon"><Droplets size={18} /></span><div className="volume-summary-main"><small>{t('waterVolume')}</small><strong>{group(gallonsOnOrders)} <em>{t('gallons')}</em></strong></div><div className="volume-summary-detail"><strong>{group(litresOnOrders)} {t('liters')}</strong><span>{group(deliveryUnits)} {t('unitsTracked')}</span></div><span className="volume-conversion-note">{t('conversionNote')}</span></section>
      <section className="overview-main-grid"><div className="panel revenue-panel"><div className="panel-heading"><div><div className="panel-eyebrow"><span className="panel-eyebrow-dot" />{t('revenueOverview')}</div><h2>{money(dashboardRevenue)}</h2><span className="panel-subtext"><span className="positive-text"><ArrowUpRight size={13} />8.4%</span> {t('vsLastWeek')}</span></div><div className="chart-period"><CalendarDays size={14} /><span>{t('last7Days')}</span><ChevronDown size={14} /></div></div><RevenueChart variant="revenue" /><div className="chart-axis"><span>Mon, 09</span><span>Tue, 10</span><span>Wed, 11</span><span>Thu, 12</span><span>Fri, 13</span><span>Sat, 14</span><span>Sun, 15</span></div><div className="chart-footer-stats"><div><span className="legend-dot legend-teal" />Cash & card <strong>Rs 824,600</strong></div><div><span className="legend-dot legend-blue" />Monthly invoices <strong>Rs 460,000</strong></div></div></div>
        <div className="panel route-panel"><div className="panel-heading"><div><div className="panel-eyebrow"><span className="panel-eyebrow-dot orange-dot" />{t('liveOperations')}</div><h3>{t('routeProgress')}</h3></div><button className="icon-button subtle-icon" type="button" onClick={() => onGoTo('deliveries')} aria-label={t('dispatchRoutes')}><ArrowUpRight size={16} /></button></div><div className="route-visual"><div className="route-map-grid" /><svg className="route-path-svg" viewBox="0 0 340 128" preserveAspectRatio="none" aria-hidden="true"><path d="M16 89 C47 82 41 45 87 54 S128 106 166 81 S208 31 240 43 S283 89 323 26" fill="none" stroke="#9ad6c9" strokeWidth="3" strokeDasharray="5 6" strokeLinecap="round" /><path d="M16 89 C47 82 41 45 87 54 S128 106 166 81 S208 31 240 43" fill="none" stroke="#19a68e" strokeWidth="3.5" strokeLinecap="round" /></svg><span className="map-pin pin-start"><Building2 size={14} /></span><span className="map-pin pin-current"><Truck size={15} /></span><span className="map-pin pin-end"><Droplets size={14} /></span><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><div className="map-label label-clifton">CLIFTON</div><div className="map-label label-dha">DHA PHASE 6</div><div className="map-label label-depot">DEPOT</div></div><div className="route-summary"><div className="route-summary-driver"><span className="driver-avatar small">NK</span><span><strong>Naveed Akhtar</strong><small>Clifton · KHI-4186</small></span></div><div className="route-summary-progress"><strong>16<span> / 24</span></strong><small>{t('completed')}</small></div></div><div className="progress-bar"><span style={{ width: '67%' }} /></div><div className="route-panel-foot"><span><span className="status-live" /> {t('onTheRoad')}</span><button type="button" onClick={() => onGoTo('deliveries')}>{t('viewAll')}<ArrowRight size={13} /></button></div></div></section>
      <section className="overview-bottom-grid"><div className="panel recent-orders-panel"><div className="panel-heading"><div><div className="panel-eyebrow"><span className="panel-eyebrow-dot" />{t('recentOrders')}</div><h3>Latest activity</h3></div><button className="panel-link" type="button" onClick={() => onGoTo('orders')}>{t('viewAll')}<ArrowRight size={14} /></button></div><OrdersTable t={t} orders={recent} compact onMarkDelivered={onMarkDelivered} onSendReport={onSendReport} /></div><div className="panel stock-alert-panel"><div className="panel-heading"><div><div className="panel-eyebrow"><span className={`panel-eyebrow-dot ${lowItems.length ? 'orange-dot' : ''}`} />{t('stockNeedsAttention')}</div><h3>{lowItems.length ? `${lowItems.length} ${t('lowStock')}` : t('inFlow')}</h3></div><button className="icon-button subtle-icon" type="button" onClick={() => onGoTo('inventory')} aria-label={t('allInventory')}><ArrowUpRight size={16} /></button></div><div className="stock-alert-list">{(lowItems.length ? lowItems : inventory.slice(0, 2)).map((item) => <div className="stock-alert-item" key={item.id}><span className={`stock-alert-icon ${item.stock < item.reorder ? 'warning-stock' : ''}`}><Package size={16} /></span><span className="stock-alert-copy"><strong>{item.name}</strong><small>{item.category}</small></span><span className={`stock-alert-qty ${item.stock < item.reorder ? 'low-stock-text' : ''}`}><strong>{item.stock}</strong><small>{item.unit}</small></span></div>)}</div><button className="stock-panel-button" type="button" onClick={() => onGoTo('inventory')}>{t('allInventory')}<ArrowRight size={14} /></button></div></section>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, suffix, trend, trendLabel, color, chart }) {
  return <article className="metric-card"><div className={`metric-icon metric-${color}`}><Icon size={18} strokeWidth={1.8} /></div><div className="metric-label">{label}</div><div className="metric-value">{value}{suffix && <small> {suffix}</small>}</div><div className="metric-foot"><span className={trendLabel ? 'metric-trend' : 'metric-note'}>{trendLabel && <ArrowUpRight size={13} />}{trend}</span><span className="metric-caption">{trendLabel}</span><MiniSparkline kind={chart} /></div></article>;
}

function MiniSparkline({ kind = 'up' }) {
  const points = kind === 'steady' ? '0,19 10,16 20,18 30,12 40,14 50,8 60,10 70,4' : '0,22 10,18 20,21 30,12 40,16 50,9 60,11 70,3';
  return <svg className="mini-sparkline" viewBox="0 0 72 26" aria-hidden="true"><polyline points={points} fill="none" stroke="#1b9d89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function RevenueChart({ variant = 'revenue' }) {
  const values = variant === 'volume' ? [40, 72, 57, 101, 83, 120, 99, 144] : [55, 92, 72, 132, 110, 160, 138, 195, 158, 202, 178, 230];
  const max = Math.max(...values);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 700},${210 - (value / max) * 165}`).join(' ');
  const linePath = `M ${points.replaceAll(' ', ' L ')}`;
  const areaPath = `${linePath} L 700,220 L 0,220 Z`;
  const gradientId = `chart-gradient-${variant}`;
  return <div className="revenue-chart"><div className="chart-y-labels"><span>Rs 200k</span><span>Rs 150k</span><span>Rs 100k</span><span>Rs 50k</span></div><svg viewBox="0 0 700 220" preserveAspectRatio="none" aria-label="Revenue chart"><defs><linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#1aa58f" stopOpacity=".22" /><stop offset="100%" stopColor="#1aa58f" stopOpacity="0" /></linearGradient></defs><line x1="0" x2="700" y1="45" y2="45" className="chart-grid-line" /><line x1="0" x2="700" y1="93" y2="93" className="chart-grid-line" /><line x1="0" x2="700" y1="142" y2="142" className="chart-grid-line" /><line x1="0" x2="700" y1="190" y2="190" className="chart-grid-line" /><path d={areaPath} fill={`url(#${gradientId})`} /><path d={linePath} fill="none" stroke="#159d88" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /><circle cx="700" cy={210 - (values.at(-1) / max) * 165} r="5" fill="#fff" stroke="#159d88" strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg></div>;
}

function OrdersPage({ t, orders, query, onMarkDelivered, onSendReport, onNewOrder }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const allSearch = `${query} ${search}`.trim().toLowerCase();
  const filtered = orders.filter((order) => (filter === 'All' || order.status === filter) && (!allSearch || `${order.id} ${order.customer} ${order.phone} ${order.route}`.toLowerCase().includes(allSearch)));
  const exportData = () => downloadCsv('aquaflow-orders.csv', ['Order', 'Customer', 'Phone', 'Cans', 'Amount', 'Payment', 'Status', 'Route'], filtered.map((order) => [order.id, order.customer, order.phone, order.cans, order.amount, order.payment, order.status, order.route]));
  return <div className="section-content"><div className="section-summary-row"><div className="inline-metrics"><span><strong>{orders.length}</strong> total orders</span><span><strong>{orders.filter((order) => order.status === 'Pending').length}</strong> pending</span><span><strong>{orders.filter((order) => order.status === 'Delivered').length}</strong> delivered</span></div><div className="table-tools"><label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('search')} /></label><select className="select-control table-filter" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="All">{t('filterAll')}</option><option value="Pending">{t('pending')}</option><option value="On the way">{t('onTheWay')}</option><option value="Delivered">{t('delivered')}</option></select><button className="button button-outline button-small" type="button" onClick={exportData}><FileText size={15} />{t('exportCsv')}</button></div></div><div className="panel table-panel"><OrdersTable t={t} orders={filtered} onMarkDelivered={onMarkDelivered} onSendReport={onSendReport} /></div><div className="table-footnote">Showing {filtered.length} of {orders.length} orders <span>·</span> Delivery queue updates in real time</div></div>;
}

function OrdersTable({ t, orders, compact = false, onMarkDelivered, onSendReport }) {
  if (!orders.length) return <EmptyState t={t} />;
  return <div className={`table-scroll ${compact ? 'compact-table-scroll' : ''}`}><table className={`data-table orders-table ${compact ? 'orders-table-compact' : ''}`}><thead><tr><th>{t('order')}</th><th>{t('customer')}</th><th>{t('items')}</th><th>{t('route')}</th><th>{t('amount')}</th><th>{t('payment')}</th><th>{t('status')}</th><th aria-label={t('actions')}></th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong className="table-id">{order.id}</strong><small className="table-secondary">{order.time}</small></td><td><strong>{order.customer}</strong><small className="table-secondary">{order.phone}</small></td><td><strong>{order.cans} × 19L</strong><small className="table-secondary">{order.product || 'Returnable can'}</small></td><td><span className="route-cell"><span className="route-cell-dot" />{order.route}</span></td><td><strong>{money(order.amount)}</strong></td><td><span className={`payment-label ${order.payment === 'Paid' ? 'payment-paid' : ''}`}>{order.payment === 'Paid' ? t('paid') : order.payment === 'Unpaid' ? t('unpaid') : order.payment === 'Cash on delivery' ? t('cashOnDelivery') : order.payment}</span></td><td><StatusPill status={order.status} t={t} /></td><td className="table-action-cell">{order.status !== 'Delivered' ? <button className="table-icon-action" type="button" title={t('markDelivered')} onClick={() => onMarkDelivered(order.id)}><Check size={15} /></button> : <button className="table-icon-action report-action" type="button" title={t('sendWhatsApp')} onClick={() => onSendReport?.(order)}><MessageCircle size={14} /></button>}</td></tr>)}</tbody></table></div>;
}

function CustomersPage({ t, customers, query, onAdd, onEdit }) {
  const [search, setSearch] = useState('');
  const term = `${query} ${search}`.trim().toLowerCase();
  const filtered = customers.filter((customer) => !term || `${customer.name} ${customer.phone} ${customer.email || ''} ${customer.address} ${customer.route}`.toLowerCase().includes(term));
  const exportData = () => downloadCsv('aquaflow-customers.csv', ['Customer', 'Phone', 'Email', 'Address', 'Route', 'Cans / delivery', 'Bottle balance', 'Money balance', 'Frequency'], filtered.map((customer) => [customer.name, customer.phone, customer.email, customer.address, customer.route, customer.cans, customer.bottleBalance, customer.balance, customer.frequency]));
  const debt = customers.reduce((sum, customer) => sum + Number(customer.balance || 0), 0);
  return <div className="section-content"><div className="customer-stats"><div className="customer-stat-card"><span className="customer-stat-icon"><Users size={18} /></span><span><small>Customers in workspace</small><strong>{group(customers.length)} <em>+ 12.4%</em></strong></span></div><div className="customer-stat-card"><span className="customer-stat-icon customer-stat-lime"><Truck size={18} /></span><span><small>Delivery zones</small><strong>5 <em>active routes</em></strong></span></div><div className="customer-stat-card"><span className="customer-stat-icon customer-stat-peach"><Wallet size={18} /></span><span><small>Outstanding balances</small><strong>{money(debt)}</strong></span></div><button className="customer-quick-add" type="button" onClick={onAdd}><span><Plus size={18} /></span><strong>Add your next customer</strong><small>Keep every delivery on file</small></button></div><div className="section-summary-row"><div className="inline-metrics"><span><strong>{customers.length}</strong> customer records</span><span><strong>{customers.filter((customer) => customer.balance > 0).length}</strong> with balances</span></div><div className="table-tools"><label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('search')} /></label><button className="button button-outline button-small" type="button" onClick={exportData}><FileText size={15} />{t('exportCsv')}</button></div></div><div className="panel table-panel"><div className="table-scroll"><table className="data-table customers-table"><thead><tr><th>{t('customer')}</th><th>{t('phone')}</th><th>{t('address')}</th><th>{t('route')}</th><th>{t('items')}</th><th>{t('bottleBalance')}</th><th>{t('cadence')}</th><th>{t('balance')}</th><th>{t('since')}</th><th>{t('actions')}</th></tr></thead><tbody>{filtered.map((customer, index) => <tr key={customer.id}><td><div className="customer-name-cell"><span className={`customer-avatar customer-avatar-${index % 5}`}>{customer.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span><span><strong>{customer.name}</strong><small className="table-secondary">{customer.id}</small></span></div></td><td><strong>{customer.phone}</strong><small className="table-secondary">{customer.email || '—'}</small></td><td className="address-cell">{customer.address}</td><td><span className="route-cell"><span className="route-cell-dot" />{customer.route}</span></td><td><strong>{customer.cans}</strong> cans</td><td><strong>{group(customer.bottleBalance ?? customer.cans ?? 0)}</strong> {t('bottlesUnit')}</td><td>{customer.frequency}</td><td className={customer.balance > 0 ? 'balance-due' : 'balance-clear'}>{customer.balance > 0 ? money(customer.balance) : 'Clear'}</td><td>{customer.since}</td><td><button className="table-icon-action" type="button" onClick={() => onEdit(customer)} aria-label={`${t('editCustomer')} ${customer.name}`} title={t('editCustomer')}><Pencil size={14} /></button></td></tr>)}</tbody></table>{!filtered.length && <EmptyState t={t} />}</div></div><div className="table-footnote">Customer details stay attached to their delivery history.</div></div>;
}

function DeliveriesPage({ t, orders, routes, onMarkDelivered, onSendReport, onEditRoute }) {
  const activeOrders = orders.filter((order) => order.status !== 'Delivered');
  const completedToday = orders.filter((order) => order.status === 'Delivered').length;
  return <div className="section-content delivery-page"><div className="delivery-overview-cards"><div className="delivery-overview-card delivery-card-highlight"><span className="delivery-card-icon"><Truck size={19} /></span><div><small>Routes in progress</small><strong>{routes.length}</strong><span>Across Karachi today</span></div><div className="delivery-mini-route"><i /><i /><i /><i /></div></div><div className="delivery-overview-card"><span className="delivery-card-icon delivery-green"><CheckCircle2 size={19} /></span><div><small>Stops completed</small><strong>{completedToday + 52} <em>/ 90</em></strong><span>58% of today’s run</span></div><div className="delivery-progress-ring"><strong>58%</strong></div></div><div className="delivery-overview-card"><span className="delivery-card-icon delivery-orange"><Clock3 size={19} /></span><div><small>Orders to dispatch</small><strong>{activeOrders.length + 21}</strong><span>Across 5 delivery zones</span></div><div className="delivery-card-badge">{activeOrders.length} live</div></div></div><div className="delivery-section-title"><div><h2>Today’s routes</h2><p>Driver progress from depot to doorstep.</p></div><span className="live-status-label"><span className="status-live" />LIVE DISPATCH</span></div><div className="routes-grid">{routes.map((route) => <RouteCard key={route.id} route={route} t={t} onEdit={onEditRoute} />)}</div><div className="delivery-section-title orders-awaiting-title"><div><h2>Next up on the delivery queue</h2><p>Complete an order when the cans reach the customer.</p></div><span className="queue-count">{activeOrders.length} open</span></div><div className="panel table-panel"><OrdersTable t={t} orders={activeOrders} onMarkDelivered={onMarkDelivered} onSendReport={onSendReport} /></div></div>;
}

function RouteCard({ route, t, onEdit }) {
  const progress = Math.round(route.done / route.stops * 100);
  return <article className={`route-card route-card-${route.color}`}><div className="route-card-top"><span className="route-card-symbol"><Truck size={19} /></span><span className="route-id">{route.id}</span><button className="route-more" type="button" onClick={() => onEdit(route)} aria-label={`${t('editRoute')} ${route.name}`} title={t('editRoute')}><MoreHorizontal size={18} /></button></div><div className="route-card-name"><h3>{route.name}</h3><p><span><span className="route-cell-dot" />{route.zone}</span><span>{route.cans} cans</span></p></div><div className="route-map-mini"><span className="mini-map-road road-a" /><span className="mini-map-road road-b" /><span className="mini-map-dot dot-a" /><span className="mini-map-dot dot-b" /><span className="mini-map-dot dot-c" /><span className="mini-map-truck"><Truck size={13} /></span></div><div className="route-card-footer"><div className="route-driver"><span className="driver-avatar small">{route.driver.split(' ').map((part) => part[0]).join('')}</span><span><strong>{route.driver}</strong><small>{route.vehicle}</small></span></div><div className="route-stop-count"><strong>{route.done}<span>/{route.stops}</span></strong><small>{t('completed')}</small></div></div><div className="progress-bar route-progress"><span style={{ width: `${progress}%` }} /></div><div className="route-card-status"><span className="status-live" />{route.status}<span className="route-card-percent">{progress}%</span></div></article>;
}

function InventoryPage({ t, inventory, onAdjust }) {
  const ready = inventory.find((item) => item.id === 'INV-01')?.stock || 0;
  const empty = inventory.find((item) => item.id === 'INV-02')?.stock || 0;
  const low = inventory.filter((item) => item.stock < item.reorder).length;
  const value = inventory.reduce((total, item) => total + item.stock * (item.id === 'INV-01' ? 140 : item.id === 'INV-03' ? 420 : 3), 0);
  return <div className="section-content"><div className="inventory-stats"><div className="inventory-stat-card"><div className="inventory-stat-symbol stock-ready"><Droplets size={19} /></div><span><small>Filled 19L cans ready</small><strong>{group(ready)} <em>cans</em></strong></span><MiniSparkline /></div><div className="inventory-stat-card"><div className="inventory-stat-symbol stock-empty"><Package size={19} /></div><span><small>Empty cans in circulation</small><strong>{group(empty)} <em>returnable</em></strong></span><MiniSparkline kind="steady" /></div><div className={`inventory-stat-card ${low ? 'inventory-warning-card' : ''}`}><div className="inventory-stat-symbol stock-low"><Activity size={19} /></div><span><small>Items to reorder</small><strong>{low} <em>{low === 1 ? 'item' : 'items'}</em></strong></span><span className="low-stock-status">{low ? t('needAttention') : t('inFlow')}</span></div><div className="inventory-stat-card"><div className="inventory-stat-symbol stock-value"><Wallet size={19} /></div><span><small>{t('stockValue')}</small><strong>{money(value)}</strong></span><span className="inventory-value-note">Ready + packaging</span></div></div><div className="inventory-quick-banner"><div className="inventory-banner-icon"><Package size={19} /></div><div><strong>Keep the next route ready.</strong><span>Update production and returned-can counts before dispatch leaves the depot.</span></div><button type="button" className="button button-outline button-small" onClick={onAdjust}><Plus size={15} />{t('adjustStock')}</button></div><div className="panel table-panel"><div className="inventory-table-heading"><div><h2>Stock overview</h2><p>Production, packaging and reusable cans.</p></div><span className="inventory-updated"><span className="status-live" />Updated just now</span></div><div className="table-scroll"><table className="data-table inventory-table"><thead><tr><th>{t('item')}</th><th>{t('category')}</th><th>{t('inStock')}</th><th>{t('reorderAt')}</th><th>Stock level</th><th>{t('movement')}</th><th>{t('actions')}</th></tr></thead><tbody>{inventory.map((item) => { const percent = Math.min(100, Math.round(item.stock / Math.max(item.reorder * 2, 1) * 100)); const isLow = item.stock < item.reorder; return <tr key={item.id}><td><div className="inventory-item-cell"><span className={`inventory-item-icon ${isLow ? 'inventory-item-warning' : ''}`}><Package size={17} /></span><span><strong>{item.name}</strong><small className="table-secondary">{item.id}</small></span></div></td><td>{item.category}</td><td><strong className={isLow ? 'low-stock-text' : ''}>{group(item.stock)}</strong> <span className="table-secondary">{item.unit}</span></td><td>{group(item.reorder)} {item.unit}</td><td><div className="stock-level"><div className="progress-bar"><span className={isLow ? 'bar-low' : ''} style={{ width: `${percent}%` }} /></div><small>{isLow ? t('lowStock') : `${percent}%`}</small></div></td><td><span className={item.movement.startsWith('−') ? 'movement-negative' : 'movement-positive'}>{item.movement}</span></td><td><button className="button button-outline button-xs" type="button" onClick={onAdjust}><Plus size={13} />Adjust</button></td></tr>; })}</tbody></table></div></div></div>;
}

function BillingPage({ t, orders, customers = [], expenses, onAddExpense }) {
  const amountReceived = (order) => order.paymentReceived != null ? Number(order.paymentReceived) : order.payment === 'Paid' ? Number(order.amount) : 0;
  const paid = orders.reduce((sum, order) => sum + amountReceived(order), 0) + 824600;
  const outstandingCustomerBalance = customers.reduce((sum, customer) => sum + Number(customer.balance || 0), 0);
  const pendingOrderBalance = orders.filter((order) => order.status !== 'Delivered').reduce((sum, order) => sum + Math.max(0, Number(order.amount || 0) - amountReceived(order)), 0);
  const due = outstandingCustomerBalance + pendingOrderBalance + 184500;
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0) + 406300;
  const invoices = orders.slice(0, 6).map((order, index) => ({ id: `INV-${String(2481 - index)}`, customer: order.customer, amount: order.amount, status: amountReceived(order) >= Number(order.amount || 0) ? 'Paid' : 'Due', date: order.date, orderId: order.id }));
  return <div className="section-content"><div className="finance-stats"><div className="finance-stat-card"><span className="finance-stat-icon finance-in"><ArrowDownRight size={18} /></span><small>{t('totalCollected')}</small><strong>{money(paid)}</strong><span className="finance-trend"><ArrowUpRight size={13} /> 12.4% this month</span></div><div className="finance-stat-card"><span className="finance-stat-icon finance-due"><Clock3 size={18} /></span><small>{t('outstanding')}</small><strong>{money(due)}</strong><span className="finance-trend finance-warn">Across 18 invoices</span></div><div className="finance-stat-card"><span className="finance-stat-icon finance-out"><ArrowUpRight size={18} /></span><small>{t('monthlyExpenses')}</small><strong>{money(totalExpenses)}</strong><span className="finance-trend">Fuel, stock & operations</span></div><div className="finance-stat-card finance-balance-card"><span className="finance-stat-icon finance-balance"><Wallet size={18} /></span><small>Net operating balance</small><strong>{money(paid - totalExpenses)}</strong><span className="finance-trend">After recorded expenses</span></div></div><div className="finance-main-grid"><div className="panel invoice-panel"><div className="panel-heading"><div><div className="panel-eyebrow"><span className="panel-eyebrow-dot" />{t('invoices')}</div><h3>Customer collections</h3></div><button className="button button-outline button-small" type="button" onClick={() => downloadCsv('aquaflow-invoices.csv', ['Invoice', 'Customer', 'Order', 'Amount', 'Status', 'Date'], invoices.map((invoice) => [invoice.id, invoice.customer, invoice.orderId, invoice.amount, invoice.status, invoice.date]))}><FileText size={14} />{t('exportCsv')}</button></div><div className="table-scroll"><table className="data-table invoices-table"><thead><tr><th>{t('invoice')}</th><th>{t('customer')}</th><th>{t('delivery')}</th><th>{t('amount')}</th><th>{t('status')}</th><th>{t('created')}</th></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id}><td><strong className="table-id">{invoice.id}</strong><small className="table-secondary">{invoice.orderId}</small></td><td>{invoice.customer}</td><td>19L · {orders.find((order) => order.id === invoice.orderId)?.cans} cans</td><td><strong>{money(invoice.amount)}</strong></td><td><StatusPill status={invoice.status === 'Paid' ? 'Delivered' : 'Pending'} t={t} override={invoice.status === 'Paid' ? t('paid') : t('unpaid')} /></td><td>{shortDate(invoice.date)}</td></tr>)}</tbody></table></div></div><div className="panel expense-panel"><div className="panel-heading"><div><div className="panel-eyebrow"><span className="panel-eyebrow-dot orange-dot" />{t('expenses')}</div><h3>Recent spend</h3></div><button className="icon-button subtle-icon" type="button" onClick={onAddExpense} aria-label={t('addExpense')}><Plus size={17} /></button></div><div className="expense-list">{expenses.slice(0, 5).map((expense) => <div className="expense-row" key={expense.id}><span className="expense-symbol"><Wallet size={15} /></span><span className="expense-row-copy"><strong>{expense.title}</strong><small>{expense.category} · {shortDate(expense.date)}</small></span><strong className="expense-amount">− {money(expense.amount)}</strong></div>)}</div><button className="expense-add-link" type="button" onClick={onAddExpense}><Plus size={14} />{t('addExpense')}</button></div></div></div>;
}

function ReportsPage({ t, orders, routes, expenses }) {
  const monthlyOrders = orders.length + 184;
  const cans = orders.reduce((sum, order) => sum + Number(order.cans || 0), 0) + 3640;
  const revenue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0) + 1284600;
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const routeScores = routes.map((route) => ({ ...route, score: Math.round(route.done / route.stops * 100) }));
  return <div className="section-content reports-page"><div className="report-period-bar"><span><CalendarDays size={15} /> Reporting period</span><button type="button">October 1 – October 31, 2026 <ChevronDown size={15} /></button><button className="button button-outline button-small" type="button" onClick={() => downloadCsv('aquaflow-monthly-report.csv', ['Metric', 'Value'], [['Delivery orders', monthlyOrders], ['Cans delivered', cans], ['Revenue', revenue], ['Expenses', totalExpenses]])}><FileText size={14} />{t('exportCsv')}</button></div><div className="report-kpi-grid"><div className="report-kpi"><small>{t('weeklyDispatch')}</small><strong>{monthlyOrders}</strong><span><ArrowUpRight size={14} /> 14.6% vs last month</span><MiniSparkline /></div><div className="report-kpi"><small>{t('cansDelivered')}</small><strong>{group(cans)}</strong><span><ArrowUpRight size={14} /> 8.1% vs last month</span><MiniSparkline /></div><div className="report-kpi"><small>{t('revenue')}</small><strong>{money(revenue)}</strong><span><ArrowUpRight size={14} /> 11.3% vs last month</span><MiniSparkline /></div><div className="report-kpi"><small>{t('deliveryRate')}</small><strong>96.8%</strong><span><ArrowUpRight size={14} /> 2.4% vs last month</span><MiniSparkline /></div></div><div className="report-grid"><div className="panel report-chart-card"><div className="panel-heading"><div><div className="panel-eyebrow"><span className="panel-eyebrow-dot" />{t('reportVolume')}</div><h3>Deliveries are trending up</h3></div><span className="report-chart-total">{group(monthlyOrders)} <small>orders</small></span></div><RevenueChart variant="volume" /><div className="chart-axis"><span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span><span>Wk 5</span></div></div><div className="panel top-routes-card"><div className="panel-heading"><div><div className="panel-eyebrow"><span className="panel-eyebrow-dot orange-dot" />{t('topRoutes')}</div><h3>{t('performance')}</h3></div><MoreHorizontal size={18} /></div><div className="route-performance-list">{routeScores.sort((a, b) => b.score - a.score).map((route, index) => <div className="route-performance" key={route.id}><span className={`route-rank rank-${index + 1}`}>{String(index + 1).padStart(2, '0')}</span><div className="route-performance-copy"><strong>{route.name}</strong><small>{route.done} of {route.stops} stops completed</small><div className="progress-bar"><span style={{ width: `${route.score}%` }} /></div></div><strong className="route-performance-score">{route.score}%</strong></div>)}</div><div className="report-note"><span><Wallet size={15} /></span><div><small>Operating expenses</small><strong>{money(totalExpenses + 406300)}</strong></div><span className="report-note-trend">For October</span></div></div></div><div className="report-bottom-note"><CircleHelp size={15} /> Reports include sample historical activity and will update as you enter new orders.</div></div>;
}

function SettingsPage({ t, language, setLanguage, session, onUpdateProfile, pricing, setPricing, comms, setComms, onToast }) {
  const [business, setBusiness] = useState(session.business || 'BlueSpring Water Co.');
  const [owner, setOwner] = useState(session.name || 'Hamza Khan');
  const [notificationsOn, setNotificationsOn] = useStoredState('aquaflow-notifications', true);
  const [priceForm, setPriceForm] = useState({ ...initialPricing, ...pricing });
  const [commsForm, setCommsForm] = useState({ ...initialComms, ...comms });
  const [saved, setSaved] = useState(false);
  const setPrice = (key, value) => setPriceForm((previous) => ({ ...previous, [key]: value }));
  const setCommsValue = (key, value) => setCommsForm((previous) => ({ ...previous, [key]: value }));
  const save = (event) => {
    event.preventDefault();
    onUpdateProfile({ business, name: owner });
    setPricing({ ...priceForm, pricePerCan: Number(priceForm.pricePerCan), pricePerLitre: Number(priceForm.pricePerLitre), bottlePackPrice: Number(priceForm.bottlePackPrice), bottleCartonPrice: Number(priceForm.bottleCartonPrice) });
    setComms({ ...commsForm, queryHours: Number(commsForm.queryHours) || 48 });
    setSaved(true); onToast(t('saved')); window.setTimeout(() => setSaved(false), 2500);
  };
  return <div className="section-content settings-page"><form className="settings-layout" onSubmit={save}>
    <div className="settings-main">
      <section className="panel settings-card"><div className="settings-card-heading"><span className="settings-heading-icon"><Building2 size={18} /></span><div><h2>{t('businessProfile')}</h2><p>{t('businessProfileCopy')}</p></div></div><div className="settings-fields"><label className="settings-field"><span>{t('businessName')}</span><input value={business} onChange={(event) => setBusiness(event.target.value)} required /></label><label className="settings-field"><span>{t('owner')}</span><input value={owner} onChange={(event) => setOwner(event.target.value)} /></label><label className="settings-field"><span>{t('email')}</span><input value={session.email} disabled /></label><label className="settings-field"><span>{t('phone')}</span><input defaultValue="021 3582 4400" /></label><label className="settings-field settings-wide"><span>{t('address')}</span><input defaultValue="Clifton, Karachi, Pakistan" /></label></div></section>
      <section className="panel settings-card"><div className="settings-card-heading"><span className="settings-heading-icon"><Wallet size={18} /></span><div><h2>{t('pricingSettings')}</h2><p>Order totals, invoices and customer balances use these rates.</p></div></div><div className="settings-fields"><label className="settings-field settings-wide"><span>{t('pricingMode')}</span><select value={priceForm.mode} onChange={(event) => setPrice('mode', event.target.value)}><option value="per-can">{t('per19LCan')}</option><option value="per-litre">{t('perLitre')}</option></select></label><label className="settings-field"><span>{t('perCanRate')}</span><input type="number" min="0" step="0.01" value={priceForm.pricePerCan} onChange={(event) => setPrice('pricePerCan', event.target.value)} /></label><label className="settings-field"><span>{t('perLitreRate')}</span><input type="number" min="0" step="0.01" value={priceForm.pricePerLitre} onChange={(event) => setPrice('pricePerLitre', event.target.value)} /></label>{priceForm.mode === 'per-can' && <><label className="settings-field"><span>{t('bottlePackPrice')}</span><input type="number" min="0" step="0.01" value={priceForm.bottlePackPrice} onChange={(event) => setPrice('bottlePackPrice', event.target.value)} /></label><label className="settings-field"><span>{t('bottleCartonPrice')}</span><input type="number" min="0" step="0.01" value={priceForm.bottleCartonPrice} onChange={(event) => setPrice('bottleCartonPrice', event.target.value)} /></label></>}</div><div className="pricing-preview"><Droplets size={15} /><span>Current 19L unit price</span><strong>{money(priceForm.mode === 'per-litre' ? Number(priceForm.pricePerLitre || 0) * 19 : Number(priceForm.pricePerCan || 0))}</strong></div></section>
      <section className="panel settings-card"><div className="settings-card-heading"><span className="settings-heading-icon settings-lilac"><Settings size={18} /></span><div><h2>{t('preferences')}</h2><p>{t('preferencesCopy')}</p></div></div><div className="settings-row"><div><strong>{t('language')}</strong><small>English / اردو</small></div><select className="select-control" value={language} onChange={(event) => setLanguage(event.target.value)}><option value="en">English</option><option value="ur">اردو</option></select></div><div className="settings-row"><div><strong>{t('timezone')}</strong><small>Used for orders, routes and reports</small></div><select className="select-control" defaultValue="Asia/Karachi"><option value="Asia/Karachi">Pakistan Standard Time (UTC+5)</option></select></div><div className="settings-row"><div><strong>{t('currency')}</strong><small>Prices shown in Pakistani rupees</small></div><span className="settings-chip">PKR · Rs</span></div></section>
    </div>
    <div className="settings-aside">
      <section className="panel settings-card notification-settings"><div className="settings-card-heading"><span className="settings-heading-icon settings-peach"><Bell size={18} /></span><div><h2>{t('notificationsSettings')}</h2><p>{t('notificationsCopy')}</p></div></div><div className="settings-toggle-row"><span><strong>Operations alerts</strong><small>Orders, delivery and low stock</small></span><button className={`toggle-switch ${notificationsOn ? 'toggle-on' : ''}`} type="button" role="switch" aria-checked={notificationsOn} onClick={() => setNotificationsOn(!notificationsOn)}><i /></button></div><div className="settings-toggle-row"><span><strong>Daily summary</strong><small>One concise morning report</small></span><button className="toggle-switch toggle-on" type="button" role="switch" aria-checked="true"><i /></button></div></section>
      <section className="panel settings-card"><div className="settings-card-heading"><span className="settings-heading-icon settings-peach"><MessageCircle size={18} /></span><div><h2>{t('commsSettings')}</h2><p>Used in the delivered-order message preview.</p></div></div><label className="settings-field settings-standalone"><span>{t('channelLink')}</span><input value={commsForm.whatsappChannel} onChange={(event) => setCommsValue('whatsappChannel', event.target.value)} placeholder="https://whatsapp.com/channel/..." /></label><label className="settings-field settings-standalone"><span>{t('contactPhone')}</span><input value={commsForm.contactPhone} onChange={(event) => setCommsValue('contactPhone', event.target.value)} placeholder="+92 3xx xxx xxxx" /></label><label className="settings-field settings-standalone"><span>{t('queryWindow')}</span><input type="number" min="1" max="720" value={commsForm.queryHours} onChange={(event) => setCommsValue('queryHours', event.target.value)} /></label><div className="smtp-demo-note"><Mail size={15} /><span>WhatsApp opens a ready-to-send message. Automatic SMTP email needs a private server and credentials; email reports currently open the customer’s mail app.</span></div></section>
      <section className="subscription-card"><div className="subscription-card-top"><span><Sparkles size={15} /> YOUR SUBSCRIPTION</span><span className="subscription-status">ACTIVE</span></div><h3>Growth plan</h3><p>All the room your team needs to keep water moving.</p><div className="subscription-meta"><span>Billing cycle</span><strong>Quarterly</strong></div><div className="subscription-meta"><span>Next renewal</span><strong>Dec 21, 2026</strong></div><div className="subscription-key">{session.license || 'AQF-8H4K-2M6P-9X7C'}<Copy size={13} /></div></section>
    </div>
    <div className="settings-save-row"><span>{saved ? <><CheckCircle2 size={15} />{t('saved')}</> : 'Rates and preferences save to this browser.'}</span><button className="button button-primary" type="submit">{t('saveChanges')}<Check size={15} /></button></div>
  </form></div>;
}

function MasterDashboard({ session, language, setLanguage, t, licenses, setLicenses, onLogout, onOpenDemo }) {
  const [section, setSection] = useState('platform');
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState('');
  const showToast = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const active = licenses.filter((license) => license.status === 'Active').length;
  const available = licenses.filter((license) => license.status === 'Available').length;
  const renewals = licenses.filter((license) => license.status === 'Active' && license.expiresAt && (new Date(license.expiresAt) - new Date()) / 86400000 < 30).length;
  const workspaces = licenses.filter((license) => license.status === 'Active');
  const copyCode = async (code) => { try { await navigator.clipboard.writeText(code); } catch { /* clipboard might not be allowed */ } setCopied(code); window.setTimeout(() => setCopied(''), 1600); };
  const createLicense = ({ business, email, plan, days }) => {
    const nextNum = Math.max(1008, ...licenses.map((license) => Number(license.id.replace(/\D/g, '')) || 0)) + 1;
    const code = createLicenseCode(days);
    setLicenses((previous) => [{ id: `LIC-${nextNum}`, code, plan: plan === 'Custom' ? `Custom · ${days} days` : plan, days, status: 'Available', business: business || 'Invite · unassigned', email, createdAt: localISODate(), expiresAt: '' }, ...previous]);
    setModalOpen(false); setSection('licenses'); showToast(t('keyCreated')); copyCode(code);
  };
  const revoke = (license) => {
    if (window.confirm(t('confirmRevoke'))) { setLicenses((previous) => previous.map((entry) => entry.id === license.id ? { ...entry, status: 'Revoked' } : entry)); showToast(t('revoked')); }
  };
  const pageTitle = section === 'platform' ? t('adminOverview') : section === 'licenses' ? t('licenseKeys') : section === 'businesses' ? t('businesses') : t('settings');
  return (
    <div className="app-shell master-shell"><MasterSidebar section={section} setSection={(next) => { setSection(next); setMobileNav(false); }} t={t} onLogout={onLogout} mobileNav={mobileNav} onClose={() => setMobileNav(false)} activeCount={active} />
      <div className="app-workspace"><AppTopbar title={pageTitle} language={language} setLanguage={setLanguage} t={t} globalSearch={search} setGlobalSearch={setSearch} noticeOpen={false} setNoticeOpen={() => {}} onMenu={() => setMobileNav(true)} onNew={() => setModalOpen(true)} lowStock={0} pending={0} /><main className="dashboard-content master-content">
        {section === 'platform' && <><div className="admin-welcome"><div className="admin-welcome-copy"><div className="admin-live-label"><span className="status-live" /> MASTER ADMIN CONSOLE</div><h1>{t('adminOverview')}</h1><p>{t('adminOverviewCopy')}</p><button className="button button-primary" type="button" onClick={() => setModalOpen(true)}><Plus size={16} />{t('createWorkspaceAccess')}</button></div><div className="admin-welcome-art"><div className="admin-art-orbit orbit-one" /><div className="admin-art-orbit orbit-two" /><div className="admin-art-shield"><ShieldCheck size={44} /></div><div className="admin-art-key"><span>ACCESS KEY</span><strong>AQF-••••-••••-••••</strong><CheckCircle2 size={16} /></div><div className="admin-art-spark spark-a">✦</div><div className="admin-art-spark spark-b">✧</div></div></div><div className="stats-grid admin-stats"><MetricCard icon={Building2} label={t('activeLicenses')} value={String(active)} trend={`${workspaces.length} live workspaces`} trendLabel="" color="mint" chart="up" /><MetricCard icon={ShieldCheck} label={t('availableKeys')} value={String(available)} trend="Ready to issue" trendLabel="" color="blue" chart="steady" /><MetricCard icon={CalendarDays} label={t('renewalsSoon')} value={String(renewals || 1)} trend="Next 30 days" trendLabel="" color="lilac" chart="up" /><MetricCard icon={Wallet} label={t('collectedMonth')} value="Rs 42,500" trend="Subscription income" trendLabel="" color="peach" chart="up" /></div><div className="admin-main-grid"><div className="panel master-licenses-panel"><div className="panel-heading"><div><div className="panel-eyebrow"><span className="panel-eyebrow-dot" />{t('recentKeys')}</div><h3>Access at a glance</h3></div><button className="panel-link" type="button" onClick={() => setSection('licenses')}>{t('viewAll')}<ArrowRight size={14} /></button></div><LicenseTable t={t} licenses={licenses.slice(0, 4)} copied={copied} onCopy={copyCode} onRevoke={revoke} /></div><div className="panel plan-mix-panel"><div className="panel-heading"><div><div className="panel-eyebrow"><span className="panel-eyebrow-dot purple-dot" />SUBSCRIPTION MIX</div><h3>Plan distribution</h3></div><MoreHorizontal size={18} /></div><div className="plan-mix-chart"><div className="mix-ring"><div><strong>{active}</strong><small>active</small></div></div><div className="plan-mix-legend"><div><i className="mix-dot mix-growth" /><span>Quarterly<small>{licenses.filter((item) => item.plan === 'Quarterly' && item.status === 'Active').length || 1} workspaces</small></span></div><div><i className="mix-dot mix-yearly" /><span>Yearly<small>{licenses.filter((item) => item.plan === 'Yearly' && item.status === 'Active').length || 1} workspaces</small></span></div><div><i className="mix-dot mix-monthly" /><span>Monthly / custom<small>{licenses.filter((item) => ['Monthly', 'Custom'].some((word) => item.plan.includes(word)) && item.status === 'Active').length} workspaces</small></span></div></div></div><button className="master-plan-link" type="button" onClick={() => setSection('licenses')}>{t('licenseIntro')}<ArrowRight size={14} /></button></div></div><div className="admin-safety-note"><ShieldCheck size={16} /><div><strong>{t('keyWarning')}</strong><span>{t('secureBackendNote')}</span></div></div></>}
        {section === 'licenses' && <><PageHeading title={t('licenseKeys')} description={t('licenseIntro')} action={<button className="button button-primary" onClick={() => setModalOpen(true)}><Plus size={16} />{t('generateKey')}</button>} /><LicensesPage t={t} licenses={licenses} query={search} copied={copied} onCopy={copyCode} onRevoke={revoke} /></>}
        {section === 'businesses' && <><PageHeading title={t('businesses')} description="See every supplier workspace currently using an AquaFlow access key." action={<button className="button button-primary" onClick={() => setModalOpen(true)}><Plus size={16} />{t('createWorkspaceAccess')}</button>} /><BusinessesPage t={t} licenses={licenses} query={search} /></>}
        {section === 'settings' && <><PageHeading title={t('settings')} description="Manage this platform administrator workspace." /><div className="panel master-settings-panel"><div className="settings-card-heading"><span className="settings-heading-icon settings-lilac"><ShieldCheck size={18} /></span><div><h2>Administrator account</h2><p>Master access for the AquaFlow subscription platform.</p></div></div><div className="settings-fields"><label className="settings-field"><span>{t('fullName')}</span><input defaultValue={session.name} /></label><label className="settings-field"><span>{t('email')}</span><input defaultValue={session.email} disabled /></label><label className="settings-field"><span>Role</span><input value="Platform master admin" disabled /></label></div><div className="master-settings-note"><ShieldCheck size={16} /> Admin demo credentials are shown on the sign-in page; use a protected backend before production.</div></div></>}
        <div className="demo-disclaimer"><Sparkles size={13} />{t('showingSample')}</div>
      </main></div>{mobileNav && <button className="mobile-scrim" type="button" onClick={() => setMobileNav(false)} aria-label="Close menu" />}{modalOpen && <GenerateLicenseModal t={t} onClose={() => setModalOpen(false)} onSubmit={createLicense} />}{toast && <Toast message={toast} />}
    </div>
  );
}

function MasterSidebar({ section, setSection, t, onLogout, mobileNav, onClose, activeCount }) {
  const nav = [{ id: 'platform', label: 'adminOverview', icon: LayoutDashboard }, { id: 'licenses', label: 'licenseKeys', icon: ShieldCheck }, { id: 'businesses', label: 'businesses', icon: Building2 }, { id: 'settings', label: 'settings', icon: Settings }];
  return <aside className={`app-sidebar master-sidebar ${mobileNav ? 'sidebar-open' : ''}`}><div className="sidebar-brand-row"><Brand light onClick={() => setSection('platform')} /><button className="sidebar-close" onClick={onClose} aria-label="Close menu"><X size={18} /></button></div><div className="admin-workspace-label"><span className="admin-workspace-icon"><ShieldCheck size={17} /></span><span><small>MASTER ACCOUNT</small><strong>AquaFlow Platform</strong></span><span className="admin-badge">ADMIN</span></div><div className="admin-section-heading">PLATFORM</div><nav className="sidebar-nav master-nav">{nav.map((item) => <button type="button" className={`sidebar-link ${section === item.id ? 'active' : ''}`} key={item.id} onClick={() => setSection(item.id)}><item.icon size={17} /><span>{t(item.label)}</span>{item.id === 'licenses' && <span className="nav-count">{activeCount}</span>}</button>)}</nav><div className="sidebar-bottom"><div className="master-sidebar-note"><span className="master-shield-icon"><ShieldCheck size={17} /></span><strong>Platform control</strong><small>Manage subscription access across every water supplier.</small><span className="master-note-link">All systems operational <i /></span></div><div className="sidebar-user"><span className="user-avatar admin-avatar">AF</span><span className="user-meta"><strong>AquaFlow Platform</strong><small>Master administrator</small></span><button className="logout-button" type="button" onClick={onLogout} title={t('signOut')}><LogOut size={16} /></button></div></div></aside>;
}

function LicensesPage({ t, licenses, query, copied, onCopy, onRevoke }) {
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const term = `${query} ${search}`.trim().toLowerCase();
  const filtered = licenses.filter((license) => (status === 'All' || license.status === status) && (!term || `${license.code} ${license.business} ${license.email} ${license.plan}`.toLowerCase().includes(term)));
  return <div className="section-content licenses-content"><div className="license-summary-strip"><div><span className="license-summary-icon license-green"><ShieldCheck size={17} /></span><small>Active</small><strong>{licenses.filter((entry) => entry.status === 'Active').length}</strong></div><div><span className="license-summary-icon license-blue"><KeyIcon /></span><small>Available</small><strong>{licenses.filter((entry) => entry.status === 'Available').length}</strong></div><div><span className="license-summary-icon license-orange"><Clock3 size={17} /></span><small>Expired</small><strong>{licenses.filter((entry) => entry.status === 'Expired').length}</strong></div><div><span className="license-summary-icon license-grey"><Building2 size={17} /></span><small>Total keys</small><strong>{licenses.length}</strong></div></div><div className="section-summary-row"><div className="inline-metrics"><span><strong>{licenses.length}</strong> license keys issued</span><span>New keys activate when a supplier signs up</span></div><div className="table-tools"><label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('search')} /></label><select className="select-control table-filter" value={status} onChange={(event) => setStatus(event.target.value)}><option value="All">All statuses</option><option value="Available">{t('available')}</option><option value="Active">{t('active')}</option><option value="Expired">{t('expired')}</option><option value="Revoked">{t('revoked')}</option></select></div></div><div className="panel table-panel"><LicenseTable t={t} licenses={filtered} copied={copied} onCopy={onCopy} onRevoke={onRevoke} /></div><div className="license-footnote"><ShieldCheck size={14} />{t('keyWarning')} <span>·</span> {t('shareKeysSafely')}</div></div>;
}

function LicenseTable({ t, licenses, copied, onCopy, onRevoke }) {
  if (!licenses.length) return <EmptyState t={t} />;
  return <div className="table-scroll"><table className="data-table license-table"><thead><tr><th>License key</th><th>{t('businesses')}</th><th>{t('plan')}</th><th>{t('status')}</th><th>{t('created')}</th><th>{t('expires')}</th><th>{t('actions')}</th></tr></thead><tbody>{licenses.map((license) => <tr key={license.id}><td><div className="license-code-cell"><span className="license-key-symbol"><KeyIcon /></span><span><strong>{license.code}</strong><small>{license.id} · {license.days} days</small></span></div></td><td><strong>{license.business}</strong><small className="table-secondary">{license.email || 'Not claimed yet'}</small></td><td><span className="plan-chip">{license.plan}</span></td><td><StatusPill status={license.status} t={t} /></td><td>{shortDate(license.createdAt)}</td><td>{license.expiresAt ? shortDate(license.expiresAt) : <span className="table-secondary">On activation</span>}</td><td><div className="license-actions"><button className={`copy-key-button ${copied === license.code ? 'copied' : ''}`} type="button" onClick={() => onCopy(license.code)} title={t('copyKey')}>{copied === license.code ? <Check size={14} /> : <Copy size={14} />}</button>{(license.status === 'Active' || license.status === 'Available') && <button className="revoke-key-button" type="button" onClick={() => onRevoke(license)} title={t('revoke')}><X size={14} /></button>}</div></td></tr>)}</tbody></table></div>;
}

function KeyIcon() { return <span className="key-glyph">⌘</span>; }

function BusinessesPage({ t, licenses, query }) {
  const term = query.trim().toLowerCase();
  const workspaces = licenses.filter((license) => license.status === 'Active' && (!term || `${license.business} ${license.email} ${license.plan}`.toLowerCase().includes(term)));
  return <div className="section-content businesses-grid">{workspaces.length ? workspaces.map((license, index) => <article className="workspace-card panel" key={license.id}><div className="workspace-card-top"><span className={`workspace-logo workspace-logo-${index % 4}`}><Droplets size={21} /></span><StatusPill status={license.status} t={t} /></div><h3>{license.business}</h3><p>{license.email || 'No business email attached'}</p><div className="workspace-details"><div><small>Subscription</small><strong>{license.plan}</strong></div><div><small>License ID</small><strong>{license.id}</strong></div><div><small>Expires</small><strong>{shortDate(license.expiresAt)}</strong></div><div><small>Key</small><strong className="workspace-key-short">{license.code.slice(0, 9)}••••••</strong></div></div><div className="workspace-card-bottom"><span><span className="status-live" />Workspace connected</span><button type="button" className="workspace-manage" title="Manage license"><MoreHorizontal size={18} /></button></div></article>) : <div className="panel businesses-empty"><Building2 size={28} /><h3>{t('noResults')}</h3></div>}</div>;
}

function GenerateLicenseModal({ t, onClose, onSubmit }) {
  const [form, setForm] = useState({ business: '', email: '', plan: 'Monthly', customDays: 45 });
  const [error, setError] = useState('');
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const days = form.plan === 'Monthly' ? 30 : form.plan === 'Quarterly' ? 90 : form.plan === 'Yearly' ? 365 : Math.max(1, Number(form.customDays) || 1);
  const submit = (event) => { event.preventDefault(); if (form.plan === 'Custom' && (!Number(form.customDays) || Number(form.customDays) < 1)) { setError(t('customDays')); return; } onSubmit({ business: form.business.trim(), email: form.email.trim(), plan: form.plan, days }); };
  return <ModalShell title={t('generateKey')} description="Create a time-limited access key for a water supplier workspace." onClose={onClose}><form className="modal-form" onSubmit={submit}><FormField label={t('generatedFor')} icon={Building2}><input value={form.business} onChange={(event) => set('business', event.target.value)} placeholder="e.g. Pure Springs Karachi" /></FormField><FormField label={t('emailOptional')} icon={Globe2}><input type="email" value={form.email} onChange={(event) => set('email', event.target.value)} placeholder={t('emailPlaceholder')} /></FormField><div className="license-plan-picker"><span className="field-label">{t('plan')} & {t('duration')}</span><div className="plan-choice-grid">{['Monthly', 'Quarterly', 'Yearly', 'Custom'].map((plan) => <button type="button" key={plan} className={`plan-choice ${form.plan === plan ? 'selected' : ''}`} onClick={() => set('plan', plan)}><span className="plan-choice-check">{form.plan === plan && <Check size={11} />}</span><strong>{plan === 'Custom' ? t('custom') : t(plan.toLowerCase())}</strong><small>{plan === 'Monthly' ? '30 days' : plan === 'Quarterly' ? '90 days' : plan === 'Yearly' ? '365 days' : 'Set duration'}</small></button>)}</div></div>{form.plan === 'Custom' && <FormField label={t('customDays')} icon={CalendarDays}><input type="number" min="1" max="3650" value={form.customDays} onChange={(event) => set('customDays', event.target.value)} required /></FormField>}<div className="license-modal-summary"><span><ShieldCheck size={16} /> Access duration</span><strong>{days} days</strong></div>{error && <div className="form-error"><X size={14} />{error}</div>}<div className="modal-actions"><button className="button button-outline" type="button" onClick={onClose}>{t('cancel')}</button><button className="button button-primary" type="submit"><KeyIcon />{t('generate')}</button></div><small className="modal-helper">The subscription clock starts when the supplier activates the key.</small></form></ModalShell>;
}

function NewOrderModal({ t, customers, routes, pricing, onClose, onSubmit }) {
  const [form, setForm] = useState({ customerId: customers[0]?.id || '', cans: 2, product: '19L returnable can', payment: 'Cash on delivery', route: '', deliveryDate: localISODate(), notes: '' });
  const customer = customers.find((entry) => entry.id === form.customerId);
  const matchedRoute = routes.find((entry) => customer?.route?.includes(entry.id));
  const routeValue = form.route || (matchedRoute ? `${matchedRoute.name} · ${matchedRoute.id}` : `${routes[0]?.name} · ${routes[0]?.id}`);
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  return <ModalShell title={t('createNewOrder')} description={t('orderFormCopy')} onClose={onClose}><form className="modal-form" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...form, route: routeValue, amount: calculateOrderAmount(form.product, form.cans, pricing) }); }}><FormField label={t('selectCustomer')} icon={Users}><select value={form.customerId} onChange={(event) => set('customerId', event.target.value)} required><option value="">{t('chooseCustomer')}</option>{customers.map((entry) => <option value={entry.id} key={entry.id}>{entry.name} · {entry.phone}</option>)}</select></FormField>{customer && <div className="selected-customer-summary"><span className="customer-avatar customer-avatar-1">{customer.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}</span><span><strong>{customer.address}</strong><small>{customer.route} · {t('balance')}: {money(customer.balance)} · {group(customer.bottleBalance || 0)} {t('bottlesUnit')}</small></span><MapPinIcon /></div>}<div className="form-grid-two"><FormField label={t('product')} icon={Package}><select value={form.product} onChange={(event) => set('product', event.target.value)}><option>19L returnable can</option><option>1.5L bottle pack</option><option>500ml carton</option></select></FormField><FormField label={t('quantity')} icon={Boxes}><input type="number" min="1" max="999" value={form.cans} onChange={(event) => set('cans', event.target.value)} required /></FormField></div><div className="form-grid-two"><FormField label={t('deliveryDate')} icon={CalendarDays}><input type="date" value={form.deliveryDate} onChange={(event) => set('deliveryDate', event.target.value)} required /></FormField><FormField label={t('selectRoute')} icon={Truck}><select value={routeValue} onChange={(event) => set('route', event.target.value)}>{routes.map((route) => <option key={route.id} value={`${route.name} · ${route.id}`}>{route.name}</option>)}</select></FormField></div><FormField label={t('payment')} icon={CreditCard}><select value={form.payment} onChange={(event) => set('payment', event.target.value)}><option>Cash on delivery</option><option>Paid</option><option>Monthly invoice</option></select></FormField><FormField label={t('notes')} icon={FileText}><textarea rows="2" value={form.notes} onChange={(event) => set('notes', event.target.value)} placeholder={t('notesPlaceholder')} /></FormField><div className="modal-rate-note"><span>{pricing.mode === 'per-litre' ? `${money(pricing.pricePerLitre)} / litre` : `${money(priceForUnit(form.product, pricing))} / unit`}</span><span>Estimated total <strong>{money(calculateOrderAmount(form.product, form.cans, pricing))}</strong></span></div><div className="modal-actions"><button className="button button-outline" type="button" onClick={onClose}>{t('cancel')}</button><button className="button button-primary" type="submit"><Plus size={16} />{t('createOrder')}</button></div></form></ModalShell>;
}

function MapPinIcon() { return <span className="summary-map-pin"><Truck size={15} /></span>; }

function NewCustomerModal({ t, routes, customer, onClose, onSubmit }) {
  const [form, setForm] = useState(() => customer ? { ...customer } : { name: '', phone: '', email: '', address: '', route: `${routes[0]?.name} · ${routes[0]?.id}`, frequency: 'Every 2 days', bottleBalance: 0 });
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  return <ModalShell title={customer ? t('editCustomer') : t('createNewCustomer')} description={t('customerFormCopy')} onClose={onClose}><form className="modal-form" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...form, id: customer?.id }); }}><FormField label={t('fullName')} icon={Users}><input value={form.name} onChange={(event) => set('name', event.target.value)} placeholder={t('namePlaceholder')} required /></FormField><div className="form-grid-two"><FormField label={t('phone')} icon={Globe2}><input type="tel" value={form.phone} onChange={(event) => set('phone', event.target.value)} placeholder="03xx xxx xxxx" required /></FormField><FormField label={t('emailAddress')} icon={Mail}><input type="email" value={form.email || ''} onChange={(event) => set('email', event.target.value)} placeholder="customer@example.com" /></FormField></div><FormField label={t('address')} icon={Building2}><input value={form.address} onChange={(event) => set('address', event.target.value)} placeholder="Street, area, city" required /></FormField><div className="form-grid-two"><FormField label={t('selectRoute')} icon={Truck}><select value={form.route} onChange={(event) => set('route', event.target.value)}>{routes.map((route) => <option key={route.id} value={`${route.name} · ${route.id}`}>{route.name} · {route.zone}</option>)}</select></FormField><FormField label={t('frequency')} icon={CalendarDays}><select value={form.frequency} onChange={(event) => set('frequency', event.target.value)}><option>Daily</option><option>Every 2 days</option><option>Every 3 days</option><option>Weekly</option><option>Twice a week</option><option>On demand</option></select></FormField></div><FormField label={t('bottleBalance')} icon={Package}><input type="number" min="0" value={form.bottleBalance ?? 0} onChange={(event) => set('bottleBalance', event.target.value)} /></FormField><div className="modal-actions"><button className="button button-outline" type="button" onClick={onClose}>{t('cancel')}</button><button className="button button-primary" type="submit">{customer ? <Check size={16} /> : <Plus size={16} />}{customer ? t('saveChanges') : t('saveCustomer')}</button></div></form></ModalShell>;
}

function NewRouteModal({ t, route, onClose, onSubmit }) {
  const [form, setForm] = useState(() => route ? { name: route.name, zone: route.zone, driver: route.driver, vehicle: route.vehicle, stops: route.stops } : { name: '', zone: '', driver: '', vehicle: '', stops: 20 });
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  return <ModalShell title={route ? t('editRoute') : t('createRoute')} description={t('routeFormCopy')} onClose={onClose}><form className="modal-form" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...form, id: route?.id }); }}><FormField label={t('routeName')} icon={Truck}><input value={form.name} onChange={(event) => set('name', event.target.value)} placeholder="e.g. Clifton & Seaview" required /></FormField><FormField label={t('zoneName')} icon={MapPin}><input value={form.zone} onChange={(event) => set('zone', event.target.value)} placeholder="e.g. South Karachi" required /></FormField><div className="form-grid-two"><FormField label={t('driverName')} icon={Users}><input value={form.driver} onChange={(event) => set('driver', event.target.value)} placeholder="Driver name" /></FormField><FormField label={t('vehicleNumber')} icon={Truck}><input value={form.vehicle} onChange={(event) => set('vehicle', event.target.value.toUpperCase())} placeholder="KHI-0000" /></FormField></div><FormField label={t('plannedStops')} icon={MapPin}><input type="number" min="1" max="300" value={form.stops} onChange={(event) => set('stops', event.target.value)} required /></FormField><div className="modal-actions"><button className="button button-outline" type="button" onClick={onClose}>{t('cancel')}</button><button className="button button-primary" type="submit"><Check size={16} />{route ? t('saveChanges') : t('createRoute')}</button></div></form></ModalShell>;
}

function CompleteDeliveryModal({ t, order, customer, onClose, onSubmit }) {
  const [paymentReceived, setPaymentReceived] = useState(order.paymentReceived ?? (order.payment === 'Paid' ? order.amount : 0));
  const [bottlesReturned, setBottlesReturned] = useState(order.emptyReturned ?? order.cans);
  const dueBeforeOrder = Number(customer?.balance) || 0;
  const bottleBalanceBefore = Number(customer?.bottleBalance) || 0;
  const { totalBalance, bottleBalance } = calculateDeliveryBalances({ previousBalance: dueBeforeOrder, bottleBalance: bottleBalanceBefore, orderAmount: order.amount, bottlesDelivered: order.cans, paymentReceived, bottlesReturned });
  return <ModalShell title={t('completeDelivery')} description={t('deliveryCompletionCopy')} onClose={onClose}><form className="modal-form" onSubmit={(event) => { event.preventDefault(); onSubmit({ orderId: order.id, paymentReceived: Number(paymentReceived), bottlesReturned: Number(bottlesReturned) }); }}><div className="delivery-completion-summary"><div><small>{t('customer')}</small><strong>{customer?.name || order.customer}</strong></div><div><small>{t('bottlesDelivered')}</small><strong>{order.cans} × {t('nineteenLCan')}</strong></div><div><small>{t('orderTotal')}</small><strong>{money(order.amount)}</strong></div></div><div className="form-grid-two"><FormField label={t('paymentReceived')} icon={Wallet}><input type="number" min="0" step="1" value={paymentReceived} onChange={(event) => setPaymentReceived(event.target.value)} /></FormField><FormField label={t('bottlesReturned')} icon={Package}><input type="number" min="0" max="999" value={bottlesReturned} onChange={(event) => setBottlesReturned(event.target.value)} /></FormField></div><div className="delivery-balance-preview"><div><span>{t('previousBalance')}</span><strong>{money(dueBeforeOrder)}</strong></div><div><span>{t('bottleBalance')}</span><strong>{bottleBalance} {t('bottlesUnit')}</strong></div><div><span>{t('totalBalance')}</span><strong>{money(totalBalance)}</strong></div></div><div className="modal-actions"><button className="button button-outline" type="button" onClick={onClose}>{t('cancel')}</button><button className="button button-primary" type="submit"><Check size={16} />{t('deliveryCompleted')}</button></div></form></ModalShell>;
}

function DeliveryReportModal({ t, order, customer, businessName, comms, language, onClose }) {
  const [copied, setCopied] = useState(false);
  const report = buildDeliveryReport(order, customer, businessName, comms, language);
  const sendWhatsApp = () => {
    const phone = whatsappNumber(customer?.phone || order.phone);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(report)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const emailReport = () => {
    const subject = `Delivery report · ${order.id} · ${shortDate(order.date)}`;
    window.location.href = `mailto:${encodeURIComponent(customer?.email || '')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(report)}`;
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(report); } catch { /* clipboard may be disabled */ }
    setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  };
  return <ModalShell title={t('reportPreview')} description={`${customer?.name || order.customer} · ${order.id} · ${businessName}`} onClose={onClose}><div className="delivery-report-preview"><textarea readOnly value={report} rows="12" /></div><div className="report-actions"><button className="button button-primary" type="button" onClick={sendWhatsApp}><MessageCircle size={16} />{t('sendWhatsApp')}</button><button className="button button-outline" type="button" onClick={emailReport} disabled={!customer?.email}><Mail size={15} />{t('sendEmail')}</button><button className="button button-outline" type="button" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? t('copied') : t('copyReport')}</button></div><div className="smtp-demo-note report-smtp-note"><Mail size={14} /><span>{t('smtpLimit')}</span></div></ModalShell>;
}

function StockModal({ t, inventory, onClose, onSubmit }) {
  const [form, setForm] = useState({ id: inventory[0]?.id || '', amount: 10, action: 'add' });
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const item = inventory.find((entry) => entry.id === form.id);
  return <ModalShell title={t('stockAdjustment')} description="Record production, purchases or returned stock." onClose={onClose}><form className="modal-form" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...form, amount: Number(form.amount) }); }}><FormField label={t('item')} icon={Package}><select value={form.id} onChange={(event) => set('id', event.target.value)}>{inventory.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></FormField>{item && <div className="stock-current-summary"><span className="inventory-item-icon"><Package size={17} /></span><span><small>Current balance</small><strong>{group(item.stock)} {item.unit}</strong></span><span className={item.stock < item.reorder ? 'low-stock-text' : ''}>{item.stock < item.reorder ? t('lowStock') : t('inFlow')}</span></div>}<div className="form-grid-two"><FormField label={t('quantity')} icon={Boxes}><input type="number" min="1" value={form.amount} onChange={(event) => set('amount', event.target.value)} required /></FormField><FormField label="Adjustment type" icon={Activity}><select value={form.action} onChange={(event) => set('action', event.target.value)}><option value="add">{t('add')}</option><option value="remove">{t('remove')}</option></select></FormField></div><div className="modal-actions"><button className="button button-outline" type="button" onClick={onClose}>{t('cancel')}</button><button className="button button-primary" type="submit"><Check size={16} />{t('saveAdjustment')}</button></div></form></ModalShell>;
}

function ExpenseModal({ t, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', category: 'Fuel', amount: '', paidBy: 'Cash' });
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  return <ModalShell title={t('createExpense')} description={t('expenseFormCopy')} onClose={onClose}><form className="modal-form" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...form, amount: Number(form.amount) }); }}><FormField label={t('expenseName')} icon={FileText}><input value={form.title} onChange={(event) => set('title', event.target.value)} placeholder="e.g. Delivery fuel · Fleet A" required /></FormField><div className="form-grid-two"><FormField label={t('categoryName')} icon={Package}><select value={form.category} onChange={(event) => set('category', event.target.value)}><option>Fuel</option><option>Packaging</option><option>Maintenance</option><option>Utilities</option><option>Salaries</option><option>Other</option></select></FormField><FormField label={t('amount')} icon={Wallet}><input type="number" min="1" value={form.amount} onChange={(event) => set('amount', event.target.value)} placeholder="0" required /></FormField></div><FormField label={t('paidBy')} icon={CreditCard}><select value={form.paidBy} onChange={(event) => set('paidBy', event.target.value)}><option>Cash</option><option>Bank transfer</option><option>Card</option><option>JazzCash / Easypaisa</option></select></FormField><div className="modal-actions"><button className="button button-outline" type="button" onClick={onClose}>{t('cancel')}</button><button className="button button-primary" type="submit"><Plus size={16} />{t('saveExpense')}</button></div></form></ModalShell>;
}

function ModalShell({ title, description, children, onClose }) {
  useEffect(() => {
    const closeOnEsc = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', closeOnEsc);
    return () => document.removeEventListener('keydown', closeOnEsc);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal-panel" role="dialog" aria-modal="true" aria-label={title}><div className="modal-header"><div><span className="modal-overline"><span className="eyebrow-dot" />AQUAFLOW</span><h2>{title}</h2>{description && <p>{description}</p>}</div><button className="modal-close" type="button" onClick={onClose} aria-label="Close"><X size={19} /></button></div>{children}</section></div>;
}

function StatusPill({ status, t, override }) {
  const css = status.toLowerCase().replace(/\s+/g, '-').replace('active', 'active').replace('available', 'available');
  return <span className={`status-pill status-${css}`}><i />{override || t(statusKey(status))}</span>;
}

function EmptyState({ t }) { return <div className="empty-state"><Search size={21} /><strong>{t('noResults')}</strong></div>; }
function Toast({ message }) { return <div className="toast-message"><CheckCircle2 size={17} />{message}</div>; }

function downloadCsv(filename, headers, rows) {
  const content = [headers, ...rows].map((row) => row.map((field) => `"${String(field ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}

export default App;
