import React, { useCallback, useContext, useState } from "react";

export type TFiltersValues = Record<string, unknown>;

type TFilters = Record<string, TFiltersValues>;

type TFiltersGetValues = (formName: string) => TFiltersValues | undefined;

type TFiltersSetValues = (formName: string, values: TFiltersValues) => void;

type TFiltersContextValue = {
  setValues: TFiltersSetValues;
  getValues: TFiltersGetValues;
};

interface IFiltersProviderProps {
  children: React.ReactNode;
}

const FiltersContext = React.createContext<TFiltersContextValue>({
  setValues: () => {},
  getValues: () => undefined,
});

export const FiltersProvider = ({ children }: IFiltersProviderProps) => {
  const [filters, setFilters] = useState<TFilters>();

  const getValues = useCallback<TFiltersGetValues>(
    (formName) => {
      return filters?.[formName];
    },
    [filters],
  );

  const setValues = useCallback<TFiltersSetValues>((formName, values) => {
    setFilters((prevState) => ({
      ...(prevState ?? {}),
      [formName]: values,
    }));
  }, []);

  return (
    <FiltersContext.Provider value={{ getValues, setValues }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);
