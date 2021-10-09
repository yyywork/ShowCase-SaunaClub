<script lang="ts">
let innerWidth;

$: totalStone = Math.floor(innerWidth/40);
</script>

<svelte:window bind:innerWidth={innerWidth}/>
<div class="stoneBorder">
	{#each {length:totalStone} as item, index}
    <div class="stone" style="--stoneSpacing-x:-{index%3 * 49}px;--stoneSpacing-y:{(Math.floor(index/3)%3) * 76}px;"></div>
	{/each}
</div>

<style type="text/scss">

.stoneBorder {
  display: inline-block;
  height: 50px;
  width: 100%;    
  position: absolute;
  top: -2.5vh;
  white-space: nowrap;
  overflow-x: hidden;
}
.stone{
  display: inline-block;
  background-position-x: var(--stoneSpacing-x);
  background-position-y: var(--stoneSpacing-y);
  width: 40px;
  height: 32px;
  background-image: url(/assets/images/relax/stone.png);
}
</style>