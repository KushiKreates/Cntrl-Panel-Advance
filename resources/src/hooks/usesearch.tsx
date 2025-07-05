import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Fix import to use react-router-dom
import { Search, X, ChevronRight, Command, ArrowRight } from 'lucide-react';

// Default search data
const DEFAULT_SEARCH_DATA = [
    {
        href: '/home',
        name: 'Dashboard',
        description: 'View your account dashboard and statistics',
        category: 'Navigation',
    },
    {
        href: '/servers/new',
        name: 'Deploy Server',
        description: 'Deploy a new server instance',
        category: 'Actions',
    },
    // Keep the rest of your data...
];

export default function useSearch(customData = [], options = {}) {
    // Combine default data with any custom data
    const searchData = [...DEFAULT_SEARCH_DATA, ...customData];

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [groupedResults, setGroupedResults] = useState({});
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    
    const openSearch = useCallback(() => {
        setIsOpen(true);
        // Focus the input after a short delay
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    }, []);

    const closeSearch = useCallback(() => {
        setIsOpen(false);
        setQuery('');
        setResults([]);
    }, []);

    // Register keyboard shortcut (Cmd+K or Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
            if (e.key === 'Escape' && isOpen) {
                closeSearch();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, openSearch, closeSearch]);

    // Handle search logic
    const performSearch = useCallback((searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setGroupedResults({});
            return;
        }

        const searchTerms = searchQuery.toLowerCase().split(' ').filter(Boolean);

        const filteredResults = searchData.filter((item) => {
            return searchTerms.every((term) => {
                return (
                    (item.name && item.name.toLowerCase().includes(term)) ||
                    (item.description && item.description.toLowerCase().includes(term))
                );
            });
        });

        // Group results by category
        const grouped = filteredResults.reduce((acc, item) => {
            const category = item.category || 'General';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});

        setResults(filteredResults);
        setGroupedResults(grouped);
        setSelectedIndex(filteredResults.length > 0 ? 0 : -1);
    }, [searchData]);

    // Update search results when query changes
    useEffect(() => {
        performSearch(query);
    }, [query, performSearch]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyNavigation = (e) => {
            if (e.key === 'Tab' && results.length > 0) {
                e.preventDefault();
                if (e.shiftKey) {
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
                } else {
                    setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
                }
            }

            if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                const selectedItem = results[selectedIndex];
                if (selectedItem && selectedItem.href) {
                    window.location.href = selectedItem.href;
                    closeSearch();
                }
            }
        };

        document.addEventListener('keydown', handleKeyNavigation);
        return () => document.removeEventListener('keydown', handleKeyNavigation);
    }, [isOpen, results, selectedIndex, closeSearch]);

    // Simple SearchComponent that will actually render
    const SearchComponent = () => {
        if (!isOpen) return null;
        
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div 
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-zinc-200 dark:border-zinc-800"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Search header */}
                    <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 p-4">
                        <Search className="h-5 w-5 text-zinc-400 mr-3" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="flex-1 bg-transparent border-0 focus:ring-0 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-base outline-none"
                            placeholder="Type to search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={() => {
                                    setQuery('');
                                    if (inputRef.current) {
                                        inputRef.current.focus();
                                    }
                                }}
                                className="ml-2 text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                        <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="mr-0.5">Esc</span>
                        </div>
                    </div>

                    {/* Search results */}
                    <div className="overflow-y-auto max-h-[60vh]" ref={resultsRef}>
                        {results.length > 0 ? (
                            <div>
                                {Object.entries(groupedResults).map(([category, items]) => (
                                    <div key={category}>
                                        <div className="px-4 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                                            {category}
                                        </div>
                                        <ul>
                                            {items.map((item, index) => (
                                                <li key={index} className="px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                                    <Link to={item.href} className="flex justify-between" onClick={closeSearch}>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                                {item.name}
                                                            </h4>
                                                            {item.description && (
                                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                    {item.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <ArrowRight className="h-4 w-4 text-zinc-400" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : query ? (
                            <div className="py-8 text-center">
                                <p className="text-zinc-500 dark:text-zinc-400">No results found</p>
                            </div>
                        ) : (
                            <div className="p-4 text-center">
                                <p className="text-zinc-500 dark:text-zinc-400">Start typing to search...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return {
        isOpen,
        openSearch,
        closeSearch,
        SearchComponent
    };
}