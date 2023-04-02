"use strict";

function titleClickHandler() {
	console.log("Link was clicked!");
}

const links = document.querySelectorAll(".titles a");

for (let link of links) {
	link.addEventListener("click", titleClickHandler);
}
