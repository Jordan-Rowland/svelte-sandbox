<script>
  // Use export to set from the outside
  export let userName;
  export let jobTitle = "Job Title";
  export let description = "A Short Description";
  export let image;
</script>

<style>

</style>



<div>
  <header>
  <div>
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
