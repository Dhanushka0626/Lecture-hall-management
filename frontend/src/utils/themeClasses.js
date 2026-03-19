export const themeClasses = {
  // Page containers
    pageContainer: "min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors px-4 sm:px-6 lg:px-8",
    pageContainerNoPadding: "min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors",
  
  // Cards and panels
    card: "bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 transition-colors",
  cardBorder: "border border-gray-200 dark:border-slate-700",
    cardCompact: "bg-white dark:bg-slate-800 rounded-lg shadow-sm p-3 sm:p-4 transition-colors",
  
  // Text colors
  textPrimary: "text-gray-900 dark:text-slate-100",
  textSecondary: "text-gray-600 dark:text-slate-300",
  textMuted: "text-gray-500 dark:text-slate-400",
  
  // Headings
    heading1: "text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-slate-50",
    heading2: "text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-slate-50",
    heading3: "text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-slate-100",
    heading4: "text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-100",
  
  // Buttons
    buttonPrimary: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base",
    buttonSecondary: "bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-100 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base",
    buttonDanger: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base",
    buttonSmall: "px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded",
  
  // Form inputs
    input: "w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base",
    inputLabel: "block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-200 mb-1 sm:mb-1.5",
    inputGroup: "space-y-3 sm:space-y-4",
  
  // Tables
  tableHeader: "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-semibold",
  tableRow: "border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition",
    tableCell: "px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 dark:text-slate-200",
    tableWrapper: "overflow-x-auto -mx-4 sm:mx-0",
    tableResponsive: "min-w-full divide-y divide-gray-200 dark:divide-slate-700",
  
  // Modals
    modal: "bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-2xl max-w-2xl w-full mx-4 transition-colors",
  modalOverlay: "fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 transition-opacity",
  modalHeader: "px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-700",
  modalBody: "px-4 sm:px-6 py-4",
  modalFooter: "px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900",
  
  // Navigation
  navLink: "text-gray-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition",
  navLinkActive: "text-indigo-600 dark:text-indigo-400 font-medium",
  
  // Badges and tags
    badge: "inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium",
  badgeSuccess: "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300",
  badgeWarning: "bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300",
  badgeDanger: "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300",
  badgeInfo: "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300",
  
  // Dividers
  divider: "border-t border-gray-200 dark:border-slate-700",
  
   // Grid layouts
    gridResponsive: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
    gridResponsive2: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6",
    gridResponsive4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",
  
   // Spacing
    sectionPadding: "py-12 sm:py-16 lg:py-24",
    sectionPaddingSmall: "py-8 sm:py-12 lg:py-16",
    contentMaxWidth: "max-w-6xl mx-auto px-4 sm:px-6",
  
  // Hover states
  hoverBg: "hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors",
  
  // Sidebar
  sidebar: "bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transition-colors",
  sidebarItem: "px-4 py-2 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition",
  sidebarItemActive: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium",
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export default themeClasses;
