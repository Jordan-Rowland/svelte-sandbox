<script>
  // Use export to set from the outside
  export let userName;
  export let jobTitle = "Job Title";
  export let description = "A Short Description";
  export let image;
</script>


<div>
  <header>
  <div class="{image ? "" : "thumbnail-default"}">
  <!-- Shorcut for conditional class syntax: -->
  <!-- class:((class name))={contition} -->
  <!-- <div class:thumbnail-default={!image}> -->
    <img src="{image}" alt="image of user">
  </div>
  <div>
    <h1>{userName}</h1>
    <h2>{jobTitle}</h2>
  </div>
  </header>
  <div>
    <p>{description}</p>
  </div>
</div>

<style>

.thumbnail-default {
    background: #ccc;
}

</style>

