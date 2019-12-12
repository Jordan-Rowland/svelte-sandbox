<script>

    export let courseGoal;

</script>


<input type="text" bind:value={courseGoal}>
{#if courseGoal}
<h1 class:exclaimed={courseGoal.includes("!")}>{courseGoal}</h1>
{:else}
<h2>No goal defined!</h2>
{/if}



<style>

.exclaimed {
    color: red;
}

</style>
