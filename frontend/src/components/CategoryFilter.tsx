import { useEffect, useState } from 'react';
import './CategoryFilter.css';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  {
    /*getting the categories from the backend */
  }
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://bookstore-sakuma-backend-fxbreubpaghuhcad.eastus-01.azurewebsites.net/Book/getBookCategories'
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchCategories();
  }, []);

  {
    /*filters out depending on what category is selected */
  }
  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value)
      : [...selectedCategories, target.value];

    setSelectedCategories(updatedCategories);
  }

  return (
    <div className="category-filter">
      <h5>Category Types</h5>
      <div className="category-list">
        {categories.map((c) => (
          <div key={c} className="category-item">
            <input
              type="checkbox"
              id={c}
              value={c}
              className="category-checkbox"
              onChange={handleCheckboxChange}
            />
            <label htmlFor={c} className="category-text">
              {c}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
