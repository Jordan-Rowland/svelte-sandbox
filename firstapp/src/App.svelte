<script>
/* jshint esversion: 6 */
  // import { writable } from 'svelte/store';

    import ContactCard from "./ContactCard.svelte";
    import Hello from './Hello.svelte';

    let name = 'Judy';
    let title;
    let description;
    let image;
</script>

<input type="" name="name" bind:value={name}>
<input type="" name="title" bind:value={title}>
<input type="" bind:value={description}>
<input type="" bind:value={image}>


<Hello name={name}/>


<!-- Name of valiable in component is name of attribute -->
<!-- Can also use 'object destructuring syntax to
    make the attribute definition more concise, as
    shown in 'description' and 'image' below -->
<ContactCard
    userName={name}
    jobTitle={title}
    {description}
    {image}/>

<style>


</style>


