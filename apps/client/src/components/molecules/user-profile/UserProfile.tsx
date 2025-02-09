import Headline from '../../atoms/headline/Headline';
import UserIcon from '../../atoms/icons/UserIcon';

export default function UserProfile() {
  return (
    <div className="flex gap-4 items-center">
      <div className="w-12 h-12 rounded-full border border-[var(--gray-700)] flex items-center justify-center">
        <UserIcon />
      </div>
      <div className="space-y-[2px]">
        <Headline type="h5">Esther Howard</Headline>
        <p className="text-[0.875em]">estherhoward@gmail.com</p>
      </div>
    </div>
  );
}
