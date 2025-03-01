import EyeIcon from '../../atoms/icons/EyeIcon';
import EyeSlashIcon from '../../atoms/icons/EyeSlashIcon';

type PasswordTogglerProps = {
  state: boolean;
  toggle: VoidFunction;
};

export default function PasswordToggler({
  state,
  toggle,
}: PasswordTogglerProps) {
  return (
    <button className="inline-block" onClick={toggle} type="button">
      {!state ? <EyeIcon /> : <EyeSlashIcon />}
    </button>
  );
}
