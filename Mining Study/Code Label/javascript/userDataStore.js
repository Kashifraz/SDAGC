import { writable, derived } from "svelte/store";

// Stores ---------------------------------------

// Array of spots objects that the user has saved. Every time this array changes it is synced to the userID.spots key in the database.
// New spots are added to the end of the array via the NewSpot.svelte component, so the most recent spot is the last item in the array.
// When the user deletes a spot via a component and function still to be written, the array is updated and the spot is removed from the database.
// If the user deletes the last spot in the array, an intentionalDelete boolean is set to true in spots/+layout.svelte and the array is emptied and the database is updated.
export const userSpots = writable([]);

// The spot that is currently being viewed by the user.
// This is used to give the SpotsList component a radio-like function and display the selected spot in SpotsDisplay.
export const activeSpot = writable("");

// User Settings Object
export const userPref = writable({
	date: "ymd", // Can be "ymd", "dmy", or "mdy". Although why anyone would use mdy is beyond me.
	sort: "default", // Can be "default", "recent", "alphabetical", "icon", "closest", "highRating", or "lowRating".
	map: "default" // Can be "retro" or "default".
});

// This is used to display the spots in the SpotsList component in the preferred order that the user has set in their settings.
export const sortedUserSpots = derived([userSpots, userPref], ([$userSpots, $userPref]) => {
	const currentSortedSpots = getCurrentSortingFunction($userSpots, $userPref.sort);
	return currentSortedSpots;
});

function getCurrentSortingFunction(spotsStore, currentSortMethod) {
	switch (currentSortMethod) {
		default:
		case "default":
			return dontSort(spotsStore);
		case "recent":
			return sortByRecentlyAdded(spotsStore);
		case "alphabetical":
			return sortByAlphabetical(spotsStore);
		case "icon":
			return sortByIcon(spotsStore);
		// case "closest":
		// return sortByClosest(spotsStore);
		case "highRating":
			return sortByHighestRating(spotsStore);
		case "lowRating":
			return sortByLowestRating(spotsStore);
	}
}

// Search bar -----------------------------------

export const searchTerm = writable("");
export const searchResults = derived([userSpots, searchTerm], ([$userSpots, $searchTerm]) => {
	const results = searchByName($userSpots, $searchTerm);
	return results;
});

// Sorting options for spots --------------------
// These need to be thoroughly tested.
// Using the slice method to make a copy is a bit of a hack, toSorted is a better option, consider changing.

function dontSort(spots) {
	return spots;
}

// **Tested**
// Star rating highest to lowest
function sortByHighestRating(spots) {
	const spotsCopy = spots.slice();
	const sorted = spotsCopy.sort((a, b) => {
		if (Number(a.starRating) > Number(b.starRating)) {
			return -1;
		} else if (Number(a.starRating) < Number(b.starRating)) {
			return 1;
		} else {
			return 0; // same
		}
	});
	return sorted;
}

// **Tested**
// Star rating lowest to high
function sortByLowestRating(spots) {
	const spotsCopy = spots.slice();
	const sorted = spotsCopy.sort((a, b) => {
		if (Number(a.starRating) > Number(b.starRating)) {
			return 1;
		} else if (Number(a.starRating) < Number(b.starRating)) {
			return -1;
		} else {
			return 0; // same
		}
	});
	return sorted;
}

// **Tested**
// Organise by icon
function sortByIcon(spots) {
	const spotsCopy = spots.slice();
	// This is a CoPilot creation, but I believe the default sort function is the same? Test this.
	const sorted = spotsCopy.sort((a, b) => {
		if (a.iconName > b.iconName) {
			return 1;
		} else if (a.iconName < b.iconName) {
			return -1;
		} else {
			return 0; // same
		}
	});
	return sorted;
}

// **Tested**
// Alphabetical
function sortByAlphabetical(spots) {
	const spotsCopy = spots.slice();
	// This is a CoPilot creation, but I believe the default sort function is the same? Test this.
	const sorted = spotsCopy.sort((a, b) => {
		if (a.spotName > b.spotName) {
			return 1;
		} else if (a.spotName < b.spotName) {
			return -1;
		} else {
			return 0; // same
		}
	});
	return sorted;
}

// **Tested**
// Search by name. Pass in the array of spots and the search bar value, reactive to the search bar component.
export function searchByName(spots, name) {
	const lowerCaseName = name.toLowerCase();
	const filtered = spots.filter((spot) => spot.spotName.toLowerCase().includes(lowerCaseName));
	console.log(filtered);
	return filtered;
}

// **Tested**
// Sort by closest to current location
function sortByClosest(spots) {
	// This is a promise that gets the current location of the user. Maybe needs to set a loading state in the UI?
	const getLocationPromise = new Promise((resolve, reject) => {
		const success = (pos) => {
			resolve({ lat: pos.coords.latitude, long: pos.coords.longitude });
		};
		const error = () => {
			reject("Error getting location");
		};
		navigator.geolocation.getCurrentPosition(success, error);
	});

	// Needs to be a promise so that the current location can be resolved before the spots are sorted.
	getLocationPromise
		.then((currentLocation) => {
			// Sorts by ascending distance from the current location.
			const sortedSpots = spots.toSorted((a, b) => {
				const diffA = Number(a.lat) - currentLocation.lat + (Number(a.long) - currentLocation.long);
				const diffB = Number(b.lat) - currentLocation.lat + (Number(b.long) - currentLocation.long);
				if (diffA > diffB) {
					return 1;
				} else if (diffA < diffB) {
					return -1;
				} else {
					return 0; // same
				}
			});

			console.log(sortedSpots);
			return sortedSpots;
		})
		.catch((error) => {
			console.log(error);
		});
}

// **Tested**
// Sort by recently added. Default array is from earliest added to latest added, so reverse it.
function sortByRecentlyAdded(spots) {
	const spotsCopy = spots.slice();
	const reversed = spotsCopy.reverse();
	return reversed;
}
