import React, { useState } from "react";
import "./style/common.css";

const DEFAULT_FALLBACK = "/uploads/images/ass1.png";

function resolveSrc(src) {
  if (!src) return DEFAULT_FALLBACK;
  if (Array.isArray(src)) return src[0] || DEFAULT_FALLBACK;
  return src;
}

export default function MediaImage({
  src,
  fallback = DEFAULT_FALLBACK,
  alt = "Product image",
  className = "",
  style = {},
  loading = "lazy",
  ...rest
}) {
  const [currentSrc, setCurrentSrc] = useState(() => resolveSrc(src));
  const [errored, setErrored] = useState(false);

  React.useEffect(() => {
    const resolved = resolveSrc(src);
    if (resolved !== currentSrc) {
      setCurrentSrc(resolved);
      setErrored(false);
    }
  }, [src]);

  const handleError = () => {
    if (!errored && currentSrc !== fallback) {
      setCurrentSrc(fallback);
      setErrored(true);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      onError={handleError}
      className={`media-img ${className}`}
      style={style}
      {...rest}
    />
  );
}
