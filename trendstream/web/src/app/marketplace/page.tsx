
import { fetchMarketplacePacks } from "@/lib/marketplace/packs";
import { Download, ShoppingBag, Star, Package } from "lucide-react";

export default async function MarketplacePage() {
    const packs = await fetchMarketplacePacks();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Marketplace</h2>
                <p className="text-slate-400 mt-1">
                    Discover and install community-verified pattern packs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map((pack) => (
                    <div key={pack.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-indigo-500/50 transition-colors">
                        <div className="h-32 bg-slate-800 relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 p-2 bg-slate-800/80 backdrop-blur rounded-lg border border-slate-700">
                                <Package className="w-6 h-6 text-indigo-400" />
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{pack.category.toUpperCase()}</span>
                                <div className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    {pack.rating}
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                                {pack.title}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                {pack.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <div className="text-sm text-slate-400">
                                    by <span className="text-slate-300">{pack.author}</span>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
                                    <Download className="w-4 h-4" />
                                    {pack.price === 'Free' ? 'Install' : `Buy ${pack.price}`}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
