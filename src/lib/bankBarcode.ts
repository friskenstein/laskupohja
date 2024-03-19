import type { Item } from '../types/item'
import type { State } from '../types/state'
import { calculateDueDateDate } from './dueDate'
import { refChecksum } from './refChecksum'

/**
Pankkiviivakoodin symboliversiota 4 käytetään, kun tilinumero on kansainvälisessä IBAN-muodossa
ja viite kansallisessa muodossa
Kenttä Pituus Arvo
Versionumero 1 4
Saajan tilinumeron (IBAN) numeerinen osa 16 N
Eurot 6 N
Sentit 2 N
Varalla 3 000
Viitenumero (kansallinen) 20 N
Eräpäivä 6 VVKKPP
 54

Versionumero 4.

Saajan tilinumero - Viivakoodissa on saajan IBAN -muotoinen tilinumero ilman FI - maatunnusta.
Tilinumero-kentän arvo ei ole koskaan nolla. Viivakoodiin valitun tilinumeron
on aina esiinnyttävä tilisiirtolomakkeella myös selkokielisessä muodossa FI-maatunnuksellisena.
Tilisiirtolomakkeella voi esiintyä selkokielisessä muodossa useita saajan IBAN-tilinumeroita,
joista laskuttaja valitsee yhden tulostettavaksi viivakoodiin.

Eurot - Laskun euromäärä, etunollatäyttö, lukualue 000000... 999999 euroa. Kun
laskun summa ylittää 99999999 senttiä, laskuttaja valintansa mukaan joko
tulostaa euro- ja senttikenttiin arvon 00000000 tai ei lainkaan tulosta
tilisiirtolomakkeelle viivakoodia. Jos maksaja saa itse valita maksettavan
summan, euro- ja senttikenttiin tulostetaan arvo 00000000.
NOTE: I'm not even going to implement anything for this. Millionaires don't have to use this software :)

Sentit - Laskun senttimäärä, lukualue 00...99.

Varalla - Tieto on 000 (nolla).

Viite - Laskun viitenumero (kansallinen), etunollatäyttö. Pankkiviivakoodissa
viitenumero on aina pakollinen. Etunollia ei tulosteta selkokielisenä
tilisiirtolomakkeelle.

Eräpäivä - Laskun eräpäivä on koodissa muodossa vvkkpp, mutta selkokielisenä
eräpäiväkentässä muodossa pp.kk.vvvv. Laskuttaja voi halutessaan täyttää
pankkiviivakoodin eräpäiväkentän nollilla
*/
export function v4(state: State, items: Item[]): string {
	return [
		'4',
		state.iban.replace('FI', '').replaceAll(' ', '').padEnd(16, '0'),
		(items.reduce((acc, item) => acc + item[1] * item[3] * (item[4] * 0.01 + 1), 0) * 100)
			.toFixed(0)
			.padStart(8, '0'),
		'000',
		(state.reference + refChecksum(state.reference)).padStart(20, '0'),
		(d =>
			d.getFullYear().toString().slice(-2) +
			(d.getMonth() + 1).toString().padStart(2, '0') +
			d.getDate().toString().padStart(2, '0'))(calculateDueDateDate(state)),
	].join('')
}

/*
Pankkiviivakoodin symboliversiota 5 käytetään, kun tilinumero on kansainvälisessä IBAN -
muodossa ja viite on kansainvälinen RF-viite.
Kenttä Pituus Arvo
Tyhjä alue 1
Alkumerkki *)
Versionumero 1 5
Saajan tilinumeron (IBAN)
numeerinen osa 16 N
Eurot 6 N
Sentit 2 N
RF-viitteen numeerinen osa 23 N
Eräpäivä 6 VVKKPP
Tarkiste 2 *)
Loppumerkki *)
Tyhjä alue 2
54

RF-Viite Laskun kansainvälinen viitenumero ilman RF-tunnusta 23 merkkiä pitkänä.
Pankkiviivakoodissa viitenumero on aina pakollinen.
Täydennysnollia ei tulosteta selkokielisenä tilisiirtolomakkeelle.
Viivakoodin viitekenttä muodostetaan poistamalla RF -viitteen alusta merkit
’RF’ja lisäämällä jäljelle jääneeseen merkkijonoon position 2 jälkeen niin
monta nollaa jotta kokonais-pituudeksi tulee 23 numeroa. Esimerkki:
kansallinen viite selkokielisenä: 9991
RF -muodossa selkokielisenä: RF04 9991 (jossa 04 on tarkiste)
viivakoodissa: 04000000000000000009991
Jos RF -viite kirjaimien ’RF’ jälkeen sisältää aakkosmerkkejä (ISO 11649),
pankkiviiva-koodia joko ei lainkaan muodosteta tai viitekenttään tulostetaan
nollat. Pankkiviivakoodissa esitetään vain numeerista tietoa.

*/
