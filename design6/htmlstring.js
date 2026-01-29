let html_1 = ` 
<div class="start_type" style="display:flex; flex-direction:column; align-items:center;justify-content:center; gap:12px;">
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;  width:100%; height:100%; flex-direction:column; align-items:center; justify-content:center; text-align:center;"> 
    	<strong style="font-size:18px; margin-bottom:4px;">Keyframe 1</strong>
    	<span style="font-size:14px; color:#ffffff; margin-bottom:6px;max-width: 250px;"></span>
    </div> 

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">X position:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number"
	    max="1920"	
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Y position:</strong>
        <input 
            id="input_dynamic_box_1"
            type="number"
	    max="1920"
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>
</div>
 
`;

let html_2 = ` 
<div class="end_type" style="display:flex; flex-direction:column; align-items:center;justify-content:center; gap:12px;">
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;  width:100%; height:100%; flex-direction:column; align-items:center; justify-content:center; text-align:center;"> 
    	<strong style="font-size:18px; margin-bottom:4px;">Keyframe 2</strong>
    	<span style="font-size:16px; font-style:italic; color:#ffffff;max-width:300px;">After interpolation, the value of this keyframe will remain constant over timeline until the next keyframe.</span>
    </div> 
     

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">X position:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number"
	    max="1920"	
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Y position:</strong>
        <input 
            id="input_dynamic_box_1"
            type="number"
	    max="1920"	
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>
</div> 
`;

let html_3 = ` 
<div class="start_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;text-align:center;"> 
    	<strong style="font-size:16px; margin-bottom:4px;">Keyframe 1</strong>
    	<span style="font-size:12px; color:#ffffff; margin-bottom:6px;max-width: 250px;"></span> 
    </div> 
     
    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Value:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number" 
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div> 
</div> 
`;

 

let html_4 = ` 
<div class="end_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;text-align:center;"> 
    	<strong style="font-size:16px; margin-bottom:4px;">Keyframe 2</strong>
    	<span style="font-size:12px;font-style: italic; color:#ffffff; margin-bottom:6px;max-width: 250px;">After interpolation, the value of this keyframe will remain constant over timeline until the next keyframe.</span> 
    </div>  

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Value:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number" 
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div> 
</div> 
`;


//layer_order
let html_5 = ` 
<div class="start_end_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;text-align:center;"> 
    	<strong style="font-size:16px; margin-bottom:4px;">Hold keyframe</strong>
    	<span style="font-size:12px; color:#ffffff; margin-bottom:6px;max-width: 250px;">Holds an item property's value constant until the next keyframe</span> 
    </div>  

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
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;text-align:center;"> 
    	<strong style="font-size:16px; margin-bottom:4px;">Hold keyframe</strong>
    	<span style="font-size:12px; color:#ffffff; margin-bottom:8px;max-width: 250px;">Holds an item property's value constant until the next keyframe</span>
    	<span style="font-size:12px;font-style: italic; color:#ffffff; margin-bottom:8px;max-width: 250px;">When an external item overlaps with the current one, the overlapping region will become visible or hidden depending on the selected option. The external item must have a higher layer-order than the current one.</span>
    </div>  

     

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
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;text-align:center;"> 
    	<strong style="font-size:16px; margin-bottom:4px;">Hold keyframe</strong>
    	<p style="display: block;font-size:12px; color:#ffffff; margin-bottom:8px;max-width: 250px;">Holds an item property's value constant until the next keyframe</p>
    </div>  
     

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
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;text-align:center;"> 
    	<strong style="font-size:18px; margin-bottom:8px;font-weight:bold;">Text input</strong>
    	<span style="font-size:14px; color:#ffffff; margin-bottom:12px;max-width: 250px;">This value will be constant until the next segment</span>
    </div>  
     

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;"> 
        <input 
            id="input_dynamic_box_0"
            type="text"
            style="flex:1; min-width:65px; width:120px; border-radius:6px;padding:10px 4px;font-size:16px;"
        >
    </div> 
</div> 
`;

 
 
//bounce 
let html_9 = ` 
<div class="start_end_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;text-align:center;"> 
    	<strong style="font-size:16px; margin-bottom:4px;">Bounce parameters</strong>
    	<span style="font-size:12px;font-style: italic; color:#ffffff; margin-bottom:12px;">The width of the box measures the bounce time with cushioning.</span>
    </div>  
     
     
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


let html_10 = ` 
<div class="start_type" style="display:flex; flex-direction:column; align-items:center;justify-content:center; gap:12px;">
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;  width:100%; height:100%; flex-direction:column; align-items:center; justify-content:center; text-align:center;"> 
    	<strong style="font-size:18px; margin-bottom:4px;">Keyframe 1</strong>
    	<span style="font-size:14px; color:#ffffff; margin-bottom:6px;max-width: 250px;"></span>
    </div> 

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Width:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number"
	    max="1920"	
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Height:</strong>
        <input 
            id="input_dynamic_box_1"
            type="number"
	    max="1920"
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>
</div>
 
`;

let html_11 = ` 
<div class="end_type" style="display:flex; flex-direction:column; align-items:center;justify-content:center; gap:12px;">
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;  width:100%; height:100%; flex-direction:column; align-items:center; justify-content:center; text-align:center;"> 
    	<strong style="font-size:18px; margin-bottom:4px;">Keyframe 2</strong>
    	<span style="font-size:16px; font-style:italic; color:#ffffff;max-width:300px;">After interpolation, the value of this keyframe will remain constant over timeline until the next keyframe.</span>
    </div> 
     

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Width:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number"
	    max="1920"	
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Height:</strong>
        <input 
            id="input_dynamic_box_1"
            type="number"
	    max="1920"	
	    oninput="if (this.value > 1920) this.value = 1920;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>
</div> 
`;

let html_textcolor = ` 
<div class="start_end_type_textcolor" style="display:flex; flex-direction:column; align-items:center;justify-content:center; gap:12px;">
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;  width:100%; height:100%; flex-direction:column; align-items:center; justify-content:center; text-align:center;"> 
    	<strong style="font-size:18px; margin-bottom:4px;">Text color</strong>
    	<span style="font-size:14px; color:#ffffff; margin-bottom:6px;max-width: 250px;"></span>
    </div> 

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">R:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number"
	    max="255"	
	    oninput="if (this.value > 255) this.value = 255;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">G:</strong>
        <input 
            id="input_dynamic_box_1"
            type="number"
	    max="255"
	    oninput="if (this.value > 255) this.value = 255;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>
    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">B:</strong>
        <input 
            id="input_dynamic_box_2"
            type="number"
	    max="255"
	    oninput="if (this.value > 255) this.value = 255;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>
</div>
 
`;



let html_anchorpoint_0 = ` 
<div class="start_end_type_anchorpoint" style="display:flex; flex-direction:column; align-items:center;justify-content:center; gap:12px;">
    <div> 
	<button class="btn-close">
	    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
	      <path d="M19 5L5 19M5 5l14 14"
	            stroke="#000"
	            stroke-width="5"
	            stroke-linecap="round"/>
	    </svg>
	</button> 
    </div> 
    <div style="display:flex;  width:100%; height:100%; flex-direction:column; align-items:center; justify-content:center; text-align:center;"> 
    	<strong style="font-size:18px; margin-bottom:4px;">Anchor point</strong>
    	<span style="font-size:14px; color:#ffffff; margin-bottom:6px;max-width: 250px;"></span>
    </div> 

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">X:</strong>
        <input 
            id="input_dynamic_box_0"
            type="number"
	    max="1"	
	    oninput="if (this.value > 1) this.value = 1;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">
        <strong style="min-width:70px;">Y:</strong>
        <input 
            id="input_dynamic_box_1"
            type="number"
	    max="1"
	    oninput="if (this.value > 1) this.value = 1;"
            style="flex:1; min-width:75px; max-width:85px; padding:8px 4px;font-size:16px; border-radius:6px;"
        >
    </div> 
</div>
 
`;

let html_anchorpoint = `
<div class="start_end_type_anchorpoint" style="display:flex; flex-direction:column; align-items:center;justify-content:center; gap:12px;">

    <div>
        <button class="btn-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                <path d="M19 5L5 19M5 5l14 14"
                      stroke="#000"
                      stroke-width="5"
                      stroke-linecap="round"/>
            </svg>
        </button>
    </div>

    <div style="display:flex; width:100%; flex-direction:column; align-items:center; text-align:center;">
        <strong style="font-size:18px;">Anchor point</strong>
        <span style="font-size:14px; color:#ffffff; max-width:250px;"></span>
    </div>

    <!-- INPUT X -->
    <div style="display:flex; align-items:center; gap:8px; width:100%;">
        <strong style="min-width:70px;">X:</strong>
        <input id="input_dynamic_box_0" type="number" min="0" max="1" step="0.001">
    </div>

    <!-- INPUT Y -->
    <div style="display:flex; align-items:center; gap:8px; width:100%;">
        <strong style="min-width:70px;">Y:</strong>
        <input id="input_dynamic_box_1" type="number" min="0" max="1" step="0.001">
    </div>
	
    <!-- VIEWPORT -->
    <div class="viewport-image" style="width:280px;">
        <div class="image-scroll">
<div class="image-wrapper">
<img id="anchor-img">
</div>


<!-- overlay separado -->
<div class="anchor-overlay">
<div id="anchor-point"></div>
</div>
</div>
    </div>

     

</div>
`;

html_anchorpoint = `
<div class="start_end_type_anchorpoint">
        <button class="btn-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                <path d="M19 5L5 19M5 5l14 14"
                      stroke="#000"
                      stroke-width="5"
                      stroke-linecap="round"/>
            </svg>
        </button>
    
    <div class="anchor-header">
        <strong>Anchor Point</strong>
        <span>Arrastra el punto rojo para establecer el ancla</span>
    </div>
    
    <!-- Coordenadas en una sola línea -->
    <div class="coordinates-container">
        <div class="coordinate-item">
            <strong>X:</strong>
            <input id="input_dynamic_box_0" type="text" value="0.5" readonly>
        </div>
        <div class="coordinate-item">
            <strong>Y:</strong>
            <input id="input_dynamic_box_1" type="text" value="0.5" readonly>
        </div>
    </div>
    
    <!-- VIEWPORT -->
    <div class="viewport-image">
        <div class="image-scroll">
            <div class="image-wrapper">
                <img id="anchor-img">
            </div>
            <div class="anchor-overlay">
                <div id="anchor-point"></div>
            </div>
        </div>
    </div>
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

/*
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
        		<li data-value="text">text2</li>
    		</ul>
	</div>

        <input type="text" id="custom-name-input" placeholder="Nombre personalizado..." maxlength="15">
        <div>
            <button class="btn-confirm" id="confirm-name">Confirmar</button>
            <button class="btn-cancel" id="cancel-name">Cancelar</button>
        </div> 
</div>
`; 
*/

let html_create_item = ` 
<div class="simple_menu">
  <button class="btn-close">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
  <path d="M19 5L5 19M5 5l14 14"
        stroke="#000"
        stroke-width="5"
        stroke-linecap="round"/>
</svg>


  </button>

  <div class="actions">
    <!-- IMAGE -->
<button class="btn-confirm" id="image-item">
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="16"
      fill="none" stroke="white" stroke-width="2"/>
    <circle cx="9" cy="9" r="2.2" fill="white"/>
    <path d="M4 17l4-4 3 3 4-5 5 6"
      fill="none" stroke="white" stroke-width="2"/>
  </svg>
  Image
</button>

<!-- VIDEO -->
<button class="btn-confirm" id="video-item">
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
    <rect x="4" y="5" width="16" height="14"
      fill="none" stroke="white" stroke-width="2"/>
    <polygon points="10,9 16,12 10,15" fill="white"/>
  </svg>
  Video
</button>

<!-- AUDIO -->
<button class="btn-confirm" id="audio-item">
  <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9"
      fill="none" stroke="white" stroke-width="2"/>

    <circle cx="10" cy="15" r="1.7" fill="white"/>
    <circle cx="14" cy="13.2" r="1.7" fill="white"/>

    <path d="M14 7v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <path d="M10 8.5v6.5" stroke="white" stroke-width="2" stroke-linecap="round"/>

    <path d="M10 8.5 L14 7.2"
      stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>
  Audio
</button>

<!-- TEXT (letra T) -->
<button class="btn-confirm" id="text-item">
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
    <rect x="4" y="3" width="16" height="18"
      fill="none" stroke="white" stroke-width="2"/>
    <text x="12" y="15"
      font-size="10"
      text-anchor="middle"
      fill="white"
      font-family="Arial, sans-serif">T</text>
  </svg>
  Text
</button>

  </div>
</div> 
 
`; 



let html_change_view = ` 
 
  <button class="btn-close">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
      <path d="M19 5L5 19M5 5l14 14"
            stroke="#000"
            stroke-width="5"
            stroke-linecap="round"/>
    </svg> 
  </button>
 
  <div class="actions">
    <div style="display:flex;width:100%;justify-content: center;">
      <p style="font-size:18px;font-weight:bold;">Select timeline view</p>
    </div>
  
    <button class="btn-confirm" id="view-position">
      Position
    </button>
 
    <button class="btn-confirm" id="view-scale">
      Scale
    </button>
 
    <button class="btn-confirm" id="view-rotation">
      Rotation
    </button>
 
    <button class="btn-confirm" id="view-opacity">
      Opacity
    </button>

  </div> 
`; 



let html_finish = `
<div class="other_type" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
    <strong style="font-size:18px; margin-bottom:4px;">Export video</strong>
    <span id="error_subidas_pendientes" style="background-color:rgb(200,20,10);padding:8px;border-radius:8px;font-size:16px; color:#ffffff; margin-bottom:12px;max-width: 290px;">There are still files that have not finished uploading.</span>

    <div style="display:flex; flex-wrap:wrap; align-items:center; margin-bottom:10px; gap:8px; width:100%;">

<ul id="pendientes_de_subir" style="
  width:100%;
  max-height:140px;
  overflow-y:auto;
  margin:0;
  padding:8px 12px 8px 28px;  
  list-style-position: inside; 
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
<p style="display:flex;">Last video:</p> 
<div>
<p style="display:flex;max-width:50px;">
Here will appear the exported video
</p>
</div>
    </div> 
</div>
`;

html_finish = `
<div class="export-container">
    <h2 class="export-title">Export Video</h2>
    
    <div id="error_subidas_pendientes" class="alert-error">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="min-width:20px;">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
        </svg>
        <span>There are still files that have not finished uploading.</span>
    </div>
    
    <div class="pending-files-section">
        <ul id="pendientes_de_subir" class="pending-files-list"></ul>
        
        <button class="btn-render" id="update_video">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            New Export
        </button>
    </div>
    
    <div class="last-video-section">
        <h3 class="section-subtitle">Last Video</h3>
        <div class="video-preview-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="2" y1="7" x2="7" y2="7"></line>
                <line x1="2" y1="17" x2="7" y2="17"></line>
                <line x1="17" y1="17" x2="22" y2="17"></line>
                <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
            <p>Your exported video will appear here</p>
        </div>
    </div>
</div>

<style>
.export-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    max-width: 480px;
    margin: 0 auto;
}

.export-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: #ffffff;
    text-align: center;
    letter-spacing: -0.5px;
}

.alert-error {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.08));
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;
    color: #fca5a5;
    font-size: 14px;
    line-height: 1.5;
    backdrop-filter: blur(8px);
}

.pending-files-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.pending-files-list {
    width: 100%;
    max-height: 160px;
    overflow-y: auto;
    margin: 0;
    padding: 16px;
    list-style: none;
    border-radius: 12px;
    border: 1px solid rgba(124, 85, 230, 0.15);
    background: rgba(124, 85, 230, 0.05);
    backdrop-filter: blur(8px);
}

.pending-files-list::-webkit-scrollbar {
    width: 6px;
}

.pending-files-list::-webkit-scrollbar-track {
    background: rgba(124, 85, 230, 0.08);
    border-radius: 3px;
}

.pending-files-list::-webkit-scrollbar-thumb {
    background: rgba(124, 85, 230, 0.3);
    border-radius: 3px;
}

.pending-files-list::-webkit-scrollbar-thumb:hover {
    background: rgba(124, 85, 230, 0.5);
}

.pending-files-list li {
    padding: 8px 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    border-bottom: 1px solid rgba(124, 85, 230, 0.1);
}

.pending-files-list li:last-child {
    border-bottom: none;
}

.btn-render {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    border-radius: 12px;
    border: 1px solid rgba(124, 85, 230, 0.4);
    background: linear-gradient(
        135deg,
        rgba(124, 85, 230, 0.8) 0%,
        rgba(109, 70, 210, 0.9) 100%
    );
    box-shadow: 0 4px 12px rgba(124, 85, 230, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
}

.btn-render:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 85, 230, 0.3);
    background: linear-gradient(
        135deg,
        rgba(124, 85, 230, 0.9) 0%,
        rgba(109, 70, 210, 1) 100%
    );
}

.btn-render:active {
    transform: translateY(0);
}

.last-video-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.section-subtitle {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
}

.video-preview-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 15px 20px;
    border-radius: 12px;
    border: 2px dashed rgba(124, 85, 230, 0.25);
    background: rgba(124, 85, 230, 0.05);
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
    min-height: 140px;
}

.video-preview-placeholder p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
}

.btn-download {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    border-radius: 10px;
    border: 1px solid rgba(124, 85, 230, 0.4);
    background: linear-gradient(
        135deg,
        rgba(124, 85, 230, 0.8) 0%,
        rgba(109, 70, 210, 0.9) 100%
    );
    box-shadow: 0 4px 12px rgba(124, 85, 230, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
}

.btn-download:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 85, 230, 0.4);
    background: linear-gradient(
        135deg,
        rgba(124, 85, 230, 0.9) 0%,
        rgba(109, 70, 210, 1) 100%
    );
}

.btn-download:active {
    transform: translateY(0);
}

.video-preview-placeholder.has-video {
    border-style: solid;
    border-color: rgba(124, 85, 230, 0.3);
    background: rgba(124, 85, 230, 0.05);
}
</style>
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
    <span style="background-color:transparent;padding:8px;border-radius:8px;font-size:18px; color:#ffffff; margin-bottom:12px;max-width: 290px;">Releasing on 01/2026</span>
 
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
dic_dynamic_options.text.ratio ??= {};
dic_dynamic_options["text"]["filename"]["Text_input"]=html_8;//antes iba value 
dic_dynamic_options["text"]["filename"]["Text_color"]=html_textcolor;
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

dic_dynamic_options["text"]["ratio"]["keyframe_1"]=html_10;
dic_dynamic_options["text"]["ratio"]["keyframe_2"]=html_11;




dic_dynamic_options.image ??= {};
dic_dynamic_options.image.filename ??= {};
dic_dynamic_options.image.position ??= {};
dic_dynamic_options.image.scale ??= {};
dic_dynamic_options.image.rotation ??= {};
dic_dynamic_options.image.opacity ??= {};
dic_dynamic_options.image.layer_order ??= {};
dic_dynamic_options.image.item_reveal ??= {};
dic_dynamic_options.image.ratio ??= {};
dic_dynamic_options["image"]["filename"]["value"]=html_7;   
dic_dynamic_options["image"]["filename"]["Anchor_point"]=html_anchorpoint;
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

dic_dynamic_options["image"]["ratio"]["keyframe_1"]=html_10;
dic_dynamic_options["image"]["ratio"]["keyframe_2"]=html_11;






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
                <img src="https://raw.githubusercontent.com/manyresources/resourcespage/main/logos/newlogo/favicon.ico" alt="Logo" class="logo-menu">
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
<svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> 
  <circle cx="12" cy="12" r="10" fill="#888888"/> 
  <path fill="#ffffff" d="M12 14c2.2091 0 4-1.7909 4-4s-1.7909-4-4-4-4 1.7909-4 4 1.7909 4 4 4z"/>
  <path fill="#ffffff" d="M6 18c0-1.3333 2.6667-2.5 6-2.5s6 1.1667 6 2.5v1.5H6v-1.5z"/>
</svg> 
`;

 
let sombrero_logo = `
<div>
  <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Parte superior (triángulo) -->
    <path d="M12 2L1 7L12 12L23 7L12 2Z" fill="#c4cdd0"/>

    <!-- Parte central (cuerpo) -->
    <path d="M4 10V15C4 17.2091 7.5817 19 12 19C16.4183 19 20 17.2091 20 15V10L12 14L4 10Z" fill="#c4cdd0"/>

    <!-- Detalle lateral -->
    <path d="M23 7V13H21V8.2L23 7Z" fill="#c4cdd0"/>
  </svg>
  <p style="color:white;font-size:12px;">Tutorials</p>
</div>
`;

 

let folder_logo = `
<div>
  <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6H9L11 9H21C21.5523 9 22 9.44772 22 10V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V7C2 6.44772 2.44772 6 3 6Z"
      fill="#c4cdd0"
      stroke="#c4cdd0"
      stroke-width="1"
    />
  </svg>
  <p style="color:white;font-size:12px;">Challenges</p>
</div>
`;

let maletin_logo = `
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 64 64">
   
  <path d="M12 8 Q8 12 12 16 L12 48 Q8 52 12 56 L52 56 Q56 52 52 48 L52 16 Q56 12 52 8 Z" fill="#f5f5dc" stroke="#c2b280" stroke-width="2"/>

  <!-- Pliegue superior derecho -->
  <path d="M52 8 Q50 12 52 16" fill="none" stroke="#c2b280" stroke-width="2"/>

  <!-- Pliegue superior izquierdo -->
  <path d="M12 8 Q14 12 12 16" fill="none" stroke="#c2b280" stroke-width="2"/>

 
  <line x1="16" y1="16" x2="48" y2="16" stroke="#c2b280" stroke-width="1"/>
  <line x1="16" y1="22" x2="48" y2="22" stroke="#c2b280" stroke-width="1"/>
  <line x1="16" y1="28" x2="48" y2="28" stroke="#c2b280" stroke-width="1"/>
  <line x1="16" y1="34" x2="48" y2="34" stroke="#c2b280" stroke-width="1"/>
  <line x1="16" y1="40" x2="48" y2="40" stroke="#c2b280" stroke-width="1"/>
  <line x1="16" y1="46" x2="48" y2="46" stroke="#c2b280" stroke-width="1"/>
</svg>
  <p style="color:white;font-size:12px;">Freelancers</p>
</div>
`;


maletin_logo = `
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 64 64">
  <!-- Cuerpo de la libreta -->
  <rect x="12" y="8" width="40" height="48" rx="4" ry="4" fill="#f5f5f5" stroke="#888" stroke-width="2"/>

  <!-- Lomo -->
  <rect x="12" y="8" width="8" height="48" fill="#d3d3d3" stroke="#888" stroke-width="1"/>

  <!-- Líneas de página -->
  <line x1="24" y1="16" x2="52" y2="16" stroke="#888" stroke-width="1.5"/>
  <line x1="24" y1="24" x2="52" y2="24" stroke="#888" stroke-width="1.5"/>
  <line x1="24" y1="32" x2="52" y2="32" stroke="#888" stroke-width="1.5"/>
  <line x1="24" y1="40" x2="52" y2="40" stroke="#888" stroke-width="1.5"/>
  <line x1="24" y1="48" x2="52" y2="48" stroke="#888" stroke-width="1.5"/>
</svg>
  <p style="color:white;font-size:12px;">Freelancers</p>
</div>
`;
 



 
let rombo_logo = `
<div>
<svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

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
<p style="color:white;font-size:12px;">Subscription</p>
</div>
`;
 

rombo_logo = `
<div>
  <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

    <defs>
      <!-- Degradado base en tonos morados -->
      <linearGradient id="diamondBase" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#a584f0"/>
        <stop offset="45%" stop-color="#7c55e6"/>
        <stop offset="100%" stop-color="#5e3ab8"/>
      </linearGradient>
    </defs>

    <!-- Rombo principal -->
    <polygon
      points="12,1.5 20,12 12,22.5 4,12"
      fill="url(#diamondBase)"
      stroke="#7c55e6"
      stroke-width="1.5"
    />

    <!-- Facetas claras superiores -->
    <polygon points="12,1.5 12,12 20,12" fill="rgba(255,255,255,0.35)"/>
    <polygon points="12,1.5 12,12 4,12" fill="rgba(255,255,255,0.25)"/>

    <!-- Facetas medias -->
    <polygon points="7,12 12,6.5 17,12 12,12" fill="rgba(255,255,255,0.18)"/>

    <!-- Facetas oscuras inferiores -->
    <polygon points="4,12 12,12 12,22.5" fill="rgba(0,0,0,0.25)"/>
    <polygon points="20,12 12,12 12,22.5" fill="rgba(0,0,0,0.18)"/>

    <!-- Brillo diagonal -->
    <polygon
      points="5,10 13.5,4 19,10 10.5,16"
      fill="rgba(255,255,255,0.22)"
    />

  </svg>
  <p style="color:white;font-size:12px;">Upgrade plan</p>
</div>
`;


 


function cargarCuadrados() {
    const contenedor = document.querySelector('.tabs-menu-container-settings-0');
    if (!contenedor) return;
    
    const botones = contenedor.querySelectorAll('button');
     
    botones.forEach((boton, i) => {
        if (i >= 4) return; // solo procesar los primeros 4 botones
        
        // Asignar contenido según el índice
        if (i === 0) {
            boton.id = 'log_in';
            boton.innerHTML = user_logo; 
        }
        if (i === 1) {
            boton.id = 'freelancers';
            boton.innerHTML = maletin_logo; 
        }
        if (i === 2) {
            boton.id = 'video_tutorials';
            boton.innerHTML = sombrero_logo; 
        }
        if (i === 3) {
            boton.id = 'upgrade_plan';
            boton.innerHTML = rombo_logo; 
        }
        
        // Configurar SVG
        const svg = boton.querySelector('svg');
        if (svg) {
            svg.style.pointerEvents = 'none';
        }
        
         
        
         
    });
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



 
function ajustarAlturaDivAbajo() {
    const generalMain = document.querySelector('.general-main'); // o usa el selector correcto
    if (generalMain) {
        const altura = generalMain.offsetHeight;
        document.documentElement.style.setProperty('--altura-general-main', `${altura}px`);
    }
}

// Ejecutar al cargar
ajustarAlturaDivAbajo();

// Ejecutar al redimensionar la ventana
window.addEventListener('resize', ajustarAlturaDivAbajo);






function toggleTimelineDisplay() {
    const timestamp = document.getElementById('timestamp');
    const undoRedoContainer = document.getElementById('undo-redo-container');
    const zoomOut = document.getElementById('zoom-out');
    const zoomIn = document.getElementById('zoom-in');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    if (window.innerWidth > 1000) {
        timestamp.style.display = 'block';
        undoRedoContainer.style.display = 'none';
        zoomOut.style.display = 'none';
        zoomIn.style.display = 'none';
        fullscreenBtn.style.display = 'flex';
    } else {
        timestamp.style.display = 'none';
        undoRedoContainer.style.display = 'flex';
        zoomOut.style.display = 'flex';
        zoomIn.style.display = 'flex';
        fullscreenBtn.style.display = 'none';
    }
}

// Ejecutar al cargar la página
toggleTimelineDisplay();

// Ejecutar al redimensionar
window.addEventListener('resize', toggleTimelineDisplay);














/*
function check_last_video() {
    // Verificar si globalBuffer está vacío
    if (!globalBuffer || globalBuffer.length === 0 || 
        (globalBuffer instanceof Uint8Array && globalBuffer.byteLength === 0)) {
        return;
    }

    // Si hay video, modificar el placeholder
    const placeholder = document.querySelector('.video-preview-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <button class="btn-download" id="download_last_video">
                Download Video
            </button>
        `;
    }
}

// Listener para el botón de descarga
document.addEventListener("click", function (e) {
    if (e.target.matches("#download_last_video")) {
        try {
            // Crear blob del video
            const blob = new Blob([globalBuffer], { type: "video/webm" });
            
            // Crear URL temporal
            const url = URL.createObjectURL(blob);
            
            // Crear elemento de descarga
            const a = document.createElement('a');
            a.href = url;
            a.download = `video_export_${Date.now()}.webm`;
            
            // Trigger descarga
            document.body.appendChild(a);
            a.click();
            
            // Limpiar
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('Video descargado exitosamente');
        } catch (error) {
            console.error('Error al descargar el video:', error);
            alert('Error al descargar el video. Por favor, intenta de nuevo.');
        }
    }
});
*/



// Variables globales
let ready_to_download = false;
let progress_export = 0;

function check_last_video() {
    // Solo mostrar botón si está listo para descargar 
    if (!ready_to_download) {
        return;
    } 
    show_download_button();
}

function show_download_button() {
    const placeholder = document.querySelector('.video-preview-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <button class="btn-download" id="download_last_video">
                Download Video
            </button>
        `;
        
        // Agregar clase para estilos especiales
        placeholder.classList.add('has-video');
    }

    // Mostrar botón de render nuevamente
    const renderBtn = document.getElementById('update_video');
    if (renderBtn) {
        renderBtn.style.display = 'flex';
    }

    // Ocultar indicador de progreso si existe
    const progressIndicator = document.getElementById('export_progress');
    if (progressIndicator) {
        progressIndicator.style.display = 'none';
    }
}

function show_percent_export(total_progress) {
    // Incrementar progreso
    progress_export++;

    // Calcular porcentaje
    const percentage = Math.round((progress_export / total_progress) * 100);

    // Obtener o crear el contenedor de progreso
    let progressContainer = document.getElementById('export_progress');
    const renderBtn = document.getElementById('update_video');

    if (!progressContainer) {
        // Crear contenedor de progreso si no existe
        progressContainer = document.createElement('div');
        progressContainer.id = 'export_progress';
        progressContainer.className = 'export-progress-container';
        
        // Insertar después del botón de render
        if (renderBtn && renderBtn.parentNode) {
            renderBtn.parentNode.insertBefore(progressContainer, renderBtn.nextSibling);
        }
    }

    // Ocultar botón de render
    if (renderBtn) {
        renderBtn.style.display = 'none';
    }

    // Mostrar contenedor de progreso
    progressContainer.style.display = 'flex';

    // Actualizar contenido del progreso
    progressContainer.innerHTML = ` 
      <div class="progress-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span class="progress-text">Exporting video...</span>
            <span class="progress-percentage">${percentage}%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
        </div> 
    `;

    // Si llegamos al 100%, preparar para mostrar el botón de descarga
/*
    if (percentage >= 100) {
        setTimeout(() => {
            ready_to_download = true;
            show_download_button();
        }, 500);
    }
*/
}

// Listener para el botón de descarga (sin cambios)
document.addEventListener("click", function (e) {
    if (e.target.matches("#download_last_video")) {
        try {
            if (!globalBuffer || globalBuffer.length === 0) {
                alert('No video available to download.');
                return;
            }

            // Crear blob del video
            const blob = new Blob([globalBuffer], { type: "video/webm" });
            
            // Crear URL temporal
            const url = URL.createObjectURL(blob);
            
            // Crear elemento de descarga
            const a = document.createElement('a');
            a.href = url;
            a.download = `video_export_${Date.now()}.webm`;
            
            // Trigger descarga
            document.body.appendChild(a);
            a.click();
            
            // Limpiar 
            document.body.removeChild(a);
            URL.revokeObjectURL(url); 
            
            console.log('Video descargado exitosamente');
        } catch (error) {
            console.error('Error al descargar el video:', error);
            alert('Error al descargar el video. Por favor, intenta de nuevo.');
        }
    }
});

// Función para resetear el progreso (útil para nuevas exportaciones)
function reset_export_progress() {
    progress_export = 0;
    //ready_to_download = false;
    
    const progressContainer = document.getElementById('export_progress');
    if (progressContainer) {
        progressContainer.remove();
    }
    
    const renderBtn = document.getElementById('update_video');
    if (renderBtn) {
        renderBtn.style.display = 'flex';
    }
}

