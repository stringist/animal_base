"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
// let filteredArray = [];
// The prototype for all animals:

const settings = {
    filterBy: "*",
    sortBy: "name",
    sortDir: "asc",
};

// The prototype for all animals:
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0,
    star: false,
    winner: false,
};

function start() {
    console.log("ready");
    loadJSON();
    armButtons();
}

function armButtons() {
    const filterButtons = document.querySelectorAll("[data-action=filter]");
    const sortingButtons = document.querySelectorAll("[data-action=sort]");

    filterButtons.forEach((category) => {
        category.addEventListener("click", selectFilter);
    });

    sortingButtons.forEach((category) => {
        category.addEventListener("click", selectSort);
    });
}

async function loadJSON() {
    const response = await fetch("animals.json");
    const jsonData = await response.json();

    // when loaded, prepare data objects
    prepareObjects(jsonData);
    buildList();
}

function prepareObjects(jsonData) {
    allAnimals = jsonData.map(prepareObject);

    buildList();
}

function prepareObject(jsonObject) {
    const animal = Object.create(Animal);
    const texts = jsonObject.fullname.split(" ");
    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;

    return animal;
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`user selected ${filter}`);
    // filterList(filter);
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList) {
    if (settings.filterBy != "*") {
        filteredList = allAnimals.filter(isAnimalType);
    } else {
        filteredList = allAnimals;
    }

    function isAnimalType(animal) {
        if (animal.type === settings.filterBy) {
            return true;
        } else {
            return false;
        }
    }
    return filteredList;
}

function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;
    // find old sortBy elelment
    const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
    oldElement.classList.remove("sortby");
    // indicate active sort
    event.target.classList.add("sortby");
    // toggle direction
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }
    console.log(`User selected ${settings.sortBy} - ${settings.sortDir}`);
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();
}

function sortList(sortedList) {
    let direction = 1;

    if (settings.sortDir === "desc") {
        direction = -1;
    } else {
        direction = 1;
    }

    sortedList = sortedList.sort(sortByProperty);

    function sortByProperty(animalA, animalB) {
        if (animalA[settings.sortBy] < animalB[settings.sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }
    return sortedList;
}

function buildList() {
    const currentList = filterList(allAnimals);
    const sortedList = sortList(currentList);
    displayList(sortedList);
}

function displayList(animals) {
    // clear the display
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
    // create clone
    const clone = document
        .querySelector("template#animal")
        .content.cloneNode(true);

    // set clone data

    // TODO: Show star ⭐ or ☆
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;
    if (animal.star === true) {
        clone.querySelector("[data-field=star").textContent = "⭐";
    } else {
        clone.querySelector("[data-field=star").textContent = "☆";
    }

    // TODO: Add event listener to click on star
    clone
        .querySelector("[data-field=star]")
        .addEventListener("click", toggleStar);

    function toggleStar() {
        if (animal.star) {
            animal.star = false;
        } else {
            animal.star = true;
        }
        buildList();
    }

    clone.querySelector(`[data-field='winner']`).dataset.winner = animal.winner;
    clone
        .querySelector(`[data-field='winner']`)
        .addEventListener("click", toggleWinner);

    function toggleWinner() {
        if (animal.winner) {
            animal.winner = false;
        } else {
            tryToMakeWinner(animal);
        }
        buildList();
    }
    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakeWinner(selectedAnimal) {
    const winners = allAnimals.filter((animal) => animal.winner);

    const numberOfWinners = winners.length;
    const other = winners
        .filter((animal) => animal.type === selectedAnimal.type)
        .shift();
    // if there is another of the same type
    if (other !== undefined) {
        console.log("There can only be one winner of each type!");
        removeOther(other);
    } else if (numberOfWinners >= 2) {
        console.log("There can only be two winners!");
        removeAOrB(winners[0], winners[1]);
    } else { makeWinner(selectedAnimal); }
    console.log(`There are ${numberOfWinners} winners`);

    console.log(other);

    function removeOther(other) {
        // ask user to ignore or remove 'other'
        document.querySelector("#onlyonekind").classList.remove("dialog");
        document.querySelector("#onlyonekind").classList.add("dialog.show");
        document.querySelector("#onlyonekind .closebutton").addEventListener("click", closeDialog);
        document.querySelector("#removeother").addEventListener("click", clickRemoveOther);
        document.querySelector("#removeother .animal1").textContent = `${other.name}?`


        // if ignore, do nothing

        function closeDialog() {
            document.querySelector("#onlyonekind").classList.add("dialog");
            document.querySelector("#onlyonekind .closebutton").removeEventListener("click", closeDialog);
            document.querySelector("#removeother").removeEventListener("click", clickRemoveOther);
        }
        // if remove other:

        function clickRemoveOther() {
            console.log("removeOther is clicked");
            removePrevWinner(other);
            makeWinner(selectedAnimal);
            buildList();
            closeDialog();
        }

    }

    function removeAOrB(winnerA, winnerB) {

        document.querySelector("#onlytwowinners").classList.remove("dialog");
        document.querySelector("#onlytwowinners").classList.add("dialog.show");
        document.querySelector("#onlytwowinners .closebutton").addEventListener("click", closeDialog);
        document.querySelector("#removeA").addEventListener("click", clickRemoveA);
        document.querySelector("#removeB").addEventListener("click", clickRemoveB);
        document.querySelector("#removeA [data-field=winnerA]").textContent = `${winnerA.name} the ${winnerA.type}`;
        document.querySelector("#removeB [data-field=winnerB]").textContent = `${winnerB.name} the ${winnerB.type}`;


        function closeDialog() {
            document.querySelector("#onlytwowinners").classList.add("dialog");
            document.querySelector("#onlytwowinners").classList.remove("dialog.show");
            document.querySelector("#onlytwowinners .closebutton").removeEventListener("click", closeDialog);
            document.querySelector("#removeA").removeEventListener("click", clickRemoveA);
            document.querySelector("#removeB").removeEventListener("click", clickRemoveB);
        }

        function clickRemoveA() {
            removePrevWinner(winnerA);
            makeWinner(selectedAnimal);
            buildList();
            closeDialog();
        }

        function clickRemoveB() {
            removePrevWinner(winnerB);
            makeWinner(selectedAnimal);
            buildList();
            closeDialog();
        }


    }

    function removePrevWinner(winnerAnimal) {
        winnerAnimal.winner = false;
    }

    function makeWinner(animal) {
        animal.winner = true;
    }
}