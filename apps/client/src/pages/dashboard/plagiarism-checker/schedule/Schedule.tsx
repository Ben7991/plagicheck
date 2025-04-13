import SubPageHeader from '@components/organisms/page-header/SubPageHeader';
import PageHeader from '@components/organisms/page-header/PageHeader';
import Button from '@components/atoms/button/Button';
import { FilterHandler } from './schedule.partials';
import MainContent from '@components/atoms/main-content/MainContent';
import DataTable from '@components/organisms/data-table/DataTable';
import { SCHEDULE_COLUMN_HEADINGS } from './schedule.util';
import Paginator from '@components/organisms/paginator/Paginator';

export default function Schedule() {
  return (
    <>
      <PageHeader />
      <SubPageHeader title="Schedules" description="Schedule check queue">
        <div className="flex items-center gap-4">
          <FilterHandler />
          <Button
            el="link"
            variant="primary"
            className="w-[150px] inline-block text-center"
          >
            Clear Schedule
          </Button>
        </div>
      </SubPageHeader>
      <MainContent>
        <DataTable columnHeadings={SCHEDULE_COLUMN_HEADINGS}>
          <tr>
            <td>Testing</td>
            <td>Testing</td>
            <td>Testing</td>
            <td>Testing</td>
          </tr>
        </DataTable>
        <Paginator count={1} />
      </MainContent>
    </>
  );
}
