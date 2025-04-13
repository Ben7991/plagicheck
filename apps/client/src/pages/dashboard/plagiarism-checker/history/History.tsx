import SubPageHeader from '@components/organisms/page-header/SubPageHeader';
import PageHeader from '@components/organisms/page-header/PageHeader';
import { ExportHandler } from '@components/molecules/export-handler/ExportHandler';
import DataTable from '@components/organisms/data-table/DataTable';
import { HISTORY_COLUMN_HEADINGS } from './history.util';
import MainContent from '@components/atoms/main-content/MainContent';

export default function History() {
  return (
    <>
      <PageHeader />
      <SubPageHeader title="History" description="Plagiarism check history">
        <ExportHandler btnVariant="primary" exportIconColor="#fff" />
      </SubPageHeader>
      <MainContent>
        <DataTable columnHeadings={HISTORY_COLUMN_HEADINGS}>
          <tr>
            <td>Testing</td>
            <td>Testing</td>
            <td>Testing</td>
            <td>Testing</td>
          </tr>
        </DataTable>
      </MainContent>
    </>
  );
}
