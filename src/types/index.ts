export interface Size {
  width: number;
  height: number;
}

export interface SizeMap {
  [key: number]: Size;
}

export interface DataMap<T> {
  [key: number]: T[];
}

export interface HeightMap {
  [key: number]: number;
}

export interface ContainerMap<T extends HTMLElement> {
  [key: number]: T | null;
}

export type ElementRegistrar<T extends HTMLElement> = (
  key: number,
  container: T | null
) => void;

export type ScrollEvent = React.UIEvent<HTMLDivElement>;

export type SyncItemsLoader<T> = (index: number) => T[];

export type AsyncItemsLoader<T> = (index: number) => Promise<T[]>;

export type RenderFunction<T> = (
  item: T,
  group?: number,
  index?: number
) => React.ReactElement;

export interface LazyListClasses {
  root?: string;
  loadingContainer?: string;
  nodeContainer?: string;
  groupContainer?: string;
  footerContainer?: string;
}

export interface AsyncLazyLoadOptions {
  bufferOffset?: number;
  scrollThrottle?: number;
}

export interface GroupProps<T> {
  group: number;
  data: T[];
  setElement: ElementRegistrar<HTMLDivElement>;
  classes?: LazyListClasses;
  renderFunction: RenderFunction<T>;
  style: React.CSSProperties;
  dividerComponent?: React.ReactElement;
}

export interface AsyncLazyListProps<T> {
  dataLoader: AsyncItemsLoader<T>;
  renderFunction: RenderFunction<T>;
  classes?: LazyListClasses;
  style?: React.CSSProperties;
  dividerComponent?: React.ReactElement;
  loadingComponent?: React.ReactElement;
  footerComponent?: React.ReactElement;
  options?: AsyncLazyLoadOptions;
}
