import { Button } from "../Button";
import style from "./style.module.css";

type Props = {
  message: string;
  onHide?: () => void;
};

export const Notice = ({ message, onHide }: Props) => {
  return (
    <div className={style.notice}>
      <p>{message}</p>
      <div>
        <Button size="small" onClick={onHide}>
          Dismiss
        </Button>
      </div>
    </div>
  );
};
