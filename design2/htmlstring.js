let html_1 = `
<div class="start_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:16px; margin-bottom:4px;">Keyframe 1</strong>
    <span style="font-size:14px; color:#ffffff; margin-bottom:6px;max-width: 250px;"></span>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">X position:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number"
	    max="1920"	
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:75px; max-width:75px; padding:4px; border-radius:6px;"
        >
    </div>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Y position:</strong>
        <input 
            id="input_dynamic_box_1"
            type="number"
	    max="1920"
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:75px; max-width:75px; padding:4px; border-radius:6px;"
        >
    </div>
</div>
`;

let html_2 = `
<div class="end_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:16px; margin-bottom:4px;">Keyframe 2</strong>
    <span style="font-size:12px;font-style: italic; color:#ffffff; margin-bottom:6px;max-width: 250px;">After interpolation, the value of this keyframe will remain constant over timeline until the next keyframe.</span>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">X position:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number"
	    max="1920"	
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:65px; max-width:65px; padding:4px; border-radius:6px;"
        >
    </div>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Y position:</strong>
        <input 
            id="input_dynamic_box_1"
            type="number"
	    max="1920"	
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:65px; max-width:65px; padding:4px; border-radius:6px;"
        >
    </div>
</div>
`;

let html_3 = `
<div class="start_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:16px; margin-bottom:4px;">Keyframe 1</strong>
    <span style="font-size:12px; color:#ffffff; margin-bottom:6px;max-width: 250px;"></span>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Value:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number" 
            style="flex:1; min-width:65px; max-width:65px; padding:4px; border-radius:6px;"
        >
    </div> 
</div>
`;

 

let html_4 = `
<div class="end_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:16px; margin-bottom:4px;">Keyframe 2</strong>
    <span style="font-size:12px;font-style: italic; color:#ffffff; margin-bottom:6px;max-width: 250px;">After interpolation, the value of this keyframe will remain constant over timeline until the next keyframe.</span>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Value:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number" 
            style="flex:1; min-width:65px; max-width:65px; padding:4px; border-radius:6px;"
        >
    </div> 
</div>
`;


//layer_order
let html_5 = `
<div class="start_end_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:16px; margin-bottom:4px;">Hold keyframe</strong>
    <span style="font-size:12px; color:#ffffff; margin-bottom:6px;max-width: 250px;">Holds an item property's value constant until the next keyframe</span>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Value:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number"
	    max="200"	
	    oninput="if (this.value > 200) this.value = 200;"
            style="flex:1; min-width:65px; max-width:65px; padding:4px; border-radius:6px;"
        >
    </div> 
</div>
`;

 
//item_reveal
const html_6 = `
<div class="start_type" style="display:flex; flex-direction:column; align-items:center; gap:8px; width:100%;">
    <strong style="font-size:16px; margin-bottom:4px;">Hold keyframe</strong>
    <span style="font-size:12px; color:#ffffff; margin-bottom:8px;max-width: 250px;">Holds an item property's value constant until the next keyframe</span>
    <span style="font-size:12px;font-style: italic; color:#ffffff; margin-bottom:8px;max-width: 250px;">When an external item overlaps with the current one, the overlapping region will become visible or hidden depending on the selected option. The external item must have a higher layer-order than the current one.</span>

    <select id="selector_dinamico" class="dropdown_selector" style="
      width:100%;
      padding:10px 12px;
      font-size:14px;
      border-radius:10px;
      margin-bottom:10px;	
      border:1px solid rgba(255,255,255,0.7);
      background:linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(210,240,255,0.9) 50%, rgba(180,220,255,0.95) 100%);
      box-shadow:0 2px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.8);
      backdrop-filter:blur(4px);
      appearance:none;
      cursor:pointer;
    ">
      <option value="" disabled selected hidden>Select value</option>
      <option value="off">off</option>
      <option value="show">from hidden to visible</option>
      <option value="hide">from visible to hidden</option>	
    </select>
</div>
`;
 
 
//filename
const html_7 = `
<div class="start_type" style="display:flex; flex-direction:column; align-items:center; gap:8px; width:100%;">
    <strong style="font-size:16px; margin-bottom:4px;">Hold keyframe</strong>
    <p style="display: block;font-size:12px; color:#ffffff; margin-bottom:8px;max-width: 250px;">Holds an item property's value constant until the next keyframe</p>

    <select id="selector_dinamico" class="dropdown_selector" style="
      width:100%;
      padding:10px 12px;
      font-size:14px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,0.7);
      background:linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(210,240,255,0.9) 50%, rgba(180,220,255,0.95) 100%);
      box-shadow:0 2px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.8);
      backdrop-filter:blur(4px);
      appearance:none;
      cursor:pointer;
    ">
      <option value="" disabled selected hidden>Select file</option> 
    </select>
    
    <button 
  id="btn_select_interval"
  style="
    display: none;
    margin-top: 12px;
    padding: 10px 18px;
    font-size: 14px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.7);
    background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(210,240,255,0.85) 45%, rgba(180,220,255,0.9) 100%);
    box-shadow: 0 2px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.8);
    backdrop-filter: blur(4px);
    cursor: pointer;
  "
>
  Select interval
</button>
</div>
`;


//filename (texto)
let html_8 = `
<div class="start_end_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:16px; margin-bottom:4px;">Hold keyframe</strong>
    <span style="font-size:12px; color:#ffffff; margin-bottom:12px;max-width: 250px;">Holds a text value constant until the next keyframe</span>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Text value:</strong>
        <input 
            id="input_dynamic_box_0"
            type="text"
            style="flex:1; min-width:65px; width:120px; padding:4px; border-radius:6px;"
        >
    </div> 
</div>
`;

 
 
//bounce 
let html_9 = `
<div class="start_end_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:16px; margin-bottom:4px;">Bounce parameters</strong>
    <span style="font-size:12px;font-style: italic; color:#ffffff; margin-bottom:12px;">The width of the box measures the bounce time with cushioning.</span>
     
    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Amplitude:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number"
	    max="10"	
	    oninput="if (this.value > 10) this.value = 10;"
            style="flex:1; min-width:65px; max-width:65px; padding:4px; border-radius:6px;"
        >
    </div>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Number oscillations:</strong>
        <input 
            id="input_dynamic_box_1"
            type="number"
	    max="10"	
	    oninput="if (this.value > 10) this.value = 10;"
            style="flex:1; min-width:65px; max-width:65px; padding:4px; border-radius:6px;"
        >
    </div>
    <span style="font-size:12px;font-style: italic; color:#ffffff; margin-bottom:12px;">The bounce segments always go at the end of each movement segment.</span>

</div>
`;

let html_item_configuration = `
<div class="other_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:16px; margin-bottom:4px;">Item settings</strong> 

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;"> 
        <button class="delete_item" id="delete_item" style="
      width:100%;
      padding:10px 12px;
      font-size:14px;
      font-weight: bold;
      color:rgb(255,255,255);
      border-radius:10px;
      border:1px solid rgba(200, 50, 50,0.7);
      background: linear-gradient(
    180deg, 
    rgba(226, 52, 69, 0.7) 0%,   
    rgba(226, 52, 69, 0.9) 50%,   
    rgba(226, 52, 69, 0.95) 100%    
); 
      backdrop-filter:blur(4px);
      appearance:none;
      cursor:pointer;
    ">Delete current item</button> 
    </div> 
</div>
`;


let html_create_item = `
<div class="other_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
     
        <h3>Este nombre lo usarás luego</h3>
        <div class="error-message" id="error-message"></div>

	<div class="custom-dropdown" id="custom-dropdown">
           <div class="dropdown-selected" id="dropdown-selected">Select option</div>
    		<ul class="dropdown-options" id="dropdown-options">
        		<li data-value="image">image</li>
        		<li data-value="video">video</li>
        		<li data-value="audio">audio</li>
        		<li data-value="text">text</li>
    		</ul>
	</div>

        <input type="text" id="custom-name-input" placeholder="Nombre personalizado..." maxlength="15">
        <div>
            <button class="btn-confirm" id="confirm-name">Confirmar</button>
            <button class="btn-cancel" id="cancel-name">Cancelar</button>
        </div> 
</div>
`; 


let html_finish = `
<div class="other_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:16px; margin-bottom:4px;">RENDER VIDEO</strong>
    <span id="error_subidas_pendientes" style="background-color:rgb(200,20,10);padding:8px;border-radius:8px;font-size:12px; color:#ffffff; margin-bottom:12px;max-width: 290px;">There are still files that have not finished uploading.</span>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">

<ul id="pendientes_de_subir" style="
  width:100%;
  max-height:140px;
  overflow-y:auto;
  margin:0;
  padding:8px 12px 8px 28px; /* 👈 espacio para bullets */
  list-style-position: inside; /* 👈 bullets dentro */
  border-radius:10px;
  border:1px solid rgba(180,180,180,0.4);
  background:rgba(255,255,255,0.08);
">
     
  </ul>

        <button class="update_video" id="update_video" style="
  width:100%;
  padding:10px 12px;
  font-size:14px;
  font-weight:bold;
  color:rgb(255,255,255);
  border-radius:10px;
  border:1px solid rgba(50, 180, 90, 0.7);
  background: linear-gradient(
    180deg, 
    rgba(60, 190, 100, 0.7) 0%,   
    rgba(50, 170, 90, 0.9) 50%,   
    rgba(40, 150, 80, 0.95) 100%    
  );
  backdrop-filter:blur(4px);
  appearance:none;
  cursor:pointer;
">
  Render
</button>
   
    </div> 
</div>
`;




let html_new_project = `
<div class="other_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:16px; margin-bottom:4px;">New project</strong>
    <span style="background-color:rgb(40,40,120);padding:8px;border-radius:8px;font-size:14px; color:#ffffff; margin-bottom:12px;max-width: 290px;">When a new project is created, changes in the current one will be saved automatically if the user is logged in.</span>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">

 

        <button class="create_new_project" id="create_new_project" style="
  width:100%;
  padding:10px 12px;
  font-size:14px;
  font-weight:bold;
  color:rgb(255,255,255);
  border-radius:10px;
  border:1px solid rgba(50, 180, 90, 0.7);
  background: linear-gradient(
    180deg, 
    rgba(60, 190, 100, 0.7) 0%,   
    rgba(50, 170, 90, 0.9) 50%,   
    rgba(40, 150, 80, 0.95) 100%    
  );
  backdrop-filter:blur(4px);
  appearance:none;
  cursor:pointer;
">
  Create new project
</button>
  
    </div> 
</div>
`;

 
  

html_new_project = `
<div class="other_type" style="
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:8px;
  width:180px;  
">

  <strong style="font-size:18px;">Select ratio</strong>

  <!-- CONTENEDOR DE RATIOS -->
  <div id="ratio_container" style="
    display:flex;
    flex-wrap:wrap;
    gap:5px;
    width:100%;
    justify-content:center;
    align-items:flex-start;
  ">

    <!-- CARD 16:9 -->
    <div class="ratio-card selected" data-ratio="16:9" style="
      cursor:pointer;
      flex:1 1 75px;
      max-width:95px;
      min-width:75px;
      padding:4px;
      border-radius:6px;
      border:1px solid white;
      background:rgba(196,205,208,0.35);
      display:flex;
      flex-direction:column;
      gap:2px;
      box-sizing:border-box;
      align-items:center;
    ">
      <div style="
        width:100%;
        height:50px;
        max-width: calc(50px * 16 / 9);
        border:1px solid white;
        border-radius:4px;
      "></div>
      <span style="font-size:14px; text-align:center;">16:9</span>
    </div>

    <!-- CARD 9:16 -->
    <div class="ratio-card" data-ratio="9:16" style="
      cursor:pointer;
      flex:1 1 75px;
      max-width:95px;
      min-width:75px;
      padding:4px;
      border-radius:6px;
      border:1px solid white;
      background:transparent;
      display:flex;
      flex-direction:column;
      gap:2px;
      box-sizing:border-box;
      align-items:center;
    ">
      <div style="
        height:50px;
        width: calc(50px * 9 / 16);
        border:1px solid white;
        border-radius:4px;
      "></div>
      <span style="font-size:14px; text-align:center;">9:16</span>
    </div>

  </div>

  <span style="
    background-color:transparent;
    padding:5px;
    border-radius:6px;
    font-size:12px;
    color:#ffffff;
    max-width:250px;
    text-align:center;
  ">
    Changes in the current project will be saved automatically if the user is logged in.
  </span>

  <button class="create_new_project" id="create_new_project" style="
  width:100%;
  padding:10px 12px;
  font-size:14px;
  font-weight:bold;
  color:rgb(255,255,255);
  border-radius:10px;
  border:1px solid rgba(50, 180, 90, 0.7);
  background: linear-gradient(
    180deg, 
    rgba(60, 190, 100, 0.7) 0%,   
    rgba(50, 170, 90, 0.9) 50%,   
    rgba(40, 150, 80, 0.95) 100%    
  );
  backdrop-filter:blur(4px);
  appearance:none;
  cursor:pointer;
">
  Create new project
</button>

</div>
`;









let html_new_image = `
<div class="other_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:16px; margin-bottom:4px;">New Image</strong>
    <span style="background-color:rgb(40,40,120);padding:8px;border-radius:8px;font-size:14px; color:#ffffff; margin-bottom:12px;max-width: 290px;"> description</span>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">

 

        <button class="create_new_image" id="create_new_image" style="
  width:100%;
  padding:10px 12px;
  font-size:14px;
  font-weight:bold;
  color:rgb(255,255,255);
  border-radius:10px; 
">
  Create image
</button>
  
    </div> 
</div>
`;




let html_log_in = `
<div class="other_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:18px; margin-bottom:4px;">Log in</strong>
    <span style="background-color:rgb(60,140,40);padding:8px;border-radius:8px;font-size:16px; color:#ffffff; margin-bottom:12px;max-width: 290px;">Releasing on 01/2026</span>
 
</div>
`;

let html_saved_projects = `
<div class="other_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:18px; margin-bottom:4px;">Saved projects</strong>
    <span style="background-color:transparent;padding:8px;border-radius:8px;font-size:16px; color:#ffffff; margin-bottom:12px;max-width: 290px;">Login is required to proceed.</span>

 
</div>
`;

let html_video_tutorials = `
<div class="other_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:18px; margin-bottom:4px;">Video tutorials</strong>
    <span style="background-color:transparent;padding:8px;border-radius:8px;font-size:16px; color:#ffffff; margin-bottom:12px;max-width: 290px;">Login is required to proceed.</span>
 
</div>
`;

let html_upgrade_plan = `
<div class="other_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:18px; margin-bottom:4px;">Upgrade plan</strong>
    <span style="background-color:transparent;padding:8px;border-radius:8px;font-size:16px; color:#ffffff; margin-bottom:12px;max-width: 290px;">Login is required to proceed.</span>
<!--
    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;"> 
    </div> 
-->
</div>
`;

let html_login_required = `
<div class="other_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;"> 
    <span style="background-color:transparent;padding:8px;border-radius:8px;font-size:16px; color:#ffffff; margin-bottom:12px;max-width: 290px;">Login is required to proceed.</span>
<!--
    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;"> 
    </div> 
-->
</div>
`;




let dic_dynamic_options={};

function ensure(obj, key) {
    if (!obj[key]) obj[key] = {};
    return obj[key];
}

dic_dynamic_options.text ??= {};
dic_dynamic_options.text.filename ??= {};
dic_dynamic_options.text.position ??= {};
dic_dynamic_options.text.scale ??= {};
dic_dynamic_options.text.rotation ??= {};
dic_dynamic_options.text.opacity ??= {};

dic_dynamic_options.text.layer_order ??= {};
dic_dynamic_options.text.item_reveal ??= {};
dic_dynamic_options["text"]["filename"]["value"]=html_8; 
dic_dynamic_options["text"]["position"]["keyframe_1"]=html_1;
dic_dynamic_options["text"]["position"]["keyframe_2"]=html_2;
dic_dynamic_options["text"]["position"]["bounce_parameters"]=html_9;

dic_dynamic_options["text"]["scale"]["keyframe_1"]=html_3;
dic_dynamic_options["text"]["scale"]["keyframe_2"]=html_4;
dic_dynamic_options["text"]["scale"]["bounce_parameters"]=html_9;
dic_dynamic_options["text"]["rotation"]["keyframe_1"]=html_3;
dic_dynamic_options["text"]["rotation"]["keyframe_2"]=html_4;
dic_dynamic_options["text"]["rotation"]["bounce_parameters"]=html_9;
dic_dynamic_options["text"]["opacity"]["keyframe_1"]=html_3;
dic_dynamic_options["text"]["opacity"]["keyframe_2"]=html_4;
dic_dynamic_options["text"]["opacity"]["bounce_parameters"]=html_9;

dic_dynamic_options["text"]["layer_order"]["value"]=html_5;
dic_dynamic_options["text"]["item_reveal"]["value"]=html_6;




dic_dynamic_options.image ??= {};
dic_dynamic_options.image.filename ??= {};
dic_dynamic_options.image.position ??= {};
dic_dynamic_options.image.scale ??= {};
dic_dynamic_options.image.rotation ??= {};
dic_dynamic_options.image.opacity ??= {};
dic_dynamic_options.image.layer_order ??= {};
dic_dynamic_options.image.item_reveal ??= {};
dic_dynamic_options["image"]["filename"]["value"]=html_7;  
dic_dynamic_options["image"]["position"]["keyframe_1"]=html_1;
dic_dynamic_options["image"]["position"]["keyframe_2"]=html_2;
dic_dynamic_options["image"]["position"]["bounce_parameters"]=html_9;

dic_dynamic_options["image"]["scale"]["keyframe_1"]=html_3;
dic_dynamic_options["image"]["scale"]["keyframe_2"]=html_4;
dic_dynamic_options["image"]["scale"]["bounce_parameters"]=html_9;
dic_dynamic_options["image"]["rotation"]["keyframe_1"]=html_3;
dic_dynamic_options["image"]["rotation"]["keyframe_2"]=html_4;
dic_dynamic_options["image"]["rotation"]["bounce_parameters"]=html_9;
dic_dynamic_options["image"]["opacity"]["keyframe_1"]=html_3;
dic_dynamic_options["image"]["opacity"]["keyframe_2"]=html_4;
dic_dynamic_options["image"]["opacity"]["bounce_parameters"]=html_9;

dic_dynamic_options["image"]["layer_order"]["value"]=html_5;
dic_dynamic_options["image"]["item_reveal"]["value"]=html_6;






dic_dynamic_options.video ??= {};
dic_dynamic_options.video.filename ??= {};
dic_dynamic_options.video.position ??= {};
dic_dynamic_options.video.scale ??= {};
dic_dynamic_options.video.rotation ??= {};
dic_dynamic_options.video.opacity ??= {};

dic_dynamic_options.video.layer_order ??= {};
dic_dynamic_options.video.item_reveal ??= {};
dic_dynamic_options["video"]["filename"]["value"]=html_7; 
dic_dynamic_options["video"]["position"]["keyframe_1"]=html_1;
dic_dynamic_options["video"]["position"]["keyframe_2"]=html_2;
dic_dynamic_options["video"]["position"]["bounce_parameters"]=html_9;

dic_dynamic_options["video"]["scale"]["keyframe_1"]=html_3;
dic_dynamic_options["video"]["scale"]["keyframe_2"]=html_4;
dic_dynamic_options["video"]["scale"]["bounce_parameters"]=html_9;
dic_dynamic_options["video"]["rotation"]["keyframe_1"]=html_3;
dic_dynamic_options["video"]["rotation"]["keyframe_2"]=html_4;
dic_dynamic_options["video"]["rotation"]["bounce_parameters"]=html_9;
dic_dynamic_options["video"]["opacity"]["keyframe_1"]=html_3;
dic_dynamic_options["video"]["opacity"]["keyframe_2"]=html_4;
dic_dynamic_options["video"]["opacity"]["bounce_parameters"]=html_9;

dic_dynamic_options["video"]["layer_order"]["value"]=html_5;
dic_dynamic_options["video"]["item_reveal"]["value"]=html_6;






dic_dynamic_options.audio ??= {};
dic_dynamic_options.audio.filename ??= {};
dic_dynamic_options["audio"]["filename"]["value"]=html_7; 
 

dic_dynamic_options.scene ??= {};
dic_dynamic_options.scene.camera_position ??= {};
dic_dynamic_options.scene.camera_zoom ??= {};
dic_dynamic_options["scene"]["camera_position"]["keyframe_1"]=html_1;
dic_dynamic_options["scene"]["camera_position"]["keyframe_2"]=html_2;
dic_dynamic_options["scene"]["camera_position"]["bounce_parameters"]=html_9;
dic_dynamic_options["scene"]["camera_zoom"]["keyframe_1"]=html_3;
dic_dynamic_options["scene"]["camera_zoom"]["keyframe_2"]=html_4;
dic_dynamic_options["scene"]["camera_zoom"]["bounce_parameters"]=html_9;



dic_dynamic_options["general"]=html_3; 



//poner valor inicial a item_reveal
//const lista_inputs_and_selects = obtenerInputsYSelects(html_1);
  //console.log("lista_inputs_and_selects: ",lista_inputs_and_selects);


function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.toggle('active');
}

function cargarHeader() {
    const contenedor = document.getElementById('general-header');
    if (!contenedor) return;

    //contenedor.style.display="block";	

    contenedor.innerHTML = `
        <div class="header-menu">
            <div class="logo-container-menu">
                <img src="title.png" alt="Logo" class="logo-menu">
                <p style="font-size:16px;">Manycaptions</p>
            </div>
            <div class="hamburger">&#9776;</div>
        </div>

        <div class="side-menu" id="sideMenu">
            <nav>
                <ul> 
                    <li><a id="li-home" href="/">Home</a></li>   
                    <li><a id="li-tutorial" href="https://manycaptions.com/es/subtitulos-automaticos#description-container">Features</a></li>
                    <li><a id="li-upgrade-plan" href="https://manycaptions.com/es/subtitulos-automaticos#clip-container">How to use</a></li>   
                    <li><a id="li-login" href="https://manycaptions.com/es/subtitulos-automaticos#description-container-questions">FAQ</a></li>
                </ul>
            </nav>
        </div>
    `;

    // Agregar funcionalidad del menú hamburguesa
    const hamburger = contenedor.querySelector('.hamburger');
    const sideMenu = contenedor.querySelector('#sideMenu');

    hamburger.addEventListener('click', () => {
        sideMenu.classList.toggle('active');
    });
 
    document.addEventListener("click", (e) => { 
        if (
    	    sideMenu.classList.contains("active") &&
    	    !e.target.closest("#sideMenu") &&
    	    !e.target.closest(".hamburger")
    	) {
        	sideMenu.classList.remove("active");
    	}
    });


document.addEventListener("pointerdown", (e) => {
    if (
        sideMenu.classList.contains("active") &&
        !e.target.closest("#sideMenu") &&
        !e.target.closest(".hamburger")
    ) {
        sideMenu.classList.remove("active");
    }
});
	
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarHeader);
 




function cargarCuadrados_0() {
    const contenedor = document.getElementById('general-0');
    if (!contenedor) return;

    // Limpiar contenido previo
    contenedor.innerHTML = '';

    // Crear 4 secciones cuadradas
    for (let i = 0; i < 4; i++) {
        const cuadrado = document.createElement('div');
        cuadrado.classList.add('seccion-cuadrada');
        cuadrado.textContent = '⚡';
        contenedor.appendChild(cuadrado);
    }
}


let user_logo = `
<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> 
  <circle cx="12" cy="12" r="10" fill="#888888"/> 
  <path fill="#ffffff" d="M12 14c2.2091 0 4-1.7909 4-4s-1.7909-4-4-4-4 1.7909-4 4 1.7909 4 4 4z"/>
  <path fill="#ffffff" d="M6 18c0-1.3333 2.6667-2.5 6-2.5s6 1.1667 6 2.5v1.5H6v-1.5z"/>
</svg> 
`;

 
let sombrero_logo = `
<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Definimos gradientes para dar volumen -->
  <defs>
    <linearGradient id="gradTop" x1="12" y1="2" x2="12" y2="12" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#bbbbbb"/>
      <stop offset="100%" stop-color="#777777"/>
    </linearGradient>
    <linearGradient id="gradBottom" x1="12" y1="10" x2="12" y2="19" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#999999"/>
      <stop offset="100%" stop-color="#444444"/>
    </linearGradient>
  </defs>

  <!-- Parte superior (triángulo) -->
  <path d="M12 2L1 7L12 12L23 7L12 2Z" fill="url(#gradTop)"/>

  <!-- Parte central (cuerpo) -->
  <path d="M4 10V15C4 17.2091 7.5817 19 12 19C16.4183 19 20 17.2091 20 15V10L12 14L4 10Z" fill="url(#gradBottom)"/>

  <!-- Detalle lateral -->
  <path d="M23 7V13H21V8.2L23 7Z" fill="#666666"/>
</svg>

`; 
 
/*
let folder_logo = `
<svg width="30" height="30" viewBox="0 0 24 24" fill="#888888">
  <path d="M3 6H9L11 9H21C21.5523 9 22 9.44772 22 10V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V7C2 6.44772 2.44772 6 3 6Z" fill="#888888" stroke="#777788" stroke-width="1"/>
</svg> 
`; 
*/
/*
<svg width="30" height="30" viewBox="0 0 24 24"
     xmlns="http://www.w3.org/2000/svg">
*/

let folder_logo = `
<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="folderGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dddddd"/>
      <stop offset="50%" stop-color="#8a8a8a"/>
      <stop offset="100%" stop-color="#6a6a6a"/>
    </linearGradient>
  </defs>

  <path
    d="M3 6H9L11 9H21C21.5523 9 22 9.44772 22 10V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V7C2 6.44772 2.44772 6 3 6Z"
    fill="url(#folderGrad)"
    stroke="#777788"
    stroke-width="1"
  />
</svg>
`;




 
let star_logo = `
<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Estrella tipo diamante gruesa en gris -->
  <polygon points="12,2 15,9 22,9 17,14 19,22 12,18 5,22 7,14 2,9 9,9" fill="#cccccc" stroke="#777777" stroke-width="2"/>
  
  <!-- Facetas internas para brillo en tonos de gris -->
  <polygon points="12,2 12,18 17,14" fill="#eeeeee"/>
  <polygon points="12,2 12,18 7,14" fill="#dddddd"/>
  <polygon points="7,14 12,18 17,14" fill="#bbbbbb"/>
</svg>
`; 

star_logo = `
<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <!-- Degradado base (idéntico) -->
    <linearGradient id="diamondBase" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8a8a8a"/>
      <stop offset="45%" stop-color="#5f5f5f"/>
      <stop offset="100%" stop-color="#3a3a3a"/>
    </linearGradient>
  </defs>

  <!-- Rombo principal MÁS ESBELTO -->
  <polygon
    points="12,1.5 20,12 12,22.5 4,12"
    fill="url(#diamondBase)"
    stroke="#7a7a7a"
    stroke-width="1.5"
  />

  <!-- Facetas claras superiores (idénticas, ajustadas a forma) -->
  <polygon points="12,1.5 12,12 20,12" fill="rgba(255,255,255,0.35)"/>
  <polygon points="12,1.5 12,12 4,12" fill="rgba(255,255,255,0.25)"/>

  <!-- Facetas medias -->
  <polygon points="7,12 12,6.5 17,12 12,12" fill="rgba(255,255,255,0.18)"/>

  <!-- Facetas oscuras inferiores -->
  <polygon points="4,12 12,12 12,22.5" fill="rgba(0,0,0,0.25)"/>
  <polygon points="20,12 12,12 12,22.5" fill="rgba(0,0,0,0.18)"/>

  <!-- Brillo diagonal (idéntico) -->
  <polygon
    points="5,10 13.5,4 19,10 10.5,16"
    fill="rgba(255,255,255,0.22)"
  />

</svg>
`;

let rayo_logo = `
<svg width="30" height="30" viewBox="0 0 24 24" fill="#7c55e6" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/>
</svg>
`;



function cargarCuadrados() {
    const contenedor = document.getElementById('general-0');
    if (!contenedor) return;

    contenedor.innerHTML = ''; // limpiar contenido previo

    const pages = ["page1.html", "page2.html", "page3.html", "page4.html"];
    const tooltips = ["Log in", "Saved projects", "Video tutorials", "Upgrade plan"];

    for (let i = 0; i < 4; i++) {
        const cuadrado = document.createElement('div');
        cuadrado.classList.add('seccion-cuadrada');
        //cuadrado.textContent = '◆';
 
        if (i==0){
		cuadrado.id = 'log_in';
		cuadrado.innerHTML = user_logo; 
	}
	if (i==1){
		cuadrado.id = 'saved_projects';
		cuadrado.innerHTML = folder_logo; 
	}
	if (i==2){
		cuadrado.id = 'video_tutorials';
		cuadrado.innerHTML = sombrero_logo; 
	}
	if (i==3){
		cuadrado.id = 'upgrade_plan';
		cuadrado.innerHTML = star_logo; 
	} 
 
 
	const svg = cuadrado.querySelector('svg');
	svg.style.pointerEvents = 'none';




 
	cuadrado.style.color = "#7c55e6";
 
        // crear tooltip
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = tooltips[i];
        cuadrado.appendChild(tooltip);

        // mostrar tooltip al pasar el mouse
        cuadrado.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
        });
        cuadrado.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

	/*
        // redirección al hacer click
        cuadrado.addEventListener('click', () => {
            window.location.href = pages[i];
        });
	*/

        contenedor.appendChild(cuadrado);
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarCuadrados);


 
document.addEventListener("click", (e) => { 
  const card = e.target.closest(".ratio-card");
  if (card) { 
    document.querySelectorAll(".ratio-card").forEach(c => {
      c.style.background = "transparent";
    }); 
    card.style.background = "rgba(196,205,208,0.35)";
    ratio_scene = card.dataset.ratio; 
    if (ratio_scene=="16:9"){
	resolution_scene = "1280x720";
    }	
    if (ratio_scene=="9:16"){
	resolution_scene = "720x1280";
    }	
    console.log("resolution_scene:", resolution_scene);

    return; 
  } 
});



 

