type Options = {
  placeholder: Record<string, unknown>;
};

export default function getOgImageData({
  placeholder,
}: Options): Record<string, unknown> {
  if (typeof window !== "undefined") {
    return window.NextOpengraphImage.data;
  }

  return placeholder;
}
