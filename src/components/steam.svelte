<script lang="ts">
let innerWidth;
$: totalSteam = Math.floor(innerWidth/100);
</script>
<svelte:window bind:innerWidth={innerWidth}/>
  <div id="steamContainer" style="--totalSteam:{totalSteam};">
    
	{#each {length:totalSteam} as item, index}
        {#if (index%2) == 1 }
            <div class="fog grpA" style="--fog-position:{index+1}"></div>
        {:else}
            <div class="fog" style="--fog-position:{index+1}"></div>
        {/if}
	{/each}
  </div>

  
<style type="text/scss">
#steamContainer {
    --fog-position: 0;
}
#steamContainer{
    width: 100%;
    height: 100%;
    z-index: 0;
}
.fog{
  height: 60%;
  position: absolute;
  bottom: 0;
  box-shadow: 0 0 160px 50px white;
  left: calc((100% / ((var(--totalSteam) + 1))) * var(--fog-position));
}
.fog.grpA{
  animation: fog-moving-grpA 10s calc(var(--fog-position) * 0.5s) ease-in-out infinite;
}
@keyframes fog-moving-grpA{
  0%{
      bottom: 0;
  }
  50%{
      bottom: 50%;
  }
  100%{
      bottom: 0;
  }
}
// @keyframes fog-moving-grpB{
//   10%{
//       bottom: 50%;
//   }
//   50%{
//       bottom: 0%;
//   }
//   100%{
//       bottom: 50%;
//   }
// }
</style>