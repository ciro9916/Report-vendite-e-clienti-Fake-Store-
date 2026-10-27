import type {typeProduct,typeCart,typeUser} from "./type.js"
/*

la posizione in classifica;
l’identificativo utente;
lo username;
il nome completo (nome e cognome come restituiti dall’API, uniti da uno spazio, senza capitalizzazione extra);
l’email;
il numero di ordini (carrelli) nel periodo;
il totale pezzi acquistati nel periodo (somma delle quantità);
la spesa totale nel periodo (somma di prezzo × quantità).
Come nel Report 1, il JSON deve anche dichiarare etichetta
*/ 

/*
la posizione in classifica;
l’identificativo del prodotto;
il titolo;
la categoria;
il prezzo unitario di catalogo;
le unità vendute nel periodo;
il fatturato del periodo (prezzo unitario × unità vendute).
*/
 type prodottoMaxVenduto = {
    rank?: number,
    id:number,
    titolo:string,
    categoria:string,
    prezzo_unitario:number,
    unita:number,
    fatturato:number
 }

type clienteMax = {
    rank?: number,
    nome:string,
    quantita:number,
    username:string,
    email:string,
    spesa_totale:number,
    ordini: number,
}

export const top_3_prodotti = (carrelli:typeCart[], prodotti:typeProduct[],clienti : typeUser[],periodo?:boolean):prodottoMaxVenduto[]|void =>
{
    let max:prodottoMaxVenduto[]=[]

    for(let prodotto of prodotti){
        let id = prodotto.id
        let quantita = 0
        let fatturato = 0
        for(let carrello of carrelli)
        {
            for(let items of carrello.products){
                if(id === items.productId){
                    fatturato=fatturato+(items.quantity * prodotto.price)
                    quantita+=items.quantity
                }
            }
        }

        const prodottoX:prodottoMaxVenduto = {
                id:prodotto.id,
                titolo:prodotto.title,
                categoria:prodotto.category,
                prezzo_unitario:prodotto.price,
                unita:quantita,
                fatturato:fatturato
        }

        if(max.length<3){
            max.push(prodottoX)
            max=ordinaVettore_prodotti(max)
        }else{
            max.push(prodottoX)
            max=ordinaVettore_prodotti(max)
            max.pop()
        }
    }
    return  max.map((c, i) => ({ rank: i + 1, ...c }))
}

export const top_3_clienti = (carrelli:typeCart[], prodotti:typeProduct[],clienti : typeUser[],periodo?:boolean):clienteMax[] =>
{
    
    let max:clienteMax[] = []
    for(let cliente of clienti){
        let id=cliente.id
        let quantita = 0
        let spesa=0
        let ordini=0
        for(let carrello of carrelli){
            if(periodo){
                if (new Date(carrello.date) >= new Date("2026-09-27T00:00:00.000Z")) {
                    if(id === carrello.userId){
                    ordini++
                    for(let item of carrello.products){
                        quantita+=item.quantity
                        const prodotto = prodotti.find(p => p.id === item.productId)
                        if(prodotto){
                            spesa += prodotto.price * item.quantity
                        }
                    }
                }
              }
            }else{
                 if(id === carrello.userId){
                    ordini++
                    for(let item of carrello.products){
                        quantita+=item.quantity
                        const prodotto = prodotti.find(p => p.id === item.productId)
                        if(prodotto){
                            spesa += prodotto.price * item.quantity
                        }
                    }
                }
            }
            
        }
        let clienteBuild:clienteMax = {
                nome : ""+cliente.name.firstname+" "+cliente.name.lastname,
                quantita: quantita,
                username:cliente.username,
                email:cliente.email,
                spesa_totale: spesa,
                ordini:ordini
        } ;
        if(max.length<3){
            max.push(clienteBuild)
            max=ordinaVettore_utenti(max)
        }else{
            max.push(clienteBuild);
            max = ordinaVettore_utenti(max);
            max.pop();
        }

    }

    return  max.map((c, i) => ({ rank: i + 1, ...c }))
}

const ordinaVettore_utenti = (vettore: clienteMax[]): clienteMax[] => {
    return vettore.sort((a, b) => b.spesa_totale - a.spesa_totale);
};

const ordinaVettore_prodotti = (vettore: prodottoMaxVenduto[]): prodottoMaxVenduto[] => {
    return vettore.sort((a, b) => b.unita - a.unita);
};