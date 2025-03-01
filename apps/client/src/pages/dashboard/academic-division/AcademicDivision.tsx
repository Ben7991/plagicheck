import Button from '../../../components/atoms/button/Button';
import PageHeader from '../../../components/organisms/page-header/PageHeader';
import SubPageHeader from '../../../components/organisms/page-header/SubPageHeader';

export default function AcademicDivision() {
  return (
    <>
      <PageHeader />
      <SubPageHeader
        title="Academic Unit"
        description="Add faculties and departments here"
      >
        <div className="flex gap-4">
          <Button el="button" variant="secondary" className="w-[162px]">
            Add Department
          </Button>
          <Button el="button" variant="primary" className="w-[128px]">
            Add Faculty
          </Button>
        </div>
      </SubPageHeader>
    </>
  );
}
