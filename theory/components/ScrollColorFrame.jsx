/**
 * StoryImageFrame
 * Renders high-quality full color photography with warm borders and elegant hover zoom.
 * Displayed in 100% natural color (no black & white or grayscale filters).
 */
export default function ScrollColorFrame({
  src,
  alt = "",
  className = "",
  containerClassName = "",
  aspectRatio = "aspect-[4/5]",
}) {
  return (
    <div
      className={`relative group ${aspectRatio} bg-[#faf8f2] border border-[#e5e3dc] overflow-hidden shadow-sm transition-all duration-500 ${containerClassName}`}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${className}`}
        loading="lazy"
      />
    </div>
  );
}
