// export async function getNotes() {
//   const res = await fetch(
//     "http://localhost:3000/notes");
//   const resJson = await res.json();
//   let notes = resJson.notes;
//   console.log(`from helper: ${notes}`);
//   return notes;
// }


// export async function addNote(newNote) {
//   const res = await fetch(
//     "http://localhost:3000/notes", {
//       method: "POST",
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify({body: newNote}),
//     });
//   newNote = "";
//   return [...notes, await res.json()];
// }


// export function deleteNote(event) {
//   let updatedNotes = notes.filter(note => note.id !== event.detail);
//   notes = updatedNotes;
// }
