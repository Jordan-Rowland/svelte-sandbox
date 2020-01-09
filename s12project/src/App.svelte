<script>
import { writable } from "svelte/store";
import { tweened } from "svelte/motion";
import Spring from "./Spring.svelte";
import { cubicIn } from "svelte/easing";
import { fade, fly, slide, scale } from "svelte/transition";
import { flip } from "svelte/animate";


// const progress = tweened(0, {
//   delay: 0,
//   duration: 700,
//   easing: cubicIn,
// });

// setTimeout(() => {
//   progress.set(0.5);
// }, 1000);


let boxes = [];

let boxInput = "";

function addBox() {
  boxes = [boxInput.value, ...boxes];
  boxInput.value = "";
}

function discard(value) {
  boxes = boxes.filter(i => i !== value);
}

let showParagraph = false;

</script>



<!-- <progress value={$progress}></progress> -->
<!-- <Spring /> -->

<button
  on:click={() => showParagraph = !showParagraph}>
    toggle
</button>

{#if showParagraph}
  <p
    in:fade
    out:fly={{
      duration: 800,
      x: 300
    }}>
      Can you see me
  </p>
{/if}
<hr>
<input type="text" bind:this={boxInput}>
<button on:click={addBox}>Add Box</button>

{#each boxes as box (box)}
  <div
    transition:fly={{x: 900, y: 100}}
    on:click={discard.bind(this, box)}
    on:introstart={() => console.log("Adding the elements starts")}
    on:introend={() => console.log("Adding the elements ends")}
    on:outrostart={() => console.log("Removing the elements starts")}
    on:outroend={() => console.log("Removing the elements ends")}
    animate:flip
  >
    {box}
  </div>
{/each}



<style>

div {
  width: 10rem;
  height: 10rem;
  background: hsl(130, 2%, 80%);
  margin: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 8px hsla(0, 4%, 5%, 0.26);
  border-radius: 4px;
}

</style>
