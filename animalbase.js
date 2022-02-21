"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
// The prototype for all animals:
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0,
};

function start() {
    console.log("ready");
    loadJSON();
    armButtons();
}

function armButtons() {
    const filterButtons = document.querySelectorAll(".filter");
    const sortingButtons = document.querySelectorAll("#sorting th");

    filterButtons.forEach((category) => {
        // TODO: Add event-listeners to filter and sort buttons
        category.addEventListener("click", selectFilter);
    });
    // sortingButtons.forEach(category => { category.addEventListener("click", selectSort) }
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`user selected ${filter}`)
    filterList(filter);
}

async function loadJSON() {
    const response = await fetch("animals.json");
    const jsonData = await response.json();

    // when loaded, prepare data objects
    prepareObjects(jsonData);
}

function prepareObjects(jsonData) {

    allAnimals = jsonData.map(prepareObject);
    console.log(allAnimals);
    // TODO: This might not be the function we want to call first
    // if statements here
    // displayList(allAnimals);
}

function prepareObject(jsonObject) {
    const animal = Object.create(Animal);

    const texts = jsonObject.fullname.split(" ");
    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;

    filterList(animal.type);
    return animal;
}

function filterList(category) {
    let filteredList = allAnimals;
    if (category === "cat") { filteredList = allAnimals.filter(isCat) };

    if (category === "dog") { filteredList = allAnimals.filter(isDog) };
    displayList(filteredList);
}

function isCat(animal) {
    return animal.type === "cat";
}

function isDog(animal) {
    return animal.type === "dog";
}

function displayList(animals) {
    // clear the list
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
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}