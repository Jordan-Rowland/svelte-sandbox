/* jshint esversion: 8 */

import { writable } from "svelte/store";

const hobbies = writable([]);

const hobbyStore = {
  subscribe: hobbies.subscribe,
  setHobbies: (items) => {
    hobbies.set(items);
  },
  addHobby: (hobby) => {
    hobbies.update(items => {
      return items.concat(hobby);
    });
  },
};

export default hobbyStore;
