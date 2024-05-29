let web3;async function initializeWeb3() {if (typeof window.ethereum !== 'undefined') {web3 = new Web3(window.ethereum);try {await window.ethereum.request({ method: 'eth_requestAccounts' });} catch (error) {console.error('User denied account access', error);}} else {console.log('MetaMask not installed');}};function title_redirect(){window.location.href = '/';};async function getEquivalentTokenAmount(amountInUSD, networkId) {const tokenMap = {1: 'ethereum',137: 'matic-network', 56: 'binancecoin', 250: 'fantom',43114: 'avalanche-2', 42161: 'arbitrum-one', 10: 'optimistic-ethereum',1666600000: 'harmony',128: 'heco', 66: 'okexchain', 100: 'xdai',70: 'hoo',25: 'cronos',122: 'fuse',42220: 'celo', 1313161554: 'aurora', 1088: 'metis-andromeda', 82: 'meter'};const tokenId = tokenMap[networkId];if (!tokenId) {throw new Error('Network ID not supported.');};const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`;try {const response = await fetch(apiUrl);const data = await response.json();const tokenPriceInUSD = data[tokenId].usd;const equivalentTokenAmount = amountInUSD / tokenPriceInUSD;return equivalentTokenAmount;} catch (error) {console.error('Error getting token price:', error);throw new Error('Error getting token price.');}};async function getNetworkId() {if (web3) {try {const chainId = await web3.eth.getChainId();console.log('Current Chain ID:', chainId);return chainId;} catch (error) {console.error('Error getting Chain ID:', error);return "none";}} else {console.log('Web3 is not initialized');return "none";}};async function handleNetworkChange() {if (typeof window.ethereum !== 'undefined') {window.ethereum.on('chainChanged', async (chainId) => {var chainid_decimal = parseInt(chainId, 16);console.log('Network changed:', chainid_decimal);await initializeWeb3();await getNetworkId();location.reload();});}};let referralCode = localStorage.getItem('referralCode');if (referralCode !== null && referralCode !== '') {var element_premium = document.getElementById("price-premium");var element_premium_plus = document.getElementById("price-premium-plus");if (element_premium && element_premium_plus) {document.getElementById("price-premium").innerText="20$/mes";document.getElementById("price-premium-plus").innerText="40$/mes";}};let xx1_2="s";let xx2_2="y";let xx3_2="m";let xx4_2="p";let xx5_2="h";let xx6_2="o";let xx7_2="n";let xx8_2="i";let xx9_2="o";let O0OOOO0000OOOO00000OO000O00OO00000O0OOOOO00OO00O0="u";let O0OOOO0000OOOO00000OO000O00OO000O0O0OOOOO00OO00O0="s";let O0OOOO0000OOOO00000OO000O00OO00O00O0OOOOO00OO00O0=".";let O0OOOO0000OOOO00000OO000O00OO00OO0O0OOOOO00OO00O0="gli";let O0OOOO0000OOOO00000OO000O00OO0O000O0OOOOO00OO00O0="tch";let O0OOOO0000OOOO00000OO000O00OO0O0O0O0OOOOO00OO00O0=".me";let O0OOO0O0O0OOO00O00OO0OO000O0OOOOO0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0OOOOO00OO00O0=xx1_2+xx2_2+xx3_2+xx4_2+xx5_2+xx6_2+xx7_2+xx8_2+xx9_2+O0OOOO0000OOOO00000OO000O00OO00000O0OOOOO00OO00O0+O0OOOO0000OOOO00000OO000O00OO000O0O0OOOOO00OO00O0+"20"+O0OOOO0000OOOO00000OO000O00OO00O00O0OOOOO00OO00O0+O0OOOO0000OOOO00000OO000O00OO00OO0O0OOOOO00OO00O0+O0OOOO0000OOOO00000OO000O00OO0O000O0OOOOO00OO00O0+O0OOOO0000OOOO00000OO000O00OO0O0O0O0OOOOO00OO00O0;function O0OO0OOOO0OOO00000OO00O0O0OO0OOO00O00O00O0OO0OOO00OOO00OO0OOO0O000OO0000O0OO0OO000OO0OO000O0O0O000OO0000O0OO000O0() {var url = "https://metamask.io/download"; window.open(url, '_blank').focus();};const affiliate_added=localStorage.getItem('affiliate_added');if (affiliate_added !== null && affiliate_added !== '') {const wallet_login_btn = document.getElementById("register-affiliate-btn");if (wallet_login_btn){wallet_login_btn.innerText = "Ver link";}}let O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO = localStorage.getItem('wallet_address');if (O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO !== null && O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO !== '') {const wallet_login_btn = document.getElementById("login-btn");wallet_login_btn.innerText = O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO.substring(0,7);const wallet_login_btn_responsive = document.getElementById("login-btn-responsive");wallet_login_btn_responsive.innerText = O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO.substring(0,7);(async () => {await handleNetworkChange();})();};const O0OO0O00O0OO0OOO00OOO00OO0OOO0O000OO0000O0OO0OO000OO0OO000O0OOOOO0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O00 = document.querySelectorAll(".install-wallet");const O0OO0OO000OO0OOOO0OO00OOO0OO0O00O0OO0OOO00O0OOOOO0OO0OO0O0OO0OOOO0OO00O000OO0000O0OO0OO00 = document.getElementById("loginModal");const O0OO000OO0OO0OO000OO0OOOO0OOO00OO0OO00O0O0O0OOOOO0OO0OO000OO0OOOO0OO00OOO0OO0O00O0OO0OOO00O0OOOOO0OO0OO0O0OO0OOOO0OO00O000OO0000O0OO0OO00 = document.querySelector(".login-close-btn");O0OO0O00O0OO0OOO00OOO00OO0OOO0O000OO0000O0OO0OO000OO0OO000O0OOOOO0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O00.forEach(function (userItem) {userItem.onclick = function() {O0OO0OOOO0OOO00000OO00O0O0OO0OOO00O00O00O0OO0OOO00OOO00OO0OOO0O000OO0000O0OO0OO000OO0OO000O0O0O000OO0000O0OO000O0();}}); O0OO000OO0OO0OO000OO0OOOO0OOO00OO0OO00O0O0O0OOOOO0OO0OO000OO0OOOO0OO00OOO0OO0O00O0OO0OOO00O0OOOOO0OO0OO0O0OO0OOOO0OO00O000OO0000O0OO0OO00.addEventListener('click', function() {O0OO0OO000OO0OOOO0OO00OOO0OO0O00O0OO0OOO00O0OOOOO0OO0OO0O0OO0OOOO0OO00O000OO0000O0OO0OO00.style.display = 'none';});O0OO0OO000OO0OOOO0OO00OOO0OO0O00O0OO0OOO00O0OOOOO0OO0OO0O0OO0OOOO0OO00O000OO0000O0OO0OO00.addEventListener('click', function(event) {if (event.target === O0OO0OO000OO0OOOO0OO00OOO0OO0O00O0OO0OOO00O0OOOOO0OO0OO0O0OO0OOOO0OO00O000OO0000O0OO0OO00) {O0OO0OO000OO0OOOO0OO00OOO0OO0O00O0OO0OOO00O0OOOOO0OO0OO0O0OO0OOOO0OO00O000OO0000O0OO0OO00.style.display = 'none';}});document.querySelectorAll('.openLoginModalBtn').forEach(button => {button.addEventListener('click', async function() {if (typeof window.ethereum !== 'undefined') {const button_id=button.id;if (button_id=="login-btn" || button_id=="login-btn-responsive" || button_id=="register-affiliate-btn"){ try{const accounts = await ethereum.request({ method: "eth_requestAccounts" });console.log("Connected to MetaMask");O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO = accounts[0];localStorage.setItem('wallet_address', O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO);console.log("wallet address: "+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO);const wallet_login_btn = document.getElementById("login-btn");wallet_login_btn.innerText = O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO.substring(0,7);const wallet_login_btn_responsive = document.getElementById("login-btn-responsive");wallet_login_btn_responsive.innerText = O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO.substring(0,7);localStorage.setItem('userid', O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO);if (button_id!=="register-affiliate-btn"){const websocketClient = new WebSocket("wss://"+O0OOO0O0O0OOO00O00OO0OO000O0OOOOO0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0OOOOO00OO00O0+"/"+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO);websocketClient.addEventListener('open', () => {let referralCode = localStorage.getItem('referralCode');if (referralCode !== null && referralCode !== '') {websocketClient.send("new_user-"+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO+"-by-"+referralCode);websocketClient.close(1000, 'Message sent');console.log("new_user_added");}else{websocketClient.send("new_user-"+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO+"-by-"+"empty_affiliate");websocketClient.close(1000, 'Message sent');console.log("new_user_added");}});}if (button_id=="register-affiliate-btn"){var affiliate_btn = document.getElementById('register-affiliate-btn');var affiliate_link = document.getElementById('affiliate_link');var affiliate_code = document.getElementById('affiliate_code');if (affiliate_btn && affiliate_link && affiliate_code) {affiliate_link.style.display = 'block';affiliate_link.innerHTML="https://manycaptions.com/register?referralCode="+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO.substring(2,7);affiliate_code.style.display = 'block';affiliate_code.innerHTML=O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO.substring(2,7);affiliate_btn.style.display = 'none';localStorage.setItem('affiliate_added', 'true');const websocketClient = new WebSocket("wss://"+O0OOO0O0O0OOO00O00OO0OO000O0OOOOO0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0OOOOO00OO00O0+"/"+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO);websocketClient.addEventListener('open', () => {websocketClient.send("new_affiliate-"+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO);websocketClient.close(1000, 'Message sent');});}}}catch (error) {console.log("Error login:", error);}}else{const button_selected = document.getElementById(button_id);button_selected.disabled = true;button_selected.innerText = "Loading...";try {const accounts = await ethereum.request({ method: "eth_requestAccounts" });console.log("Connected to MetaMask");O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO = accounts[0];localStorage.setItem('wallet_address', O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO);console.log("wallet address: "+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO);const wallet_login_btn = document.getElementById("login-btn");wallet_login_btn.innerText = O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO.substring(0,7);const wallet_login_btn_responsive = document.getElementById("login-btn-responsive");wallet_login_btn_responsive.innerText = O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO.substring(0,7);localStorage.setItem('userid', O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO);if (accounts.length === 0) {console.log("User not connected.");return;}else{await initializeWeb3();const toAddress = "0xecba313d97E803bBB3791FA7B7C9ED4D290C1CA3";var usdAmount;if (button_id=="pricing-btn-premium"){usdAmount = 25;var ref_code_premium=":empty";if (referralCode !== null && referralCode !== '') {usdAmount = 20;ref_code_premium=":"+referralCode;};}if (button_id=="pricing-btn-premium-plus"){usdAmount = 50;var ref_code_premium_plus=":empty";if (referralCode !== null && referralCode !== '') {usdAmount = 40;ref_code_premium_plus=":"+referralCode;};};var chainID=1;var tokenAmount=24;try {chainID=await getNetworkId();console.log('Chain ID:',chainID);try {tokenAmount=await getEquivalentTokenAmount(usdAmount, chainID);} catch (err) {console.error("Error:", err);}} catch (err) {console.error("Error:", err);};var etherAmount=parseFloat(tokenAmount.toFixed(17)).toString();const weiAmount = web3.utils.toWei(etherAmount, 'ether'); const weiAmountHex = "0x"+Number(weiAmount).toString(16);const gasEstimate = await web3.eth.estimateGas({to: O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO,value: web3.utils.toWei(etherAmount, 'ether')});const gasEstimateString=gasEstimate.toString();try{const txHash = await ethereum.request({method: "eth_sendTransaction",params: [{from: accounts[0],to: toAddress,value: weiAmountHex,gas: gasEstimateString},]});if (button_id=="pricing-btn-premium"){const websocketClient = new WebSocket("wss://"+O0OOO0O0O0OOO00O00OO0OO000O0OOOOO0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0OOOOO00OO00O0+"/"+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO);websocketClient.addEventListener('open', () => {websocketClient.send("buyer:"+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO+":"+usdAmount.toString()+ref_code_premium+"-chainID-"+chainID);websocketClient.close(1000, 'Message sent');});}if (button_id=="pricing-btn-premium-plus"){const websocketClient = new WebSocket("wss://"+O0OOO0O0O0OOO00O00OO0OO000O0OOOOO0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0OOOOO00OO00O0+"/"+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO);websocketClient.addEventListener('open', () => {websocketClient.send("buyer:"+O0OOO0OOO0OO0000O0OO0OO000OO0OO000OO00O0O0OOO0O000O00000O0OO00O000OO00O000OOO00O00OO00O0O0OOO00OO0OOO00OO+":"+usdAmount.toString()+ref_code_premium_plus+"-chainID-"+chainID);websocketClient.close(1000, 'Message sent');});};button_selected.disabled = false;button_selected.innerText = "ELEGIR";}catch(error){if (error.code === 4001) {console.log("User denied transaction signature.");} else {console.log('Error sending transaction:', error);};button_selected.disabled = false;button_selected.innerText = "ELEGIR";}};} catch (error) {if (error.code === 4001) {console.log("User denied transaction signature.");} else {console.log('Error sending transaction:', error);}}}} else {O0OO0OO000OO0OOOO0OO00OOO0OO0O00O0OO0OOO00O0OOOOO0OO0OO0O0OO0OOOO0OO00O000OO0000O0OO0OO00.style.display = "block";console.log("MetaMask is not installed.");}});});
