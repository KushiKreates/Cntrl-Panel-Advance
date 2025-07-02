type SSRGlobals = {
  [key: string]: any;
};

const ssr = {
  get<T = any>(key: string): T | undefined {
    if (typeof window !== "undefined" && (window as any)[key] !== undefined) {
      return (window as SSRGlobals)[key] as T;
    }
    return undefined;
  }
};

export default ssr;