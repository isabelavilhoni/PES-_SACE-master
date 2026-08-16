export const mascaraApenasNumeros = (valor) => {
  return valor.replace(/\D/g, "");
};
export const mascaraCargaHoraria = (valor) => {
  const numerico = valor.replace(/\D/g, "");
  return numerico.slice(0, 3);
};
