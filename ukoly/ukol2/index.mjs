// Jan Vlček, vlcj07
// Úkol č. 2

import fs from 'fs';

const copyFile = (instructions) => {

    console.log('Spouštím program pro kopírování souborů...');

    let data;

    try {
        data = fs.readFileSync(instructions, 'utf-8');
    } catch (err) {
        console.error(`Soubor ${instructions} s instrukcemi neexistuje.`);
        return;
    }

    console.log(`Instrukce:\n${data}`);

    let parsedData;

    try {
        parsedData = JSON.parse(data);
    } catch (err) {
        console.error(`Chyba při zisku instrukcí. Soubor ${instructions} není ve správném formátu JSON.`);
        return;
    }

    const { source, target } = parsedData;

    let sourceData;

    try {
        sourceData = fs.readFileSync(source, 'utf-8');
    } catch (err) {
        console.error(`Zdrojový soubor ${source} neexistuje.`);
        return;
    }

    try {
        fs.writeFileSync(target, sourceData, 'utf-8');
        console.log(`Data byla úspěšně zkopírována z ${source} do ${target}.`);
    } catch (err) {
        console.error(`Chyba při zapisování do cílového souboru ${target}.`);
        return;
    }

    console.log('Kopírování dokončeno.');
}

copyFile('instrukce.txt');