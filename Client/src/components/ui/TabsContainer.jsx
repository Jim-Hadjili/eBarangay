// Client/src/components/ui/TabsContainer.jsx
import { createContext, useContext, useState } from "react";

const TabsContext = createContext();

export function TabsContainer({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="flex flex-col min-h-screen">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return (
    <nav
      className={`flex justify-center w-full gap-2 px-4 py-4 bg-white border-b border-gray-200 sm:justify-between sm:px-8 md:px-12 lg:px-16 xl:px-20 ${className}`}
    >
      {children}
    </nav>
  );
}

export function TabButton({ value, icon: Icon, label, shortLabel }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex flex-col sm:flex-row items-center justify-center cursor-pointer gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-4 rounded-lg font-Lexend transition-all flex-1 sm:flex-auto md:flex-1 ${
        isActive
          ? "bg-green-500 text-white shadow-sm"
          : "text-gray-600 hover:bg-green-100"
      }`}
    >
      <Icon size={20} strokeWidth={2} className="shrink-0" />
      <span className="text-[10px] sm:text-sm whitespace-nowrap">
        {shortLabel ? (
          <>
            <span className="sm:hidden">{shortLabel}</span>
            <span className="hidden sm:inline">{label}</span>
          </>
        ) : (
          label
        )}
      </span>
    </button>
  );
}

export function TabsContent({ children }) {
  return <div className="flex-1 bg-gray-50">{children}</div>;
}

export function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return <div className="animate-fadeIn">{children}</div>;
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsContainer");
  }
  return context;
}
