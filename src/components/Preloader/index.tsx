export type Props = {
  className?: string;
  inProgress?: boolean;
};

export const Preloader = ({ className = "", inProgress }: Props) => {
  if (!inProgress) {
    return null;
  }

  return <div className={`${className}`}>Loading...</div>;
};
