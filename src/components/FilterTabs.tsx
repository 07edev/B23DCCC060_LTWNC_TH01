import { createContext, useContext, type ReactNode } from 'react';
import type { Filter } from '../features/deadlines/deadlinesTypes';

interface FilterTabsContextValue {
  value: Filter;
  onChange: (value: Filter) => void;
  counts: Record<Filter, number>;
}

const FilterTabsContext = createContext<FilterTabsContextValue | null>(null);

interface RootProps extends FilterTabsContextValue { children: ReactNode }
interface ItemProps { value: Filter; label: string }

function Root({ value, onChange, counts, children }: RootProps) {
  return <FilterTabsContext.Provider value={{ value, onChange, counts }}><div className="tabs" role="tablist">{children}</div></FilterTabsContext.Provider>;
}

function Item({ value, label }: ItemProps) {
  const context = useContext(FilterTabsContext);
  if (!context) throw new Error('FilterTabs.Item phải được sử dụng bên trong FilterTabs.Root');
  return <button className={context.value === value ? 'tab active' : 'tab'} onClick={() => context.onChange(value)}>{label}<span>{context.counts[value]}</span></button>;
}

export const FilterTabs = { Root, Item };
