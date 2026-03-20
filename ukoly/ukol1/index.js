// Jan Vlček, vlcj07
// Úkol č. 1 

const randomNumber = Math.floor(Math.random() * 11);

const openPrompt = (count) => {
    const userInput = prompt("Zadej svůj tip (0-10):");

    console.log(randomNumber);

    let counter = count || 1;

    if (userInput === null) {
        alert("Hra byla zrušena.");
        return;
    }

    const userNumber = parseInt(userInput, 10);

    if (isNaN(userNumber) || userNumber < 0 || userNumber > 10) {
        counter++;
        alert("Neplatný vstup. Zadej číslo mezi 0 a 10.");
        openPrompt(counter);
        return;
    }

    if (counter === 5 && userNumber !== randomNumber) {
        alert(`Prohrál jsi! Hádané číslo bylo ${randomNumber}.`);
        return;
    }

    if (counter <= 5 && userNumber === randomNumber) {
        alert("Gratulujeme! Uhádl jsi číslo.");
        console.log("Gratulujeme! Uhádl jsi číslo.");
        return;
    }

    counter++;

    alert(userNumber > randomNumber ? "Tvoje číslo je větší." : "Tvoje číslo je menší.");
    openPrompt(counter);
}

openPrompt();