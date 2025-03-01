import Headline from '../../atoms/headline/Headline';

type AuthDescriptorProps = {
  title: string;
  info: string;
};

export default function AuthDescriptor({
  title,
  info,
}: AuthDescriptorProps): JSX.Element {
  return (
    <>
      <Headline type="h4">{title}</Headline>
      <p>{info}</p>
    </>
  );
}
