// import {
//   Control,
//   FieldErrors,
//   FieldValues,
//   UseFormClearErrors,
//   UseFormGetValues,
//   UseFormHandleSubmit,
//   UseFormRegister,
//   UseFormReset,
//   UseFormSetError,
//   UseFormSetValue,
//   UseFormTrigger,
// } from 'react-hook-form';

// export interface IFormProps {
//   register: UseFormRegister<FieldValues>;
//   getValues: UseFormGetValues<FieldValues>;
//   reset: UseFormReset<FieldValues>;
//   control: Control<FieldValues, any>;
//   setValue: UseFormSetValue<FieldValues>;
//   setError: UseFormSetError<FieldValues>;
//   clearErrors: UseFormClearErrors<FieldValues>;
//   handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
//   trigger: UseFormTrigger<FieldValues>;
//   errors: FieldErrors<FieldValues>;
// }

import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetError,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';

export interface IFormProps<T extends FieldValues = FieldValues> {
  register: UseFormRegister<T>;
  getValues: UseFormGetValues<T>;
  reset: UseFormReset<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  trigger: UseFormTrigger<T>;
  errors: FieldErrors<T>;
}
