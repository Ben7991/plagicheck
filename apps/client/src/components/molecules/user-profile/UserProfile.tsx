import Headline from '../../atoms/headline/Headline';
import UserIcon from '../../atoms/icons/UserIcon';
import { UserProfileProps } from './user-profile.util';

export default function UserProfile({ className }: UserProfileProps) {
  return (
    <div className={`flex gap-4 items-center ${className}`}>
      <div className="w-12 h-12 rounded-full border border-[var(--gray-700)] flex items-center justify-center relative">
        <UserIcon />
        <span className="w-4 h-4 border border-white rounded-full bg-[var(--success-100)] absolute bottom-0 -right-1"></span>
      </div>
      <div className="space-y-[2px]">
        <Headline type="h5">Esther Howard</Headline>
        <p className="text-[0.875em]">estherhoward@gmail.com</p>
      </div>
    </div>
  );
}
