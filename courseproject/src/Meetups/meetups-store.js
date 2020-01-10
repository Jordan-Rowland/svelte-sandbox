import { writable } from "svelte/store";

const meetups = writable([
    // {
    //   id: "m1",
    //   title: "Python Bootcamp",
    //   subtitle: "Learn to code in 276 years",
    //   description: "In this meetup, we will have some total beginners to teach you how to code! Badly!",
    //   imageUrl: "https://3t7bol18ef963l8x6yzv7ja1-wpengine.netdna-ssl.com/wp-content/uploads/2017/07/on-ground_coding_bootcamps_2.jpg",
    //   address: "421 Evergreen Terrace, Springfield 52413",
    //   contact: "code@douletran.com",
    //   favourite: false,
    // },
    // {
    //   id: "m2",
    //   title: "JS Bootcamp",
    //   subtitle: "Learn to code in 6 minues",
    //   description: "In this meetup, we don't even know what to do! JS is so weird lol",
    //   imageUrl: "https://brokeassstuart-9uzlt3u.netdna-ssl.com/wp-content/pictsnShit/2016/06/coding-bootcamp.jpg",
    //   address: "123 Fake Street, Springfield 51423",
    //   contact: "code@douletran.com",
    //   favourite: false,
    // }
]);

const customMeetupsStore = {
  // Create a custom store, any object with a
  // subscribe method is a store. We are using the
  // above store and proxying the subscribe method
  // to make our custom store.
  subscribe: meetups.subscribe,
  setMeetups: meetupArray => {
    meetups.set(meetupArray);
  },
  addMeetup: meetupData => {
    const newMeetup = { ...meetupData };
    meetups.update(items => {
      return [newMeetup, ...items];
    });
  },

  updateMeetup: (id, meetupData) => {
    meetups.update(items => {
      const meetupIndex = items.findIndex(m => m.id === id);
      const updatedMeetup = {...items[meetupIndex], ...meetupData};
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },

  removeMeetup: id => {
    meetups.update(items => {
      return items.filter(item => item.id !== id);
    });
  },

  toggleFavourite: id => {
    meetups.update(items => {
      const meetupIndex = items.findIndex(m => m.id === id);
      const updatedMeetup = {
        ...items.find(m => m.id === id)};
      updatedMeetup.favourite = !updatedMeetup.favourite;
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },

};

export default customMeetupsStore;
