// do not look inside, you have been warned
// please, you will be scarred for life
// please make sure an emergency line is with you while ya look at this ok?
// p.s. this is NOT EDIBLE spaghetto code
// /s

let imgPath = "./images/light/";
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	imgPath = "./images/dark/";
	document.querySelector(".favicon").href = "./images/icon-dark.svg";
}

document.querySelector("#includeInstallation button").addEventListener("click", function () {
	if (!this.classList.contains("true")) {
		this.classList.add("true");
	} else {
		this.classList.remove("true");
	}
});

document.querySelector("#clear").addEventListener("click", function () {
	document.querySelectorAll(".true:not(button)").forEach((e) => e.classList.remove("true"));
	document.querySelectorAll(".warning").forEach((e) => e.classList.remove("warning"));
	document.querySelectorAll(".img").forEach((e) => e.remove());
});

function toggle() {
	let index = this.index;
	let requires = this.requires;
	let provides = this.provides;
	let negates = this.negates;
	let replaces = this.replaces;

	if (!this.classList.contains("true")) {

		this.classList.add("true");

		if (this.classList.contains("warning")) this.classList.remove("warning");

		if (requires != 0) {
			document.querySelector(".pref:nth-child(" + requires + ")").classList.add("true");
			document.querySelector(".pref:nth-child(" + requires + ")").classList.remove("warning");
		}
		if (negates != []) {
			for(i = 1; i <= negates.length; i++) {
				document.querySelector(".pref:nth-child(" + negates[i-1] + ")").classList.remove("true");
				document.querySelector(".pref:nth-child(" + negates[i-1] + ")").classList.add("warning");
				if (document.querySelector(".img[index=\"" + negates[i-1] +"\"]")) document.querySelector(".img[index=\"" + negates[i-1] +"\"]").remove();

				refreshWarnings();
			}
		}
		if (replaces != []) {
			for(i = 1; i <= replaces.length; i++) {
				if (document.querySelector(".img[index=\"" + replaces[i-1] +"\"]")) document.querySelector(".img[index=\"" + replaces[i-1] +"\"]").remove();
			}
		}
		
		let img = document.createElement("img");
		let imgContainer = document.createElement("div");
		imgContainer.innerHTML = this.innerHTML;
		imgContainer.classList.add("img");
		imgContainer.setAttribute("index", index);
		img.setAttribute("src", imgPath + this.innerHTML + ".png");
		imgContainer.appendChild(img);
		document.querySelector("#left").prepend(imgContainer);

	} else {
		this.classList.remove("true");

		if (provides != []) {
			for (i = 1; i <= provides.length; i++) {
				document.querySelector(".pref:nth-child(" + provides[i-1] + ")").classList.remove("true");
				if (document.querySelector(".img[index=\"" + provides[i-1] +"\"]")) document.querySelector(".img[index=\"" + provides[i-1] +"\"]").remove();
				refreshWarnings();
			}
		}
		
		if (negates != []) refreshWarnings();


		if (replaces != []) {
			for (i = 1; i <= replaces.length; i++) {
				let img = document.createElement("img");
				let imgContainer = document.createElement("div");
				imgContainer.innerHTML = document.querySelector(".pref:nth-child(" + replaces[i-1] + ")").innerHTML;
				imgContainer.classList.add("img");
				imgContainer.setAttribute("index", replaces[i-1]);
				img.setAttribute("src", imgPath + document.querySelector(".pref:nth-child(" + replaces[i-1] + ")").innerHTML + ".png");
				imgContainer.appendChild(img);
				document.querySelector("#left").prepend(imgContainer);
			}
		}

		if (document.querySelector(".img[index=\"" + index +"\"]")) document.querySelector("#left .img[index=\"" + index +"\"]").remove();
	}
}

function refreshWarnings() {
	for (let e of document.querySelectorAll(".warning")) {
		let canBeRemoved = true;
		for (let f of document.querySelectorAll(".true:not(button)")) {
			if (e.negates.includes(f.index)) canBeRemoved = false;
		}
		if (canBeRemoved) e.classList.remove("warning");
	}
}

async function load() {
	const response = await fetch("prefs.json");
	const data = await response.json();
	
	for (let e of data.prefs) {
		let prefRow = document.createElement("div");
		prefRow.classList.add("pref");
		prefRow.innerHTML = e[0];
		prefRow.index = e[1][0];
		prefRow.requires = e[1][1];
		prefRow.provides = e[1][2];
		prefRow.negates = e[1][3];
		prefRow.replaces = e[1][4];
		prefRow.desc = e[2];
		prefRow.addEventListener("click", toggle);
		prefRow.addEventListener("mouseover", function () {
			document.querySelector("#desc-box").innerHTML = this.desc;
			document.querySelector("#desc-name").innerHTML = this.innerHTML;
			let incompatibilities = "";
			this.negates.forEach((e) => incompatibilities += document.querySelector(".pref:nth-child(" + e + ")").innerHTML + "<br>");
			if (incompatibilities == "") {
				document.querySelector("#incompat-box div").innerHTML = "N/A";
				document.querySelector("#incompat-box").classList.add("empty");
			} else {
				document.querySelector("#incompat-box div").innerHTML = incompatibilities;
				document.querySelector("#incompat-box").classList.remove("empty");
			}
		});
		document.querySelector("#pref-list").appendChild(prefRow);
	}

	document.querySelector("#export").addEventListener("click", function () {
		let exported = "// Put this in your profile folder and delete it after you start Firefox\n";
		fetch("defaultPrefs.json")
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				let link = document.createElement("a");
				if (document.querySelector("#includeInstallation button").classList.contains("true")) {	
					for (let e of data.defaultPrefs) {
						exported += e + "\n";
					}
		
					exported += "\n";
				}
				document.querySelectorAll(".true:not(button)").forEach((e) => exported = exported.concat("user_pref(\"" + e.innerHTML + "\", true);\n"));
				link.href = "data:text/plain," + encodeURIComponent(exported);
				link.download = "user.js";
				link.click();
			})
			.catch((error) => {
				console.log("error " + error);
			});
	});
}

load();