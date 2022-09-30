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

export type RenderFunction<T> = (item: T, index: number) => React.ReactElement;

export interface AsyncLazyLoadOptions {
  bufferOffset?: number;
}

export interface AsyncLazyListProps<T> {
  style?: React.CSSProperties;
  dataLoader: AsyncItemsLoader<T>;
  renderFunction: RenderFunction<T>;
  dividerComponent?: React.ReactElement;
  loadingComponent?: React.ReactElement;
  errorComponent?: React.ReactElement;
  options?: AsyncLazyLoadOptions;
}
