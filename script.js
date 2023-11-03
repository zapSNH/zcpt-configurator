// do not look inside, you have been warned
// please, you will be scarred for life
// please make sure an emergency line is with you while ya look at this ok?
// /s

let imgPath = "./images/light/";
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	imgPath = "./images/dark/";
}

/*index, requires=0, provides=[], negates=[], replaces=[]*/
function toggle(e) {
	let index = this.index;
	let requires = this.requires;
	let provides = this.provides;
	let negates = this.negates;
	let replaces = this.replaces;

	if (!this.classList.contains("true")) {
		if (requires != 0) {
			document.querySelector(".pref:nth-child(" + requires + ")").classList.add("true");
		}
		if (negates != []) {
			for(i = 1; i <= negates.length; i++) {
				document.querySelector(".pref:nth-child(" + negates[i-1] + ")").classList.remove("true");
				if (document.querySelector(".img[index=\"" + negates[i-1] +"\"]")) {
					document.querySelector(".img[index=\"" + negates[i-1] +"\"]").remove();
				}
			}
		}
		if (replaces != []) {
			for(i = 1; i <= replaces.length; i++) {
				if (document.querySelector(".img[index=\"" + replaces[i-1] +"\"]")) {
					document.querySelector(".img[index=\"" + replaces[i-1] +"\"]").remove();
				}
			}
		}
		this.classList.add("true");

		let img = document.createElement("img");
		let imgContainer = document.createElement("div");
		imgContainer.innerHTML = this.innerHTML;
		imgContainer.classList.add("img");
		imgContainer.setAttribute("index", index);
		img.setAttribute("src", imgPath + this.innerHTML + ".png");
		imgContainer.appendChild(img);
		document.querySelector("#left").appendChild(imgContainer);
	} else {
		if (provides != []) {
			for(i = 1; i <= provides.length; i++) {
				document.querySelector(".pref:nth-child(" + provides[i-1] + ")").classList.remove("true");
				if (document.querySelector(".img[index=\"" + provides[i-1] +"\"]")) {
					document.querySelector(".img[index=\"" + provides[i-1] +"\"]").remove();
				}
			}
		}

		if (replaces != []) {
			for (i = 1; i <= replaces.length; i++) {
				let img = document.createElement("img");
				let imgContainer = document.createElement("div");
				imgContainer.innerHTML = document.querySelector(".pref:nth-child(" + replaces[i-1] + ")").innerHTML;
				imgContainer.classList.add("img");
				imgContainer.setAttribute("index", replaces[i-1]);
				img.setAttribute("src", imgPath + document.querySelector(".pref:nth-child(" + replaces[i-1] + ")").innerHTML + ".png");
				imgContainer.appendChild(img);
				document.querySelector("#left").appendChild(imgContainer);
			}
		}

		this.classList.remove("true");

		if (document.querySelector(".img[index=\"" + index +"\"]")) {
			document.querySelector("#left .img[index=\"" + index +"\"]").remove();
		}
	}
}

function includeInstallation() {
	if (!document.querySelector("#includeInstallation button").classList.contains("true")) {
		document.querySelector("#includeInstallation button").classList.add("true");
	} else {
		document.querySelector("#includeInstallation button").classList.remove("true");
	}
}

function exportPrefs() {
	let exported = "// Put this in your profile folder and delete it after you start Firefox\n";

	if (document.querySelector("#includeInstallation button").classList.contains("true")) {
		exported = "// Put this in your profile folder and delete it after you start Firefox\nuser_pref(\"toolkit.legacyUserProfileCustomizations.stylesheets\", true);\nuser_pref(\"svg.context-properties.content.enabled\", true);\nuser_pref(\"layout.css.has-selector.enabled\", true);\nuser_pref(\"browser.newtabpage.activity-stream.logowordmark.alwaysVisible\", true);\n";
	}

	document.querySelectorAll(".true:not(button)").forEach((e) => exported = exported.concat("user_pref(\"" + e.innerHTML + "\", true);\n"));
	console.log(exported);
	document.querySelector("#export").href = "data:text/plain," + encodeURIComponent(exported);
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
		});
		document.querySelector("#pref-list").appendChild(prefRow);
	}
}

load();