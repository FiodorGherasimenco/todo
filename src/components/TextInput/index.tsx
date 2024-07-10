import style from "./style.module.css";

export type Props = {
  value?: string;
  size?: "small" | "medium" | "large";
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const TextInput = ({ size = "medium", onChange, ...rest }: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value.trim());
  };

  return (
    <input
      className={`${style.input} ${style[size]} ${style.fluid}`}
      onInput={handleChange}
      {...rest}
    />
  );
};
