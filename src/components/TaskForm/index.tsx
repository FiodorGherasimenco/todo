import { useMachine } from "../../hooks/useMachine";
import FormMachine from "../../machines/form";
import { Button } from "../Button";
import { TextInput } from "../TextInput";
import style from "./style.module.css";

export type Props = {
  onSubmit?: (formData: { title: string }) => Promise<void>;
};

export const TaskForm = ({ onSubmit }: Props) => {
  const [state, send] = useMachine(FormMachine);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(state.context);
    send("reset");
  };

  const handleChange = (value: string) => {
    send("change", {
      title: value,
    });
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <TextInput value={state.context.title} onChange={handleChange} />
      <Button variant="primary" disabled={!state.context.title.length}>
        Create
      </Button>
    </form>
  );
};
