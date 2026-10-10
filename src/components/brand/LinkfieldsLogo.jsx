// The official Linkfields logo, used unmodified. Two published variants,
// intrinsic 181×46; only the display size changes:
//  - linkfields-logo-dark.svg: dark wordmark, for light backgrounds (default)
//  - linkfields-logo.svg: light wordmark, for dark backgrounds (`light`)
export default function LinkfieldsLogo({ height = 32, light = false, className }) {
  const width = Math.round((181 / 46) * height);
  return (
    <img
      className={className}
      src={`${process.env.PUBLIC_URL}/brand/${light ? 'linkfields-logo.svg' : 'linkfields-logo-dark.svg'}`}
      width={width}
      height={height}
      alt="Linkfields"
      decoding="async"
    />
  );
}
