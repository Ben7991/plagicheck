import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getFilters } from '@pages/dashboard/archive/archive.util';
import Button from '@components/atoms/button/Button';
import FilterIcon from '@components/atoms/icons/FilterIcon';

export function FilterHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [wordFilter, setWordFilter] = useState(false);
  const [pdfFilter, setPdfFilter] = useState(false);
  const [textFilter, setTextFilter] = useState(false);

  useEffect(() => {
    const filter = searchParams.get('filter');
    const filters = filter?.split(',') ?? [];
    filters.forEach((filter) => {
      if (filter === 'WORD') {
        setWordFilter(true);
      } else if (filter === 'PDF') {
        setPdfFilter(true);
      } else if (filter === 'TEXT') {
        setTextFilter(true);
      }
    });
  }, [searchParams]);

  useEffect(() => {
    if (wordFilter || pdfFilter || textFilter) {
      const changedFilters = getFilters(wordFilter, pdfFilter, textFilter);
      const filters = changedFilters.join(',');
      const searchParams = new URLSearchParams();
      searchParams.append('filter', filters);
      navigate(`/dashboard/checker/schedule?${searchParams.toString()}`);
    }

    if (!wordFilter && !pdfFilter && !textFilter) {
      navigate('/dashboard/checker/schedule');
    }
  }, [wordFilter, pdfFilter, textFilter, navigate]);

  return (
    <div className="relative">
      <Button
        el="button"
        variant="secondary"
        className="w-[162px] flex items-center justify-center gap-4"
        onClick={() => setShowFilters(!showFilters)}
      >
        Filter by: All <FilterIcon />
      </Button>
      {showFilters && (
        <div className="bg-white shadow-lg absolute top-12 right-0 w-[205px] p-2 lg:p-4 border border-[var(--gray-1000)] rounded-lg">
          <p className="mb-3">
            <strong>Filter</strong>
          </p>
          <ul className="space-y-3">
            <li className="flex gap-2 items-center">
              <input
                type="checkbox"
                className="w-4 h-4"
                id="word-doc"
                checked={wordFilter}
                onChange={(e) => {
                  setWordFilter(e.currentTarget.checked);
                }}
              />
              <label
                className={`${wordFilter ? 'text-[var(--sea-blue-100)]' : ''} text-[1em] mb-0`}
                htmlFor="word-doc"
              >
                Word document
              </label>
            </li>
            <li className="flex gap-2 items-center">
              <input
                type="checkbox"
                className="w-4 h-4"
                id="pdf-doc"
                checked={pdfFilter}
                onChange={(e) => {
                  setPdfFilter(e.currentTarget.checked);
                }}
              />
              <label
                className={`${pdfFilter ? 'text-[var(--sea-blue-100)]' : ''} text-[1em] mb-0`}
                htmlFor="pdf-doc"
              >
                PDF document
              </label>
            </li>
            <li className="flex gap-2 items-center">
              <input
                type="checkbox"
                className="w-4 h-4"
                id="text-doc"
                checked={textFilter}
                onChange={(e) => {
                  setTextFilter(e.currentTarget.checked);
                }}
              />
              <label
                className={`${textFilter ? 'text-[var(--sea-blue-100)]' : ''} text-[1em] mb-0`}
                htmlFor="text-doc"
              >
                Text document
              </label>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
