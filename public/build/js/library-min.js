const stakingRewardAddress="0xd6b2D8f59Bf30cfE7009fB4fC00a7b13Ca836A2c",conStakingTokenAddress="0x154a9f9cbd3449ad22fdae23044319d6ef2a1fab",mainAddress="0x39Bea96e13453Ed52A734B6ACEeD4c41F57B2271",charAddress="0xc6f252c2cdd4087e30608a35c022ce490b58179b",weapAddress="0x7e091b0a220356b157131c831258a9c98ac8031a",oracleAddress="0x1cbfa0ec28da66896946474b2a93856eb725fbba",defaultAddress="0x0000000000000000000000000000000000000000",web3=new Web3("https://bsc-dataseed1.defibit.io/"),conStakingReward=new web3.eth.Contract(IStakingRewards,stakingRewardAddress),conStakingToken=new web3.eth.Contract(IERC20,conStakingTokenAddress),conCryptoBlades=new web3.eth.Contract(CryptoBlades,mainAddress),conCharacters=new web3.eth.Contract(Characters,charAddress),conWeapons=new web3.eth.Contract(Weapons,weapAddress),conOracle=new web3.eth.Contract(BasicPriceOracle,oracleAddress),isAddress=t=>web3.utils.isAddress(t),getBNBBalance=t=>web3.eth.getBalance(t),getStakedBalance=t=>conStakingToken.methods.balanceOf(t).call({from:defaultAddress}),getStakedRewards=t=>conStakingReward.methods.balanceOf(t).call({from:defaultAddress}),getStakedTimeLeft=t=>conStakingReward.methods.getStakeUnlockTimeLeft().call({from:t}),getAccountCharacters=t=>conCryptoBlades.methods.getMyCharacters().call({from:t}),getAccountWeapons=t=>conCryptoBlades.methods.getMyWeapons().call({from:t}),getAccountSkillReward=t=>conCryptoBlades.methods.getTokenRewards().call({from:t}),getOwnRewardsClaimTax=t=>conCryptoBlades.methods.getOwnRewardsClaimTax().call({from:t}),getRewardsClaimTaxMax=t=>conCryptoBlades.methods.REWARDS_CLAIM_TAX_MAX().call({from:t}),getIngameSkill=t=>conCryptoBlades.methods.inGameOnlyFunds(t).call({from:t}),getCharacterExp=t=>conCryptoBlades.methods.getXpRewards(`${t}`).call({from:defaultAddress}),characterTargets=(t,e)=>conCryptoBlades.methods.getTargets(t,e).call({from:defaultAddress}),getCharacterStamina=t=>conCharacters.methods.getStaminaPoints(`${t}`).call({from:defaultAddress}),getCharacterData=t=>conCharacters.methods.get(`${t}`).call({from:defaultAddress}),getWeaponData=t=>conWeapons.methods.get(`${t}`).call({from:defaultAddress}),getOraclePrice=()=>conOracle.methods.currentPrice().call({from:defaultAddress}),fetchFightGasOffset=async()=>conCryptoBlades.methods.fightRewardGasOffset().call({from:defaultAddress}),fetchFightBaseline=async()=>conCryptoBlades.methods.fightRewardBaseline().call({from:defaultAddress}),usdToSkill=async t=>conCryptoBlades.methods.usdToSkill(t).call({from:defaultAddress}),decodeAbi=(t,e)=>web3.eth.abi.decodeParameters(t,e),getPasLogs=t=>web3.eth.abi.getPasLogs(t),getLatestBlock=async()=>web3.eth.getBlock("latest"),getPastEvents=async(t,e,a,r,n)=>conCryptoBlades.getPastEvents(t,{fromBlock:e,toBlock:a,address:r,topics:n}),getTransaction=async t=>web3.eth.getTransaction(t),getTransactionReceipt=async t=>web3.eth.getTransactionReceipt(t),randomString=t=>{const e="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHUJKLMNOPQRSTUVWXYZ";let a="";for(let r=0;r<t;r+=1)a+=e.charAt(Math.floor(Math.random()*e.length));return a};function CharacterPower(t){return(1e3+10*t)*(Math.floor(t/10)+1)}const WeaponElement={Fire:0,Earth:1,Lightning:2,Water:3},WeaponTrait={STR:0,DEX:1,CHA:2,INT:3,PWR:4};function traitNumberToName(t){switch(t){case WeaponElement.Fire:return"Fire";case WeaponElement.Earth:return"Earth";case WeaponElement.Water:return"Water";case WeaponElement.Lightning:return"Lightning";default:return"???"}}function characterFromContract(t,e){return{id:+t,xp:e[0],level:parseInt(e[1],10),trait:e[2],traitName:traitNumberToName(+e[2]),staminaTimestamp:e[3],head:e[4],arms:e[5],torso:e[6],legs:e[7],boots:e[8],race:e[9]}}function getStatPatternFromProperties(t){return t>>5&127}function getStat1Trait(t){return t%5}function getStat2Trait(t){return Math.floor(t/5)%5}function getStat3Trait(t){return Math.floor(Math.floor(t/5)/5)%5}function statNumberToName(t){switch(t){case WeaponTrait.CHA:return"CHA";case WeaponTrait.DEX:return"DEX";case WeaponTrait.INT:return"INT";case WeaponTrait.PWR:return"PWR";case WeaponTrait.STR:return"STR";default:return"???"}}function getWeaponTraitFromProperties(t){return t>>3&3}function weaponFromContract(t,e){const a=e[0],r=e[1],n=e[2],o=e[3],s=+e[4],c=e[5],i=e[6],l=e[7],d=e[8],u=+e[9],f=+e[10],m=+r,h=+n,g=+o,p=getStatPatternFromProperties(+a),T=getStat1Trait(p),S=getStat2Trait(p),C=getStat3Trait(p),w=getWeaponTraitFromProperties(+a),A=255&u,b=u>>8&255,N=u>>16&255,E=7&+a;return{id:+t,properties:a,trait:w,element:traitNumberToName(w),stat1:statNumberToName(T),stat1Value:m,stat1Type:T,stat2:statNumberToName(S),stat2Value:h,stat2Type:S,stat3:statNumberToName(C),stat3Value:g,stat3Type:C,level:s,blade:c,crossguard:i,grip:l,pommel:d,stars:E,lowStarBurnPoints:A,fourStarBurnPoints:b,fiveStarBurnPoints:N,bonusPower:f}}function getElementAdvantage(t,e){return(t+1)%4===e?1:(e+1)%4===t?-1:0}function AdjustStatForTrait(t,e,a){let r=t;return e===a?r=Math.floor(1.07*r):e===WeaponTrait.PWR&&(r=Math.floor(1.03*r)),r}function MultiplierPerEffectiveStat(t){return.25*t}function Stat1PercentForChar(t,e){return MultiplierPerEffectiveStat(AdjustStatForTrait(t.stat1Value,t.stat1Type,e))}function Stat2PercentForChar(t,e){return MultiplierPerEffectiveStat(AdjustStatForTrait(t.stat2Value,t.stat2Type,e))}function Stat3PercentForChar(t,e){return MultiplierPerEffectiveStat(AdjustStatForTrait(t.stat3Value,t.stat3Type,e))}function GetTotalMultiplierForTrait(t,e){return 1+.01*(Stat1PercentForChar(t,e)+Stat2PercentForChar(t,e)+Stat3PercentForChar(t,e))}function getAlignedCharacterPower(t,e){return CharacterPower(t.level)*GetTotalMultiplierForTrait(e,parseInt(t.trait,10))+e.bonusPower}function getWinChance(t,e,a,r){const n=parseInt(t.trait,10),o=parseInt(WeaponElement[e.element],10),s=getAlignedCharacterPower(t,e),c=1+.075*(o===n?1:0)+.075*getElementAdvantage(n,r),i=s*c*.9,l=s*c*1.1,d=.9*a,u=1.1*a;let f=0,m=0;for(let t=Math.floor(i);t<=l;t++)for(let e=Math.floor(d);e<=u;e++)t>=e?f++:m++;return f/(f+m)}const SECONDS_IN_MINUTE=60,SECONDS_IN_HOUR=60*SECONDS_IN_MINUTE,SECONDS_IN_DAY=24*SECONDS_IN_HOUR;function formatDurationToUnit(t,e){return`${t.toFixed(0)} ${"1"===t.toFixed(0)?e[0]:e[1]}`}function formatDurationFromSeconds(t){return t/SECONDS_IN_DAY>=1?formatDurationToUnit(t/SECONDS_IN_DAY,["day","days"]):t/SECONDS_IN_HOUR>=1?formatDurationToUnit(t/SECONDS_IN_HOUR,["hour","hours"]):t/SECONDS_IN_MINUTE>=1?formatDurationToUnit(t/SECONDS_IN_MINUTE,["minute","minutes"]):formatDurationToUnit(t,["second","seconds"])}function secondsToDDHHMMSS(t){const e=Math.floor(t/86400),a=Math.floor(t/3600%24),r=Math.floor(t/60)%60,n=t%60;return`${0!==e&&`${`0${e}`.slice(-2)}d `||""}${0!==a&&`${`0${a}`.slice(-2)}h `||""}`+`${0!==r&&`${`0${r}`.slice(-2)}m `||""}${0!==n&&`${`0${n}`.slice(-2)}s`||""}`}const experienceTable=[16,17,18,19,20,22,24,26,28,30,33,36,39,42,46,50,55,60,66,72,79,86,94,103,113,124,136,149,163,178,194,211,229,248,268,289,311,334,358,383,409,436,464,493,523,554,586,619,653,688,724,761,799,838,878,919,961,1004,1048,1093,1139,1186,1234,1283,1333,1384,1436,1489,1543,1598,1654,1711,1769,1828,1888,1949,2011,2074,2138,2203,2269,2336,2404,2473,2543,2614,2686,2759,2833,2908,2984,3061,3139,3218,3298,3379,3461,3544,3628,3713,3799,3886,3974,4063,4153,4244,4336,4429,4523,4618,4714,4811,4909,5008,5108,5209,5311,5414,5518,5623,5729,5836,5944,6053,6163,6274,6386,6499,6613,6728,6844,6961,7079,7198,7318,7439,7561,7684,7808,7933,8059,8186,8314,8443,8573,8704,8836,8969,9103,9238,9374,9511,9649,9788,9928,10069,10211,10354,10498,10643,10789,10936,11084,11233,11383,11534,11686,11839,11993,12148,12304,12461,12619,12778,12938,13099,13261,13424,13588,13753,13919,14086,14254,14423,14593,14764,14936,15109,15283,15458,15634,15811,15989,16168,16348,16529,16711,16894,17078,17263,17449,17636,17824,18013,18203,18394,18586,18779,18973,19168,19364,19561,19759,19958,20158,20359,20561,20764,20968,21173,21379,21586,21794,22003,22213,22424,22636,22849,23063,23278,23494,23711,23929,24148,24368,24589,24811,25034,25258,25483,25709,25936,26164,26393,26623,26854,27086,27319,27553,27788,28024,28261,28499,28738,28978];function getNextTargetExpLevel(t){let e=10*(Math.floor(t/10)+1);e===t&&(e=t+11);let a=0;for(let r=t;r<e;r++)a+=experienceTable[r];return{level:e,exp:a}}function getPotentialXp(t,e,a,r){const n=t*GetTotalMultiplierForTrait(r,parseInt(a,10))+r.bonusPower;return Math.floor(e/n*this.fightXpGain)}function getEnemyDetails(t){return t.map(t=>{const e=parseInt(t,10);return{original:t,power:16777215&e,trait:e>>24}})}function sumOfArray(t){let e=0;return t.forEach(t=>{e+=parseFloat(t)}),BigInt(e).toString()}function truncateToDecimals(t,e=2){const a=Math.pow(10,e);return Math.trunc(t*a)/a}