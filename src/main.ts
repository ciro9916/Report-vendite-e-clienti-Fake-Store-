// base url https://fakestoreapi.com/

/*
Endpoint	    Contenuto utile
GET /products	Catalogo: id, titolo, prezzo, …
GET /carts	    Ordini/carrelli: userId, date, elenco { productId, quantity }
GET /users	    Anagrafica clienti
*/


import { chiamataApiCart, chiamataApiUser, chiamataApiProduct } from "./api.js";
import { reportProdotti, reportClienti } from "./logic.js"

const main = async () => {
    const prodotti = await chiamataApiProduct();
    const carrelli = await chiamataApiCart();
    const utenti = await chiamataApiUser();

    console.log(JSON.stringify(reportProdotti(carrelli, prodotti), null, 2))
    console.log("----------------------")
    console.log(JSON.stringify(reportClienti(carrelli, prodotti, utenti), null, 2))
}

main()