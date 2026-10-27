// base url https://fakestoreapi.com/

/*
Endpoint	    Contenuto utile
GET /products	Catalogo: id, titolo, prezzo, …
GET /carts	    Ordini/carrelli: userId, date, elenco { productId, quantity }
GET /users	    Anagrafica clienti
*/

import type {typeProduct,typeCart,typeUser} from "./type.js"
import { chiamataApiCart, chiamataApiUser, chiamataApiProduct } from "./api.js";
import {top_3_clienti,top_3_prodotti} from "./logic.js"

const main = async () =>{
    const prodotti = await chiamataApiProduct();
    const carrelli = await chiamataApiCart();
    const utenti = await chiamataApiUser();

    /*console.log(top_3_clienti(carrelli,prodotti,utenti))
    console.log("----------------------")
    console.log(top_3_clienti(carrelli,prodotti,utenti,true))*/

    console.log(top_3_prodotti(carrelli,prodotti,utenti))

    }

main()