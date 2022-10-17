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
  /** Classname for root container. */
  root?: string;

  /** Classname for loading container */
  loadingContainer?: string;

  /** Classname for node container */
  nodeContainer?: string;

  /** Classname for group container */
  groupContainer?: string;

  /** Classname for footer container */
  footerContainer?: string;
}

export interface AsyncLazyLoadOptions {
  /**
   * Pre fetch/buffer size in pixels.
   * @defaultValue `50`
   */
  bufferOffset?: number;

  /**
   * Limit scroll event process with at most 1 fires every X ms.
   * @defaultValue `60`
   */
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
  /**
   * Loader function that retrieves the data.
   * @example
   * ```ts
   * const loadData = (idx: number): Promise<Node[]> =>
   * fetchData("some_url", {
   * page: (idx + 1),
   * size: 10
   * })
   * ```
   */
  dataLoader: AsyncItemsLoader<T>;

  /**
   * Renderer function to render the nodes.
   *
   * @example
   * ```ts
   * renderFunction={
   *   (node: Node) => <NodeItem node={node} />
   * }
   * ```
   *
   *
   * @returns JSX Element to render.
   * @typeParam T - Type of the node.
   */
  renderFunction: RenderFunction<T>;

  /**
   * Classnames for different LazyList Elements.
   *
   * @example
   * ```ts
   * <ReactAsyncLazyList
   * classes={{
   *  root: "lazy-root",
   *  loadingContainer: "lazy-container",
   *  ...
   * }}
   * />
   * ```
   *
   * @see {@link https://github.com/sawrozpdl/react-async-lazy-list#properties  React Async Lazy List - Properties}
   */
  classes?: LazyListClasses;

  /** CSS styles properties. */
  style?: React.CSSProperties;

  /** Divider that divides the lists. */
  dividerComponent?: React.ReactElement;

  /** Loader to render while the list is loading. */
  loadingComponent?: React.ReactElement;

  /** JSX Element to render at the end of the list. */
  footerComponent?: React.ReactElement;

  /**
   * Different options for lazy list loading.
   * |Property|
   * :----------------
   * `bufferOffset`
   * `scrollThrottle`
   * @see {@link https://github.com/sawrozpdl/react-async-lazy-list#options React Async Lazy List - Options}
   */
  options?: AsyncLazyLoadOptions;
}
