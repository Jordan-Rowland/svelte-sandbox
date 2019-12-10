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
<input type="" name="description" bind:value={description}>
<input type="" name="image" bind:value={image}>


<Hello name={name}/>

<ContactCard
  userName={name}
  jobTitle={title}
  description={description}
  image={image}/>

<style>

</style>


