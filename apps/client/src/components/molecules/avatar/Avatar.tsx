import UserIcon from '../../atoms/icons/UserIcon';
import { AvatarProps } from './avatar.util';

export default function Avatar({ name, imagePath }: AvatarProps) {
  return (
    <div className="flex gap-2 lg:gap-4 items-center">
      {imagePath ? (
        <img
          alt={`${name}'s profile image`}
          src={imagePath}
          className="w-10 h-10 inline-block rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full border border-[var(--gray-700)] flex items-center justify-center">
          <UserIcon />
        </div>
      )}
      <p>{name}</p>
    </div>
  );
}
