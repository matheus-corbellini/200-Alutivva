import { createContext, useContext, useState, type ReactNode } from "react";

type SidebarCollapseContextValue = {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    toggleCollapsed: () => void;
};

const SidebarCollapseContext = createContext<SidebarCollapseContextValue | undefined>(
    undefined
);

type SidebarCollapseProviderProps = {
    children: ReactNode;
    initialCollapsed?: boolean;
};

export function SidebarCollapseProvider({ children, initialCollapsed = false }: SidebarCollapseProviderProps) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(initialCollapsed);

    const toggleCollapsed = () => setIsCollapsed((prev) => !prev);

    return (
        <SidebarCollapseContext.Provider value={{ isCollapsed, setIsCollapsed, toggleCollapsed }}>
            {children}
        </SidebarCollapseContext.Provider>
    );
}

export function useSidebarCollapse(): SidebarCollapseContextValue {
    const ctx = useContext(SidebarCollapseContext);
    if (!ctx) {
        throw new Error("useSidebarCollapse must be used within SidebarCollapseProvider");
    }
    return ctx;
}


