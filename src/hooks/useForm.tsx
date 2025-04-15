import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DatePicker,
  DateValue,
  Form,
  Input,
  NumberInput,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";

interface IInputInstance {
  type: "input";
  isPassword?: boolean;
  validation?: {
    minLength?: boolean;
    isPrimaryLength?: boolean;
  };
}

interface IMultiSelectInstance {
  type: "multiSelect";
  loading?: boolean;
  options: { label: string; value: number }[];
}

interface INumberInputInstance {
  type: "numberInput";
  validation?: { isMark: boolean };
}

interface IMarkInstance {
  type: "mark";
}

interface ITextareaInstance {
  type: "textarea";
}

interface IDateInstance {
  type: "date";
}

type TFormFieldInstance =
  | IInputInstance
  | INumberInputInstance
  | IMarkInstance
  | ITextareaInstance
  | IDateInstance
  | IMultiSelectInstance;

interface IFormField<T extends TFormFieldInstance = TFormFieldInstance> {
  label: string;
  placeholder?: string;
  required?: boolean;
  hidden?: boolean;
  instance?: T;
}

type IFormFieldComponentProps<T extends TFormFieldInstance, K> = React.FC<
  IFormField<T> & {
    value: K;
    onSet: (value: K) => void;
    onError: TErrorFn;
    size?: "sm" | "md" | "lg";
  }
>;

export type TFormConfig<T extends object> = {
  [P in keyof T]: IFormField;
};

type TSetFieldFn<T extends object> = (name: keyof T, value: T[keyof T]) => void;

type TSetErrorFn<T extends object> = (name: keyof T, value: boolean) => void;

type TErrorFn = (hasErrors: boolean) => void;

type TFormErrors<T extends object> = { [P in keyof T]: boolean };

const defaultValues = {
  text: "",
  number: 1,
  date: "",
  multiSelect: [] as string[],
};

export const useForm = <T extends object>(
  config: TFormConfig<T>,
  options?: { size?: "sm" | "md" | "lg"; values?: T },
) => {
  const [formValues, setFormValues] = useState<T>();
  const [formErrors, setFormErrors] = useState<TFormErrors<T>>();
  const prevConfig = useRef<string>();
  const prevValues = useRef<string>();

  const isReady = useMemo(() => {
    return !!(formErrors && Object.values(formErrors).every((v) => !v));
  }, [formErrors]);

  const setField = useCallback<TSetFieldFn<T>>((name, value) => {
    setFormValues((prevState) => {
      if (!prevState) {
        return prevState;
      }

      return { ...prevState, [name]: value };
    });
  }, []);

  const setError = useCallback<TSetErrorFn<T>>((name, value) => {
    setFormErrors((prevState) => {
      if (!prevState) {
        return prevState;
      }

      return { ...prevState, [name]: value };
    });
  }, []);

  const reset = useCallback(
    (needPrevState: boolean = false) => {
      setFormValues((prevState) => {
        const result: any = {};

        for (const key in config) {
          const field = config[key];
          let value: unknown;

          switch (field.instance?.type) {
            case undefined:
            case "input":
            case "textarea":
              value = defaultValues.text;
              break;
            case "numberInput":
              value = defaultValues.number;
              break;
            case "date":
              value = defaultValues.date;
              break;
            case "multiSelect":
              value = defaultValues.multiSelect;
              break;
          }
          result[key] = value as T;
        }

        return prevState && needPrevState
          ? { ...result, ...prevState }
          : result;
      });
    },
    [config],
  );

  useEffect(() => {
    const configString = JSON.stringify(config);

    if (prevConfig.current !== configString) {
      prevConfig.current = configString;
      reset(true);
      setFormErrors(() => {
        const result: any = {};

        for (const key in config) {
          result[key] = false;
        }

        return result;
      });
    }
  }, [config, reset]);

  useEffect(() => {
    const valuesString = JSON.stringify(options?.values);

    if (prevValues.current !== valuesString) {
      prevValues.current = valuesString;
      options?.values && setFormValues(() => options.values);
    }
  }, [options?.values]);

  const node = useMemo<React.ReactNode>(
    () => (
      <Form>
        {Object.keys(formValues ?? []).map((fieldName) => {
          const value = formValues?.[fieldName as keyof T];
          const settings = config[fieldName as keyof T];

          if (value === undefined || !!settings.hidden) {
            return null;
          }

          const fieldProps = {
            value,
            onSet: (value: any) => setField(fieldName as keyof T, value),
            onError: (hasErrors: boolean) =>
              setError(fieldName as keyof T, hasErrors),
            size: options?.size,
            ...settings,
          };

          switch (fieldProps.instance?.type) {
            case undefined:
            case "input":
              return <InputField key={fieldName} {...(fieldProps as any)} />;
            case "numberInput":
              return <NumberField key={fieldName} {...(fieldProps as any)} />;
            case "textarea":
              return <TextareaField key={fieldName} {...(fieldProps as any)} />;
            case "multiSelect":
              return (
                <MultiSelectField key={fieldName} {...(fieldProps as any)} />
              );
            case "date":
              return <DateField key={fieldName} {...(fieldProps as any)} />;
          }
        })}
      </Form>
    ),
    [formValues],
  );

  return { node, values: formValues, isReady, reset };
};

const useErrors = (errors: string[], onError: (hasError: boolean) => void) => {
  const firsRender = useRef(true);

  const isInvalid = useMemo(() => {
    return !firsRender.current && errors.length > 0;
  }, [errors.length]);

  useEffect(() => {
    onError(errors.length > 0);
  }, [errors.length]);

  useEffect(() => {
    firsRender.current = false;
  }, []);

  return {
    isInvalid,
    errorsList: () => (
      <ul>
        {errors.map((error, i) => (
          <li key={i}>{error}</li>
        ))}
      </ul>
    ),
  };
};

const InputField: IFormFieldComponentProps<IInputInstance, string> = ({
  label,
  placeholder,
  required,
  instance,
  value,
  onSet,
  onError,
  size,
}) => {
  const errors = useMemo(() => {
    const result: string[] = [];

    if (required && !value.trim().length) {
      result.push("Обязательное поле");
    }

    if (instance?.validation?.minLength && value.trim().length < 5) {
      result.push("Минимум 5 символов");
    }

    if (instance?.validation?.isPrimaryLength) {
      if (value.length > 60) {
        result.push("Максимум 60 символов");
      }
    } else if (value.trim().length > 255) {
      result.push("Максимум 255 символов");
    }

    return result;
  }, [instance, value, required]);

  const { isInvalid, errorsList } = useErrors(errors, onError);

  return (
    <Input
      isClearable
      errorMessage={errorsList}
      isInvalid={isInvalid}
      isRequired={required}
      label={label}
      placeholder={placeholder}
      size={size}
      type={instance?.isPassword ? "password" : "text"}
      value={value}
      onValueChange={onSet}
    />
  );
};

const TextareaField: IFormFieldComponentProps<IInputInstance, string> = ({
  label,
  placeholder,
  required,
  instance,
  value,
  onSet,
  onError,
  size,
}) => {
  const errors = useMemo(() => {
    const result: string[] = [];

    if (required && !value.trim().length) {
      result.push("Обязательное поле");
    }

    if (instance?.validation?.isPrimaryLength) {
      if (value.length > 60) {
        result.push("Максимум 60 символов");
      }
    } else if (value.trim().length > 255) {
      result.push("Максимум 255 символов");
    }

    return result;
  }, [instance, value, required]);

  const { isInvalid, errorsList } = useErrors(errors, onError);

  return (
    <Textarea
      isClearable
      errorMessage={errorsList}
      isInvalid={isInvalid}
      isRequired={required}
      label={label}
      maxRows={5}
      minRows={3}
      placeholder={placeholder}
      size={size}
      value={value}
      onValueChange={onSet}
    />
  );
};

const NumberField: IFormFieldComponentProps<INumberInputInstance, number> = ({
  label,
  placeholder,
  required,
  instance,
  value,
  onSet,
  size,
}) => {
  return (
    <NumberInput
      isRequired={required}
      label={label}
      maxValue={instance?.validation?.isMark ? 10 : undefined}
      minValue={1}
      placeholder={placeholder}
      size={size}
      value={value}
      onValueChange={onSet}
    />
  );
};

const MultiSelectField: IFormFieldComponentProps<
  IMultiSelectInstance,
  string[]
> = ({
  label,
  placeholder,
  required,
  instance,
  value = [],
  onSet,
  onError,
  size,
}) => {
  const errors = useMemo(() => {
    const result: string[] = [];

    if (required && (!value || value.length === 0)) {
      result.push("Обязательное поле");
    }

    return result;
  }, [value, required]);

  const { isInvalid, errorsList } = useErrors(errors, onError);

  const options = instance?.options || [];

  return (
    <Select
      errorMessage={errorsList}
      isInvalid={isInvalid}
      isRequired={required}
      label={label}
      placeholder={placeholder}
      selectedKeys={new Set(value)}
      selectionMode="multiple"
      size={size}
      onSelectionChange={(keys) => onSet(Array.from(keys) as string[])}
    >
      {options.map((option) => (
        <SelectItem key={option.value}>{option.label}</SelectItem>
      ))}
    </Select>
  );
};

const DateField: IFormFieldComponentProps<IDateInstance, string> = ({
  label,
  required,
  value,
  onSet,
  onError,
  size,
}) => {
  const errors = useMemo(() => {
    const result: string[] = [];

    if (required && (!value || value.length === 0)) {
      result.push("Обязательное поле");
    }

    return result;
  }, [value, required]);

  const { isInvalid, errorsList } = useErrors(errors, onError);

  const handleChange = useCallback<(value: DateValue | null) => void>(
    (value) => {
      onSet(value?.toString() ?? "");
    },
    [onSet],
  );

  const parsedValue = useMemo(() => {
    try {
      return parseDate(value.split("T")[0]);
    } catch {
      return undefined;
    }
  }, [value]);

  return (
    <DatePicker
      showMonthAndYearPickers
      errorMessage={errorsList}
      firstDayOfWeek={"mon"}
      isInvalid={isInvalid}
      isRequired={required}
      label={label}
      size={size}
      value={parsedValue as any}
      onChange={handleChange}
    />
  );
};
