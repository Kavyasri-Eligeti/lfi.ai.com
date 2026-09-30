// Releases every GPU resource owned by an object tree.
export function disposeObject(root) {
  const materials = new Set();
  root.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => materials.add(m));
    }
  });
  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      if (value && value.isTexture) value.dispose();
    });
    if (material.uniforms) {
      Object.values(material.uniforms).forEach((u) => {
        if (u.value && u.value.isTexture) u.value.dispose();
      });
    }
    material.dispose();
  });
}
