import { IoClose } from 'react-icons/io5';

import { ModalProps } from './modal.util';
import Backdrop from '../../atoms/back-drop/Backdrop';
import Headline from '../../atoms/headline/Headline';

export default function Modal({ title, children, onHide }: ModalProps) {
  return (
    <>
      <Backdrop onHide={onHide} />
      <section className="bg-white w-[90%] md:w-[461px] rounded-lg px-6 py-7 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="flex items-center justify-between mb-4">
          <Headline type="h3">{title}</Headline>
          <button
            className="hover:cursor-pointer inline-block"
            onClick={onHide}
          >
            <IoClose className="text-2xl text-gray-500 hover:text-[var(--error-100)]" />
          </button>
        </div>
        {children}
      </section>
    </>
  );
}
