import { UseFormRegister } from "react-hook-form";

export interface RegisterFormType {
  firstName: string;
  surname: string;
  idCardNumber: string;
  birthday: string;
  phoneNumber: string;
  email?: string;
}

export interface RegisterFormProps {
  open: boolean;
}

export interface RegisterContentFormProps {
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  register: UseFormRegister<RegisterFormType>;
  extractedData?: Partial<RegisterFormType>
  handleGoBack: () => void;
}
