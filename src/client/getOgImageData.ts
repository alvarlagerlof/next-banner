type Options = {
  placeholder: Record<string, unknown>;
};

export default function getOgImageData<T>({ placeholder }: Options): T {
  if (typeof window !== "undefined" && window.NextOpengraphImage) {
    return window.NextOpengraphImage.data as T;
  }

  return placeholder as T;
}
