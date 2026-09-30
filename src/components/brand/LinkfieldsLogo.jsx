// The official Linkfields logo, used unmodified.
// public/brand/linkfields-logo.svg is a byte-identical copy of
// https://www.linkfields.com/images/linkfields_logo%201.svg (light-on-dark variant,
// intrinsic 181×46). Only its display size changes. Proportions are preserved.
export default function LinkfieldsLogo({ height = 32, className }) {
  const width = Math.round((181 / 46) * height);
  return (
    <img
      className={className}
      src={`${process.env.PUBLIC_URL}/brand/linkfields-logo.svg`}
      width={width}
      height={height}
      alt="Linkfields"
      decoding="async"
    />
  );
}
