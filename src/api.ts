import type { typeCart, typeUser, typeProduct } from "./type.js";

export const chiamataApiCart = async (): Promise<typeCart[]> => {
  const risposta = await fetch("https://fakestoreapi.com/carts");

  if (!risposta.ok) {
    throw new Error("Errore caricamento");
  }

  return await risposta.json();
};

export const chiamataApiUser = async (): Promise<typeUser[]> => {
  const risposta = await fetch("https://fakestoreapi.com/users");

  if (!risposta.ok) {
    throw new Error("Errore caricamento");
  }

  return await risposta.json();
};

export const chiamataApiProduct = async (): Promise<typeProduct[]> => {
  const risposta = await fetch("https://fakestoreapi.com/products");

  if (!risposta.ok) {
    throw new Error("Errore caricamento");
  }

  return await risposta.json();
};