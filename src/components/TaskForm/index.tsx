import { useMachine } from "../../hooks/useMachine";
import FormMachine from "../../machines/form";
import { Button } from "../Button";
import { TextInput } from "../TextInput";
import style from "./style.module.css";

export type Props = {
  onSubmit?: (formData: { title: string }) => Promise<void>;
};

export const TaskForm = ({ onSubmit }: Props) => {
  const [{ loading, formData }, send] = useMachine(FormMachine);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send("submit");
    onSubmit?.(formData);
    send("reset");
  };

  const handleChange = (value: string) => {
    send("update", {
      title: value,
    });
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <TextInput
        value={formData.title}
        disabled={loading}
        onChange={handleChange}
      />
      <Button variant="primary" disabled={!formData.title.length || loading}>
        Create
      </Button>
    </form>
  );
};
