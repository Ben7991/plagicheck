import Headline from '../../atoms/headline/Headline';
import UserIcon from '../../atoms/icons/UserIcon';
import { UserProfileProps } from './user-profile.util';
import { useAppSelector } from '../../../store/store.util';

export default function UserProfile({ className }: UserProfileProps) {
  const authUser = useAppSelector((state) => state.auth.data);

  return (
    <div className={`flex gap-4 items-center ${className}`}>
      <div
        className={`w-12 h-12 rounded-full ${!authUser?.imagePath && 'border border-[var(--gray-700)]'} flex items-center justify-center relative`}
      >
        {authUser?.imagePath ? (
          <img
            src={`http://localhost:3000/${authUser?.imagePath}`}
            alt="User profile photo"
            className="w-12 h-12 rounded-full object-cover shadow-lg border border-[var(--gray-700)]"
          />
        ) : (
          <UserIcon />
        )}
        <span className="w-4 h-4 border border-white rounded-full bg-[var(--success-100)] absolute bottom-0 -right-1"></span>
      </div>
      <div className="space-y-[2px]">
        <Headline type="h5">{authUser?.name}</Headline>
        <p className="text-[0.875em]">{authUser?.email}</p>
      </div>
    </div>
  );
}
