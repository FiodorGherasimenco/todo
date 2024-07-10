import style from "./style.module.css";

export type Props = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
  size?: "small" | "medium";
};

export const Button = ({
  variant = "primary",
  size = "medium",
  ...rest
}: Props) => {
  return (
    <button
      className={`${style.button} ${style[variant]} ${style[size]}`}
      {...rest}
    />
  );
};
