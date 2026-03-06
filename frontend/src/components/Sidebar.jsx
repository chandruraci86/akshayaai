import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, Gem, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Sidebar({ isOpen, onClose }) {
    const navItems = [
        { to: "/", icon: <PackageSearch size={20} />, label: "Bucket Management" },
        { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Reorder Dashboard" }
    ];

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <div className={cn(
                "fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-sm h-screen flex flex-col transition-transform duration-300 ease-in-out",
                // On mobile: slide in/out. On md+: always visible
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <div className="flex items-center">
                        <Gem className="text-brand-600 mr-2" size={24} />
                        <h1 className="text-lg font-bold text-gray-900 tracking-tight">Akshaya AI</h1>
                    </div>
                    {/* Close button on mobile */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm",
                                    isActive
                                        ? "bg-brand-50 text-brand-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )
                            }
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="text-xs text-center text-gray-400 font-medium">
                        ML Reorder Engine v1.0
                    </div>
                </div>
            </div>
        </>
    );
}
