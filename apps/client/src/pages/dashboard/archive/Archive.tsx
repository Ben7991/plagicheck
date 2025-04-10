import { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SubPageHeader from '@components/organisms/page-header/SubPageHeader';
import PageHeader from '@components/organisms/page-header/PageHeader';
import MainContent from '@components/atoms/main-content/MainContent';
import DataTable from '@components/organisms/data-table/DataTable';
import {
  ARCHIVE_COLUMN_HEADINGS,
  deleteArchive,
  downloadArchive,
  getArchives,
  getContentType,
} from './archive.util';
import Paginator from '@components/organisms/paginator/Paginator';
import { useAppDispatch, useAppSelector } from '@store/store.util';
import {
  loadArchives,
  removeArchive,
} from '@store/slice/archive/archive.slice';
import ErrorBoundary from '@pages/error/error-boundary/ErrorBoundary';
import { useAlert } from '@util/hooks/use-alert/useAlert';
import Alert from '@components/molecules/alert/Alert';
import { ArchiveUploader } from './archive.partials';
import pdfImage from '../../../assets/pdf.png';
import txtImage from '../../../assets/text.png';
import msWordImage from '../../../assets/word.png';
import { Archive as ArchiveType, DocumentType } from '@util/types/archive.type';
import Modal from '@components/organisms/modal/Modal';
import FormFooter from '@components/atoms/form-elements/form-footer/FormFooter';
import Button from '@components/atoms/button/Button';
import { AlertVariant } from '@util/enum/alert-variant.enum';

export default function Archive() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const archiveData = useAppSelector((state) => state.archive);
  const [searchParams] = useSearchParams();
  const [fetchError, setFetchError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldDelete, setShouldDelete] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<ArchiveType>();
  const { alertInfo, alertState, hideAlert, setAlertInfo, showAlert } =
    useAlert();

  useEffect(() => {
    const fetchArchives = async () => {
      const page = searchParams.get('page') ?? 1;
      const query = searchParams.get('q');
      const filter = searchParams.get('filter');
      try {
        const result = await getArchives(+page, query ?? '', filter ?? '');
        dispatch(loadArchives(result));
      } catch (error) {
        if ((error as Error).message !== 'UN_AUTHORIZED') {
          setFetchError((error as Error).message);
          return;
        }
        navigate('/');
      }
    };

    fetchArchives();
  }, [searchParams, dispatch, navigate]);

  if (fetchError) {
    return (
      <ErrorBoundary
        message={fetchError}
        path="/dashboard/archive"
        fullScreen={false}
      />
    );
  }

  const handleDeleteDocument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedArchive) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await deleteArchive(selectedArchive.id);
      setAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });
      dispatch(removeArchive(selectedArchive.id));
    } catch (error) {
      setAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.ERROR,
      });
    }

    setIsLoading(false);
    setShouldDelete(false);
    showAlert();
  };

  const handleDownloadDocument = async (id: number) => {
    const selectedArchive = archiveData.data.find(
      (archive) => archive.id === id,
    );

    if (!selectedArchive || !downloadRef.current) {
      return;
    }

    try {
      const blob = await downloadArchive(selectedArchive.id);
      const fileURL = URL.createObjectURL(
        new Blob([blob], {
          type: getContentType(selectedArchive.documentType),
        }),
      );
      downloadRef.current.href = fileURL;
      downloadRef.current.click();
    } catch (error) {
      setAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.SUCCESS,
      });
      showAlert();
    }
  };

  return (
    <>
      <PageHeader />
      <SubPageHeader
        title="Database"
        description="Upload past project works here."
      >
        <ArchiveUploader
          onSetAlertInfo={setAlertInfo}
          onShowAlert={showAlert}
        />
      </SubPageHeader>
      <a href="#" ref={downloadRef} hidden>
        Download file
      </a>
      <MainContent>
        <DataTable columnHeadings={ARCHIVE_COLUMN_HEADINGS}>
          {archiveData.data.map((archive) => (
            <tr key={archive.id}>
              <td>
                <div className="flex items-center gap-2">
                  <img
                    src={
                      archive.documentType === DocumentType.PDF
                        ? pdfImage
                        : archive.documentType === DocumentType.WORD
                          ? msWordImage
                          : txtImage
                    }
                    alt={archive.documentType}
                    className="inline-block w-10"
                  />
                  {archive.title.length > 40 ? (
                    <span title={archive.title}>
                      {archive.title.slice(0, 40)}...
                    </span>
                  ) : (
                    <span>{archive.title}</span>
                  )}
                </div>
              </td>
              <td>
                {new Date(archive.createdAt)
                  .toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })
                  .split('/')
                  .join('-')
                  .replace(',', '')}
              </td>
              <td>{archive.documentType} Document</td>
              <td>
                <DataTable.ActionHolder>
                  <DataTable.Action
                    text="Download document"
                    onClick={() => handleDownloadDocument(archive.id)}
                  />
                  <DataTable.Action
                    text="Delete document"
                    onClick={() => {
                      setShouldDelete(true);
                      setSelectedArchive(archive);
                    }}
                  />
                </DataTable.ActionHolder>
              </td>
            </tr>
          ))}
        </DataTable>
        <Paginator count={archiveData.count} />
      </MainContent>

      {shouldDelete && (
        <Modal title="Delete Document" onHide={() => setShouldDelete(false)}>
          <form onSubmit={handleDeleteDocument}>
            <p className="mb-4">
              Are you sure you want to delete this document? This action cannot
              be undone.
            </p>
            <FormFooter className="gap-4">
              <Button
                el="button"
                variant="secondary"
                className="flex-grow"
                type="button"
                onClick={() => setShouldDelete(false)}
              >
                Cancel
              </Button>
              <Button
                el="button"
                variant="danger"
                className="flex-grow"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Yes, delete'}
              </Button>
            </FormFooter>
          </form>
        </Modal>
      )}

      {alertState && alertInfo && (
        <Alert
          message={alertInfo.message}
          variant={alertInfo.variant}
          onHide={hideAlert}
        />
      )}
    </>
  );
}
