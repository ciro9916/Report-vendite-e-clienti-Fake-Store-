import type {typeProduct,typeCart,typeUser,Report} from "./type.js"
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
    id:number,
    nome:string,
    quantita:number,
    username:string,
    email:string,
    spesa_totale:number,
    ordini: number,
}

export type Intervallo = { 
    data_riferimento: Date; 
    inizio: Date; 
    fine: Date 
}

export const calcolaIntervallo = (carrelli: typeCart[]): Intervallo | false => {
    if (carrelli.length === 0) return false

    const primo = carrelli[0]

    if (!primo) 
        return false              

    let data_riferimento = new Date(primo.date)


    for (const carrello of carrelli) {
        const data = new Date(carrello.date)
        if (data >  data_riferimento) {                  
             data_riferimento = data
        }
    }

    const inizio = new Date( data_riferimento)           
    inizio.setUTCMonth(inizio.getUTCMonth() - 1)  

    return {  data_riferimento, inizio, fine:  data_riferimento }
}



export const top_3_prodotti = (carrelli:typeCart[], prodotti:typeProduct[],periodo?:boolean):prodottoMaxVenduto[] =>
{
    let max:prodottoMaxVenduto[]=[]

    const intervallo = periodo ? calcolaIntervallo(carrelli) : false

    for(let prodotto of prodotti){
        let id = prodotto.id
        let quantita = 0
        let fatturato = 0
        for(let carrello of carrelli)
        {
            const data = new Date(carrello.date)
            // se intervallo è null calcola sempre - invece se è positivo fa i calcoli solo per l'ultimo mese
            if (!intervallo || (data >= intervallo.inizio && data <= intervallo.fine)) {
                for(let items of carrello.products){
                    if(id === items.productId){
                        fatturato=fatturato+(items.quantity * prodotto.price)
                        quantita+=items.quantity
                    }
                }
            }
        }

        const prodottoX:prodottoMaxVenduto = {
               id:prodotto.id,
               titolo:prodotto.title,
               categoria:prodotto.category,
               prezzo_unitario:prodotto.price,
               unita:quantita,
               fatturato:fatturato,
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

    const intervallo = periodo ? calcolaIntervallo(carrelli) : false

    for(let cliente of clienti){
        let id=cliente.id
        let quantita = 0
        let spesa=0
        let ordini=0
        for(let carrello of carrelli){
            const data = new Date(carrello.date)

            if (id === carrello.userId && (!intervallo || (data >= intervallo.inizio && data <= intervallo.fine))) {
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
        let clienteBuild:clienteMax = {
                nome : ""+cliente.name.firstname+" "+cliente.name.lastname,
                id:cliente.id,
                quantita: quantita,
                username:cliente.username,
                email:cliente.email,
                spesa_totale: Math.round(spesa * 100) / 100,
                ordini:ordini
        } ;
        if (ordini > 0) {
            if(max.length<3){
                max.push(clienteBuild)
                max=ordinaVettore_utenti(max)
            }else{
                max.push(clienteBuild);
                max = ordinaVettore_utenti(max);
                max.pop();
            }
        }

    }

    return  max.map((c, i) => ({ rank: i + 1, ...c }))
}

const ordinaVettore_utenti = (vettore: clienteMax[]): clienteMax[] => {
    return vettore.sort((a, b) =>
        b.spesa_totale - a.spesa_totale ||   
        b.ordini - a.ordini ||               
        b.quantita - a.quantita              
    );
}

const ordinaVettore_prodotti = (vettore: prodottoMaxVenduto[]): prodottoMaxVenduto[] => {
    return vettore.sort((a, b) =>
        b.unita - a.unita ||                 
        b.fatturato - a.fatturato ||         
        a.id - b.id                          
    );
}

export const reportProdotti = (carrelli: typeCart[], prodotti: typeProduct[]): Report<prodottoMaxVenduto> => {
    const intervallo = calcolaIntervallo(carrelli)

    return {
        report: "top_3_prodotti",
        generato_il: new Date()+"",
        data_riferimento: intervallo ? intervallo.data_riferimento+"" : null,
        all_time: {
            intervallo: null,
            classifica: top_3_prodotti(carrelli, prodotti, false)
        },
        ultimo_mese: {
            intervallo: intervallo
                ? { inizio: intervallo.inizio+"", fine: intervallo.fine+"" }
                : null,
            classifica: top_3_prodotti(carrelli, prodotti, true)
        }
    }
}

export const reportClienti = (carrelli: typeCart[], prodotti: typeProduct[], clienti: typeUser[]): Report<clienteMax> => {
    const intervallo = calcolaIntervallo(carrelli)

    return {
        report: "top_3_clienti",
        generato_il: new Date()+"",
        data_riferimento: intervallo ? intervallo.data_riferimento+"" : null,
        all_time: {
            intervallo: null,
            classifica: top_3_clienti(carrelli, prodotti, clienti, false)
        },
        ultimo_mese: {
            intervallo: intervallo
                ? { inizio: intervallo.inizio+"", fine: intervallo.fine+"" }
                : null,
            classifica: top_3_clienti(carrelli, prodotti, clienti, true)
        }
    }
}