import { BackdropProps } from './backdrop.util';

export default function Backdrop({ onHide }: BackdropProps) {
  return (
    <div
      className="w-full h-screen bg-black/50 fixed top-0 left-0"
      onClick={onHide}
    ></div>
  );
}
