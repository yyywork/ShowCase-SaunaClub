<script lang="ts">
import { onMount } from 'svelte';
import {
    Header,
    HeaderNav,
    HeaderNavItem,
    Grid, Row, Column,
    Tabs, Tab, TabContent,
    Form, TextInput,
    FormGroup,
    TextArea, Select,
    SelectItem, Button, 
    SideNav, SideNavItems,
    SideNavLink, Tooltip
  } from "carbon-components-svelte";
// import "carbon-components-svelte/css/white.css";
import Steam from "./components/steam.svelte";
import Attr from "./attr.svelte";
import Stone from "./components/stoneBorder.svelte";

onMount(() => {
  getTop('p1',y);
  getTop('p2',y);
  getTop('p3',y);
  getTop('p4',y);
});

let isSideNavOpen:boolean = true;
let y: number,totalH: number, totalW: number;

function getTop(p: string,y: number){
  let ph = document.getElementById(p);
  let pTop = null
  if(ph)
    pTop = ph.getBoundingClientRect().top;
  return pTop
}

function getColor(pTop: number,which: string){
  let result: number = 0;
  if(pStop[which])
    return 1;
  if(pTop>(totalH/2)){
    result = Math.min(pTop/totalH,0.5);
  }else{
    result = Math.min((1 - pTop/totalH),1);
  }
  return result;
}
function getPos(pTop: number,which: string){
  let result = 0;
  if(pStop[which])
    return 0+"%";
  if(pTop>(totalH/2)){
    result = Math.min(pTop/totalH * 100,pTop/totalH * 100) * -1;
  }else{
    result = Math.max(pTop/totalH * 100 - 20,0) * -1;
  }
  if(result === 0)
    pStop[which] = true
  return result+'%';
}
let pStop = {p1:false,p2:false,p3:false,p4:false}
$: p1Top = getTop('p1',y);
$: p2Top = getTop('p2',y);
$: p3Top = getTop('p3',y);
$: p4Top = getTop('p4',y);

</script>

<svelte:window bind:scrollY={y} bind:innerHeight={totalH} bind:innerWidth={totalW}/>

<Header company="Sauna Club" platformName="P" bind:isSideNavOpen>
  <HeaderNav>
    <HeaderNavItem href="#p1" text="Introduction" />
    <HeaderNavItem href="#p2" text="Advantages" />
    <HeaderNavItem href="#p3" text="Types" />
    <HeaderNavItem href="#p4" text="Contact us" />
  </HeaderNav>
</Header>
<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink href="#p1" text="Introduction" />
    <SideNavLink href="#p2" text="Advantages" />
    <SideNavLink href="#p3" text="Types" />
    <SideNavLink href="#p4" text="Contact us" />
  </SideNavItems>
</SideNav>
<main>
<div id="banner">
  <Steam />
  <div id="floatingText">Sauna</div>
</div>
<div id="contentContainer">
  <Stone />
  <Steam />
  <Grid noGutter={false} style="overflow-x: hidden;">
    <Row as let:props class="twoParts" style="--odd-pos:{getPos(p1Top,'p1')};--odd-color:{getColor(p1Top,'p1')};">
      <div {...props}>
        <a id="p1" class="anchor" />
        <Column lg={6} md={6} sm={4} class="imgPart">
          <img src="../assets/images/relax/whatissauna.jpg" alt="What is sauna?"/>
        </Column>
        <Column lg={0} md={6} sm={4} class="textPart">
          <h2>What is Sauna?</h2>
          A sauna , or sudatory, is a small room or building designed as a place to experience dry or wet heat sessions, or an establishment with one or more of these facilities. The steam and high heat make the bathers perspire. A thermometer in a sauna is typically used to measure heat, a hygrometer can be used to measure levels of humidity or steam. 
        </Column>
        <Column lg={6} md={0} sm={0} class="textPart bigScreen">
          <h2>What is Sauna?</h2>
          A sauna , or sudatory, is a small room or building designed as a place to experience dry or wet heat sessions, or an establishment with one or more of these facilities. The steam and high heat make the bathers perspire. A thermometer in a sauna is typically used to measure heat, a hygrometer can be used to measure levels of humidity or steam. 
        </Column>
      </div>
    </Row>
    <Row class="twoParts" style="--even-pos:{getPos(p2Top,'p2')};--even-color:{getColor(p2Top,'p2')};">
      <a id="p2" class="anchor"></a>
      <Column lg={6} md={0} sm={0} class="textPart bigScreen">
        <h2>How good is Sauna?</h2>
        Increased frequency of sauna bathing is associated with a reduced risk of sudden cardiac death, cardiovascular disease, and all-cause mortality. Its usage is also associated with lower markers of inflammation in the blood and a reduced risk of high blood pressure. In addition, it is associated with a decreased risk of pneumonia and may temporarily relieve symptoms of the common cold.It is also associated with a reduced risk of dementia and Alzheimer's disease.
      </Column>
      <Column lg={6} md={6} sm={4} class="imgPart">
          <img src="../assets/images/relax/barrel.jpg" alt="How good is sauna?" />
        </Column>
        <Column lg={0} md={6} sm={4} class="textPart">
          <h2>How good is Sauna?</h2>
          Increased frequency of sauna bathing is associated with a reduced risk of sudden cardiac death, cardiovascular disease, and all-cause mortality. Its usage is also associated with lower markers of inflammation in the blood and a reduced risk of high blood pressure. In addition, it is associated with a decreased risk of pneumonia and may temporarily relieve symptoms of the common cold.It is also associated with a reduced risk of dementia and Alzheimer's disease.
        </Column>
    </Row>
    <Row class="twoParts" style="--odd-pos:{getPos(p3Top,'p3')};--odd-color:{getColor(p3Top,'p3')};">
      <a id="p3" class="anchor"></a>
      <Column lg={6} md={6} sm={4} class="imgPart">
          <img src="../assets/images/relax/smoke.jpg" alt="How to sauna?" />
        </Column>
        <Column lg={0} md={6} sm={4} class="textPart">
          <h2>How to Sauna?</h2>
          Increased frequency of sauna bathing is associated with a reduced risk of sudden cardiac death, cardiovascular disease, and all-cause mortality. Its usage is also associated with lower markers of inflammation in the blood and a reduced risk of high blood pressure. In addition, it is associated with a decreased risk of pneumonia and may temporarily relieve symptoms of the common cold.It is also associated with a reduced risk of dementia and Alzheimer's disease.
        </Column>
        <Column lg={6} md={0} sm={0} class="textPart bigScreen">
          <Tabs>
            <Tab label="Smoke" />
            <Tab label="Heat storage" />
            <Tab label="Continuous fire" />
            <Tab label="Electric stove" />
            <div slot="content">
              <TabContent>
                Smoke sauna (Finnish savusauna, Estonian suitsusaun, Võro savvusann) is one of the earliest forms of the sauna. It is simply a room containing a pile of rocks, but without a chimney. A fire is lit directly under the rocks and after a while the fire is extinguished. The heat retained in the rocks, and the earlier fire, becomes the main source for heating the sauna.
                </TabContent>
              <TabContent>
                The smoke-sauna stove is also used with a sealed stone compartment and chimney (a heat storage-stove) which eliminates the smoke odour and eye irritation of the smoke sauna. A heat storage stove does not give up much heat in the sauna before bathing since the stone compartment has an insulated lid. When the sauna bath is started and the löyly shutter opened a soft warmth flow into the otherwise relatively cold (60 °C; 140 °F) sauna.
                </TabContent>
              <TabContent>
                A continuous fire stove, instead of stored heat, is a relatively recent invention. There is a firebox and a smokestack, and stones are placed in a compartment directly above the firebox. It takes a shorter time to heat than the heat-storage sauna, about one hour. A fire-heated sauna requires manual labor in the form of maintaining the fire during bathing; the fire can also be seen as a hazard.
                </TabContent>
              <TabContent>
                The most common modern sauna types are those with electric stoves. The stones are heated up and kept on temperature using electric heating elements. There is a thermostat and a timer (typically with eight hours' maximum delay time, followed by one hour's continuous heating time) on the stove. This type of heating is generally used only in urban saunas.
                </TabContent>
            </div>
          </Tabs>
          
        </Column>
    </Row>
    <Row class="twoParts" style="--even-pos:{getPos(p4Top,'p4')};--even-color:{getColor(p4Top,'p4')};">
      <a id="p4" class="anchor"></a>
      <Column lg={6} md={6} sm={12}>
        <div class="formTitle">Contact Us</div>
        <Form>
          <FormGroup legendText="What is your name?" noMargin>
            <TextInput placeholder="Enter name here..." pattern="{String.raw`.+`}" type="text" required />
          </FormGroup>
          <FormGroup legendText="What is your email?" noMargin>
            <TextInput placeholder="Enter email here..." type="email" required />
          </FormGroup>
          <FormGroup legendText="What is it about?" noMargin>
            <Select noLabel selected="">
              <SelectItem value="sauna_service" text="Sauna Service" />
              <SelectItem value="locations" text="Locations" />
              <SelectItem value="site" text="Official Site" />
              <SelectItem value="other" text="Other" />
            </Select>
          </FormGroup>
          
          <FormGroup legendText="What is your questions?" noMargin>
            <TextArea required placeholder="questions, comment or anything you want to speak to me..." />
          </FormGroup>
          <FormGroup id="formFooter">
            <Button type="submit">Submit</Button>
          </FormGroup>
        </Form>
      </Column>
    </Row>
    </Grid>
    <div style="display:flex;justify-content: space-between;">
      <Tooltip direction="top" triggerText="Attribute">
        <p>
          <Attr />
        </p>
      </Tooltip>
      <div>Copyright © 2021 Ying</div>
    </div>
  </div>
</main>

<style type="text/scss" global>
  @import './app.scss';

  @mixin vertical-align-mixin{
    display: flex;
    justify-content: center;
  }

  $content-font-size: 19px;
  $content-bgcolor: saddlebrown;

  :root{
    --even-pos: 0;
    --even-color: 1;
    --odd-pos: 0;
    --odd-color: 1;
  }
  main{
      width: 100%;
      height: 100%;
  }
  #banner{
      background: url(../assets/images/relax/sauna.jpg);
      background-size: cover;
      background-repeat: no-repeat;
      width: 100%;    
      background-position: center;
      height: 75%;
      position: relative;
  }
  #contentContainer{
    width: 100%;
    min-height: auto;
    @include vertical-align-mixin;
    flex-direction: column;
    background: linear-gradient(180deg, rgba(242,163,86,0.2945553221288515) 0%, rgba(242,163,86,1) 100%);
    position: relative;
  }
  .twoParts{
    @include vertical-align-mixin;
    margin-top: 20vh;
    align-items: center;
    z-index: 1;
    position: relative;
    width: 100%;
  }
  .twoParts:nth-child(even) .imgPart{
    text-align: right;
  }
  .twoParts:nth-child(even){
    opacity: var(--even-color);
    right: var(--even-pos);
  }
  .twoParts:nth-child(odd){
    opacity: var(--odd-color);
    left: var(--odd-pos);
  }
  .oddTwoPartsFar{
    opacity: 0.5;
    left: -50%;
  }
  .oddTwoPartsNear{
    opacity: 1;
    left: 0;
  }
  .imgPart{  
    @include vertical-align-mixin;
    position: relative;
    padding: 25px;
  }
  .textPart{
    min-height: 30vh;
    padding: 25px;
    line-height: $content-font-size * 1.2;
    font-size: $content-font-size;
    border-radius: 25px;
    color: $content-bgcolor;
    z-index: 1;
    text-align: left;
  }
  .textPart.bigScreen{
    backdrop-filter: brightness(0.95);
    box-shadow: 5px 5px 10px 1px grey, inset 5px 5px 25px -2px white;
  }
  .imgPart img{
    max-width: 400px;
    width: 100%;
    // height: 100%;
    filter: drop-shadow(0px 10px 16px grey);
    border-radius: 25px;
    // clip-path: polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%);
  }
  #formFooter{
    display: flex;
    justify-content: end;
  }
  button{
    text-align: center
  }
  .anchor{
    position: absolute;
    top: 0;
  }
  .formTitle{
    padding: 15px 0px;
    font-weight: bold;
    font-size: 1.2em;
  }
  #floatingText{
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 100px;
    transform: translate(-50%, -50%);
    color: rgba(0,0,0,0);
    animation: floatingTextAnim 10s 1s ease-in-out infinite;
  }
@keyframes floatingTextAnim{
  0%{
    text-shadow: 0px 0px 0px #b38c70;
  }
  50%{
    text-shadow: 0px 0px 30px #b38c70;
  }
  100%{
    text-shadow: 0px 0px 0px #b38c70;
  }
}
</style>