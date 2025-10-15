import { useRouter, useSearchParams } from "next/navigation";
import Slider from "rc-slider";
import { useState } from "react";

import productsTypes from "../../utils/data/products-types";
import Checkbox from "./form-builder/checkbox";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

interface ProductsFilterProps {
  onApplyFilters: (
    filters: Record<string, string[]>,
    priceRange: [number, number],
  ) => void;
}

const ProductsFilter = ({ onApplyFilters }: ProductsFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 150]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const handleCheckboxChange = (
    name: string,
    value: string,
    checked: boolean,
  ) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      if (checked) {
        updatedFilters[name] = [...(updatedFilters[name] || []), value];
      } else {
        updatedFilters[name] =
          updatedFilters[name]?.filter((v) => v !== value) || [];
        if (updatedFilters[name].length === 0) {
          // Remove the key using reduce
          const newFilters = Object.keys(updatedFilters).reduce(
            (acc, key) => {
              if (key !== name) {
                acc[key] = updatedFilters[key];
              }
              return acc;
            },
            {} as Record<string, string[]>,
          );
          updateQueryParams(newFilters);
          return newFilters;
        }
      }
      updateQueryParams(updatedFilters);
      return updatedFilters;
    });
  };

  const updateQueryParams = (filters: Record<string, string[]>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, values]) => {
      params.set(key, values.join(","));
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Apply filters when Apply button is clicked
  const applyFilters = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Call the parent function and pass the selected filters and price range
    onApplyFilters(selectedFilters, priceRange);
  };

  return (
    <form className="products-filter">
      <button
        type="button"
        onClick={() => setFiltersOpen(!filtersOpen)}
        className={`products-filter__menu-btn ${filtersOpen ? "products-filter__menu-btn--active" : ""}`}
      >
        Add Filter <i className="icon-down-open" />
      </button>

      <div
        className={`products-filter__wrapper ${filtersOpen ? "products-filter__wrapper--open" : ""}`}
      >
        <div className="products-filter__block">
          <button type="button">Product type</button>
          <div className="products-filter__block__content">
            {productsTypes.map((type) => (
              <Checkbox
                key={type.id}
                name="product-type"
                label={type.name}
                onChange={(e) =>
                  handleCheckboxChange(
                    "product-type",
                    type.name,
                    e.target.checked,
                  )
                }
              />
            ))}
          </div>
        </div>

        <div className="products-filter__block">
          <button type="button">Price</button>
          <div className="products-filter__block__content">
            <Range
              min={0}
              max={200}
              defaultValue={priceRange}
              onChange={(range) => setPriceRange(range as [number, number])}
              tipFormatter={(value) => `${value}₹`}
            />
          </div>
        </div>

        <div className="flex w-full justify-center">
          <button
            onClick={applyFilters}
            className="px-2 py-1 rounded-md bg-yellow-700 hover:bg-yellow-600 text-white"
          >
            Apply
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductsFilter;
