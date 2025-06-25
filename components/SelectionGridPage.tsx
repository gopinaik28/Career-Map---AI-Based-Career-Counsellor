// components/SelectionGridPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import ItemCard from './ItemCard';
import type { SkillItem, InterestItem, SkillCategory, InterestCategory, AppState } from '../types';
import ProgressStepper from './ProgressStepper';

type Item = SkillItem | InterestItem;
type Category = SkillCategory | InterestCategory;

interface SelectionGridPageProps {
  title: string;
  subTitle?: string;
  categories: Category[];
  allItems: Item[];
  setAllItems: React.Dispatch<React.SetStateAction<Item[]>>;
  selectedItems: Item[];
  onToggleItem: (item: Item) => void;
  onNext: () => void;
  onBack?: () => void;
  nextButtonText?: string;
  searchPlaceholder: string; 
  itemType: 'skill' | 'interest';
  currentAppState: AppState;
  onCustomItemAdded: (name: string, type: 'skill' | 'interest') => void; // For dynamic RAG
}

const ITEMS_PER_PAGE = 18; 

const SelectionGridPage: React.FC<SelectionGridPageProps> = ({
  title,
  subTitle,
  categories,
  allItems,
  setAllItems,
  selectedItems,
  onToggleItem,
  onNext,
  onBack,
  nextButtonText = "Next",
  searchPlaceholder: genericSearchPlaceholder,
  itemType,
  currentAppState,
  onCustomItemAdded,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('all'); // Default to 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const [customItemName, setCustomItemName] = useState('');

  const currentSearchPlaceholder = selectedCategoryName === 'all' 
    ? genericSearchPlaceholder 
    : `Search in "${selectedCategoryName}"...`;

  // Memoized list of categories to display in the UI, including "User Defined" if it has items
  const displayCategories = useMemo(() => {
    const baseCategories = [...categories];
    const hasUserDefinedItems = allItems.some(item => item.category === 'User Defined');
    const userDefinedCategoryExists = baseCategories.some(cat => cat.name === 'User Defined');

    if (hasUserDefinedItems && !userDefinedCategoryExists) {
      baseCategories.push({
        id: 'user_defined_cat_dynamic', // Unique ID
        name: 'User Defined',
        items: allItems.filter(item => item.category === 'User Defined'), // Ensure items list is populated for this dynamic category
        colorTheme: { activeClass: 'bg-slate-500 text-white', inactiveClass: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600', textClass: 'text-slate-500 dark:text-slate-400' }
      } as Category);
    }
    return baseCategories;
  }, [categories, allItems]);


  const itemsInSelectedCategoryOrAll = useMemo(() => {
    if (selectedCategoryName === 'all') {
      return allItems; // Show all items if "All Categories" is selected
    }
    return allItems.filter(item => item.category === selectedCategoryName);
  }, [allItems, selectedCategoryName]);

  const searchedItems = useMemo(() => {
    if (!searchTerm.trim()) { // Use trim to ignore whitespace-only search
      return itemsInSelectedCategoryOrAll;
    }
    return itemsInSelectedCategoryOrAll.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [itemsInSelectedCategoryOrAll, searchTerm]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [searchTerm, selectedCategoryName]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return searchedItems.slice(startIndex, endIndex);
  }, [searchedItems, currentPage]);

  const totalPages = Math.ceil(searchedItems.length / ITEMS_PER_PAGE);

  const handleToggleItem = (itemId: string) => {
    const item = allItems.find(i => i.id === itemId);
    if (item) {
      onToggleItem(item);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [selectedCategoryName, currentPage]);
  
  useEffect(() => {
    // If current selectedCategoryName is not 'all' and not in displayCategories, reset to 'all'
    if (selectedCategoryName !== 'all' && !displayCategories.find(c => c.name === selectedCategoryName)) {
      setSelectedCategoryName('all');
    } else if (selectedCategoryName === 'all' && displayCategories.length > 0 && !categories.find(c => c.name === 'all')) {
      // This ensures 'all' is a valid choice if categories exist.
      // setSelectedCategoryName might be 'all' by default.
    }
  }, [displayCategories, selectedCategoryName, categories]);


  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleAddCustomItem = () => {
    if (customItemName.trim() === '') return;
    const newName = customItemName.trim();
    const newId = `custom_${itemType}_${Date.now()}_${newName.toLowerCase().replace(/\s+/g, '_')}`;
    
    const existingItem = allItems.find(item => item.name.toLowerCase() === newName.toLowerCase());
    if (existingItem) {
        if (!selectedItems.some(si => si.id === existingItem.id)) {
            onToggleItem(existingItem);
        }
        alert(`"${existingItem.name}" already exists and has been selected if it wasn't already.`);
    } else {
        const newItemCategory = 'User Defined';
        const newItem: Item = { id: newId, name: newName, category: newItemCategory };
        setAllItems(prevAllItems => [newItem, ...prevAllItems].sort((a,b) => a.name.localeCompare(b.name)));
        onToggleItem(newItem);
        onCustomItemAdded(newName, itemType); // Notify App.tsx for dynamic RAG
        if (selectedCategoryName !== newItemCategory && selectedCategoryName !== 'all') {
            alert(`"${newName}" added to 'User Defined' category and selected. Switch to 'User Defined' or 'All Categories' to see it listed.`);
        }
    }
    setCustomItemName('');
  };
  

  // Styles specific to the new layout for skills
  if (itemType === 'skill') {
    return (
      <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-200">
        <ProgressStepper currentAppState={currentAppState} />
        <div className="shrink-0 sticky top-0 bg-white dark:bg-gray-800 py-4 z-10 shadow-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">{title}</h2>
            {subTitle && <p className="text-center text-sm sm:text-md text-gray-600 dark:text-gray-300 mb-5">{subTitle}</p>}
          </div>
        </div>

        <div className="flex-grow container mx-auto px-4 pt-4 pb-36 flex flex-col md:flex-row gap-6"> {/* pb-36 for footer space */}
          {/* Left Panel: Categories */}
          <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0 md:sticky md:top-36 self-start"> {/* Adjust top based on header height */}
            <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">Categories</h3>
            <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2"> {/* Scrollable categories */}
              <button // "All Categories" button for Skills
                key="all-skills-cat"
                onClick={() => { setSelectedCategoryName('all'); setSearchTerm(''); }}
                className={`w-full text-left p-3 rounded-lg shadow-sm transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800
                            ${selectedCategoryName === 'all' ? 'bg-indigo-500 text-white ring-2 ring-indigo-500/70' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 hover:shadow-md'}`}
              >
                All Categories ({allItems.length})
              </button>
              {displayCategories.map(cat => {
                const theme = (cat as SkillCategory).colorTheme || { activeClass: 'bg-indigo-500 text-white', inactiveClass: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600' };
                const isActive = selectedCategoryName === cat.name;
                const categoryItemsCount = allItems.filter(item => item.category === cat.name).length;
                if (categoryItemsCount === 0 && cat.name !== "User Defined") return null; // Don't show empty predefined categories

                return (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategoryName(cat.name); setSearchTerm(''); }}
                    className={`w-full text-left p-3 rounded-lg shadow-sm transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800
                                ${isActive ? theme.activeClass + ' ring-2 ' + theme.activeClass.split(' ')[0].replace('bg-', 'ring-') + '/70' : theme.inactiveClass + ' text-gray-700 dark:text-gray-200 hover:shadow-md'}`}
                  >
                    {cat.name} ({categoryItemsCount})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Search, Items Grid, Custom Add */}
          <div className="flex-grow w-full md:w-3/4 lg:w-4/5">
            <input
              type="text"
              placeholder={currentSearchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500"
              aria-label={currentSearchPlaceholder}
            />
             <div className="flex flex-col sm:flex-row gap-2 mt-1 mb-4">
                <input
                  type="text"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  placeholder={`Add custom ${itemType}...`}
                  className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500"
                  aria-label={`Add custom ${itemType}`}
                />
                <button
                  onClick={handleAddCustomItem}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label={`Add custom ${itemType} to list`}
                >
                  Add {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                </button>
            </div>

            <h4 className={`text-lg font-semibold mb-3 ${(displayCategories.find(c=>c.name === selectedCategoryName) as SkillCategory)?.colorTheme?.textClass || 'text-indigo-600 dark:text-indigo-400'}`}>
              Items in: {selectedCategoryName === 'all' ? 'All Categories' : selectedCategoryName}
            </h4>
            
            {searchedItems.length === 0 && (
              <p className="text-center text-gray-600 dark:text-gray-300 text-lg py-10">
                No {itemType}s match your current search or selected category. Try adding a custom one.
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {paginatedItems.map(item => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  category={item.category}
                  isSelected={selectedItems.some(si => si.id === item.id)}
                  onToggle={handleToggleItem}
                />
              ))}
            </div>
            
            {selectedItems.length > 0 && (
                <p className="text-center font-semibold text-pink-600 dark:text-pink-400 mt-6 text-md">
                    Selected {selectedItems.length} {itemType}{selectedItems.length > 1 ? 's' : ''}
                </p>
            )}

            {totalPages > 1 && (
              <div className="mt-8 mb-4 flex justify-center items-center space-x-2 sm:space-x-4">
                <button onClick={goToPrevPage} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">Previous</button>
                <span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">Next</button>
              </div>
            )}
          </div>
        </div>
        {/* Restored Footer for Skill Selection Page */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 p-4 border-t border-gray-300 dark:border-gray-600 shadow-top-lg">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                {onBack && (
                    <button 
                        onClick={onBack} 
                        className="w-full sm:w-auto px-6 py-3 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform hover:scale-105"
                        aria-label="Go back to previous step"
                    >
                        Back
                    </button>
                )}
                <div className={!onBack ? "w-full flex justify-center" : "w-full sm:w-auto"}>
                    <button
                        onClick={onNext}
                        disabled={selectedItems.length === 0}
                        className={`w-full ${!onBack ? 'sm:w-1/2 mx-auto' : 'sm:w-auto'} px-8 py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform hover:scale-105
                        ${(selectedItems.length === 0)
                            ? 'bg-gray-400 dark:bg-gray-500 cursor-not-allowed text-gray-300 dark:text-gray-400'
                            : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white focus:ring-green-500'
                        }`}
                        aria-label={nextButtonText}
                    >
                        {nextButtonText}
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // Fallback to original layout for interests or if itemType is not skill (old layout)
  return (
    <div className="flex flex-col h-full bg-transparent text-gray-800 dark:text-gray-200">
      <ProgressStepper currentAppState={currentAppState} />
      <div className="shrink-0 sticky top-0 bg-white dark:bg-gray-800 py-4 z-10 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">{title}</h2>
          {subTitle && <p className="text-center text-sm sm:text-md text-gray-600 dark:text-gray-300 mb-5">{subTitle}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={currentSearchPlaceholder} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500"
              aria-label={currentSearchPlaceholder}
            />
            <select
              value={selectedCategoryName}
              onChange={(e) => {
                setSelectedCategoryName(e.target.value);
                setSearchTerm('');
              }}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500"
              aria-label="Select category"
            >
              <option value="all">All Categories ({allItems.length})</option>
              {displayCategories.map(cat => {
                const categoryItemsCount = allItems.filter(i => i.category === cat.name).length;
                 if (categoryItemsCount === 0 && cat.name !== "User Defined") return null; 
                return (
                    <option key={cat.id} value={cat.name}>
                    {cat.name} ({categoryItemsCount})
                    </option>
                );
              })}
            </select>
          </div>
           <div className="flex flex-col sm:flex-row gap-2 mt-3 mb-2">
            <input
              type="text"
              value={customItemName}
              onChange={(e) => setCustomItemName(e.target.value)}
              placeholder={`Add custom ${itemType}...`}
              className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500"
              aria-label={`Add custom ${itemType}`}
            />
            <button
              onClick={handleAddCustomItem}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Add {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto container mx-auto px-4 pt-4 pb-36 bg-gradient-to-br from-indigo-50/30 via-purple-50/30 to-pink-50/30 dark:from-gray-800/50 dark:via-gray-850/50 dark:to-gray-900/50">
        {searchedItems.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-300 text-lg py-10">
              No items match your current search or selected category. Try adding a custom one.
            </p>
          )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {paginatedItems.map(item => (
            <ItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              category={item.category}
              isSelected={selectedItems.some(si => si.id === item.id)}
              onToggle={handleToggleItem}
            />
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="mt-8 mb-4 flex justify-center items-center space-x-2 sm:space-x-4">
            <button onClick={goToPrevPage} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">Previous</button>
            <span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">Next</button>
          </div>
        )}
      </div>

      {/* Footer Buttons: (This footer is for the 'interest' layout) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 p-4 border-t border-gray-300 dark:border-gray-600 shadow-top-lg">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="w-full sm:w-auto px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:-translate-y-0.5 transform">
              Back
            </button>
          )}
          <div className={!onBack ? "w-full flex justify-center" : "w-full sm:w-auto"}>
            {/* The "Next" button is rendered here, specific to the interest layout. The outer if/else handles skill vs interest. */}
            <button
                onClick={onNext}
                disabled={selectedItems.length === 0}
                className={`w-full ${onBack ? 'sm:w-auto' : 'sm:w-1/2 mx-auto'} px-8 py-3 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:-translate-y-0.5 transform
                ${(selectedItems.length === 0)
                    ? 'bg-gray-400 dark:bg-gray-500 cursor-not-allowed text-gray-700 dark:text-gray-400'
                    : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white focus:ring-green-500'
                }`}
            >
                {nextButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionGridPage;
