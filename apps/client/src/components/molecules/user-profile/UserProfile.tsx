import Headline from '../../atoms/headline/Headline';
import UserIcon from '../../atoms/icons/UserIcon';
import { UserProfileProps } from './user-profile.util';

export default function UserProfile({ className }: UserProfileProps) {
  return (
    <div className={`flex gap-4 items-center ${className}`}>
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
