// Jan Vlček, vlcj07
// Úkol č. 3

import fs from 'fs/promises';

const readInstructions = async () => {
    const number = await fs.readFile('instrukce.txt', 'utf-8');

    const parsedNumber = parseInt(number.trim());

    if (parsedNumber < 0 || isNaN(parsedNumber)) {
        throw new Error('Neplatný počet souborů.');
    }

    return parsedNumber;
}

const createFiles = async () => {
    let numberOfFiles;
    try {
        numberOfFiles = await readInstructions();
    } catch (err) {
        console.error('Chyba při čtení instrukcí:', err.message);
        return;
    }

    const filesArray = [];
    const dir = './files';
    
    try {

        await fs.mkdir(dir, { recursive: true });

        for (let i = 0; i <= numberOfFiles; i++) {
            filesArray.push(fs.writeFile(`${dir}/${i}.txt`, `Soubor ${i}`, 'utf-8'));
        }

        if (filesArray.length === 0) {
            console.log('Žádné soubory k vytvoření.');
            return;
        }

        await Promise.all(filesArray);
    } catch (err) {
        console.error('Chyba při vytváření souborů.');
        throw err;
    }

    console.log('Všechny soubory byly úspěšně vytvořeny.');
}

createFiles();