// OBJETOS DEL DOM (Carácteristicas de los Pokémones) //

const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');

const pokeListItems = document.querySelectorAll('.list-item');

const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

// Array donde contenga todos los tipos de Pokémon //

const TYPES = [
    'normal' , 'fighting' , 'flying' , 'poison' , 'ground' , 'rock' , 'bug' , 'ghost' , 'steel' , 'fire' , 'water' , 'grass' , 'electric' , 'psychic' , 'ice' , 'dragon' , 'dark' , 'fairy'
];

let prevUrl = null;
let nextUrl = null;



//Función para poner la primera letra del tipo de Pokemón mayúscula //
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);


// Función que eliminará el DIV de color de pantalla una vez cambiemos de pokemón //

const resetScreen = () => {
    mainScreen.classList.remove('hide');
    for (const type of TYPES) {
        mainScreen.classList.remove(type);
    }

}




//Todo esto es la información que se insertará en la pantalla de la izquierda //

const fetchPokeData = id => {
    fetch (`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {
         resetScreen();

            const dataTypes = data ['types'];
            const dataFirstType = dataTypes [0];
            const dataSecondType = dataTypes [1];
            pokeTypeOne.textContent = capitalize(dataFirstType ['type'] ['name']);
            if (dataSecondType) {
                pokeTypeTwo.classList.remove('hide');
                pokeTypeTwo.textContent = capitalize(dataSecondType ['type'] ['name']);
            } else {
                pokeTypeTwo.classList.add('hide');
                pokeTypeTwo.textContent = '';
            }
            mainScreen.classList.add(dataFirstType ['type'] ['name']);
         
            mainScreen.classList.remove('hide');
            pokeName.textContent = capitalize(data ['name']);
            pokeId.textContent = '#' + data ['id'].toString().padStart(3,'0');
            pokeWeight.textContent = data ['weight'];
            pokeHeight.textContent = data ['height'];
            pokeFrontImage.src = data ['sprites'] ['front_default'] || '';
            pokeBackImage.src = data ['sprites'] ['back_default'] || '';
    });
};

 // Esta es toda la información que se insertará en la pantalla de la derecha //

const fetchPokeList = url => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const { results, previous, next } = data;
            prevUrl = previous;
            nextUrl = next;

            for (let i = 0; i < pokeListItems.length ; i++) {
                const pokeListItem = pokeListItems[i];
                const resultData = results[i];
                
                if (resultData) {
                    const { name, url } = resultData;
                    const urlArray = url.split('/');
                    const id = urlArray[urlArray.length - 2];
                    pokeListItem.textContent = id + '. ' + capitalize(name);
                } else {
                    pokeListItem.textContent = '';
                }
            }
        });
};

// Función para que funcionen los botones de la derecha //

const handleRightButtonClick = () => {
    if (nextUrl) {
        fetchPokeList(nextUrl);
    }

};

const handleLeftButtonClick = () => {
    if (prevUrl) {
        fetchPokeList(prevUrl);
    }

};

const handleListItemClick = (e) => {
    if (!e.target) return;

    const listItem = e.target;
    if (!listItem.textContent) return;

    const id = listItem.textContent.split ('.')[0];
    fetchPokeData(id);
};




// Agregar event listeners a los botones de la derecha //

leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);

// Agregar even Listeners para cada item //

for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
};



// Iniciar la APP //
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');