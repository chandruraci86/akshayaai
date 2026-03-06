import React, { useState, useEffect } from 'react';
import { getBuckets, updateBucketStrategy } from '../services/api';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '../components/Sidebar';

export default function BucketManagement() {
    const [buckets, setBuckets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBuckets();
    }, []);

    const fetchBuckets = async () => {
        try {
            setLoading(true);
            const data = await getBuckets();
            setBuckets(data);
        } catch (error) {
            console.error("Failed to fetch buckets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStrategyToggle = async (bucketId, currentStrategy) => {
        const newStrategy = currentStrategy === 'Rotation' ? 'Margin' : 'Rotation';
        try {
            // Optimistic UI update
            setBuckets(prev => prev.map(b => b.id === bucketId ? { ...b, strategy: newStrategy } : b));
            await updateBucketStrategy(bucketId, newStrategy);
        } catch (error) {
            console.error("Failed to update strategy", error);
            // Revert on failure
            setBuckets(prev => prev.map(b => b.id === bucketId ? { ...b, strategy: currentStrategy } : b));
        }
    };

    const filteredBuckets = buckets.filter(b => {
        const term = searchTerm.toLowerCase();
        return (b.name && b.name.toLowerCase().includes(term)) || b.id.toLowerCase().includes(term);
    });

    return (
        <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bucket Management</h1>
                    <p className="text-gray-500 mt-2">Manage grouped jewelry items and assign algorithms.</p>
                </div>

                <div className="relative w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                        placeholder="Search by Bucket Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="flex justify-center items-center flex-1">
                        <Loader2 className="animate-spin text-brand-500" size={32} />
                    </div>
                ) : (
                    <div className="overflow-x-auto flex-1">
                        <table className="min-w-full divide-y divide-gray-100 text-left">
                            <thead className="bg-gray-50/50 sticky top-0 backdrop-blur-sm z-10">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 tracking-wider">Bucket Name</th>
                                    <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 tracking-wider">Current Stock</th>
                                    <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-500 tracking-wider">Assigned Strategy</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {filteredBuckets.map((bucket) => (
                                    <tr key={bucket.id} className="table-row-hover group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-100 to-brand-300 flex items-center justify-center text-brand-800 font-bold text-xs mr-3">
                                                    {bucket.name ? bucket.name.substring(0, 2).toUpperCase() : bucket.id.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold text-gray-900 font-mono" title={bucket.id}>
                                                    {bucket.name || bucket.id.substring(0, 16) + '...'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">{bucket.stock_count} <span className="text-gray-400 font-normal">pcs</span></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleStrategyToggle(bucket.id, bucket.strategy)}
                                                className={cn(
                                                    "relative inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-in-out border hover:shadow-md",
                                                    bucket.strategy === 'Rotation'
                                                        ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                                        : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                                )}
                                            >
                                                <span className="relative z-10 flex items-center gap-1.5">
                                                    {bucket.strategy === 'Rotation' ? (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                    ) : (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                    )}
                                                    {bucket.strategy}
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBuckets.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">
                                            No buckets found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
