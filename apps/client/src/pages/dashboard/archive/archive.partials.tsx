import { ChangeEvent, useEffect, useRef, useState } from 'react';

import Button from '@components/atoms/button/Button';
import FilterIcon from '@components/atoms/icons/FilterIcon';
import { AlertVariant } from '@util/enum/alert-variant.enum';
import { ArchiveUploaderProps } from './archive.types';
import { useAppDispatch } from '@store/store.util';
import { addArchive } from '@store/slice/archive/archive.slice';
import { createArchive, getFilters } from './archive.util';
import MultiSelect from '@components/molecules/multi-select/MultiSelect';
import { Department } from '@util/types/department.type';
import { getDepartments } from '../academic-division/academic-division.utils';
import { useNavigate } from 'react-router-dom';

export function ArchiveUploader({
  onSetAlertInfo,
  onShowAlert,
}: ArchiveUploaderProps) {
  const dispatch = useAppDispatch();
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const [isDepartmentFetched, setIsDepartmentFetched] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const result = await getDepartments();
        setDepartments(result.data);
        setIsDepartmentFetched(true);
      } catch (error) {
        onSetAlertInfo({
          message: 'Failed to fetch departments',
          variant: AlertVariant.ERROR,
        });
        onShowAlert();
      }
    };

    if (!isDepartmentFetched) {
      fetchDepartments();
    }
  }, [
    isDepartmentFetched,
    setIsDepartmentFetched,
    setDepartments,
    onSetAlertInfo,
    onShowAlert,
  ]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      await uploadArchive(file);
    };
    reader.readAsDataURL(file);
  };

  const uploadArchive = async (file: File) => {
    if (!selectedDepartment) {
      onSetAlertInfo({
        message: 'Please select your preferred database',
        variant: AlertVariant.SUCCESS,
      });
      onShowAlert();
      return Promise.resolve();
    }

    const formData = new FormData();
    formData.append('departmentId', selectedDepartment.id.toString());
    formData.append('file', file);

    try {
      const result = await createArchive(formData);
      dispatch(addArchive(result.data));
      onSetAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });
    } catch (error) {
      onSetAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.ERROR,
      });
    }

    onShowAlert();
    setSelectedDepartment(undefined);
    formRef.current?.reset();
  };

  return (
    <form ref={formRef}>
      <div className="flex gap-4 flex-wrap">
        <MultiSelect
          className="w-[300px]"
          prefix="Database: "
          placeholderText="Database Selection"
          list={departments}
          selectedItem={selectedDepartment}
          onSelectItem={setSelectedDepartment}
        />
        <FilterHandler />
        <Button
          el="button"
          variant="primary"
          className="w-[162px]"
          type="button"
          onClick={() => fileUploadRef.current?.click()}
        >
          Add documents
        </Button>
        <input
          type="file"
          hidden
          ref={fileUploadRef}
          onChange={handleFileUpload}
        />
      </div>
    </form>
  );
}

function FilterHandler() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const [wordFilter, setWordFilter] = useState(false);
  const [pdfFilter, setPdfFilter] = useState(false);
  const [textFilter, setTextFilter] = useState(false);

  useEffect(() => {
    if (wordFilter || pdfFilter || textFilter) {
      const changedFilters = getFilters(wordFilter, pdfFilter, textFilter);
      const filters = changedFilters.join(',');
      const searchParams = new URLSearchParams();
      searchParams.append('filter', filters);
      navigate(`/dashboard/archive?${searchParams.toString()}`);
    }

    if (!wordFilter && !pdfFilter && !textFilter) {
      navigate('/dashboard/archive');
    }
  }, [wordFilter, pdfFilter, textFilter, navigate]);

  return (
    <div className="relative">
      <Button
        el="button"
        variant="secondary"
        className="w-[162px] flex items-center justify-center gap-4"
        type="button"
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
