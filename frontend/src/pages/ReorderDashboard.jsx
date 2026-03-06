import React, { useState, useEffect } from 'react';
import { getReorderDashboard } from '../services/api';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../components/Sidebar';

export default function ReorderDashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const data = await getReorderDashboard();
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    const getUrgencyConfig = (urgency) => {
        switch (urgency) {
            case 'High': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: <AlertTriangle size={18} className="text-red-500" /> };
            case 'Medium': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: <TrendingUp size={18} className="text-amber-500" /> };
            case 'Low': return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: <CheckCircle2 size={18} className="text-green-500" /> };
            default: return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: <Info size={18} /> };
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Smart Reorder List</h1>
                <p className="text-gray-500 mt-2">ML-assisted inventory alerts sorted by priority and strategy.</p>
            </div>

            <div className="flex-1 overflow-auto pr-2 pb-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-brand-500" size={32} />
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                        <CheckCircle2 size={48} className="text-green-400 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">All Stocked Up!</h3>
                        <p className="text-gray-500 mt-1">No buckets currently need reordering based on their strategies.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {items.map((item) => {
                            const uConfig = getUrgencyConfig(item.urgency);

                            return (
                                <div key={item.bucket_id} className={cn(
                                    "bg-white rounded-2xl p-6 border shadow-sm flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden",
                                    uConfig.border
                                )}>
                                    {/* Decorative top bar */}
                                    <div className={cn("absolute top-0 left-0 right-0 h-1.5", uConfig.bg.replace('50', '400'))}></div>

                                    <div className="flex justify-between items-start mb-4 mt-2">
                                        <div className="flex items-center gap-2">
                                            {uConfig.icon}
                                            <span className={cn("text-sm font-bold uppercase tracking-wider", uConfig.color)}>
                                                {item.urgency} Urgency
                                            </span>
                                        </div>
                                        <span className={cn(
                                            "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border",
                                            item.strategy === 'Rotation' ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-purple-50 text-purple-700 border-purple-100"
                                        )}>
                                            {item.strategy}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-6 truncate" title={`Hash: ${item.bucket_id}`}>
                                        {item.bucket_name || item.bucket_id.substring(0, 16) + '...'}
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4 flex-1">
                                        <div className="bg-gray-50 rounded-xl p-3 flex flex-col justify-center">
                                            <span className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-1">Current Stock</span>
                                            <span className="text-2xl font-bold text-gray-900">{item.stock_count} <span className="text-sm font-normal text-gray-400">pcs</span></span>
                                        </div>
                                        <div className="bg-brand-50 rounded-xl p-3 flex flex-col justify-center border border-brand-100/50">
                                            <span className="text-xs text-brand-700 font-medium tracking-wide uppercase mb-1">Rec. Qty</span>
                                            <span className="text-2xl font-bold text-brand-900">{item.recommended_quantity} <span className="text-sm font-normal text-brand-700/60">+</span></span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 font-medium">Reorder Point (ROP)</span>
                                            <span className="text-sm font-bold text-gray-700">{item.reorder_point} pcs</span>
                                        </div>
                                        <div className="flex flex-coltext-right">
                                            <span className="text-xs text-gray-400 font-medium mb-1 block text-right">ML Confidence</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.confidence_score * 100}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-600">{(item.confidence_score * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
