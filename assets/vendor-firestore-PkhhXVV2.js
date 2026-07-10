import{F as Ul,L as Bl,a as Fe,g as ee,i as gi,p as nu,d as hr,c as zl,b as Gl,_ as ru,e as $l,f as Kl,I as Et,h as Ql,j as jl,k as zr,l as su,m as Wl,E as Hl,X as Jl,n as Yl,o as Ns,W as vr,q as Xl,r as iu,M as Zl,S as So,s as eh,t as th,C as nh,u as Co,v as rh}from"./vendor-firebase-CWFJvb2B.js";import"./vendor-CPs0AGvL.js";import"./vendor-react-jH9PZ-w6.js";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}re.UNAUTHENTICATED=new re(null),re.GOOGLE_CREDENTIALS=new re("google-credentials-uid"),re.FIRST_PARTY=new re("first-party-uid"),re.MOCK_USER=new re("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Tn="12.14.0";function sh(r){Tn=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const et=new Bl("@firebase/firestore");function Kt(){return et.logLevel}function l_(r){et.setLogLevel(r)}function p(r,...e){if(et.logLevel<=Fe.DEBUG){const t=e.map(pi);et.debug(`Firestore (${Tn}): ${r}`,...t)}}function W(r,...e){if(et.logLevel<=Fe.ERROR){const t=e.map(pi);et.error(`Firestore (${Tn}): ${r}`,...t)}}function Te(r,...e){if(et.logLevel<=Fe.WARN){const t=e.map(pi);et.warn(`Firestore (${Tn}): ${r}`,...t)}}function pi(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function A(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,ou(r,n,t)}function ou(r,e,t){let n=`FIRESTORE (${Tn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw W(n),new Error(n)}function v(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||ou(e,s,n)}function h_(r,e){r||A(57014,e)}function E(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class g extends Ul{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class au{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class ih{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(re.UNAUTHENTICATED)))}shutdown(){}}class oh{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class ah{constructor(e){this.t=e,this.currentUser=re.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){v(this.o===void 0,42304);let n=this.i;const s=u=>this.i!==n?(n=this.i,t(u)):Promise.resolve();let i=new ie;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new ie,e.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},a=u=>{p("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((u=>a(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?a(u):(p("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new ie)}}),0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.i!==e?(p("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(v(typeof n.accessToken=="string",31837,{l:n}),new au(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return v(e===null||typeof e=="string",2055,{h:e}),new re(e)}}class uh{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=re.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class ch{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new uh(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(re.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Gs{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class lh{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,eh(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){v(this.o===void 0,3512);const n=i=>{i.error!=null&&p("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,p("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>n(i)))};const s=i=>{p("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):p("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Gs(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(v(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Gs(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}class d_{getToken(){return Promise.resolve(new Gs(""))}invalidateToken(){}start(e,t){}shutdown(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hh(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=hh(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function P(r,e){return r<e?-1:r>e?1:0}function $s(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),i=e.charAt(n);if(s!==i)return ks(s)===ks(i)?P(s,i):ks(s)?1:-1}return P(r.length,e.length)}const dh=55296,fh=57343;function ks(r){const e=r.charCodeAt(0);return e>=dh&&e<=fh}function Xt(r,e,t){return r.length===e.length&&r.every(((n,s)=>t(n,e[s])))}function uu(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ks="__name__";class ve{constructor(e,t,n){t===void 0?t=0:t>e.length&&A(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&A(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return ve.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ve?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=ve.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return P(e.length,t.length)}static compareSegments(e,t){const n=ve.isNumericId(e),s=ve.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?ve.extractNumericId(e).compare(ve.extractNumericId(t)):$s(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Et.fromString(e.substring(4,e.length-2))}}class D extends ve{construct(e,t,n){return new D(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new g(m.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((s=>s.length>0)))}return new D(t)}static emptyPath(){return new D([])}}const mh=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class G extends ve{construct(e,t,n){return new G(e,t,n)}static isValidIdentifier(e){return mh.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),G.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Ks}static keyField(){return new G([Ks])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new g(m.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const a=e[s];if(a==="\\"){if(s+1===e.length)throw new g(m.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new g(m.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,s+=2}else a==="`"?(o=!o,s++):a!=="."||o?(n+=a,s++):(i(),s++)}if(i(),o)throw new g(m.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new G(t)}static emptyPath(){return new G([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class T{constructor(e){this.path=e}static fromPath(e){return new T(D.fromString(e))}static fromName(e){return new T(D.fromString(e).popFirst(5))}static empty(){return new T(D.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&D.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return D.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new T(new D(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ii(r,e,t){if(!t)throw new g(m.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function _h(r,e,t,n){if(e===!0&&n===!0)throw new g(m.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Do(r){if(!T.isDocumentKey(r))throw new g(m.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function xo(r){if(T.isDocumentKey(r))throw new g(m.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function cu(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function is(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":A(12329,{type:typeof r})}function x(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new g(m.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=is(r);throw new g(m.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function lu(r,e){if(e<=0)throw new g(m.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X(r,e){const t={typeString:r};return e&&(t.value=e),t}function kt(r,e){if(!cu(r))throw new g(m.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,i="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${n}' field to equal '${i.value}'`;break}}if(t)throw new g(m.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const No=-62135596800,ko=1e6;class F{static now(){return F.fromMillis(Date.now())}static fromDate(e){return F.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*ko);return new F(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new g(m.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new g(m.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<No)throw new g(m.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new g(m.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/ko}_compareTo(e){return this.seconds===e.seconds?P(this.nanoseconds,e.nanoseconds):P(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:F._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(kt(e,F._jsonSchema))return new F(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-No;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}F._jsonSchemaVersion="firestore/timestamp/1.0",F._jsonSchema={type:X("string",F._jsonSchemaVersion),seconds:X("number"),nanoseconds:X("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R{static fromTimestamp(e){return new R(e)}static min(){return new R(new F(0,0))}static max(){return new R(new F(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zt=-1;class en{constructor(e,t,n,s){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=s}}function Qs(r){return r.fields.find((e=>e.kind===2))}function mt(r){return r.fields.filter((e=>e.kind!==2))}function gh(r,e){let t=P(r.collectionGroup,e.collectionGroup);if(t!==0)return t;for(let n=0;n<Math.min(r.fields.length,e.fields.length);++n)if(t=ph(r.fields[n],e.fields[n]),t!==0)return t;return P(r.fields.length,e.fields.length)}en.UNKNOWN_ID=-1;class wt{constructor(e,t){this.fieldPath=e,this.kind=t}}function ph(r,e){const t=G.comparator(r.fieldPath,e.fieldPath);return t!==0?t:P(r.kind,e.kind)}class tn{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new tn(0,Ee.min())}}function hu(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=R.fromTimestamp(n===1e9?new F(t+1,0):new F(t,n));return new Ee(s,T.empty(),e)}function du(r){return new Ee(r.readTime,r.key,Zt)}class Ee{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Ee(R.min(),T.empty(),Zt)}static max(){return new Ee(R.max(),T.empty(),Zt)}}function Ti(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=T.comparator(r.documentKey,e.documentKey),t!==0?t:P(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fu="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class mu{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function at(r){if(r.code!==m.FAILED_PRECONDITION||r.message!==fu)throw r;p("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&A(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new f(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof f?t:f.resolve(t)}catch(t){return f.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):f.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):f.reject(t)}static resolve(e){return new f(((t,n)=>{t(e)}))}static reject(e){return new f(((t,n)=>{n(e)}))}static waitFor(e){return new f(((t,n)=>{let s=0,i=0,o=!1;e.forEach((a=>{++s,a.next((()=>{++i,o&&i===s&&t()}),(u=>n(u)))})),o=!0,i===s&&t()}))}static or(e){let t=f.resolve(!1);for(const n of e)t=t.next((s=>s?f.resolve(s):n()));return t}static forEach(e,t){const n=[];return e.forEach(((s,i)=>{n.push(t.call(this,s,i))})),this.waitFor(n)}static mapArray(e,t){return new f(((n,s)=>{const i=e.length,o=new Array(i);let a=0;for(let u=0;u<i;u++){const c=u;t(e[c]).next((l=>{o[c]=l,++a,a===i&&n(o)}),(l=>s(l)))}}))}static doWhile(e,t){return new f(((n,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):n()};i()}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ge="SimpleDb";class os{static open(e,t,n,s){try{return new os(t,e.transaction(s,n))}catch(i){throw new Gn(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new ie,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new Gn(e,t.error)):this.S.resolve()},this.transaction.onerror=n=>{const s=Ei(n.target.error);this.S.reject(new Gn(e,s))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(p(ge,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new Ih(t)}}class Se{static delete(e){return p(ge,"Removing database:",e),gt(Ql().indexedDB.deleteDatabase(e)).toPromise()}static v(){if(!jl())return!1;if(Se.F())return!0;const e=zr(),t=Se.M(e),n=0<t&&t<10,s=_u(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static F(){return typeof process<"u"&&process.__PRIVATE_env?.__PRIVATE_USE_MOCK_PERSISTENCE==="YES"}static O(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.B=null,Se.M(zr())===12.2&&W("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(e){return this.db||(p(ge,"Opening database:",this.name),this.db=await new Promise(((t,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;t(o)},s.onblocked=()=>{n(new Gn(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new g(m.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new g(m.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new Gn(e,o))},s.onupgradeneeded=i=>{p(ge,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.N.k(o,s.transaction,i.oldVersion,this.version).next((()=>{p(ge,"Database upgrade to version "+this.version+" complete")}))}}))),this.q&&(this.db.onversionchange=t=>this.q(t)),this.db}K(e){this.q=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,s){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.L(e);const a=os.open(this.db,e,i?"readonly":"readwrite",n),u=s(a).next((c=>(a.C(),c))).catch((c=>(a.abort(c),f.reject(c)))).toPromise();return u.catch((()=>{})),await a.D,u}catch(a){const u=a,c=u.name!=="FirebaseError"&&o<3;if(p(ge,"Transaction failed with error:",u.message,"Retrying:",c),this.close(),!c)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function _u(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class yh{constructor(e){this.U=e,this.$=!1,this.W=null}get isDone(){return this.$}get G(){return this.W}set cursor(e){this.U=e}done(){this.$=!0}j(e){this.W=e}delete(){return gt(this.U.delete())}}class Gn extends g{constructor(e,t){super(m.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function ut(r){return r.name==="IndexedDbTransactionError"}class Ih{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(p(ge,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(p(ge,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),gt(n)}add(e){return p(ge,"ADD",this.store.name,e,e),gt(this.store.add(e))}get(e){return gt(this.store.get(e)).next((t=>(t===void 0&&(t=null),p(ge,"GET",this.store.name,e,t),t)))}delete(e){return p(ge,"DELETE",this.store.name,e),gt(this.store.delete(e))}count(){return p(ge,"COUNT",this.store.name),gt(this.store.count())}J(e,t){const n=this.options(e,t),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new f(((o,a)=>{i.onerror=u=>{a(u.target.error)},i.onsuccess=u=>{o(u.target.result)}}))}{const i=this.cursor(n),o=[];return this.H(i,((a,u)=>{o.push(u)})).next((()=>o))}}Z(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new f(((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}}))}X(e,t){p(ge,"DELETE ALL",this.store.name);const n=this.options(e,t);n.Y=!1;const s=this.cursor(n);return this.H(s,((i,o,a)=>a.delete()))}ee(e,t){let n;t?n=e:(n={},t=e);const s=this.cursor(n);return this.H(s,t)}te(e){const t=this.cursor({});return new f(((n,s)=>{t.onerror=i=>{const o=Ei(i.target.error);s(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next((a=>{a?o.continue():n()})):n()}}))}H(e,t){const n=[];return new f(((s,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const a=o.target.result;if(!a)return void s();const u=new yh(a),c=t(a.primaryKey,a.value,u);if(c instanceof f){const l=c.catch((h=>(u.done(),f.reject(h))));n.push(l)}u.isDone?s():u.G===null?a.continue():a.continue(u.G)}})).next((()=>f.waitFor(n)))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.Y?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function gt(r){return new f(((e,t)=>{r.onsuccess=n=>{const s=n.target.result;e(s)},r.onerror=n=>{const s=Ei(n.target.error);t(s)}}))}let Fo=!1;function Ei(r){const e=Se.M(zr());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new g("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Fo||(Fo=!0,setTimeout((()=>{throw n}),0)),n}}return r}const $n="IndexBackfiller";class Th{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}re(e){p($n,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{const t=await this.ne.ie();p($n,`Documents written: ${t}`)}catch(t){ut(t)?p($n,"Ignoring IndexedDB error during index backfill: ",t):await at(t)}await this.re(6e4)}))}}class Eh{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.se(t,e)))}se(e,t){const n=new Set;let s=t,i=!0;return f.doWhile((()=>i===!0&&s>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((o=>{if(o!==null&&!n.has(o))return p($n,`Processing collection: ${o}`),this.oe(e,o,s).next((a=>{s-=a,n.add(o)}));i=!1})))).next((()=>t-s))}oe(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((s=>this.localStore.localDocuments.getNextDocuments(e,t,s,n).next((i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next((()=>this._e(s,i))).next((a=>(p($n,`Updating offset: ${a}`),this.localStore.indexManager.updateCollectionGroup(e,t,a)))).next((()=>o.size))}))))}_e(e,t){let n=e;return t.changes.forEach(((s,i)=>{const o=du(i);Ti(o,n)>0&&(n=o)})),new Ee(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>t.writeSequenceNumber(n))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}fe.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ze=-1;function dr(r){return r==null}function Yn(r){return r===0&&1/r==-1/0}function gu(r){return typeof r=="number"&&Number.isInteger(r)&&!Yn(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gr="";function he(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Mo(e)),e=wh(r.get(t),e);return Mo(e)}function wh(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case Gr:t+="";break;default:t+=i}}return t}function Mo(r){return r+Gr+""}function Ve(r){const e=r.length;if(v(e>=2,64408,{path:r}),e===2)return v(r.charAt(0)===Gr&&r.charAt(1)==="",56145,{path:r}),D.emptyPath();const t=e-2,n=[];let s="";for(let i=0;i<e;){const o=r.indexOf(Gr,i);switch((o<0||o>t)&&A(50515,{path:r}),r.charAt(o+1)){case"":const a=r.substring(i,o);let u;s.length===0?u=a:(s+=a,u=s,s=""),n.push(u);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:A(61167,{path:r})}i=o+2}return new D(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _t="remoteDocuments",fr="owner",qt="owner",Xn="mutationQueues",Ah="userId",Ae="mutations",Oo="batchId",Tt="userMutationsIndex",Lo=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xr(r,e){return[r,he(e)]}function pu(r,e,t){return[r,he(e),t]}const vh={},nn="documentMutations",$r="remoteDocumentsV14",Rh=["prefixPath","collectionGroup","readTime","documentId"],Nr="documentKeyIndex",Vh=["prefixPath","collectionGroup","documentId"],yu="collectionGroupIndex",Ph=["collectionGroup","readTime","prefixPath","documentId"],Zn="remoteDocumentGlobal",js="remoteDocumentGlobalKey",rn="targets",Iu="queryTargetsIndex",bh=["canonicalId","targetId"],sn="targetDocuments",Sh=["targetId","path"],wi="documentTargetsIndex",Ch=["path","targetId"],Kr="targetGlobalKey",At="targetGlobal",er="collectionParents",Dh=["collectionId","parent"],on="clientMetadata",xh="clientId",as="bundles",Nh="bundleId",us="namedQueries",kh="name",Ai="indexConfiguration",Fh="indexId",Ws="collectionGroupIndex",Mh="collectionGroup",Kn="indexState",Oh=["indexId","uid"],Tu="sequenceNumberIndex",Lh=["uid","sequenceNumber"],Qn="indexEntries",qh=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],Eu="documentKeyIndex",Uh=["indexId","uid","orderedDocumentKey"],cs="documentOverlays",Bh=["userId","collectionPath","documentId"],Hs="collectionPathOverlayIndex",zh=["userId","collectionPath","largestBatchId"],wu="collectionGroupOverlayIndex",Gh=["userId","collectionGroup","largestBatchId"],vi="globals",$h="name",Au=[Xn,Ae,nn,_t,rn,fr,At,sn,on,Zn,er,as,us],Kh=[...Au,cs],vu=[Xn,Ae,nn,$r,rn,fr,At,sn,on,Zn,er,as,us,cs],Ru=vu,Ri=[...Ru,Ai,Kn,Qn],Qh=Ri,Vu=[...Ri,vi],jh=Vu;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Js extends mu{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function te(r,e){const t=E(r);return Se.O(t.le,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qo(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function ct(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Pu(r,e){const t=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t.push(e(r[n],n,r));return t}function bu(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(e,t){this.comparator=e,this.root=t||ae.EMPTY}insert(e,t){return new q(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ae.BLACK,null,null))}remove(e){return new q(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ae.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Rr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Rr(this.root,e,this.comparator,!1)}getReverseIterator(){return new Rr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Rr(this.root,e,this.comparator,!0)}}class Rr{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ae{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??ae.RED,this.left=s??ae.EMPTY,this.right=i??ae.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new ae(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return ae.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return ae.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ae.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ae.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw A(43730,{key:this.key,value:this.value});if(this.right.isRed())throw A(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw A(27949);return e+(this.isRed()?0:1)}}ae.EMPTY=null,ae.RED=!0,ae.BLACK=!1;ae.EMPTY=new class{constructor(){this.size=0}get key(){throw A(57766)}get value(){throw A(16141)}get color(){throw A(16727)}get left(){throw A(29726)}get right(){throw A(36894)}copy(e,t,n,s,i){return this}insert(e,t,n){return new ae(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(e){this.comparator=e,this.data=new q(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Uo(this.data.getIterator())}getIteratorFrom(e){return new Uo(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof O)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new O(this.comparator);return t.data=e,t}}class Uo{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Ut(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(e){this.fields=e,e.sort(G.comparator)}static empty(){return new me([])}unionWith(e){let t=new O(G.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new me(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Xt(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Su extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m_(){return typeof atob<"u"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Su("Invalid base64 string: "+i):i}})(e);return new j(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new j(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return P(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}j.EMPTY_BYTE_STRING=new j("");const Wh=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Me(r){if(v(!!r,39018),typeof r=="string"){let e=0;const t=Wh.exec(r);if(v(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:z(r.seconds),nanos:z(r.nanos)}}function z(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Oe(r){return typeof r=="string"?j.fromBase64String(r):j.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cu="server_timestamp",Du="__type__",xu="__previous_value__",Nu="__local_write_time__";function ls(r){return(r?.mapValue?.fields||{})[Du]?.stringValue===Cu}function hs(r){const e=r.mapValue.fields[xu];return ls(e)?hs(e):e}function tr(r){const e=Me(r.mapValue.fields[Nu].timestampValue);return new F(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hh{constructor(e,t,n,s,i,o,a,u,c,l,h){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=l,this.apiKey=h}}const nr="(default)";class Rt{constructor(e,t){this.projectId=e,this.database=t||nr}static empty(){return new Rt("","")}get isDefaultDatabase(){return this.database===nr}isEqual(e){return e instanceof Rt&&e.projectId===this.projectId&&e.database===this.database}}function Jh(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new g(m.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Rt(r.options.projectId,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vi="__type__",ku="__max__",Je={mapValue:{fields:{__type__:{stringValue:ku}}}},Pi="__vector__",an="value",kr={nullValue:"NULL_VALUE"};function tt(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?ls(r)?4:Mu(r)?9007199254740991:ds(r)?10:11:A(28295,{value:r})}function Ne(r,e){if(r===e)return!0;const t=tt(r);if(t!==tt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return tr(r).isEqual(tr(e));case 3:return(function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=Me(s.timestampValue),a=Me(i.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(s,i){return Oe(s.bytesValue).isEqual(Oe(i.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(s,i){return z(s.geoPointValue.latitude)===z(i.geoPointValue.latitude)&&z(s.geoPointValue.longitude)===z(i.geoPointValue.longitude)})(r,e);case 2:return(function(s,i){if("integerValue"in s&&"integerValue"in i)return z(s.integerValue)===z(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=z(s.doubleValue),a=z(i.doubleValue);return o===a?Yn(o)===Yn(a):isNaN(o)&&isNaN(a)}return!1})(r,e);case 9:return Xt(r.arrayValue.values||[],e.arrayValue.values||[],Ne);case 10:case 11:return(function(s,i){const o=s.mapValue.fields||{},a=i.mapValue.fields||{};if(qo(o)!==qo(a))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(a[u]===void 0||!Ne(o[u],a[u])))return!1;return!0})(r,e);default:return A(52216,{left:r})}}function rr(r,e){return(r.values||[]).find((t=>Ne(t,e)))!==void 0}function nt(r,e){if(r===e)return 0;const t=tt(r),n=tt(e);if(t!==n)return P(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return P(r.booleanValue,e.booleanValue);case 2:return(function(i,o){const a=z(i.integerValue||i.doubleValue),u=z(o.integerValue||o.doubleValue);return a<u?-1:a>u?1:a===u?0:isNaN(a)?isNaN(u)?0:-1:1})(r,e);case 3:return Bo(r.timestampValue,e.timestampValue);case 4:return Bo(tr(r),tr(e));case 5:return $s(r.stringValue,e.stringValue);case 6:return(function(i,o){const a=Oe(i),u=Oe(o);return a.compareTo(u)})(r.bytesValue,e.bytesValue);case 7:return(function(i,o){const a=i.split("/"),u=o.split("/");for(let c=0;c<a.length&&c<u.length;c++){const l=P(a[c],u[c]);if(l!==0)return l}return P(a.length,u.length)})(r.referenceValue,e.referenceValue);case 8:return(function(i,o){const a=P(z(i.latitude),z(o.latitude));return a!==0?a:P(z(i.longitude),z(o.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return zo(r.arrayValue,e.arrayValue);case 10:return(function(i,o){const a=i.fields||{},u=o.fields||{},c=a[an]?.arrayValue,l=u[an]?.arrayValue,h=P(c?.values?.length||0,l?.values?.length||0);return h!==0?h:zo(c,l)})(r.mapValue,e.mapValue);case 11:return(function(i,o){if(i===Je.mapValue&&o===Je.mapValue)return 0;if(i===Je.mapValue)return 1;if(o===Je.mapValue)return-1;const a=i.fields||{},u=Object.keys(a),c=o.fields||{},l=Object.keys(c);u.sort(),l.sort();for(let h=0;h<u.length&&h<l.length;++h){const d=$s(u[h],l[h]);if(d!==0)return d;const _=nt(a[u[h]],c[l[h]]);if(_!==0)return _}return P(u.length,l.length)})(r.mapValue,e.mapValue);default:throw A(23264,{he:t})}}function Bo(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return P(r,e);const t=Me(r),n=Me(e),s=P(t.seconds,n.seconds);return s!==0?s:P(t.nanos,n.nanos)}function zo(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=nt(t[s],n[s]);if(i)return i}return P(t.length,n.length)}function un(r){return Ys(r)}function Ys(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=Me(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Oe(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return T.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=Ys(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${Ys(t.fields[o])}`;return s+"}"})(r.mapValue):A(61005,{value:r})}function Fr(r){switch(tt(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=hs(r);return e?16+Fr(e):16;case 5:return 2*r.stringValue.length;case 6:return Oe(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+Fr(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return ct(n.fields,((i,o)=>{s+=i.length+Fr(o)})),s})(r.mapValue);default:throw A(13486,{value:r})}}function Vt(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function sr(r){return!!r&&"integerValue"in r}function Fu(r){return sr(r)||(function(t){return!!t&&"doubleValue"in t})(r)}function ir(r){return!!r&&"arrayValue"in r}function Go(r){return!!r&&"nullValue"in r}function $o(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Mr(r){return!!r&&"mapValue"in r}function ds(r){return(r?.mapValue?.fields||{})[Vi]?.stringValue===Pi}function jn(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return ct(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=jn(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=jn(r.arrayValue.values[t]);return e}return{...r}}function Mu(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===ku}const Ou={mapValue:{fields:{[Vi]:{stringValue:Pi},[an]:{arrayValue:{}}}}};function Yh(r){return"nullValue"in r?kr:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?Vt(Rt.empty(),T.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?ds(r)?Ou:{mapValue:{}}:A(35942,{value:r})}function Xh(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?Vt(Rt.empty(),T.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?Ou:"mapValue"in r?ds(r)?{mapValue:{}}:Je:A(61959,{value:r})}function Ko(r,e){const t=nt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function Qo(r,e){const t=nt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(e){this.value=e}static empty(){return new se({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!Mr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=jn(t)}setAll(e){let t=G.emptyPath(),n={},s=[];e.forEach(((o,a)=>{if(!t.isImmediateParentOf(a)){const u=this.getFieldsMap(t);this.applyChanges(u,n,s),n={},s=[],t=a.popLast()}o?n[a.lastSegment()]=jn(o):s.push(a.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());Mr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ne(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];Mr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){ct(t,((s,i)=>e[s]=i));for(const s of n)delete e[s]}clone(){return new se(jn(this.value))}}function Lu(r){const e=[];return ct(r.fields,((t,n)=>{const s=new G([t]);if(Mr(n)){const i=Lu(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)})),new me(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e,t,n,s,i,o,a){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(e){return new B(e,0,R.min(),R.min(),R.min(),se.empty(),0)}static newFoundDocument(e,t,n,s){return new B(e,1,t,R.min(),n,s,0)}static newNoDocument(e,t){return new B(e,2,t,R.min(),R.min(),se.empty(),0)}static newUnknownDocument(e,t){return new B(e,3,t,R.min(),R.min(),se.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(R.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=se.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=se.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=R.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof B&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new B(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e,t){this.position=e,this.inclusive=t}}function jo(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=T.comparator(T.fromName(o.referenceValue),t.key):n=nt(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function Wo(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!Ne(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class or{constructor(e,t="asc"){this.field=e,this.dir=t}}function Zh(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qu{}class N extends qu{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new ed(e,t,n):t==="array-contains"?new rd(e,n):t==="in"?new Ku(e,n):t==="not-in"?new sd(e,n):t==="array-contains-any"?new id(e,n):new N(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new td(e,n):new nd(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(nt(t,this.value)):t!==null&&tt(this.value)===tt(t)&&this.matchesComparison(nt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return A(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class M extends qu{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new M(e,t)}matches(e){return cn(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function cn(r){return r.op==="and"}function Xs(r){return r.op==="or"}function bi(r){return Uu(r)&&cn(r)}function Uu(r){for(const e of r.filters)if(e instanceof M)return!1;return!0}function Zs(r){if(r instanceof N)return r.field.canonicalString()+r.op.toString()+un(r.value);if(bi(r))return r.filters.map((e=>Zs(e))).join(",");{const e=r.filters.map((t=>Zs(t))).join(",");return`${r.op}(${e})`}}function Bu(r,e){return r instanceof N?(function(n,s){return s instanceof N&&n.op===s.op&&n.field.isEqual(s.field)&&Ne(n.value,s.value)})(r,e):r instanceof M?(function(n,s){return s instanceof M&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,a)=>i&&Bu(o,s.filters[a])),!0):!1})(r,e):void A(19439)}function zu(r,e){const t=r.filters.concat(e);return M.create(t,r.op)}function Gu(r){return r instanceof N?(function(t){return`${t.field.canonicalString()} ${t.op} ${un(t.value)}`})(r):r instanceof M?(function(t){return t.op.toString()+" {"+t.getFilters().map(Gu).join(" ,")+"}"})(r):"Filter"}class ed extends N{constructor(e,t,n){super(e,t,n),this.key=T.fromName(n.referenceValue)}matches(e){const t=T.comparator(e.key,this.key);return this.matchesComparison(t)}}class td extends N{constructor(e,t){super(e,"in",t),this.keys=$u("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class nd extends N{constructor(e,t){super(e,"not-in",t),this.keys=$u("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function $u(r,e){return(e.arrayValue?.values||[]).map((t=>T.fromName(t.referenceValue)))}class rd extends N{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ir(t)&&rr(t.arrayValue,this.value)}}class Ku extends N{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&rr(this.value.arrayValue,t)}}class sd extends N{constructor(e,t){super(e,"not-in",t)}matches(e){if(rr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!rr(this.value.arrayValue,t)}}class id extends N{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ir(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>rr(this.value.arrayValue,n)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class od{constructor(e,t=null,n=[],s=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=a,this.Te=null}}function ei(r,e=null,t=[],n=[],s=null,i=null,o=null){return new od(r,e,t,n,s,i,o)}function Pt(r){const e=E(r);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>Zs(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),dr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>un(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>un(n))).join(",")),e.Te=t}return e.Te}function mr(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!Zh(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Bu(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!Wo(r.startAt,e.startAt)&&Wo(r.endAt,e.endAt)}function Qr(r){return T.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function jr(r,e){return r.filters.filter((t=>t instanceof N&&t.field.isEqual(e)))}function Ho(r,e,t){let n=kr,s=!0;for(const i of jr(r,e)){let o=kr,a=!0;switch(i.op){case"<":case"<=":o=Yh(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,a=!1;break;case"!=":case"not-in":o=kr}Ko({value:n,inclusive:s},{value:o,inclusive:a})<0&&(n=o,s=a)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];Ko({value:n,inclusive:s},{value:o,inclusive:t.inclusive})<0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}function Jo(r,e,t){let n=Je,s=!0;for(const i of jr(r,e)){let o=Je,a=!0;switch(i.op){case">=":case">":o=Xh(i.value),a=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,a=!1;break;case"!=":case"not-in":o=Je}Qo({value:n,inclusive:s},{value:o,inclusive:a})>0&&(n=o,s=a)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];Qo({value:n,inclusive:s},{value:o,inclusive:t.inclusive})>0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue{constructor(e,t=null,n=[],s=[],i=null,o="F",a=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=u,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function Qu(r,e,t,n,s,i,o,a){return new Ue(r,e,t,n,s,i,o,a)}function En(r){return new Ue(r)}function Yo(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function ad(r){return T.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Si(r){return r.collectionGroup!==null}function Ht(r){const e=E(r);if(e.Ie===null){e.Ie=[];const t=new Set;for(const i of e.explicitOrderBy)e.Ie.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new O(G.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((c=>{c.isInequality()&&(a=a.add(c.field))}))})),a})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.Ie.push(new or(i,n))})),t.has(G.keyField().canonicalString())||e.Ie.push(new or(G.keyField(),n))}return e.Ie}function de(r){const e=E(r);return e.Ee||(e.Ee=Wu(e,Ht(r))),e.Ee}function ju(r){const e=E(r);return e.Re||(e.Re=Wu(e,r.explicitOrderBy)),e.Re}function Wu(r,e){if(r.limitType==="F")return ei(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new or(s.field,i)}));const t=r.endAt?new rt(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new rt(r.startAt.position,r.startAt.inclusive):null;return ei(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function ti(r,e){const t=r.filters.concat([e]);return new Ue(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function ud(r,e){const t=r.explicitOrderBy.concat([e]);return new Ue(r.path,r.collectionGroup,t,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}function Wr(r,e,t){return new Ue(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function cd(r,e){return new Ue(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),r.limit,r.limitType,e,r.endAt)}function ld(r,e){return new Ue(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),r.limit,r.limitType,r.startAt,e)}function _r(r,e){return mr(de(r),de(e))&&r.limitType===e.limitType}function Hu(r){return`${Pt(de(r))}|lt:${r.limitType}`}function Qt(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((s=>Gu(s))).join(", ")}]`),dr(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((s=>un(s))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((s=>un(s))).join(",")),`Target(${n})`})(de(r))}; limitType=${r.limitType})`}function gr(r,e){return e.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):T.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,e)&&(function(n,s){for(const i of Ht(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,e)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,e)&&(function(n,s){return!(n.startAt&&!(function(o,a,u){const c=jo(o,a,u);return o.inclusive?c<=0:c<0})(n.startAt,Ht(n),s)||n.endAt&&!(function(o,a,u){const c=jo(o,a,u);return o.inclusive?c>=0:c>0})(n.endAt,Ht(n),s))})(r,e)}function Ju(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Yu(r){return(e,t)=>{let n=!1;for(const s of Ht(r)){const i=hd(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function hd(r,e,t){const n=r.field.isKeyField()?T.comparator(e.key,t.key):(function(i,o,a){const u=o.data.field(i),c=a.data.field(i);return u!==null&&c!==null?nt(u,c):A(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return A(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){ct(this.inner,((t,n)=>{for(const[s,i]of n)e(s,i)}))}isEmpty(){return bu(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dd=new q(T.comparator);function _e(){return dd}const Xu=new q(T.comparator);function Un(...r){let e=Xu;for(const t of r)e=e.insert(t.key,t);return e}function Zu(r){let e=Xu;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function Pe(){return Wn()}function ec(){return Wn()}function Wn(){return new Be((r=>r.toString()),((r,e)=>r.isEqual(e)))}const fd=new q(T.comparator),md=new O(T.comparator);function b(...r){let e=md;for(const t of r)e=e.add(t);return e}const _d=new O(P);function Ci(){return _d}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fs(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Yn(e)?"-0":e}}function Di(r){return{integerValue:""+r}}function ms(r,e){return gu(e)?Di(e):fs(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s{constructor(){this._=void 0}}function gd(r,e,t){return r instanceof ln?(function(s,i){const o={fields:{[Du]:{stringValue:Cu},[Nu]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&ls(i)&&(i=hs(i)),i&&(o.fields[xu]=i),{mapValue:o}})(t,e):r instanceof bt?nc(r,e):r instanceof St?rc(r,e):r instanceof Ct?(function(s,i){const o=tc(s,i),a=Hr(o)+Hr(s.Ae);return sr(o)&&sr(s.Ae)?Di(a):fs(s.serializer,a)})(r,e):r instanceof hn?(function(s,i){return Xo(s,i,Math.min)})(r,e):r instanceof dn?(function(s,i){return Xo(s,i,Math.max)})(r,e):void 0}function pd(r,e,t){return r instanceof bt?nc(r,e):r instanceof St?rc(r,e):t}function tc(r,e){return r instanceof Ct?Fu(e)?e:{integerValue:0}:null}class ln extends _s{}class bt extends _s{constructor(e){super(),this.elements=e}}function nc(r,e){const t=sc(e);for(const n of r.elements)t.some((s=>Ne(s,n)))||t.push(n);return{arrayValue:{values:t}}}class St extends _s{constructor(e){super(),this.elements=e}}function rc(r,e){let t=sc(e);for(const n of r.elements)t=t.filter((s=>!Ne(s,n)));return{arrayValue:{values:t}}}class xi extends _s{constructor(e,t){super(),this.serializer=e,this.Ae=t}}class Ct extends xi{}class hn extends xi{}class dn extends xi{}function Xo(r,e,t){if(!Fu(e))return r.Ae;const n=t(Hr(e),Hr(r.Ae));return sr(e)&&sr(r.Ae)?Di(n):fs(r.serializer,n)}function Hr(r){return z(r.integerValue||r.doubleValue)}function sc(r){return ir(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(e,t){this.field=e,this.transform=t}}function yd(r,e){return r.field.isEqual(e.field)&&(function(n,s){return n instanceof bt&&s instanceof bt||n instanceof St&&s instanceof St?Xt(n.elements,s.elements,Ne):n instanceof Ct&&s instanceof Ct||n instanceof hn&&s instanceof hn||n instanceof dn&&s instanceof dn?Ne(n.Ae,s.Ae):n instanceof ln&&s instanceof ln})(r.transform,e.transform)}class Id{constructor(e,t){this.version=e,this.transformResults=t}}class ${constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new $}static exists(e){return new $(void 0,e)}static updateTime(e){return new $(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Or(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class gs{}function ic(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new An(r.key,$.none()):new wn(r.key,r.data,$.none());{const t=r.data,n=se.empty();let s=new O(G.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new ze(r.key,n,new me(s.toArray()),$.none())}}function Td(r,e,t){r instanceof wn?(function(s,i,o){const a=s.value.clone(),u=ea(s.fieldTransforms,i,o.transformResults);a.setAll(u),i.convertToFoundDocument(o.version,a).setHasCommittedMutations()})(r,e,t):r instanceof ze?(function(s,i,o){if(!Or(s.precondition,i))return void i.convertToUnknownDocument(o.version);const a=ea(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(oc(s)),u.setAll(a),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function Hn(r,e,t,n){return r instanceof wn?(function(i,o,a,u){if(!Or(i.precondition,o))return a;const c=i.value.clone(),l=ta(i.fieldTransforms,u,o);return c.setAll(l),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null})(r,e,t,n):r instanceof ze?(function(i,o,a,u){if(!Or(i.precondition,o))return a;const c=ta(i.fieldTransforms,u,o),l=o.data;return l.setAll(oc(i)),l.setAll(c),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),a===null?null:a.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((h=>h.field)))})(r,e,t,n):(function(i,o,a){return Or(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a})(r,e,t)}function Ed(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=tc(n.transform,s||null);i!=null&&(t===null&&(t=se.empty()),t.set(n.field,i))}return t||null}function Zo(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&Xt(n,s,((i,o)=>yd(i,o)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class wn extends gs{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class ze extends gs{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function oc(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function ea(r,e,t){const n=new Map;v(r.length===t.length,32656,{Ve:t.length,de:r.length});for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,a=e.data.field(i.field);n.set(i.field,pd(o,a,t[s]))}return n}function ta(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,gd(i,o,e))}return n}class An extends gs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Ni extends gs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&Td(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Hn(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Hn(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=ec();return this.mutations.forEach((s=>{const i=e.get(s.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=t.has(s.key)?null:a;const u=ic(o,a);u!==null&&n.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(R.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),b())}isEqual(e){return this.batchId===e.batchId&&Xt(this.mutations,e.mutations,((t,n)=>Zo(t,n)))&&Xt(this.baseMutations,e.baseMutations,((t,n)=>Zo(t,n)))}}class Fi{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){v(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let s=(function(){return fd})();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new Fi(e,t,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mi{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ac{constructor(e,t,n){this.alias=e,this.aggregateType=t,this.fieldPath=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wd{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Y,k;function uc(r){switch(r){case m.OK:return A(64938);case m.CANCELLED:case m.UNKNOWN:case m.DEADLINE_EXCEEDED:case m.RESOURCE_EXHAUSTED:case m.INTERNAL:case m.UNAVAILABLE:case m.UNAUTHENTICATED:return!1;case m.INVALID_ARGUMENT:case m.NOT_FOUND:case m.ALREADY_EXISTS:case m.PERMISSION_DENIED:case m.FAILED_PRECONDITION:case m.ABORTED:case m.OUT_OF_RANGE:case m.UNIMPLEMENTED:case m.DATA_LOSS:return!0;default:return A(15467,{code:r})}}function cc(r){if(r===void 0)return W("GRPC error has no .code"),m.UNKNOWN;switch(r){case Y.OK:return m.OK;case Y.CANCELLED:return m.CANCELLED;case Y.UNKNOWN:return m.UNKNOWN;case Y.DEADLINE_EXCEEDED:return m.DEADLINE_EXCEEDED;case Y.RESOURCE_EXHAUSTED:return m.RESOURCE_EXHAUSTED;case Y.INTERNAL:return m.INTERNAL;case Y.UNAVAILABLE:return m.UNAVAILABLE;case Y.UNAUTHENTICATED:return m.UNAUTHENTICATED;case Y.INVALID_ARGUMENT:return m.INVALID_ARGUMENT;case Y.NOT_FOUND:return m.NOT_FOUND;case Y.ALREADY_EXISTS:return m.ALREADY_EXISTS;case Y.PERMISSION_DENIED:return m.PERMISSION_DENIED;case Y.FAILED_PRECONDITION:return m.FAILED_PRECONDITION;case Y.ABORTED:return m.ABORTED;case Y.OUT_OF_RANGE:return m.OUT_OF_RANGE;case Y.UNIMPLEMENTED:return m.UNIMPLEMENTED;case Y.DATA_LOSS:return m.DATA_LOSS;default:return A(39323,{code:r})}}(k=Y||(Y={}))[k.OK=0]="OK",k[k.CANCELLED=1]="CANCELLED",k[k.UNKNOWN=2]="UNKNOWN",k[k.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",k[k.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",k[k.NOT_FOUND=5]="NOT_FOUND",k[k.ALREADY_EXISTS=6]="ALREADY_EXISTS",k[k.PERMISSION_DENIED=7]="PERMISSION_DENIED",k[k.UNAUTHENTICATED=16]="UNAUTHENTICATED",k[k.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",k[k.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",k[k.ABORTED=10]="ABORTED",k[k.OUT_OF_RANGE=11]="OUT_OF_RANGE",k[k.UNIMPLEMENTED=12]="UNIMPLEMENTED",k[k.INTERNAL=13]="INTERNAL",k[k.UNAVAILABLE=14]="UNAVAILABLE",k[k.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ni=null;function Ad(r){if(ni)throw new Error("a TestingHooksSpi instance is already set");ni=r}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lc(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vd=new Et([4294967295,4294967295],0);function na(r){const e=lc().encode(r),t=new Zl;return t.update(e),new Uint8Array(t.digest())}function ra(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Et([t,n],0),new Et([s,i],0)]}class Oi{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Bn(`Invalid padding: ${t}`);if(n<0)throw new Bn(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Bn(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Bn(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=Et.fromNumber(this.ge)}ye(e,t,n){let s=e.add(t.multiply(Et.fromNumber(n)));return s.compare(vd)===1&&(s=new Et([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=na(e),[n,s]=ra(t);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);if(!this.we(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Oi(i,s,t);return n.forEach((a=>o.insert(a))),o}insert(e){if(this.ge===0)return;const t=na(e),[n,s]=ra(t);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);this.Se(o)}}Se(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Bn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(e,t,n,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,pr.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new vn(R.min(),s,new q(P),_e(),b())}}class pr{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new pr(n,t,b(),b(),b())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr{constructor(e,t,n,s){this.be=e,this.removedTargetIds=t,this.key=n,this.De=s}}class hc{constructor(e,t){this.targetId=e,this.Ce=t}}class dc{constructor(e,t,n=j.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class sa{constructor(e){this.targetId=e,this.ve=0,this.Fe=ia(),this.Me=j.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=b(),t=b(),n=b();return this.Fe.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:A(38017,{changeType:i})}})),new pr(this.Me,this.xe,e,t,n)}qe(){this.Oe=!1,this.Fe=ia()}Ke(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,v(this.ve>=0,3241,{ve:this.ve,targetId:this.targetId})}Qe(){this.Oe=!0,this.xe=!0}}const Nn="WatchChangeAggregator";class Rd{constructor(e){this.Ge=e,this.ze=new Map,this.je=_e(),this.Je=Vr(),this.He=Vr(),this.Ze=new q(P)}Xe(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const n=this.ze.get(t);if(n)switch(e.state){case 0:this.nt(t)&&n.Le(e.resumeToken);break;case 1:n.We(),n.Ne||n.qe(),n.Le(e.resumeToken);break;case 2:n.We(),n.Ne||this.removeTarget(t);break;case 3:this.nt(t)&&(n.Qe(),n.Le(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),n.Le(e.resumeToken));break;default:A(56790,{state:e.state})}else p(Nn,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((n,s)=>{this.nt(s)&&t(s)}))}it(e){const t=e.targetId,n=e.Ce.count,s=this.st(t);if(s){const i=s.target;if(Qr(i))if(n===0){const o=new T(i.path);this.et(t,o,B.newNoDocument(o,R.min()))}else v(n===1,20013,{expectedCount:n});else{const o=this.ot(t);if(o!==n){const a=this._t(e),u=a?this.ut(a,e,o):1;if(u!==0){this.rt(t);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,c)}ni?.o((function(l,h,d,_,I){const y={localCacheCount:l,existenceFilterCount:h.count,databaseId:d.database,projectId:d.projectId},w=h.unchangedNames;return w&&(y.bloomFilter={applied:I===0,hashCount:w?.hashCount??0,bitmapLength:w?.bits?.bitmap?.length??0,padding:w?.bits?.padding??0,mightContain:V=>_?.mightContain(V)??!1}),y})(o,e.Ce,this.Ge.lt(),a,u))}}}}_t(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,a;try{o=Oe(n).toUint8Array()}catch(u){if(u instanceof Su)return Te("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{a=new Oi(o,s,i)}catch(u){return Te(u instanceof Bn?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return a.ge===0?null:a}ut(e,t,n){return t.Ce.count===n-this.ht(e,t.targetId)?0:2}ht(e,t){const n=this.Ge.getRemoteKeysForTarget(t);let s=0;return n.forEach((i=>{const o=this.Ge.lt(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(a)||(this.et(t,i,null),s++)})),s}Pt(e){const t=new Map;this.ze.forEach(((i,o)=>{const a=this.st(o);if(a){if(i.current&&Qr(a.target)){const u=new T(a.target.path);this.Tt(u).has(o)||this.It(o,u)||this.et(o,u,B.newNoDocument(u,e))}i.Be&&(t.set(o,i.ke()),i.qe())}}));let n=b();this.He.forEach(((i,o)=>{let a=!0;o.forEachWhile((u=>{const c=this.st(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)})),a&&(n=n.add(i))})),this.je.forEach(((i,o)=>o.setReadTime(e)));const s=new vn(e,t,this.Ze,this.je,n);return this.je=_e(),this.Je=Vr(),this.He=Vr(),this.Ze=new q(P),s}Ye(e,t){const n=this.ze.get(e);if(!n||!this.nt(e))return void p(Nn,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.It(e,t.key)?2:0;n.Ke(t.key,s),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.Tt(t.key).add(e)),this.He=this.He.insert(t.key,this.Et(t.key).add(e))}et(e,t,n){const s=this.ze.get(e);s&&this.nt(e)?(this.It(e,t)?s.Ke(t,1):s.Ue(t),this.He=this.He.insert(t,this.Et(t).delete(e)),this.He=this.He.insert(t,this.Et(t).add(e)),n&&(this.je=this.je.insert(t,n))):p(Nn,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ze.delete(e)}ot(e){const t=this.ze.get(e);if(!t)return 0;const n=t.ke();return this.Ge.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}$e(e){let t=this.ze.get(e);t||(p(Nn,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new sa(e),this.ze.set(e,t)),t.$e()}Et(e){let t=this.He.get(e);return t||(t=new O(P),this.He=this.He.insert(e,t)),t}Tt(e){let t=this.Je.get(e);return t||(t=new O(P),this.Je=this.Je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||p(Nn,"Detected inactive target",e),t}st(e){const t=this.ze.get(e);return t===void 0||t.Ne?null:this.Ge.Rt(e)}rt(e){this.ze.set(e,new sa(e)),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}It(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Vr(){return new q(T.comparator)}function ia(){return new q(T.comparator)}const Vd={asc:"ASCENDING",desc:"DESCENDING"},Pd={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},bd={and:"AND",or:"OR"};class Sd{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ri(r,e){return r.useProto3Json||dr(e)?e:{value:e}}function fn(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function fc(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function Cd(r,e){return fn(r,e.toTimestamp())}function H(r){return v(!!r,49232),R.fromTimestamp((function(t){const n=Me(t);return new F(n.seconds,n.nanos)})(r))}function Li(r,e){return si(r,e).canonicalString()}function si(r,e){const t=(function(s){return new D(["projects",s.projectId,"databases",s.database])})(r).child("documents");return e===void 0?t:t.child(e)}function mc(r){const e=D.fromString(r);return v(Ac(e),10190,{key:e.toString()}),e}function ar(r,e){return Li(r.databaseId,e.path)}function Ce(r,e){const t=mc(e);if(t.get(1)!==r.databaseId.projectId)throw new g(m.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new g(m.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new T(pc(t))}function _c(r,e){return Li(r.databaseId,e)}function gc(r){const e=mc(r);return e.length===4?D.emptyPath():pc(e)}function ii(r){return new D(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function pc(r){return v(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function oa(r,e,t){return{name:ar(r,e),fields:t.value.mapValue.fields}}function ps(r,e,t){const n=Ce(r,e.name),s=H(e.updateTime),i=e.createTime?H(e.createTime):R.min(),o=new se({mapValue:{fields:e.fields}}),a=B.newFoundDocument(n,s,i,o);return t&&a.setHasCommittedMutations(),t?a.setHasCommittedMutations():a}function Dd(r,e){return"found"in e?(function(n,s){v(!!s.found,43571),s.found.name,s.found.updateTime;const i=Ce(n,s.found.name),o=H(s.found.updateTime),a=s.found.createTime?H(s.found.createTime):R.min(),u=new se({mapValue:{fields:s.found.fields}});return B.newFoundDocument(i,o,a,u)})(r,e):"missing"in e?(function(n,s){v(!!s.missing,3894),v(!!s.readTime,22933);const i=Ce(n,s.missing),o=H(s.readTime);return B.newNoDocument(i,o)})(r,e):A(7234,{result:e})}function xd(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:A(39313,{state:c})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(c,l){return c.useProto3Json?(v(l===void 0||typeof l=="string",58123),j.fromBase64String(l||"")):(v(l===void 0||l instanceof Buffer||l instanceof Uint8Array,16193),j.fromUint8Array(l||new Uint8Array))})(r,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&(function(c){const l=c.code===void 0?m.UNKNOWN:cc(c.code);return new g(l,c.message||"")})(o);t=new dc(n,s,i,a||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=Ce(r,n.document.name),i=H(n.document.updateTime),o=n.document.createTime?H(n.document.createTime):R.min(),a=new se({mapValue:{fields:n.document.fields}}),u=B.newFoundDocument(s,i,o,a),c=n.targetIds||[],l=n.removedTargetIds||[];t=new Lr(c,l,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=Ce(r,n.document),i=n.readTime?H(n.readTime):R.min(),o=B.newNoDocument(s,i),a=n.removedTargetIds||[];t=new Lr([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=Ce(r,n.document),i=n.removedTargetIds||[];t=new Lr([],i,s,null)}else{if(!("filter"in e))return A(11601,{At:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new wd(s,i),a=n.targetId;t=new hc(a,o)}}return t}function ur(r,e){let t;if(e instanceof wn)t={update:oa(r,e.key,e.value)};else if(e instanceof An)t={delete:ar(r,e.key)};else if(e instanceof ze)t={update:oa(r,e.key,e.data),updateMask:Ld(e.fieldMask)};else{if(!(e instanceof Ni))return A(16599,{Vt:e.type});t={verify:ar(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(i,o){const a=o.transform;if(a instanceof ln)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof bt)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof St)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof Ct)return{fieldPath:o.field.canonicalString(),increment:a.Ae};if(a instanceof hn)return{fieldPath:o.field.canonicalString(),minimum:a.Ae};if(a instanceof dn)return{fieldPath:o.field.canonicalString(),maximum:a.Ae};throw A(20930,{transform:o.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:Cd(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:A(27497)})(r,e.precondition)),t}function oi(r,e){const t=e.currentDocument?(function(i){return i.updateTime!==void 0?$.updateTime(H(i.updateTime)):i.exists!==void 0?$.exists(i.exists):$.none()})(e.currentDocument):$.none(),n=e.updateTransforms?e.updateTransforms.map((s=>(function(o,a){let u=null;if("setToServerValue"in a)v(a.setToServerValue==="REQUEST_TIME",16630,{proto:a}),u=new ln;else if("appendMissingElements"in a){const l=a.appendMissingElements.values||[];u=new bt(l)}else if("removeAllFromArray"in a){const l=a.removeAllFromArray.values||[];u=new St(l)}else"increment"in a?u=new Ct(o,a.increment):"minimum"in a?u=new hn(o,a.minimum):"maximum"in a?u=new dn(o,a.maximum):A(16584,{proto:a});const c=G.fromServerFormat(a.fieldPath);return new Ft(c,u)})(r,s))):[];if(e.update){e.update.name;const s=Ce(r,e.update.name),i=new se({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=(function(u){const c=u.fieldPaths||[];return new me(c.map((l=>G.fromServerFormat(l))))})(e.updateMask);return new ze(s,i,o,t,n)}return new wn(s,i,t,n)}if(e.delete){const s=Ce(r,e.delete);return new An(s,t)}if(e.verify){const s=Ce(r,e.verify);return new Ni(s,t)}return A(1463,{proto:e})}function Nd(r,e){return r&&r.length>0?(v(e!==void 0,14353),r.map((t=>(function(s,i){let o=s.updateTime?H(s.updateTime):H(i);return o.isEqual(R.min())&&(o=H(i)),new Id(o,s.transformResults||[])})(t,e)))):[]}function yc(r,e){return{documents:[_c(r,e.path)]}}function ys(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=_c(r,s);const i=(function(c){if(c.length!==0)return wc(M.create(c,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const o=(function(c){if(c.length!==0)return c.map((l=>(function(d){return{field:We(d.field),direction:Fd(d.dir)}})(l)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const a=ri(r,e.limit);return a!==null&&(t.structuredQuery.limit=a),e.startAt&&(t.structuredQuery.startAt=(function(c){return{before:c.inclusive,values:c.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(c){return{before:!c.inclusive,values:c.position}})(e.endAt)),{dt:t,parent:s}}function Ic(r,e,t,n){const{dt:s,parent:i}=ys(r,e),o={},a=[];let u=0;return t.forEach((c=>{const l=n?c.alias:"aggregate_"+u++;o[l]=c.alias,c.aggregateType==="count"?a.push({alias:l,count:{}}):c.aggregateType==="avg"?a.push({alias:l,avg:{field:We(c.fieldPath)}}):c.aggregateType==="sum"&&a.push({alias:l,sum:{field:We(c.fieldPath)}})})),{request:{structuredAggregationQuery:{aggregations:a,structuredQuery:s.structuredQuery},parent:s.parent},ft:o,parent:i}}function Tc(r){let e=gc(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){v(n===1,65062);const l=t.from[0];l.allDescendants?s=l.collectionId:e=e.child(l.collectionId)}let i=[];t.where&&(i=(function(h){const d=Ec(h);return d instanceof M&&bi(d)?d.getFilters():[d]})(t.where));let o=[];t.orderBy&&(o=(function(h){return h.map((d=>(function(I){return new or(jt(I.field),(function(w){switch(w){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(I.direction))})(d)))})(t.orderBy));let a=null;t.limit&&(a=(function(h){let d;return d=typeof h=="object"?h.value:h,dr(d)?null:d})(t.limit));let u=null;t.startAt&&(u=(function(h){const d=!!h.before,_=h.values||[];return new rt(_,d)})(t.startAt));let c=null;return t.endAt&&(c=(function(h){const d=!h.before,_=h.values||[];return new rt(_,d)})(t.endAt)),Qu(e,s,o,i,a,"F",u,c)}function kd(r,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return A(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Ec(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=jt(t.unaryFilter.field);return N.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=jt(t.unaryFilter.field);return N.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=jt(t.unaryFilter.field);return N.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=jt(t.unaryFilter.field);return N.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return A(61313);default:return A(60726)}})(r):r.fieldFilter!==void 0?(function(t){return N.create(jt(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return A(58110);default:return A(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return M.create(t.compositeFilter.filters.map((n=>Ec(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return A(1026)}})(t.compositeFilter.op))})(r):A(30097,{filter:r})}function Fd(r){return Vd[r]}function Md(r){return Pd[r]}function Od(r){return bd[r]}function We(r){return{fieldPath:r.canonicalString()}}function jt(r){return G.fromServerFormat(r.fieldPath)}function wc(r){return r instanceof N?(function(t){if(t.op==="=="){if($o(t.value))return{unaryFilter:{field:We(t.field),op:"IS_NAN"}};if(Go(t.value))return{unaryFilter:{field:We(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if($o(t.value))return{unaryFilter:{field:We(t.field),op:"IS_NOT_NAN"}};if(Go(t.value))return{unaryFilter:{field:We(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:We(t.field),op:Md(t.op),value:t.value}}})(r):r instanceof M?(function(t){const n=t.getFilters().map((s=>wc(s)));return n.length===1?n[0]:{compositeFilter:{op:Od(t.op),filters:n}}})(r):A(54877,{filter:r})}function Ld(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Ac(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function vc(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e,t,n,s,i=R.min(),o=R.min(),a=j.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=u}withSequenceNumber(e){return new be(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new be(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new be(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new be(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rc{constructor(e){this.gt=e}}function qd(r,e){let t;if(e.document)t=ps(r.gt,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=T.fromSegments(e.noDocument.path),s=xt(e.noDocument.readTime);t=B.newNoDocument(n,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return A(56709);{const n=T.fromSegments(e.unknownDocument.path),s=xt(e.unknownDocument.version);t=B.newUnknownDocument(n,s)}}return e.readTime&&t.setReadTime((function(s){const i=new F(s[0],s[1]);return R.fromTimestamp(i)})(e.readTime)),t}function aa(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Jr(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=(function(i,o){return{name:ar(i,o.key),fields:o.data.value.mapValue.fields,updateTime:fn(i,o.version.toTimestamp()),createTime:fn(i,o.createTime.toTimestamp())}})(r.gt,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:Dt(e.version)};else{if(!e.isUnknownDocument())return A(57904,{document:e});n.unknownDocument={path:t.path.toArray(),version:Dt(e.version)}}return n}function Jr(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function Dt(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function xt(r){const e=new F(r.seconds,r.nanoseconds);return R.fromTimestamp(e)}function pt(r,e){const t=(e.baseMutations||[]).map((i=>oi(r.gt,i)));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const a=e.mutations[i+1];o.updateTransforms=a.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const n=e.mutations.map((i=>oi(r.gt,i))),s=F.fromMillis(e.localWriteTimeMs);return new ki(e.batchId,s,t,n)}function zn(r){const e=xt(r.readTime),t=r.lastLimboFreeSnapshotVersion!==void 0?xt(r.lastLimboFreeSnapshotVersion):R.min();let n;return n=(function(i){return i.documents!==void 0})(r.query)?(function(i){const o=i.documents.length;return v(o===1,1966,{count:o}),de(En(gc(i.documents[0])))})(r.query):(function(i){return de(Tc(i))})(r.query),new be(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,e,t,j.fromBase64String(r.resumeToken))}function Vc(r,e){const t=Dt(e.snapshotVersion),n=Dt(e.lastLimboFreeSnapshotVersion);let s;s=Qr(e.target)?yc(r.gt,e.target):ys(r.gt,e.target).dt;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:Pt(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function Is(r){const e=Tc({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Wr(e,e.limit,"L"):e}function Fs(r,e){return new Mi(e.largestBatchId,oi(r.gt,e.overlayMutation))}function ua(r,e){const t=e.path.lastSegment();return[r,he(e.path.popLast()),t]}function ca(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:Dt(n.readTime),documentKey:he(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ud{getBundleMetadata(e,t){return la(e).get(t).next((n=>{if(n)return(function(i){return{id:i.bundleId,createTime:xt(i.createTime),version:i.version}})(n)}))}saveBundleMetadata(e,t){return la(e).put((function(s){return{bundleId:s.id,createTime:Dt(H(s.createTime)),version:s.version}})(t))}getNamedQuery(e,t){return ha(e).get(t).next((n=>{if(n)return(function(i){return{name:i.name,query:Is(i.bundledQuery),readTime:xt(i.readTime)}})(n)}))}saveNamedQuery(e,t){return ha(e).put((function(s){return{name:s.name,readTime:Dt(H(s.readTime)),bundledQuery:s.bundledQuery}})(t))}}function la(r){return te(r,as)}function ha(r){return te(r,us)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts{constructor(e,t){this.serializer=e,this.userId=t}static yt(e,t){const n=t.uid||"";return new Ts(e,n)}getOverlay(e,t){return kn(e).get(ua(this.userId,t)).next((n=>n?Fs(this.serializer,n):null))}getOverlays(e,t){const n=Pe();return f.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(e,t,n){const s=[];return n.forEach(((i,o)=>{const a=new Mi(t,o);s.push(this.wt(e,a))})),f.waitFor(s)}removeOverlaysForBatchId(e,t,n){const s=new Set;t.forEach((o=>s.add(he(o.getCollectionPath()))));const i=[];return s.forEach((o=>{const a=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push(kn(e).X(Hs,a))})),f.waitFor(i)}getOverlaysForCollection(e,t,n){const s=Pe(),i=he(t),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return kn(e).J(Hs,o).next((a=>{for(const u of a){const c=Fs(this.serializer,u);s.set(c.getKey(),c)}return s}))}getOverlaysForCollectionGroup(e,t,n,s){const i=Pe();let o;const a=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return kn(e).ee({index:wu,range:a},((u,c,l)=>{const h=Fs(this.serializer,c);i.size()<s||h.largestBatchId===o?(i.set(h.getKey(),h),o=h.largestBatchId):l.done()})).next((()=>i))}wt(e,t){return kn(e).put((function(s,i,o){const[a,u,c]=ua(i,o.mutation.key);return{userId:i,collectionPath:u,documentId:c,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:ur(s.gt,o.mutation)}})(this.serializer,this.userId,t))}}function kn(r){return te(r,cs)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bd{St(e){return te(e,vi)}getSessionToken(e){return this.St(e).get("sessionToken").next((t=>{const n=t?.value;return n?j.fromUint8Array(n):j.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.St(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(){}bt(e,t){this.Dt(e,t),t.Ct()}Dt(e,t){if("nullValue"in e)this.vt(t,5);else if("booleanValue"in e)this.vt(t,10),t.Ft(e.booleanValue?1:0);else if("integerValue"in e)this.vt(t,15),t.Ft(z(e.integerValue));else if("doubleValue"in e){const n=z(e.doubleValue);isNaN(n)?this.vt(t,13):(this.vt(t,15),Yn(n)?t.Ft(0):t.Ft(n))}else if("timestampValue"in e){let n=e.timestampValue;this.vt(t,20),typeof n=="string"&&(n=Me(n)),t.Mt(`${n.seconds||""}`),t.Ft(n.nanos||0)}else if("stringValue"in e)this.xt(e.stringValue,t),this.Ot(t);else if("bytesValue"in e)this.vt(t,30),t.Nt(Oe(e.bytesValue)),this.Ot(t);else if("referenceValue"in e)this.Bt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.vt(t,45),t.Ft(n.latitude||0),t.Ft(n.longitude||0)}else"mapValue"in e?Mu(e)?this.vt(t,Number.MAX_SAFE_INTEGER):ds(e)?this.Lt(e.mapValue,t):(this.kt(e.mapValue,t),this.Ot(t)):"arrayValue"in e?(this.qt(e.arrayValue,t),this.Ot(t)):A(19022,{Kt:e})}xt(e,t){this.vt(t,25),this.Ut(e,t)}Ut(e,t){t.Mt(e)}kt(e,t){const n=e.fields||{};this.vt(t,55);for(const s of Object.keys(n))this.xt(s,t),this.Dt(n[s],t)}Lt(e,t){const n=e.fields||{};this.vt(t,53);const s=an,i=n[s].arrayValue?.values?.length||0;this.vt(t,15),t.Ft(z(i)),this.xt(s,t),this.Dt(n[s],t)}qt(e,t){const n=e.values||[];this.vt(t,50);for(const s of n)this.Dt(s,t)}Bt(e,t){this.vt(t,37),T.fromName(e).path.forEach((n=>{this.vt(t,60),this.Ut(n,t)}))}vt(e,t){e.Ft(t)}Ot(e){e.Ft(2)}}yt.$t=new yt;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bt=255;function zd(r){if(r===0)return 8;let e=0;return r>>4||(e+=4,r<<=4),r>>6||(e+=2,r<<=2),r>>7||(e+=1),e}function da(r){const e=64-(function(n){let s=0;for(let i=0;i<8;++i){const o=zd(255&n[i]);if(s+=o,o!==8)break}return s})(r);return Math.ceil(e/8)}class Gd{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Wt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Qt(n.value),n=t.next();this.Gt()}zt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.jt(n.value),n=t.next();this.Jt()}Ht(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Qt(n);else if(n<2048)this.Qt(960|n>>>6),this.Qt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Qt(480|n>>>12),this.Qt(128|63&n>>>6),this.Qt(128|63&n);else{const s=t.codePointAt(0);this.Qt(240|s>>>18),this.Qt(128|63&s>>>12),this.Qt(128|63&s>>>6),this.Qt(128|63&s)}}this.Gt()}Zt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.jt(n);else if(n<2048)this.jt(960|n>>>6),this.jt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.jt(480|n>>>12),this.jt(128|63&n>>>6),this.jt(128|63&n);else{const s=t.codePointAt(0);this.jt(240|s>>>18),this.jt(128|63&s>>>12),this.jt(128|63&s>>>6),this.jt(128|63&s)}}this.Jt()}Xt(e){const t=this.Yt(e),n=da(t);this.en(1+n),this.buffer[this.position++]=255&n;for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=255&t[s]}tn(e){const t=this.Yt(e),n=da(t);this.en(1+n),this.buffer[this.position++]=~(255&n);for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}nn(){this.rn(Bt),this.rn(255)}sn(){this._n(Bt),this._n(255)}reset(){this.position=0}seed(e){this.en(e.length),this.buffer.set(e,this.position),this.position+=e.length}an(){return this.buffer.slice(0,this.position)}Yt(e){const t=(function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)})(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let s=1;s<t.length;++s)t[s]^=n?255:0;return t}Qt(e){const t=255&e;t===0?(this.rn(0),this.rn(255)):t===Bt?(this.rn(Bt),this.rn(0)):this.rn(t)}jt(e){const t=255&e;t===0?(this._n(0),this._n(255)):t===Bt?(this._n(Bt),this._n(0)):this._n(e)}Gt(){this.rn(0),this.rn(1)}Jt(){this._n(0),this._n(1)}rn(e){this.en(1),this.buffer[this.position++]=e}_n(e){this.en(1),this.buffer[this.position++]=~e}en(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class $d{constructor(e){this.un=e}Nt(e){this.un.Wt(e)}Mt(e){this.un.Ht(e)}Ft(e){this.un.Xt(e)}Ct(){this.un.nn()}}class Kd{constructor(e){this.un=e}Nt(e){this.un.zt(e)}Mt(e){this.un.Zt(e)}Ft(e){this.un.tn(e)}Ct(){this.un.sn()}}class Fn{constructor(){this.un=new Gd,this.ascending=new $d(this.un),this.descending=new Kd(this.un)}seed(e){this.un.seed(e)}cn(e){return e===0?this.ascending:this.descending}an(){return this.un.an()}reset(){this.un.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(e,t,n,s){this.ln=e,this.hn=t,this.Pn=n,this.Tn=s}In(){const e=this.Tn.length,t=e===0||this.Tn[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.Tn,0),t!==e?n.set([0],this.Tn.length):++n[n.length-1],new It(this.ln,this.hn,this.Pn,n)}En(e,t,n){return{indexId:this.ln,uid:e,arrayValue:qr(this.Pn),directionalValue:qr(this.Tn),orderedDocumentKey:qr(t),documentKey:n.path.toArray()}}Rn(e,t,n){const s=this.En(e,t,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function Ke(r,e){let t=r.ln-e.ln;return t!==0?t:(t=fa(r.Pn,e.Pn),t!==0?t:(t=fa(r.Tn,e.Tn),t!==0?t:T.comparator(r.hn,e.hn)))}function fa(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}function qr(r){return iu()?(function(t){let n="";for(let s=0;s<t.length;s++)n+=String.fromCharCode(t[s]);return n})(r):r}function ma(r){return typeof r!="string"?r:(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(r)}class _a{constructor(e){this.An=new O(((t,n)=>G.comparator(t.field,n.field))),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.Vn=e.orderBy,this.dn=[];for(const t of e.filters){const n=t;n.isInequality()?this.An=this.An.add(n):this.dn.push(n)}}get mn(){return this.An.size>1}fn(e){if(v(e.collectionGroup===this.collectionId,49279),this.mn)return!1;const t=Qs(e);if(t!==void 0&&!this.gn(t))return!1;const n=mt(e);let s=new Set,i=0,o=0;for(;i<n.length&&this.gn(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.An.size>0){const a=this.An.getIterator().getNext();if(!s.has(a.field.canonicalString())){const u=n[i];if(!this.pn(a,u)||!this.yn(this.Vn[o++],u))return!1}++i}for(;i<n.length;++i){const a=n[i];if(o>=this.Vn.length||!this.yn(this.Vn[o++],a))return!1}return!0}wn(){if(this.mn)return null;let e=new O(G.comparator);const t=[];for(const n of this.dn)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new wt(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new wt(n.field,0))}for(const n of this.Vn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new wt(n.field,n.dir==="asc"?0:1)));return new en(en.UNKNOWN_ID,this.collectionId,t,tn.empty())}gn(e){for(const t of this.dn)if(this.pn(t,e))return!0;return!1}pn(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}yn(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pc(r){if(v(r instanceof N||r instanceof M,20012),r instanceof N){if(r instanceof Ku){const t=r.value.arrayValue?.values?.map((n=>N.create(r.field,"==",n)))||[];return M.create(t,"or")}return r}const e=r.filters.map((t=>Pc(t)));return M.create(e,r.op)}function Qd(r){if(r.getFilters().length===0)return[];const e=ci(Pc(r));return v(bc(e),7391),ai(e)||ui(e)?[e]:e.getFilters()}function ai(r){return r instanceof N}function ui(r){return r instanceof M&&bi(r)}function bc(r){return ai(r)||ui(r)||(function(t){if(t instanceof M&&Xs(t)){for(const n of t.getFilters())if(!ai(n)&&!ui(n))return!1;return!0}return!1})(r)}function ci(r){if(v(r instanceof N||r instanceof M,34018),r instanceof N)return r;if(r.filters.length===1)return ci(r.filters[0]);const e=r.filters.map((n=>ci(n)));let t=M.create(e,r.op);return t=Yr(t),bc(t)?t:(v(t instanceof M,64498),v(cn(t),40251),v(t.filters.length>1,57927),t.filters.reduce(((n,s)=>qi(n,s))))}function qi(r,e){let t;return v(r instanceof N||r instanceof M,38388),v(e instanceof N||e instanceof M,25473),t=r instanceof N?e instanceof N?(function(s,i){return M.create([s,i],"and")})(r,e):ga(r,e):e instanceof N?ga(e,r):(function(s,i){if(v(s.filters.length>0&&i.filters.length>0,48005),cn(s)&&cn(i))return zu(s,i.getFilters());const o=Xs(s)?s:i,a=Xs(s)?i:s,u=o.filters.map((c=>qi(c,a)));return M.create(u,"or")})(r,e),Yr(t)}function ga(r,e){if(cn(e))return zu(e,r.getFilters());{const t=e.filters.map((n=>qi(r,n)));return M.create(t,"or")}}function Yr(r){if(v(r instanceof N||r instanceof M,11850),r instanceof N)return r;const e=r.getFilters();if(e.length===1)return Yr(e[0]);if(Uu(r))return r;const t=e.map((s=>Yr(s))),n=[];return t.forEach((s=>{s instanceof N?n.push(s):s instanceof M&&(s.op===r.op?n.push(...s.filters):n.push(s))})),n.length===1?n[0]:M.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jd{constructor(){this.Sn=new Ui}addToCollectionParentIndex(e,t){return this.Sn.add(t),f.resolve()}getCollectionParents(e,t){return f.resolve(this.Sn.getEntries(t))}addFieldIndex(e,t){return f.resolve()}deleteFieldIndex(e,t){return f.resolve()}deleteAllFieldIndexes(e){return f.resolve()}createTargetIndexes(e,t){return f.resolve()}getDocumentsMatchingTarget(e,t){return f.resolve(null)}getIndexType(e,t){return f.resolve(0)}getFieldIndexes(e,t){return f.resolve([])}getNextCollectionGroupToUpdate(e){return f.resolve(null)}getMinOffset(e,t){return f.resolve(Ee.min())}getMinOffsetFromCollectionGroup(e,t){return f.resolve(Ee.min())}updateCollectionGroup(e,t,n){return f.resolve()}updateIndexEntries(e,t){return f.resolve()}}class Ui{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new O(D.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new O(D.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pa="IndexedDbIndexManager",Pr=new Uint8Array(0);class Wd{constructor(e,t){this.databaseId=t,this.bn=new Ui,this.Dn=new Be((n=>Pt(n)),((n,s)=>mr(n,s))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.bn.has(t)){const n=t.lastSegment(),s=t.popLast();e.addOnCommittedListener((()=>{this.bn.add(t)}));const i={collectionId:n,parent:he(s)};return ya(e).put(i)}return f.resolve()}getCollectionParents(e,t){const n=[],s=IDBKeyRange.bound([t,""],[uu(t),""],!1,!0);return ya(e).J(s).next((i=>{for(const o of i){if(o.collectionId!==t)break;n.push(Ve(o.parent))}return n}))}addFieldIndex(e,t){const n=Mn(e),s=(function(a){return{indexId:a.indexId,collectionGroup:a.collectionGroup,fields:a.fields.map((u=>[u.fieldPath.canonicalString(),u.kind]))}})(t);delete s.indexId;const i=n.add(s);if(t.indexState){const o=Gt(e);return i.next((a=>{o.put(ca(a,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return i.next()}deleteFieldIndex(e,t){const n=Mn(e),s=Gt(e),i=zt(e);return n.delete(t.indexId).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=Mn(e),n=zt(e),s=Gt(e);return t.X().next((()=>n.X())).next((()=>s.X()))}createTargetIndexes(e,t){return f.forEach(this.Cn(t),(n=>this.getIndexType(e,n).next((s=>{if(s===0||s===1){const i=new _a(n).wn();if(i!=null)return this.addFieldIndex(e,i)}}))))}getDocumentsMatchingTarget(e,t){const n=zt(e);let s=!0;const i=new Map;return f.forEach(this.Cn(t),(o=>this.vn(e,o).next((a=>{s&&(s=!!a),i.set(o,a)})))).next((()=>{if(s){let o=b();const a=[];return f.forEach(i,((u,c)=>{p(pa,`Using index ${(function(S){return`id=${S.indexId}|cg=${S.collectionGroup}|f=${S.fields.map((K=>`${K.fieldPath}:${K.kind}`)).join(",")}`})(u)} to execute ${Pt(t)}`);const l=(function(S,K){const Z=Qs(K);if(Z===void 0)return null;for(const J of jr(S,Z.fieldPath))switch(J.op){case"array-contains-any":return J.value.arrayValue.values||[];case"array-contains":return[J.value]}return null})(c,u),h=(function(S,K){const Z=new Map;for(const J of mt(K))for(const ue of jr(S,J.fieldPath))switch(ue.op){case"==":case"in":Z.set(J.fieldPath.canonicalString(),ue.value);break;case"not-in":case"!=":return Z.set(J.fieldPath.canonicalString(),ue.value),Array.from(Z.values())}return null})(c,u),d=(function(S,K){const Z=[];let J=!0;for(const ue of mt(K)){const xn=ue.kind===0?Ho(S,ue.fieldPath,S.startAt):Jo(S,ue.fieldPath,S.startAt);Z.push(xn.value),J&&(J=xn.inclusive)}return new rt(Z,J)})(c,u),_=(function(S,K){const Z=[];let J=!0;for(const ue of mt(K)){const xn=ue.kind===0?Jo(S,ue.fieldPath,S.endAt):Ho(S,ue.fieldPath,S.endAt);Z.push(xn.value),J&&(J=xn.inclusive)}return new rt(Z,J)})(c,u),I=this.Fn(u,c,d),y=this.Fn(u,c,_),w=this.Mn(u,c,h),V=this.xn(u.indexId,l,I,d.inclusive,y,_.inclusive,w);return f.forEach(V,(C=>n.Z(C,t.limit).next((S=>{S.forEach((K=>{const Z=T.fromSegments(K.documentKey);o.has(Z)||(o=o.add(Z),a.push(Z))}))}))))})).next((()=>a))}return f.resolve(null)}))}Cn(e){let t=this.Dn.get(e);return t||(e.filters.length===0?t=[e]:t=Qd(M.create(e.filters,"and")).map((n=>ei(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt))),this.Dn.set(e,t),t)}xn(e,t,n,s,i,o,a){const u=(t!=null?t.length:1)*Math.max(n.length,i.length),c=u/(t!=null?t.length:1),l=[];for(let h=0;h<u;++h){const d=t?this.On(t[h/c]):Pr,_=this.Nn(e,d,n[h%c],s),I=this.Bn(e,d,i[h%c],o),y=a.map((w=>this.Nn(e,d,w,!0)));l.push(...this.createRange(_,I,y))}return l}Nn(e,t,n,s){const i=new It(e,T.empty(),t,n);return s?i:i.In()}Bn(e,t,n,s){const i=new It(e,T.empty(),t,n);return s?i.In():i}vn(e,t){const n=new _a(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next((i=>{let o=null;for(const a of i)n.fn(a)&&(!o||a.fields.length>o.fields.length)&&(o=a);return o}))}getIndexType(e,t){let n=2;const s=this.Cn(t);return f.forEach(s,(i=>this.vn(e,i).next((o=>{o?n!==0&&o.fields.length<(function(u){let c=new O(G.comparator),l=!1;for(const h of u.filters)for(const d of h.getFlattenedFilters())d.field.isKeyField()||(d.op==="array-contains"||d.op==="array-contains-any"?l=!0:c=c.add(d.field));for(const h of u.orderBy)h.field.isKeyField()||(c=c.add(h.field));return c.size+(l?1:0)})(i)&&(n=1):n=0})))).next((()=>(function(o){return o.limit!==null})(t)&&s.length>1&&n===2?1:n))}Ln(e,t){const n=new Fn;for(const s of mt(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const o=n.cn(s.kind);yt.$t.bt(i,o)}return n.an()}On(e){const t=new Fn;return yt.$t.bt(e,t.cn(0)),t.an()}kn(e,t){const n=new Fn;return yt.$t.bt(Vt(this.databaseId,t),n.cn((function(i){const o=mt(i);return o.length===0?0:o[o.length-1].kind})(e))),n.an()}Mn(e,t,n){if(n===null)return[];let s=[];s.push(new Fn);let i=0;for(const o of mt(e)){const a=n[i++];for(const u of s)if(this.qn(t,o.fieldPath)&&ir(a))s=this.Kn(s,o,a);else{const c=u.cn(o.kind);yt.$t.bt(a,c)}}return this.Un(s)}Fn(e,t,n){return this.Mn(e,t,n.position)}Un(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].an();return t}Kn(e,t,n){const s=[...e],i=[];for(const o of n.arrayValue.values||[])for(const a of s){const u=new Fn;u.seed(a.an()),yt.$t.bt(o,u.cn(t.kind)),i.push(u)}return i}qn(e,t){return!!e.filters.find((n=>n instanceof N&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in")))}getFieldIndexes(e,t){const n=Mn(e),s=Gt(e);return(t?n.J(Ws,IDBKeyRange.bound(t,t)):n.J()).next((i=>{const o=[];return f.forEach(i,(a=>s.get([a.indexId,this.uid]).next((u=>{o.push((function(l,h){const d=h?new tn(h.sequenceNumber,new Ee(xt(h.readTime),new T(Ve(h.documentKey)),h.largestBatchId)):tn.empty(),_=l.fields.map((([I,y])=>new wt(G.fromServerFormat(I),y)));return new en(l.indexId,l.collectionGroup,_,d)})(a,u))})))).next((()=>o))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((t=>t.length===0?null:(t.sort(((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:P(n.collectionGroup,s.collectionGroup)})),t[0].collectionGroup)))}updateCollectionGroup(e,t,n){const s=Mn(e),i=Gt(e);return this.$n(e).next((o=>s.J(Ws,IDBKeyRange.bound(t,t)).next((a=>f.forEach(a,(u=>i.put(ca(u.indexId,this.uid,o,n))))))))}updateIndexEntries(e,t){const n=new Map;return f.forEach(t,((s,i)=>{const o=n.get(s.collectionGroup);return(o?f.resolve(o):this.getFieldIndexes(e,s.collectionGroup)).next((a=>(n.set(s.collectionGroup,a),f.forEach(a,(u=>this.Wn(e,s,u).next((c=>{const l=this.Qn(i,u);return c.isEqual(l)?f.resolve():this.Gn(e,i,u,c,l)})))))))}))}zn(e,t,n,s){return zt(e).put(s.En(this.uid,this.kn(n,t.key),t.key))}jn(e,t,n,s){return zt(e).delete(s.Rn(this.uid,this.kn(n,t.key),t.key))}Wn(e,t,n){const s=zt(e);let i=new O(Ke);return s.ee({index:Eu,range:IDBKeyRange.only([n.indexId,this.uid,qr(this.kn(n,t))])},((o,a)=>{i=i.add(new It(n.indexId,t,ma(a.arrayValue),ma(a.directionalValue)))})).next((()=>i))}Qn(e,t){let n=new O(Ke);const s=this.Ln(t,e);if(s==null)return n;const i=Qs(t);if(i!=null){const o=e.data.field(i.fieldPath);if(ir(o))for(const a of o.arrayValue.values||[])n=n.add(new It(t.indexId,e.key,this.On(a),s))}else n=n.add(new It(t.indexId,e.key,Pr,s));return n}Gn(e,t,n,s,i){p(pa,"Updating index entries for document '%s'",t.key);const o=[];return(function(u,c,l,h,d){const _=u.getIterator(),I=c.getIterator();let y=Ut(_),w=Ut(I);for(;y||w;){let V=!1,C=!1;if(y&&w){const S=l(y,w);S<0?C=!0:S>0&&(V=!0)}else y!=null?C=!0:V=!0;V?(h(w),w=Ut(I)):C?(d(y),y=Ut(_)):(y=Ut(_),w=Ut(I))}})(s,i,Ke,(a=>{o.push(this.zn(e,t,n,a))}),(a=>{o.push(this.jn(e,t,n,a))})),f.waitFor(o)}$n(e){let t=1;return Gt(e).ee({index:Tu,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((n,s,i)=>{i.done(),t=s.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((o,a)=>Ke(o,a))).filter(((o,a,u)=>!a||Ke(o,u[a-1])!==0));const s=[];s.push(e);for(const o of n){const a=Ke(o,e),u=Ke(o,t);if(a===0)s[0]=e.In();else if(a>0&&u<0)s.push(o),s.push(o.In());else if(u>0)break}s.push(t);const i=[];for(let o=0;o<s.length;o+=2){if(this.Jn(s[o],s[o+1]))return[];const a=s[o].Rn(this.uid,Pr,T.empty()),u=s[o+1].Rn(this.uid,Pr,T.empty());i.push(IDBKeyRange.bound(a,u))}return i}Jn(e,t){return Ke(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(Ia)}getMinOffset(e,t){return f.mapArray(this.Cn(t),(n=>this.vn(e,n).next((s=>s||A(44426))))).next(Ia)}}function ya(r){return te(r,er)}function zt(r){return te(r,Qn)}function Mn(r){return te(r,Ai)}function Gt(r){return te(r,Kn)}function Ia(r){v(r.length!==0,28825);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;Ti(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new Ee(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Sc=41943040;class le{static withCacheSize(e){return new le(e,le.DEFAULT_COLLECTION_PERCENTILE,le.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cc(r,e,t){const n=r.store(Ae),s=r.store(nn),i=[],o=IDBKeyRange.only(t.batchId);let a=0;const u=n.ee({range:o},((l,h,d)=>(a++,d.delete())));i.push(u.next((()=>{v(a===1,47070,{batchId:t.batchId})})));const c=[];for(const l of t.mutations){const h=pu(e,l.key.path,t.batchId);i.push(s.delete(h)),c.push(l.key)}return f.waitFor(i).next((()=>c))}function Xr(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw A(14731);e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */le.DEFAULT_COLLECTION_PERCENTILE=10,le.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,le.DEFAULT=new le(Sc,le.DEFAULT_COLLECTION_PERCENTILE,le.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),le.DISABLED=new le(-1,0,0);class Es{constructor(e,t,n,s){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=s,this.Hn={}}static yt(e,t,n,s){v(e.uid!=="",64387);const i=e.isAuthenticated()?e.uid:"";return new Es(i,t,n,s)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Qe(e).ee({index:Tt,range:n},((s,i,o)=>{t=!1,o.done()})).next((()=>t))}addMutationBatch(e,t,n,s){const i=Wt(e),o=Qe(e);return o.add({}).next((a=>{v(typeof a=="number",49019);const u=new ki(a,t,n,s),c=(function(_,I,y){const w=y.baseMutations.map((C=>ur(_.gt,C))),V=y.mutations.map((C=>ur(_.gt,C)));return{userId:I,batchId:y.batchId,localWriteTimeMs:y.localWriteTime.toMillis(),baseMutations:w,mutations:V}})(this.serializer,this.userId,u),l=[];let h=new O(((d,_)=>P(d.canonicalString(),_.canonicalString())));for(const d of s){const _=pu(this.userId,d.key.path,a);h=h.add(d.key.path.popLast()),l.push(o.put(c)),l.push(i.put(_,vh))}return h.forEach((d=>{l.push(this.indexManager.addToCollectionParentIndex(e,d))})),e.addOnCommittedListener((()=>{this.Hn[a]=u.keys()})),f.waitFor(l).next((()=>u))}))}lookupMutationBatch(e,t){return Qe(e).get(t).next((n=>n?(v(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:t}),pt(this.serializer,n)):null))}Zn(e,t){return this.Hn[t]?f.resolve(this.Hn[t]):this.lookupMutationBatch(e,t).next((n=>{if(n){const s=n.keys();return this.Hn[t]=s,s}return null}))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return Qe(e).ee({index:Tt,range:s},((o,a,u)=>{a.userId===this.userId&&(v(a.batchId>=n,47524,{Xn:n}),i=pt(this.serializer,a)),u.done()})).next((()=>i))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=Ze;return Qe(e).ee({index:Tt,range:t,reverse:!0},((s,i,o)=>{n=i.batchId,o.done()})).next((()=>n))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,Ze],[this.userId,Number.POSITIVE_INFINITY]);return Qe(e).J(Tt,t).next((n=>n.map((s=>pt(this.serializer,s)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=xr(this.userId,t.path),s=IDBKeyRange.lowerBound(n),i=[];return Wt(e).ee({range:s},((o,a,u)=>{const[c,l,h]=o,d=Ve(l);if(c===this.userId&&t.path.isEqual(d))return Qe(e).get(h).next((_=>{if(!_)throw A(61480,{Yn:o,batchId:h});v(_.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:_.userId,batchId:h}),i.push(pt(this.serializer,_))}));u.done()})).next((()=>i))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new O(P);const s=[];return t.forEach((i=>{const o=xr(this.userId,i.path),a=IDBKeyRange.lowerBound(o),u=Wt(e).ee({range:a},((c,l,h)=>{const[d,_,I]=c,y=Ve(_);d===this.userId&&i.path.isEqual(y)?n=n.add(I):h.done()}));s.push(u)})),f.waitFor(s).next((()=>this.er(e,n)))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1,i=xr(this.userId,n),o=IDBKeyRange.lowerBound(i);let a=new O(P);return Wt(e).ee({range:o},((u,c,l)=>{const[h,d,_]=u,I=Ve(d);h===this.userId&&n.isPrefixOf(I)?I.length===s&&(a=a.add(_)):l.done()})).next((()=>this.er(e,a)))}er(e,t){const n=[],s=[];return t.forEach((i=>{s.push(Qe(e).get(i).next((o=>{if(o===null)throw A(35274,{batchId:i});v(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:i}),n.push(pt(this.serializer,o))})))})),f.waitFor(s).next((()=>n))}removeMutationBatch(e,t){return Cc(e.le,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.tr(t.batchId)})),f.forEach(n,(s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))))}tr(e){delete this.Hn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return f.resolve();const n=IDBKeyRange.lowerBound((function(o){return[o]})(this.userId)),s=[];return Wt(e).ee({range:n},((i,o,a)=>{if(i[0]===this.userId){const u=Ve(i[1]);s.push(u)}else a.done()})).next((()=>{v(s.length===0,56720,{nr:s.map((i=>i.canonicalString()))})}))}))}containsKey(e,t){return Dc(e,this.userId,t)}rr(e){return xc(e).get(this.userId).next((t=>t||{userId:this.userId,lastAcknowledgedBatchId:Ze,lastStreamToken:""}))}}function Dc(r,e,t){const n=xr(e,t.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return Wt(r).ee({range:i,Y:!0},((a,u,c)=>{const[l,h,d]=a;l===e&&h===s&&(o=!0),c.done()})).next((()=>o))}function Qe(r){return te(r,Ae)}function Wt(r){return te(r,nn)}function xc(r){return te(r,Xn)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le{constructor(e){this.ir=e}next(){return this.ir+=2,this.ir}static sr(){return new Le(0)}static _r(){return new Le(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hd{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.ar(e).next((t=>{const n=new Le(t.highestTargetId);return t.highestTargetId=n.next(),this.ur(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.ar(e).next((t=>R.fromTimestamp(new F(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.ar(e).next((t=>t.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.ar(e).next((s=>(s.highestListenSequenceNumber=t,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.ur(e,s))))}addTargetData(e,t){return this.cr(e,t).next((()=>this.ar(e).next((n=>(n.targetCount+=1,this.lr(t,n),this.ur(e,n))))))}updateTargetData(e,t){return this.cr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>$t(e).delete(t.targetId))).next((()=>this.ar(e))).next((n=>(v(n.targetCount>0,8065),n.targetCount-=1,this.ur(e,n))))}removeTargets(e,t,n){let s=0;const i=[];return $t(e).ee(((o,a)=>{const u=zn(a);u.sequenceNumber<=t&&n.get(u.targetId)===null&&(s++,i.push(this.removeTargetData(e,u)))})).next((()=>f.waitFor(i))).next((()=>s))}forEachTarget(e,t){return $t(e).ee(((n,s)=>{const i=zn(s);t(i)}))}ar(e){return Ea(e).get(Kr).next((t=>(v(t!==null,2888),t)))}ur(e,t){return Ea(e).put(Kr,t)}cr(e,t){return $t(e).put(Vc(this.serializer,t))}lr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.ar(e).next((t=>t.targetCount))}getTargetData(e,t){const n=Pt(t),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return $t(e).ee({range:s,index:Iu},((o,a,u)=>{const c=zn(a);mr(t,c.target)&&(i=c,u.done())})).next((()=>i))}addMatchingKeys(e,t,n){const s=[],i=He(e);return t.forEach((o=>{const a=he(o.path);s.push(i.put({targetId:n,path:a})),s.push(this.referenceDelegate.addReference(e,n,o))})),f.waitFor(s)}removeMatchingKeys(e,t,n){const s=He(e);return f.forEach(t,(i=>{const o=he(i.path);return f.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(e,n,i)])}))}removeMatchingKeysForTargetId(e,t){const n=He(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),s=He(e);let i=b();return s.ee({range:n,Y:!0},((o,a,u)=>{const c=Ve(o[1]),l=new T(c);i=i.add(l)})).next((()=>i))}containsKey(e,t){const n=he(t.path),s=IDBKeyRange.bound([n],[uu(n)],!1,!0);let i=0;return He(e).ee({index:wi,Y:!0,range:s},(([o,a],u,c)=>{o!==0&&(i++,c.done())})).next((()=>i>0))}Rt(e,t){return $t(e).get(t).next((n=>n?zn(n):null))}}function $t(r){return te(r,rn)}function Ea(r){return te(r,At)}function He(r){return te(r,sn)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wa="LruGarbageCollector",Nc=1048576;function Aa([r,e],[t,n]){const s=P(r,t);return s===0?P(e,n):s}class Jd{constructor(e){this.hr=e,this.buffer=new O(Aa),this.Pr=0}Tr(){return++this.Pr}Ir(e){const t=[e,this.Tr()];if(this.buffer.size<this.hr)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();Aa(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class kc{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Er=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Er&&(this.Er.cancel(),this.Er=null)}get started(){return this.Er!==null}Rr(e){p(wa,`Garbage collection scheduled in ${e}ms`),this.Er=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Er=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){ut(t)?p(wa,"Ignoring IndexedDB error during garbage collection: ",t):await at(t)}await this.Rr(3e5)}))}}class Yd{constructor(e,t){this.Ar=e,this.params=t}calculateTargetCount(e,t){return this.Ar.Vr(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return f.resolve(fe.ce);const n=new Jd(t);return this.Ar.forEachTarget(e,(s=>n.Ir(s.sequenceNumber))).next((()=>this.Ar.dr(e,(s=>n.Ir(s))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.Ar.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Ar.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(p("LruGarbageCollector","Garbage collection skipped; disabled"),f.resolve(Ta)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(p("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Ta):this.mr(e,t)))}getCacheSize(e){return this.Ar.getCacheSize(e)}mr(e,t){let n,s,i,o,a,u,c;const l=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((h=>(h>this.params.maximumSequenceNumbersToCollect?(p("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${h}`),s=this.params.maximumSequenceNumbersToCollect):s=h,o=Date.now(),this.nthSequenceNumber(e,s)))).next((h=>(n=h,a=Date.now(),this.removeTargets(e,n,t)))).next((h=>(i=h,u=Date.now(),this.removeOrphanedDocuments(e,n)))).next((h=>(c=Date.now(),Kt()<=Fe.DEBUG&&p("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-l}ms
	Determined least recently used ${s} in `+(a-o)+`ms
	Removed ${i} targets in `+(u-a)+`ms
	Removed ${h} documents in `+(c-u)+`ms
Total Duration: ${c-l}ms`),f.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:h}))))}}function Fc(r,e){return new Yd(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xd{constructor(e,t){this.db=e,this.garbageCollector=Fc(this,t)}Vr(e){const t=this.gr(e);return this.db.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}gr(e){let t=0;return this.dr(e,(n=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}dr(e,t){return this.pr(e,((n,s)=>t(s)))}addReference(e,t,n){return br(e,n)}removeReference(e,t,n){return br(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return br(e,t)}yr(e,t){return(function(s,i){let o=!1;return xc(s).te((a=>Dc(s,a,i).next((u=>(u&&(o=!0),f.resolve(!u)))))).next((()=>o))})(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.pr(e,((o,a)=>{if(a<=t){const u=this.yr(e,o).next((c=>{if(!c)return i++,n.getEntry(e,o).next((()=>(n.removeEntry(o,R.min()),He(e).delete((function(h){return[0,he(h.path)]})(o)))))}));s.push(u)}})).next((()=>f.waitFor(s))).next((()=>n.apply(e))).next((()=>i))}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return br(e,t)}pr(e,t){const n=He(e);let s,i=fe.ce;return n.ee({index:wi},(([o,a],{path:u,sequenceNumber:c})=>{o===0?(i!==fe.ce&&t(new T(Ve(s)),i),i=c,s=u):i=fe.ce})).next((()=>{i!==fe.ce&&t(new T(Ve(s)),i)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function br(r,e){return He(r).put((function(n,s){return{targetId:0,path:he(n.path),sequenceNumber:s}})(e,r.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mc{constructor(){this.changes=new Be((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,B.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?f.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zd{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return ft(e).put(n)}removeEntry(e,t,n){return ft(e).delete((function(i,o){const a=i.path.toArray();return[a.slice(0,a.length-2),a[a.length-2],Jr(o),a[a.length-1]]})(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.wr(e,n))))}getEntry(e,t){let n=B.newInvalidDocument(t);return ft(e).ee({index:Nr,range:IDBKeyRange.only(On(t))},((s,i)=>{n=this.Sr(t,i)})).next((()=>n))}br(e,t){let n={size:0,document:B.newInvalidDocument(t)};return ft(e).ee({index:Nr,range:IDBKeyRange.only(On(t))},((s,i)=>{n={document:this.Sr(t,i),size:Xr(i)}})).next((()=>n))}getEntries(e,t){let n=_e();return this.Dr(e,t,((s,i)=>{const o=this.Sr(s,i);n=n.insert(s,o)})).next((()=>n))}Cr(e,t){let n=_e(),s=new q(T.comparator);return this.Dr(e,t,((i,o)=>{const a=this.Sr(i,o);n=n.insert(i,a),s=s.insert(i,Xr(o))})).next((()=>({documents:n,vr:s})))}Dr(e,t,n){if(t.isEmpty())return f.resolve();let s=new O(Va);t.forEach((u=>s=s.add(u)));const i=IDBKeyRange.bound(On(s.first()),On(s.last())),o=s.getIterator();let a=o.getNext();return ft(e).ee({index:Nr,range:i},((u,c,l)=>{const h=T.fromSegments([...c.prefixPath,c.collectionGroup,c.documentId]);for(;a&&Va(a,h)<0;)n(a,null),a=o.getNext();a&&a.isEqual(h)&&(n(a,c),a=o.hasNext()?o.getNext():null),a?l.j(On(a)):l.done()})).next((()=>{for(;a;)n(a,null),a=o.hasNext()?o.getNext():null}))}getDocumentsMatchingQuery(e,t,n,s,i){const o=t.path,a=[o.popLast().toArray(),o.lastSegment(),Jr(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return ft(e).J(IDBKeyRange.bound(a,u,!0)).next((c=>{i?.incrementDocumentReadCount(c.length);let l=_e();for(const h of c){const d=this.Sr(T.fromSegments(h.prefixPath.concat(h.collectionGroup,h.documentId)),h);d.isFoundDocument()&&(gr(t,d)||s.has(d.key))&&(l=l.insert(d.key,d))}return l}))}getAllFromCollectionGroup(e,t,n,s){let i=_e();const o=Ra(t,n),a=Ra(t,Ee.max());return ft(e).ee({index:yu,range:IDBKeyRange.bound(o,a,!0)},((u,c,l)=>{const h=this.Sr(T.fromSegments(c.prefixPath.concat(c.collectionGroup,c.documentId)),c);i=i.insert(h.key,h),i.size===s&&l.done()})).next((()=>i))}newChangeBuffer(e){return new ef(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((t=>t.byteSize))}getMetadata(e){return va(e).get(js).next((t=>(v(!!t,20021),t)))}wr(e,t){return va(e).put(js,t)}Sr(e,t){if(t){const n=qd(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(R.min())))return n}return B.newInvalidDocument(e)}}function Oc(r){return new Zd(r)}class ef extends Mc{constructor(e,t){super(),this.Fr=e,this.trackRemovals=t,this.Mr=new Be((n=>n.toString()),((n,s)=>n.isEqual(s)))}applyChanges(e){const t=[];let n=0,s=new O(((i,o)=>P(i.canonicalString(),o.canonicalString())));return this.changes.forEach(((i,o)=>{const a=this.Mr.get(i);if(t.push(this.Fr.removeEntry(e,i,a.readTime)),o.isValidDocument()){const u=aa(this.Fr.serializer,o);s=s.add(i.path.popLast());const c=Xr(u);n+=c-a.size,t.push(this.Fr.addEntry(e,i,u))}else if(n-=a.size,this.trackRemovals){const u=aa(this.Fr.serializer,o.convertToNoDocument(R.min()));t.push(this.Fr.addEntry(e,i,u))}})),s.forEach((i=>{t.push(this.Fr.indexManager.addToCollectionParentIndex(e,i))})),t.push(this.Fr.updateMetadata(e,n)),f.waitFor(t)}getFromCache(e,t){return this.Fr.br(e,t).next((n=>(this.Mr.set(t,{size:n.size,readTime:n.document.readTime}),n.document)))}getAllFromCache(e,t){return this.Fr.Cr(e,t).next((({documents:n,vr:s})=>(s.forEach(((i,o)=>{this.Mr.set(i,{size:o,readTime:n.get(i).readTime})})),n)))}}function va(r){return te(r,Zn)}function ft(r){return te(r,$r)}function On(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function Ra(r,e){const t=e.documentKey.path.toArray();return[r,Jr(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function Va(r,e){const t=r.path.toArray(),n=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<n.length-2;++i)if(s=P(t[i],n[i]),s)return s;return s=P(t.length,n.length),s||(s=P(t[t.length-2],n[n.length-2]),s||P(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tf{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lc{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(n=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(n!==null&&Hn(n.mutation,s,me.empty(),F.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,b()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=b()){const s=Pe();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,n).next((i=>{let o=Un();return i.forEach(((a,u)=>{o=o.insert(a,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const n=Pe();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,b())))}populateOverlays(e,t,n){const s=[];return n.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,a)=>{t.set(o,a)}))}))}computeViews(e,t,n,s){let i=_e();const o=Wn(),a=(function(){return Wn()})();return t.forEach(((u,c)=>{const l=n.get(c.key);s.has(c.key)&&(l===void 0||l.mutation instanceof ze)?i=i.insert(c.key,c):l!==void 0?(o.set(c.key,l.mutation.getFieldMask()),Hn(l.mutation,c,l.mutation.getFieldMask(),F.now())):o.set(c.key,me.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((c,l)=>o.set(c,l))),t.forEach(((c,l)=>a.set(c,new tf(l,o.get(c)??null)))),a)))}recalculateAndSaveOverlays(e,t){const n=Wn();let s=new q(((o,a)=>o-a)),i=b();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const a of o)a.keys().forEach((u=>{const c=t.get(u);if(c===null)return;let l=n.get(u)||me.empty();l=a.applyToLocalView(c,l),n.set(u,l);const h=(s.get(a.batchId)||b()).add(u);s=s.insert(a.batchId,h)}))})).next((()=>{const o=[],a=s.getReverseIterator();for(;a.hasNext();){const u=a.getNext(),c=u.key,l=u.value,h=ec();l.forEach((d=>{if(!i.has(d)){const _=ic(t.get(d),n.get(d));_!==null&&h.set(d,_),i=i.add(d)}})),o.push(this.documentOverlayCache.saveOverlays(e,c,h))}return f.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,s){return ad(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Si(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):f.resolve(Pe());let a=Zt,u=i;return o.next((c=>f.forEach(c,((l,h)=>(a<h.largestBatchId&&(a=h.largestBatchId),i.get(l)?f.resolve():this.remoteDocumentCache.getEntry(e,l).next((d=>{u=u.insert(l,d)}))))).next((()=>this.populateOverlays(e,c,i))).next((()=>this.computeViews(e,u,c,b()))).next((l=>({batchId:a,changes:Zu(l)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new T(t)).next((n=>{let s=Un();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=Un();return this.indexManager.getCollectionParents(e,i).next((a=>f.forEach(a,(u=>{const c=(function(h,d){return new Ue(d,null,h.explicitOrderBy.slice(),h.filters.slice(),h.limit,h.limitType,h.startAt,h.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,c,n,s).next((l=>{l.forEach(((h,d)=>{o=o.insert(h,d)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s)))).next((o=>{i.forEach(((u,c)=>{const l=c.getKey();o.get(l)===null&&(o=o.insert(l,B.newInvalidDocument(l)))}));let a=Un();return o.forEach(((u,c)=>{const l=i.get(u);l!==void 0&&Hn(l.mutation,c,me.empty(),F.now()),gr(t,c)&&(a=a.insert(u,c))})),a}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nf{constructor(e){this.serializer=e,this.Or=new Map,this.Nr=new Map}getBundleMetadata(e,t){return f.resolve(this.Or.get(t))}saveBundleMetadata(e,t){return this.Or.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:H(s.createTime)}})(t)),f.resolve()}getNamedQuery(e,t){return f.resolve(this.Nr.get(t))}saveNamedQuery(e,t){return this.Nr.set(t.name,(function(s){return{name:s.name,query:Is(s.bundledQuery),readTime:H(s.readTime)}})(t)),f.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rf{constructor(){this.overlays=new q(T.comparator),this.Br=new Map}getOverlay(e,t){return f.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Pe();return f.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(e,t,n){return n.forEach(((s,i)=>{this.wt(e,t,i)})),f.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Br.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Br.delete(n)),f.resolve()}getOverlaysForCollection(e,t,n){const s=Pe(),i=t.length+1,o=new T(t.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const u=a.getNext().value,c=u.getKey();if(!t.isPrefixOf(c.path))break;c.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return f.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new q(((c,l)=>c-l));const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===t&&c.largestBatchId>n){let l=i.get(c.largestBatchId);l===null&&(l=Pe(),i=i.insert(c.largestBatchId,l)),l.set(c.getKey(),c)}}const a=Pe(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((c,l)=>a.set(c,l))),!(a.size()>=s)););return f.resolve(a)}wt(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.Br.get(s.largestBatchId).delete(n.key);this.Br.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new Mi(t,n));let i=this.Br.get(t);i===void 0&&(i=b(),this.Br.set(t,i)),this.Br.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sf{constructor(){this.sessionToken=j.EMPTY_BYTE_STRING}getSessionToken(e){return f.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,f.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bi{constructor(){this.Lr=new O(ne.kr),this.qr=new O(ne.Kr)}isEmpty(){return this.Lr.isEmpty()}addReference(e,t){const n=new ne(e,t);this.Lr=this.Lr.add(n),this.qr=this.qr.add(n)}Ur(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.$r(new ne(e,t))}Wr(e,t){e.forEach((n=>this.removeReference(n,t)))}Qr(e){const t=new T(new D([])),n=new ne(t,e),s=new ne(t,e+1),i=[];return this.qr.forEachInRange([n,s],(o=>{this.$r(o),i.push(o.key)})),i}Gr(){this.Lr.forEach((e=>this.$r(e)))}$r(e){this.Lr=this.Lr.delete(e),this.qr=this.qr.delete(e)}zr(e){const t=new T(new D([])),n=new ne(t,e),s=new ne(t,e+1);let i=b();return this.qr.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(e){const t=new ne(e,0),n=this.Lr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class ne{constructor(e,t){this.key=e,this.jr=t}static kr(e,t){return T.comparator(e.key,t.key)||P(e.jr,t.jr)}static Kr(e,t){return P(e.jr,t.jr)||T.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class of{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Xn=1,this.Jr=new O(ne.kr)}checkEmpty(e){return f.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.Xn;this.Xn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new ki(i,t,n,s);this.mutationQueue.push(o);for(const a of s)this.Jr=this.Jr.add(new ne(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return f.resolve(o)}lookupMutationBatch(e,t){return f.resolve(this.Hr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.Zr(n),i=s<0?0:s;return f.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return f.resolve(this.mutationQueue.length===0?Ze:this.Xn-1)}getAllMutationBatches(e){return f.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new ne(t,0),s=new ne(t,Number.POSITIVE_INFINITY),i=[];return this.Jr.forEachInRange([n,s],(o=>{const a=this.Hr(o.jr);i.push(a)})),f.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new O(P);return t.forEach((s=>{const i=new ne(s,0),o=new ne(s,Number.POSITIVE_INFINITY);this.Jr.forEachInRange([i,o],(a=>{n=n.add(a.jr)}))})),f.resolve(this.Xr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;T.isDocumentKey(i)||(i=i.child(""));const o=new ne(new T(i),0);let a=new O(P);return this.Jr.forEachWhile((u=>{const c=u.key.path;return!!n.isPrefixOf(c)&&(c.length===s&&(a=a.add(u.jr)),!0)}),o),f.resolve(this.Xr(a))}Xr(e){const t=[];return e.forEach((n=>{const s=this.Hr(n);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){v(this.Yr(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Jr;return f.forEach(t.mutations,(s=>{const i=new ne(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.Jr=n}))}tr(e){}containsKey(e,t){const n=new ne(t,0),s=this.Jr.firstAfterOrEqual(n);return f.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,f.resolve()}Yr(e,t){return this.Zr(e)}Zr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Hr(e){const t=this.Zr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class af{constructor(e){this.ei=e,this.docs=(function(){return new q(T.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.ei(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return f.resolve(n?n.document.mutableCopy():B.newInvalidDocument(t))}getEntries(e,t){let n=_e();return t.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():B.newInvalidDocument(s))})),f.resolve(n)}getDocumentsMatchingQuery(e,t,n,s){let i=_e();const o=t.path,a=new T(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(a);for(;u.hasNext();){const{key:c,value:{document:l}}=u.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||Ti(du(l),n)<=0||(s.has(l.key)||gr(t,l))&&(i=i.insert(l.key,l.mutableCopy()))}return f.resolve(i)}getAllFromCollectionGroup(e,t,n,s){A(9500)}ti(e,t){return f.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new uf(this)}getSize(e){return f.resolve(this.size)}}class uf extends Mc{constructor(e){super(),this.Fr=e}applyChanges(e){const t=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?t.push(this.Fr.addEntry(e,s)):this.Fr.removeEntry(n)})),f.waitFor(t)}getFromCache(e,t){return this.Fr.getEntry(e,t)}getAllFromCache(e,t){return this.Fr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cf{constructor(e){this.persistence=e,this.ni=new Be((t=>Pt(t)),mr),this.lastRemoteSnapshotVersion=R.min(),this.highestTargetId=0,this.ri=0,this.ii=new Bi,this.targetCount=0,this.si=Le.sr()}forEachTarget(e,t){return this.ni.forEach(((n,s)=>t(s))),f.resolve()}getLastRemoteSnapshotVersion(e){return f.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return f.resolve(this.ri)}allocateTargetId(e){return this.highestTargetId=this.si.next(),f.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.ri&&(this.ri=t),f.resolve()}cr(e){this.ni.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.si=new Le(t),this.highestTargetId=t),e.sequenceNumber>this.ri&&(this.ri=e.sequenceNumber)}addTargetData(e,t){return this.cr(t),this.targetCount+=1,f.resolve()}updateTargetData(e,t){return this.cr(t),f.resolve()}removeTargetData(e,t){return this.ni.delete(t.target),this.ii.Qr(t.targetId),this.targetCount-=1,f.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.ni.forEach(((o,a)=>{a.sequenceNumber<=t&&n.get(a.targetId)===null&&(this.ni.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),s++)})),f.waitFor(i).next((()=>s))}getTargetCount(e){return f.resolve(this.targetCount)}getTargetData(e,t){const n=this.ni.get(t)||null;return f.resolve(n)}addMatchingKeys(e,t,n){return this.ii.Ur(t,n),f.resolve()}removeMatchingKeys(e,t,n){this.ii.Wr(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),f.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.ii.Qr(t),f.resolve()}getMatchingKeysForTargetId(e,t){const n=this.ii.zr(t);return f.resolve(n)}containsKey(e,t){return f.resolve(this.ii.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zi{constructor(e,t){this.oi={},this.overlays={},this._i=new fe(0),this.ai=!1,this.ai=!0,this.ui=new sf,this.referenceDelegate=e(this),this.ci=new cf(this),this.indexManager=new jd,this.remoteDocumentCache=(function(s){return new af(s)})((n=>this.referenceDelegate.li(n))),this.serializer=new Rc(t),this.hi=new nf(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ai=!1,Promise.resolve()}get started(){return this.ai}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new rf,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.oi[e.toKey()];return n||(n=new of(t,this.referenceDelegate),this.oi[e.toKey()]=n),n}getGlobalsCache(){return this.ui}getTargetCache(){return this.ci}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.hi}runTransaction(e,t,n){p("MemoryPersistence","Starting transaction:",e);const s=new lf(this._i.next());return this.referenceDelegate.Pi(),n(s).next((i=>this.referenceDelegate.Ti(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}Ii(e,t){return f.or(Object.values(this.oi).map((n=>()=>n.containsKey(e,t))))}}class lf extends mu{constructor(e){super(),this.currentSequenceNumber=e}}class ws{constructor(e){this.persistence=e,this.Ei=new Bi,this.Ri=null}static Ai(e){return new ws(e)}get Vi(){if(this.Ri)return this.Ri;throw A(60996)}addReference(e,t,n){return this.Ei.addReference(n,t),this.Vi.delete(n.toString()),f.resolve()}removeReference(e,t,n){return this.Ei.removeReference(n,t),this.Vi.add(n.toString()),f.resolve()}markPotentiallyOrphaned(e,t){return this.Vi.add(t.toString()),f.resolve()}removeTarget(e,t){this.Ei.Qr(t.targetId).forEach((s=>this.Vi.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.Vi.add(i.toString())))})).next((()=>n.removeTargetData(e,t)))}Pi(){this.Ri=new Set}Ti(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return f.forEach(this.Vi,(n=>{const s=T.fromPath(n);return this.di(e,s).next((i=>{i||t.removeEntry(s,R.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.di(e,t).next((n=>{n?this.Vi.delete(t.toString()):this.Vi.add(t.toString())}))}li(e){return 0}di(e,t){return f.or([()=>f.resolve(this.Ei.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ii(e,t)])}}class Zr{constructor(e,t){this.persistence=e,this.mi=new Be((n=>he(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=Fc(this,t)}static Ai(e,t){return new Zr(e,t)}Pi(){}Ti(e){return f.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Vr(e){const t=this.gr(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}gr(e){let t=0;return this.dr(e,(n=>{t++})).next((()=>t))}dr(e,t){return f.forEach(this.mi,((n,s)=>this.yr(e,n,s).next((i=>i?f.resolve():t(s)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ti(e,(o=>this.yr(e,o,t).next((a=>{a||(n++,i.removeEntry(o,R.min()))})))).next((()=>i.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.mi.set(t,e.currentSequenceNumber),f.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.mi.set(n,e.currentSequenceNumber),f.resolve()}removeReference(e,t,n){return this.mi.set(n,e.currentSequenceNumber),f.resolve()}updateLimboDocument(e,t){return this.mi.set(t,e.currentSequenceNumber),f.resolve()}li(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Fr(e.data.value)),t}yr(e,t,n){return f.or([()=>this.persistence.Ii(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.mi.get(t);return f.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hf{constructor(e){this.serializer=e}k(e,t,n,s){const i=new os("createOrUpgrade",t);n<1&&s>=1&&((function(u){u.createObjectStore(fr)})(e),(function(u){u.createObjectStore(Xn,{keyPath:Ah}),u.createObjectStore(Ae,{keyPath:Oo,autoIncrement:!0}).createIndex(Tt,Lo,{unique:!0}),u.createObjectStore(nn)})(e),Pa(e),(function(u){u.createObjectStore(_t)})(e));let o=f.resolve();return n<3&&s>=3&&(n!==0&&((function(u){u.deleteObjectStore(sn),u.deleteObjectStore(rn),u.deleteObjectStore(At)})(e),Pa(e)),o=o.next((()=>(function(u){const c=u.store(At),l={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:R.min().toTimestamp(),targetCount:0};return c.put(Kr,l)})(i)))),n<4&&s>=4&&(n!==0&&(o=o.next((()=>(function(u,c){return c.store(Ae).J().next((h=>{u.deleteObjectStore(Ae),u.createObjectStore(Ae,{keyPath:Oo,autoIncrement:!0}).createIndex(Tt,Lo,{unique:!0});const d=c.store(Ae),_=h.map((I=>d.put(I)));return f.waitFor(_)}))})(e,i)))),o=o.next((()=>{(function(u){u.createObjectStore(on,{keyPath:xh})})(e)}))),n<5&&s>=5&&(o=o.next((()=>this.fi(i)))),n<6&&s>=6&&(o=o.next((()=>((function(u){u.createObjectStore(Zn)})(e),this.gi(i))))),n<7&&s>=7&&(o=o.next((()=>this.pi(i)))),n<8&&s>=8&&(o=o.next((()=>this.yi(e,i)))),n<9&&s>=9&&(o=o.next((()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)}))),n<10&&s>=10&&(o=o.next((()=>this.wi(i)))),n<11&&s>=11&&(o=o.next((()=>{(function(u){u.createObjectStore(as,{keyPath:Nh})})(e),(function(u){u.createObjectStore(us,{keyPath:kh})})(e)}))),n<12&&s>=12&&(o=o.next((()=>{(function(u){const c=u.createObjectStore(cs,{keyPath:Bh});c.createIndex(Hs,zh,{unique:!1}),c.createIndex(wu,Gh,{unique:!1})})(e)}))),n<13&&s>=13&&(o=o.next((()=>(function(u){const c=u.createObjectStore($r,{keyPath:Rh});c.createIndex(Nr,Vh),c.createIndex(yu,Ph)})(e))).next((()=>this.Si(e,i))).next((()=>e.deleteObjectStore(_t)))),n<14&&s>=14&&(o=o.next((()=>this.bi(e,i)))),n<15&&s>=15&&(o=o.next((()=>(function(u){u.createObjectStore(Ai,{keyPath:Fh,autoIncrement:!0}).createIndex(Ws,Mh,{unique:!1}),u.createObjectStore(Kn,{keyPath:Oh}).createIndex(Tu,Lh,{unique:!1}),u.createObjectStore(Qn,{keyPath:qh}).createIndex(Eu,Uh,{unique:!1})})(e)))),n<16&&s>=16&&(o=o.next((()=>{t.objectStore(Kn).clear()})).next((()=>{t.objectStore(Qn).clear()}))),n<17&&s>=17&&(o=o.next((()=>{(function(u){u.createObjectStore(vi,{keyPath:$h})})(e)}))),n<18&&s>=18&&iu()&&(o=o.next((()=>{t.objectStore(Kn).clear()})).next((()=>{t.objectStore(Qn).clear()}))),o}gi(e){let t=0;return e.store(_t).ee(((n,s)=>{t+=Xr(s)})).next((()=>{const n={byteSize:t};return e.store(Zn).put(js,n)}))}fi(e){const t=e.store(Xn),n=e.store(Ae);return t.J().next((s=>f.forEach(s,(i=>{const o=IDBKeyRange.bound([i.userId,Ze],[i.userId,i.lastAcknowledgedBatchId]);return n.J(Tt,o).next((a=>f.forEach(a,(u=>{v(u.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:u.batchId});const c=pt(this.serializer,u);return Cc(e,i.userId,c).next((()=>{}))}))))}))))}pi(e){const t=e.store(sn),n=e.store(_t);return e.store(At).get(Kr).next((s=>{const i=[];return n.ee(((o,a)=>{const u=new D(o),c=(function(h){return[0,he(h)]})(u);i.push(t.get(c).next((l=>l?f.resolve():(h=>t.put({targetId:0,path:he(h),sequenceNumber:s.highestListenSequenceNumber}))(u))))})).next((()=>f.waitFor(i)))}))}yi(e,t){e.createObjectStore(er,{keyPath:Dh});const n=t.store(er),s=new Ui,i=o=>{if(s.add(o)){const a=o.lastSegment(),u=o.popLast();return n.put({collectionId:a,parent:he(u)})}};return t.store(_t).ee({Y:!0},((o,a)=>{const u=new D(o);return i(u.popLast())})).next((()=>t.store(nn).ee({Y:!0},(([o,a,u],c)=>{const l=Ve(a);return i(l.popLast())}))))}wi(e){const t=e.store(rn);return t.ee(((n,s)=>{const i=zn(s),o=Vc(this.serializer,i);return t.put(o)}))}Si(e,t){const n=t.store(_t),s=[];return n.ee(((i,o)=>{const a=t.store($r),u=(function(h){return h.document?new T(D.fromString(h.document.name).popFirst(5)):h.noDocument?T.fromSegments(h.noDocument.path):h.unknownDocument?T.fromSegments(h.unknownDocument.path):A(36783)})(o).path.toArray(),c={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(a.put(c))})).next((()=>f.waitFor(s)))}bi(e,t){const n=t.store(Ae),s=Oc(this.serializer),i=new zi(ws.Ai,this.serializer.gt);return n.J().next((o=>{const a=new Map;return o.forEach((u=>{let c=a.get(u.userId)??b();pt(this.serializer,u).keys().forEach((l=>c=c.add(l))),a.set(u.userId,c)})),f.forEach(a,((u,c)=>{const l=new re(c),h=Ts.yt(this.serializer,l),d=i.getIndexManager(l),_=Es.yt(l,this.serializer,d,i.referenceDelegate);return new Lc(s,_,h,d).recalculateAndSaveOverlaysForDocumentKeys(new Js(t,fe.ce),u).next()}))}))}}function Pa(r){r.createObjectStore(sn,{keyPath:Sh}).createIndex(wi,Ch,{unique:!0}),r.createObjectStore(rn,{keyPath:"targetId"}).createIndex(Iu,bh,{unique:!0}),r.createObjectStore(At)}const je="IndexedDbPersistence",Ms=18e5,Os=5e3,Ls="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",qc="main";class Gi{constructor(e,t,n,s,i,o,a,u,c,l,h=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Di=i,this.window=o,this.document=a,this.Ci=c,this.Fi=l,this.Mi=h,this._i=null,this.ai=!1,this.isPrimary=!1,this.networkEnabled=!0,this.xi=null,this.inForeground=!1,this.Oi=null,this.Ni=null,this.Bi=Number.NEGATIVE_INFINITY,this.Li=d=>Promise.resolve(),!Gi.v())throw new g(m.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new Xd(this,s),this.ki=t+qc,this.serializer=new Rc(u),this.qi=new Se(this.ki,this.Mi,new hf(this.serializer)),this.ui=new Bd,this.ci=new Hd(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Oc(this.serializer),this.hi=new Ud,this.window&&this.window.localStorage?this.Ki=this.window.localStorage:(this.Ki=null,l===!1&&W(je,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Ui().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new g(m.FAILED_PRECONDITION,Ls);return this.$i(),this.Wi(),this.Qi(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.ci.getHighestSequenceNumber(e)))})).then((e=>{this._i=new fe(e,this.Ci)})).then((()=>{this.ai=!0})).catch((e=>(this.qi&&this.qi.close(),Promise.reject(e))))}Gi(e){return this.Li=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.qi.K((async t=>{t.newVersion===null&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Di.enqueueAndForget((async()=>{this.started&&await this.Ui()})))}Ui(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>Sr(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.zi(e).next((t=>{t||(this.isPrimary=!1,this.Di.enqueueRetryable((()=>this.Li(!1))))}))})).next((()=>this.ji(e))).next((t=>this.isPrimary&&!t?this.Ji(e).next((()=>!1)):!!t&&this.Hi(e).next((()=>!0)))))).catch((e=>{if(ut(e))return p(je,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return p(je,"Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.Di.enqueueRetryable((()=>this.Li(e))),this.isPrimary=e}))}zi(e){return Ln(e).get(qt).next((t=>f.resolve(this.Zi(t))))}Xi(e){return Sr(e).delete(this.clientId)}async Yi(){if(this.isPrimary&&!this.es(this.Bi,Ms)){this.Bi=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(t=>{const n=te(t,on);return n.J().next((s=>{const i=this.ts(s,Ms),o=s.filter((a=>i.indexOf(a)===-1));return f.forEach(o,(a=>n.delete(a.clientId))).next((()=>o))}))})).catch((()=>[]));if(this.Ki)for(const t of e)this.Ki.removeItem(this.ns(t.clientId))}}Qi(){this.Ni=this.Di.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.Ui().then((()=>this.Yi())).then((()=>this.Qi()))))}Zi(e){return!!e&&e.ownerId===this.clientId}ji(e){return this.Fi?f.resolve(!0):Ln(e).get(qt).next((t=>{if(t!==null&&this.es(t.leaseTimestampMs,Os)&&!this.rs(t.ownerId)){if(this.Zi(t)&&this.networkEnabled)return!0;if(!this.Zi(t)){if(!t.allowTabSynchronization)throw new g(m.FAILED_PRECONDITION,Ls);return!1}}return!(!this.networkEnabled||!this.inForeground)||Sr(e).J().next((n=>this.ts(n,Os).find((s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,a=this.networkEnabled===s.networkEnabled;if(i||o&&a)return!0}return!1}))===void 0))})).next((t=>(this.isPrimary!==t&&p(je,`Client ${t?"is":"is not"} eligible for a primary lease.`),t)))}async shutdown(){this.ai=!1,this.ss(),this.Ni&&(this.Ni.cancel(),this.Ni=null),this._s(),this.us(),await this.qi.runTransaction("shutdown","readwrite",[fr,on],(e=>{const t=new Js(e,fe.ce);return this.Ji(t).next((()=>this.Xi(t)))})),this.qi.close(),this.cs()}ts(e,t){return e.filter((n=>this.es(n.updateTimeMs,t)&&!this.rs(n.clientId)))}ls(){return this.runTransaction("getActiveClients","readonly",(e=>Sr(e).J().next((t=>this.ts(t,Ms).map((n=>n.clientId))))))}get started(){return this.ai}getGlobalsCache(){return this.ui}getMutationQueue(e,t){return Es.yt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.ci}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new Wd(e,this.serializer.gt.databaseId)}getDocumentOverlayCache(e){return Ts.yt(this.serializer,e)}getBundleCache(){return this.hi}runTransaction(e,t,n){p(je,"Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=(function(u){return u===18?jh:u===17?Vu:u===16?Qh:u===15?Ri:u===14?Ru:u===13?vu:u===12?Kh:u===11?Au:void A(60245)})(this.Mi);let o;return this.qi.runTransaction(e,s,i,(a=>(o=new Js(a,this._i?this._i.next():fe.ce),t==="readwrite-primary"?this.zi(o).next((u=>!!u||this.ji(o))).next((u=>{if(!u)throw W(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Di.enqueueRetryable((()=>this.Li(!1))),new g(m.FAILED_PRECONDITION,fu);return n(o)})).next((u=>this.Hi(o).next((()=>u)))):this.hs(o).next((()=>n(o)))))).then((a=>(o.raiseOnCommittedEvent(),a)))}hs(e){return Ln(e).get(qt).next((t=>{if(t!==null&&this.es(t.leaseTimestampMs,Os)&&!this.rs(t.ownerId)&&!this.Zi(t)&&!(this.Fi||this.allowTabSynchronization&&t.allowTabSynchronization))throw new g(m.FAILED_PRECONDITION,Ls)}))}Hi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Ln(e).put(qt,t)}static v(){return Se.v()}Ji(e){const t=Ln(e);return t.get(qt).next((n=>this.Zi(n)?(p(je,"Releasing primary lease."),t.delete(qt)):f.resolve()))}es(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(W(`Detected an update time that is in the future: ${e} > ${n}`),!1))}$i(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Oi=()=>{this.Di.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.Ui())))},this.document.addEventListener("visibilitychange",this.Oi),this.inForeground=this.document.visibilityState==="visible")}_s(){this.Oi&&(this.document.removeEventListener("visibilitychange",this.Oi),this.Oi=null)}Wi(){typeof this.window?.addEventListener=="function"&&(this.xi=()=>{this.ss();const e=/(?:Version|Mobile)\/1[456]/;su()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Di.enterRestrictedMode(!0),this.Di.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.xi))}us(){this.xi&&(this.window.removeEventListener("pagehide",this.xi),this.xi=null)}rs(e){try{const t=this.Ki?.getItem(this.ns(e))!==null;return p(je,`Client '${e}' ${t?"is":"is not"} zombied in LocalStorage`),t}catch(t){return W(je,"Failed to get zombied client id.",t),!1}}ss(){if(this.Ki)try{this.Ki.setItem(this.ns(this.clientId),String(Date.now()))}catch(e){W("Failed to set zombie client id.",e)}}cs(){if(this.Ki)try{this.Ki.removeItem(this.ns(this.clientId))}catch{}}ns(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Ln(r){return te(r,fr)}function Sr(r){return te(r,on)}function $i(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.Ps=n,this.Ts=s}static Is(e,t){let n=b(),s=b();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Ki(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class df{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uc{constructor(){this.Es=!1,this.Rs=!1,this.As=100,this.Vs=(function(){return su()?8:_u(zr())>0?6:4})()}initialize(e,t){this.ds=e,this.indexManager=t,this.Es=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.fs(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.gs(e,t,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new df;return this.ps(e,t,o).next((a=>{if(i.result=a,this.Rs)return this.ys(e,t,o,a.size)}))})).next((()=>i.result))}ys(e,t,n,s){return n.documentReadCount<this.As?(Kt()<=Fe.DEBUG&&p("QueryEngine","SDK will not create cache indexes for query:",Qt(t),"since it only creates cache indexes for collection contains","more than or equal to",this.As,"documents"),f.resolve()):(Kt()<=Fe.DEBUG&&p("QueryEngine","Query:",Qt(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.Vs*s?(Kt()<=Fe.DEBUG&&p("QueryEngine","The SDK decides to create cache indexes for query:",Qt(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,de(t))):f.resolve())}fs(e,t){if(Yo(t))return f.resolve(null);let n=de(t);return this.indexManager.getIndexType(e,n).next((s=>s===0?null:(t.limit!==null&&s===1&&(t=Wr(t,null,"F"),n=de(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next((i=>{const o=b(...i);return this.ds.getDocuments(e,o).next((a=>this.indexManager.getMinOffset(e,n).next((u=>{const c=this.ws(t,a);return this.Ss(t,c,o,u.readTime)?this.fs(e,Wr(t,null,"F")):this.bs(e,c,t,u)}))))})))))}gs(e,t,n,s){return Yo(t)||s.isEqual(R.min())?f.resolve(null):this.ds.getDocuments(e,n).next((i=>{const o=this.ws(t,i);return this.Ss(t,o,n,s)?f.resolve(null):(Kt()<=Fe.DEBUG&&p("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Qt(t)),this.bs(e,o,t,hu(s,Zt)).next((a=>a)))}))}ws(e,t){let n=new O(Yu(e));return t.forEach(((s,i)=>{gr(e,i)&&(n=n.add(i))})),n}Ss(e,t,n,s){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}ps(e,t,n){return Kt()<=Fe.DEBUG&&p("QueryEngine","Using full collection scan to execute query:",Qt(t)),this.ds.getDocumentsMatchingQuery(e,t,Ee.min(),n)}bs(e,t,n,s){return this.ds.getDocumentsMatchingQuery(e,n,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qi="LocalStore",ff=3e8;class mf{constructor(e,t,n,s){this.persistence=e,this.Ds=t,this.serializer=s,this.Cs=new q(P),this.vs=new Be((i=>Pt(i)),mr),this.Fs=new Map,this.Ms=e.getRemoteDocumentCache(),this.ci=e.getTargetCache(),this.hi=e.getBundleCache(),this.xs(n)}xs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Lc(this.Ms,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ms.setIndexManager(this.indexManager),this.Ds.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Cs)))}}function Bc(r,e,t,n){return new mf(r,e,t,n)}async function zc(r,e){const t=E(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,t.xs(e),t.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],a=[];let u=b();for(const c of s){o.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}for(const c of i){a.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}return t.localDocuments.getDocuments(n,u).next((c=>({Os:c,removedBatchIds:o,addedBatchIds:a})))}))}))}function _f(r,e){const t=E(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=e.batch.keys(),i=t.Ms.newChangeBuffer({trackRemovals:!0});return(function(a,u,c,l){const h=c.batch,d=h.keys();let _=f.resolve();return d.forEach((I=>{_=_.next((()=>l.getEntry(u,I))).next((y=>{const w=c.docVersions.get(I);v(w!==null,48541),y.version.compareTo(w)<0&&(h.applyToRemoteDocument(y,c),y.isValidDocument()&&(y.setReadTime(c.commitVersion),l.addEntry(y)))}))})),_.next((()=>a.mutationQueue.removeMutationBatch(u,h)))})(t,n,e,i).next((()=>i.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(a){let u=b();for(let c=0;c<a.mutationResults.length;++c)a.mutationResults[c].transformResults.length>0&&(u=u.add(a.batch.mutations[c].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(n,s)))}))}function Gc(r){const e=E(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.ci.getLastRemoteSnapshotVersion(t)))}function gf(r,e){const t=E(r),n=e.snapshotVersion;let s=t.Cs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=t.Ms.newChangeBuffer({trackRemovals:!0});s=t.Cs;const a=[];e.targetChanges.forEach(((l,h)=>{const d=s.get(h);if(!d)return;a.push(t.ci.removeMatchingKeys(i,l.removedDocuments,h).next((()=>t.ci.addMatchingKeys(i,l.addedDocuments,h))));let _=d.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(h)!==null?_=_.withResumeToken(j.EMPTY_BYTE_STRING,R.min()).withLastLimboFreeSnapshotVersion(R.min()):l.resumeToken.approximateByteSize()>0&&(_=_.withResumeToken(l.resumeToken,n)),s=s.insert(h,_),(function(y,w,V){return y.resumeToken.approximateByteSize()===0||w.snapshotVersion.toMicroseconds()-y.snapshotVersion.toMicroseconds()>=ff?!0:V.addedDocuments.size+V.modifiedDocuments.size+V.removedDocuments.size>0})(d,_,l)&&a.push(t.ci.updateTargetData(i,_))}));let u=_e(),c=b();if(e.documentUpdates.forEach((l=>{e.resolvedLimboDocuments.has(l)&&a.push(t.persistence.referenceDelegate.updateLimboDocument(i,l))})),a.push($c(i,o,e.documentUpdates).next((l=>{u=l.Ns,c=l.Bs}))),!n.isEqual(R.min())){const l=t.ci.getLastRemoteSnapshotVersion(i).next((h=>t.ci.setTargetsMetadata(i,i.currentSequenceNumber,n)));a.push(l)}return f.waitFor(a).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,c))).next((()=>u))})).then((i=>(t.Cs=s,i)))}function $c(r,e,t){let n=b(),s=b();return t.forEach((i=>n=n.add(i))),e.getEntries(r,n).next((i=>{let o=_e();return t.forEach(((a,u)=>{const c=i.get(a);u.isFoundDocument()!==c.isFoundDocument()&&(s=s.add(a)),u.isNoDocument()&&u.version.isEqual(R.min())?(e.removeEntry(a,u.readTime),o=o.insert(a,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(a,u)):p(Qi,"Ignoring outdated watch update for ",a,". Current version:",c.version," Watch version:",u.version)})),{Ns:o,Bs:s}}))}function pf(r,e){const t=E(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=Ze),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function mn(r,e){const t=E(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return t.ci.getTargetData(n,e).next((i=>i?(s=i,f.resolve(s)):t.ci.allocateTargetId(n).next((o=>(s=new be(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.ci.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=t.Cs.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Cs=t.Cs.insert(n.targetId,n),t.vs.set(e,n.targetId)),n}))}async function _n(r,e,t){const n=E(r),s=n.Cs.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!ut(o))throw o;p(Qi,`Failed to update sequence numbers for target ${e}: ${o}`)}n.Cs=n.Cs.remove(e),n.vs.delete(s.target)}function es(r,e,t){const n=E(r);let s=R.min(),i=b();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,c,l){const h=E(u),d=h.vs.get(l);return d!==void 0?f.resolve(h.Cs.get(d)):h.ci.getTargetData(c,l)})(n,o,de(e)).next((a=>{if(a)return s=a.lastLimboFreeSnapshotVersion,n.ci.getMatchingKeysForTargetId(o,a.targetId).next((u=>{i=u}))})).next((()=>n.Ds.getDocumentsMatchingQuery(o,e,t?s:R.min(),t?i:b()))).next((a=>(jc(n,Ju(e),a),{documents:a,Ls:i})))))}function Kc(r,e){const t=E(r),n=E(t.ci),s=t.Cs.get(e);return s?Promise.resolve(s.target):t.persistence.runTransaction("Get target data","readonly",(i=>n.Rt(i,e).next((o=>o?o.target:null))))}function Qc(r,e){const t=E(r),n=t.Fs.get(e)||R.min();return t.persistence.runTransaction("Get new document changes","readonly",(s=>t.Ms.getAllFromCollectionGroup(s,e,hu(n,Zt),Number.MAX_SAFE_INTEGER))).then((s=>(jc(t,e,s),s)))}function jc(r,e,t){let n=r.Fs.get(e)||R.min();t.forEach(((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)})),r.Fs.set(e,n)}async function yf(r,e,t,n){const s=E(r);let i=b(),o=_e();for(const c of t){const l=e.ks(c.metadata.name);c.document&&(i=i.add(l));const h=e.qs(c);h.setReadTime(e.Ks(c.metadata.readTime)),o=o.insert(l,h)}const a=s.Ms.newChangeBuffer({trackRemovals:!0}),u=await mn(s,(function(l){return de(En(D.fromString(`__bundle__/docs/${l}`)))})(n));return s.persistence.runTransaction("Apply bundle documents","readwrite",(c=>$c(c,a,o).next((l=>(a.apply(c),l))).next((l=>s.ci.removeMatchingKeysForTargetId(c,u.targetId).next((()=>s.ci.addMatchingKeys(c,i,u.targetId))).next((()=>s.localDocuments.getLocalViewOfDocuments(c,l.Ns,l.Bs))).next((()=>l.Ns))))))}async function If(r,e,t=b()){const n=await mn(r,de(Is(e.bundledQuery))),s=E(r);return s.persistence.runTransaction("Save named query","readwrite",(i=>{const o=H(e.readTime);if(n.snapshotVersion.compareTo(o)>=0)return s.hi.saveNamedQuery(i,e);const a=n.withResumeToken(j.EMPTY_BYTE_STRING,o);return s.Cs=s.Cs.insert(a.targetId,a),s.ci.updateTargetData(i,a).next((()=>s.ci.removeMatchingKeysForTargetId(i,n.targetId))).next((()=>s.ci.addMatchingKeys(i,t,n.targetId))).next((()=>s.hi.saveNamedQuery(i,e)))}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wc="firestore_clients";function ba(r,e){return`${Wc}_${r}_${e}`}const Hc="firestore_mutations";function Sa(r,e,t){let n=`${Hc}_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}const Jc="firestore_targets";function qs(r,e){return`${Jc}_${r}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Re="SharedClientState";class ts{constructor(e,t,n,s){this.user=e,this.batchId=t,this.state=n,this.error=s}static Us(e,t,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new g(s.error.code,s.error.message))),o?new ts(e,t,s.state,i):(W(Re,`Failed to parse mutation state for ID '${t}': ${n}`),null)}$s(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Jn{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static Us(e,t){const n=JSON.parse(t);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new g(n.error.code,n.error.message))),i?new Jn(e,n.state,s):(W(Re,`Failed to parse target state for ID '${e}': ${t}`),null)}$s(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class ns{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Us(e,t){const n=JSON.parse(t);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=Ci();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=gu(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new ns(e,i):(W(Re,`Failed to parse client data for instance '${e}': ${t}`),null)}}class ji{constructor(e,t){this.clientId=e,this.onlineState=t}static Us(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new ji(t.clientId,t.onlineState):(W(Re,`Failed to parse online state: ${e}`),null)}}class li{constructor(){this.activeTargetIds=Ci()}Ws(e){this.activeTargetIds=this.activeTargetIds.add(e)}Qs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}$s(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Us{constructor(e,t,n,s,i){this.window=e,this.Di=t,this.persistenceKey=n,this.Gs=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.zs=this.js.bind(this),this.Js=new q(P),this.started=!1,this.Hs=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Zs=ba(this.persistenceKey,this.Gs),this.Xs=(function(u){return`firestore_sequence_number_${u}`})(this.persistenceKey),this.Js=this.Js.insert(this.Gs,new li),this.Ys=new RegExp(`^${Wc}_${o}_([^_]*)$`),this.eo=new RegExp(`^${Hc}_${o}_(\\d+)(?:_(.*))?$`),this.no=new RegExp(`^${Jc}_${o}_(\\d+)$`),this.ro=(function(u){return`firestore_online_state_${u}`})(this.persistenceKey),this.io=(function(u){return`firestore_bundle_loaded_v2_${u}`})(this.persistenceKey),this.window.addEventListener("storage",this.zs)}static v(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.ls();for(const n of e){if(n===this.Gs)continue;const s=this.getItem(ba(this.persistenceKey,n));if(s){const i=ns.Us(n,s);i&&(this.Js=this.Js.insert(i.clientId,i))}}this.so();const t=this.storage.getItem(this.ro);if(t){const n=this.oo(t);n&&this._o(n)}for(const n of this.Hs)this.js(n);this.Hs=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.Xs,JSON.stringify(e))}getAllActiveQueryTargets(){return this.ao(this.Js)}isActiveQueryTarget(e){let t=!1;return this.Js.forEach(((n,s)=>{s.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this.uo(e,"pending")}updateMutationState(e,t,n){this.uo(e,t,n),this.co(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(qs(this.persistenceKey,e));if(s){const i=Jn.Us(e,s);i&&(n=i.state)}}return t&&this.lo.Ws(e),this.so(),n}removeLocalQueryTarget(e){this.lo.Qs(e),this.so()}isLocalQueryTarget(e){return this.lo.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(qs(this.persistenceKey,e))}updateQueryState(e,t,n){this.ho(e,t,n)}handleUserChange(e,t,n){t.forEach((s=>{this.co(s)})),this.currentUser=e,n.forEach((s=>{this.addPendingMutation(s)}))}setOnlineState(e){this.Po(e)}notifyBundleLoaded(e){this.To(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.zs),this.removeItem(this.Zs),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return p(Re,"READ",e,t),t}setItem(e,t){p(Re,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){p(Re,"REMOVE",e),this.storage.removeItem(e)}js(e){const t=e;if(t.storageArea===this.storage){if(p(Re,"EVENT",t.key,t.newValue),t.key===this.Zs)return void W("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Di.enqueueRetryable((async()=>{if(this.started){if(t.key!==null){if(this.Ys.test(t.key)){if(t.newValue==null){const n=this.Io(t.key);return this.Eo(n,null)}{const n=this.Ro(t.key,t.newValue);if(n)return this.Eo(n.clientId,n)}}else if(this.eo.test(t.key)){if(t.newValue!==null){const n=this.Ao(t.key,t.newValue);if(n)return this.Vo(n)}}else if(this.no.test(t.key)){if(t.newValue!==null){const n=this.mo(t.key,t.newValue);if(n)return this.fo(n)}}else if(t.key===this.ro){if(t.newValue!==null){const n=this.oo(t.newValue);if(n)return this._o(n)}}else if(t.key===this.Xs){const n=(function(i){let o=fe.ce;if(i!=null)try{const a=JSON.parse(i);v(typeof a=="number",30636,{po:i}),o=a}catch(a){W(Re,"Failed to read sequence number from WebStorage",a)}return o})(t.newValue);n!==fe.ce&&this.sequenceNumberHandler(n)}else if(t.key===this.io){const n=this.yo(t.newValue);await Promise.all(n.map((s=>this.syncEngine.wo(s))))}}}else this.Hs.push(t)}))}}get lo(){return this.Js.get(this.Gs)}so(){this.setItem(this.Zs,this.lo.$s())}uo(e,t,n){const s=new ts(this.currentUser,e,t,n),i=Sa(this.persistenceKey,this.currentUser,e);this.setItem(i,s.$s())}co(e){const t=Sa(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Po(e){const t={clientId:this.Gs,onlineState:e};this.storage.setItem(this.ro,JSON.stringify(t))}ho(e,t,n){const s=qs(this.persistenceKey,e),i=new Jn(e,t,n);this.setItem(s,i.$s())}To(e){const t=JSON.stringify(Array.from(e));this.setItem(this.io,t)}Io(e){const t=this.Ys.exec(e);return t?t[1]:null}Ro(e,t){const n=this.Io(e);return ns.Us(n,t)}Ao(e,t){const n=this.eo.exec(e),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return ts.Us(new re(i),s,t)}mo(e,t){const n=this.no.exec(e),s=Number(n[1]);return Jn.Us(s,t)}oo(e){return ji.Us(e)}yo(e){return JSON.parse(e)}async Vo(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.So(e.batchId,e.state,e.error);p(Re,`Ignoring mutation for non-active user ${e.user.uid}`)}fo(e){return this.syncEngine.bo(e.targetId,e.state,e.error)}Eo(e,t){const n=t?this.Js.insert(e,t):this.Js.remove(e),s=this.ao(this.Js),i=this.ao(n),o=[],a=[];return i.forEach((u=>{s.has(u)||o.push(u)})),s.forEach((u=>{i.has(u)||a.push(u)})),this.syncEngine.Do(o,a).then((()=>{this.Js=n}))}_o(e){this.Js.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}ao(e){let t=Ci();return e.forEach(((n,s)=>{t=t.unionWith(s.activeTargetIds)})),t}}class Yc{constructor(){this.Co=new li,this.vo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Co.Ws(e),this.vo[e]||"not-current"}updateQueryState(e,t,n){this.vo[e]=t}removeLocalQueryTarget(e){this.Co.Qs(e)}isLocalQueryTarget(e){return this.Co.activeTargetIds.has(e)}clearQueryState(e){delete this.vo[e]}getAllActiveQueryTargets(){return this.Co.activeTargetIds}isActiveQueryTarget(e){return this.Co.activeTargetIds.has(e)}start(){return this.Co=new li,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tf{Fo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ca="ConnectivityMonitor";class Da{constructor(){this.Mo=()=>this.xo(),this.Oo=()=>this.No(),this.Bo=[],this.Lo()}Fo(e){this.Bo.push(e)}shutdown(){window.removeEventListener("online",this.Mo),window.removeEventListener("offline",this.Oo)}Lo(){window.addEventListener("online",this.Mo),window.addEventListener("offline",this.Oo)}xo(){p(Ca,"Network connectivity changed: AVAILABLE");for(const e of this.Bo)e(0)}No(){p(Ca,"Network connectivity changed: UNAVAILABLE");for(const e of this.Bo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Cr=null;function hi(){return Cr===null?Cr=(function(){return 268435456+Math.round(2147483648*Math.random())})():Cr++,"0x"+Cr.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bs="RestConnection",Ef={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class wf{get ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Ko=`projects/${n}/databases/${s}`,this.Uo=this.databaseId.database===nr?`project_id=${n}`:`project_id=${n}&database_id=${s}`}$o(e,t,n,s,i){const o=hi(),a=this.Wo(e,t.toUriEncodedString());p(Bs,`Sending RPC '${e}' ${o}:`,a,n);const u={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Uo};this.Qo(u,s,i);const{host:c}=new URL(a),l=gi(c);return this.Go(e,a,u,n,l).then((h=>(p(Bs,`Received RPC '${e}' ${o}: `,h),h)),(h=>{throw Te(Bs,`RPC '${e}' ${o} failed with error: `,h,"url: ",a,"request:",n),h}))}zo(e,t,n,s,i,o){return this.$o(e,t,n,s,i)}Qo(e,t,n){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Tn})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),n&&n.headers.forEach(((s,i)=>e[i]=s))}Wo(e,t){const n=Ef[e];let s=`${this.qo}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Af{constructor(e){this.jo=e.jo,this.Jo=e.Jo}Ho(e){this.Zo=e}Xo(e){this.Yo=e}e_(e){this.t_=e}onMessage(e){this.n_=e}close(){this.Jo()}send(e){this.jo(e)}r_(){this.Zo()}i_(){this.Yo()}s_(e){this.t_(e)}o_(e){this.n_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ce="WebChannelConnection",qn=(r,e,t)=>{r.listen(e,(n=>{try{t(n)}catch(s){setTimeout((()=>{throw s}),0)}}))};class Jt extends wf{constructor(e){super(e),this.__=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static a_(){if(!Jt.u_){const e=Wl();qn(e,Hl.STAT_EVENT,(t=>{t.stat===So.PROXY?p(ce,"STAT_EVENT: detected buffering proxy"):t.stat===So.NOPROXY&&p(ce,"STAT_EVENT: detected no buffering proxy")})),Jt.u_=!0}}Go(e,t,n,s,i){const o=hi();return new Promise(((a,u)=>{const c=new Jl;c.setWithCredentials(!0),c.listenOnce(Yl.COMPLETE,(()=>{try{switch(c.getLastErrorCode()){case Ns.NO_ERROR:const h=c.getResponseJson();p(ce,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(h)),a(h);break;case Ns.TIMEOUT:p(ce,`RPC '${e}' ${o} timed out`),u(new g(m.DEADLINE_EXCEEDED,"Request time out"));break;case Ns.HTTP_ERROR:const d=c.getStatus();if(p(ce,`RPC '${e}' ${o} failed with status:`,d,"response text:",c.getResponseText()),d>0){let _=c.getResponseJson();Array.isArray(_)&&(_=_[0]);const I=_?.error;if(I&&I.status&&I.message){const y=(function(V){const C=V.toLowerCase().replace(/_/g,"-");return Object.values(m).indexOf(C)>=0?C:m.UNKNOWN})(I.status);u(new g(y,I.message))}else u(new g(m.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new g(m.UNAVAILABLE,"Connection failed."));break;default:A(9055,{c_:e,streamId:o,l_:c.getLastErrorCode(),h_:c.getLastError()})}}finally{p(ce,`RPC '${e}' ${o} completed.`)}}));const l=JSON.stringify(s);p(ce,`RPC '${e}' ${o} sending request:`,s),c.send(t,"POST",l,n,15)}))}P_(e,t,n){const s=hi(),i=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(a.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(a.useFetchStreams=!0),this.Qo(a.initMessageHeaders,t,n),a.encodeInitMessageHeaders=!0;const c=i.join("");p(ce,`Creating RPC '${e}' stream ${s}: ${c}`,a);const l=o.createWebChannel(c,a);this.T_(l);let h=!1,d=!1;const _=new Af({jo:I=>{d?p(ce,`Not sending because RPC '${e}' stream ${s} is closed:`,I):(h||(p(ce,`Opening RPC '${e}' stream ${s} transport.`),l.open(),h=!0),p(ce,`RPC '${e}' stream ${s} sending:`,I),l.send(I))},Jo:()=>l.close()});return qn(l,vr.EventType.OPEN,(()=>{d||(p(ce,`RPC '${e}' stream ${s} transport opened.`),_.r_())})),qn(l,vr.EventType.CLOSE,(()=>{d||(d=!0,p(ce,`RPC '${e}' stream ${s} transport closed`),_.s_(),this.I_(l))})),qn(l,vr.EventType.ERROR,(I=>{d||(d=!0,Te(ce,`RPC '${e}' stream ${s} transport errored. Name:`,I.name,"Message:",I.message),_.s_(new g(m.UNAVAILABLE,"The operation could not be completed")))})),qn(l,vr.EventType.MESSAGE,(I=>{if(!d){const y=I.data[0];v(!!y,16349);const w=y,V=w?.error||w[0]?.error;if(V){p(ce,`RPC '${e}' stream ${s} received error:`,V);const C=V.status;let S=(function(J){const ue=Y[J];if(ue!==void 0)return cc(ue)})(C),K=V.message;C==="NOT_FOUND"&&K.includes("database")&&K.includes("does not exist")&&K.includes(this.databaseId.database)&&Te(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),S===void 0&&(S=m.INTERNAL,K="Unknown error status: "+C+" with message "+V.message),d=!0,_.s_(new g(S,K)),l.close()}else p(ce,`RPC '${e}' stream ${s} received:`,y),_.o_(y)}})),Jt.a_(),setTimeout((()=>{_.i_()}),0),_}terminate(){this.__.forEach((e=>e.close())),this.__=[]}T_(e){this.__.push(e)}I_(e){this.__=this.__.filter((t=>t===e))}Qo(e,t,n){super.Qo(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Xl()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vf(r){return new Jt(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xc(){return typeof window<"u"?window:null}function Ur(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mt(r){return new Sd(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Jt.u_=!1;class Wi{constructor(e,t,n=1e3,s=1.5,i=6e4){this.Di=e,this.timerId=t,this.E_=n,this.R_=s,this.A_=i,this.V_=0,this.d_=null,this.m_=Date.now(),this.reset()}reset(){this.V_=0}f_(){this.V_=this.A_}g_(e){this.cancel();const t=Math.floor(this.V_+this.p_()),n=Math.max(0,Date.now()-this.m_),s=Math.max(0,t-n);s>0&&p("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.d_=this.Di.enqueueAfterDelay(this.timerId,s,(()=>(this.m_=Date.now(),e()))),this.V_*=this.R_,this.V_<this.E_&&(this.V_=this.E_),this.V_>this.A_&&(this.V_=this.A_)}y_(){this.d_!==null&&(this.d_.skipDelay(),this.d_=null)}cancel(){this.d_!==null&&(this.d_.cancel(),this.d_=null)}p_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xa="PersistentStream";class Zc{constructor(e,t,n,s,i,o,a,u){this.Di=e,this.w_=n,this.S_=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=u,this.state=0,this.b_=0,this.D_=null,this.C_=null,this.stream=null,this.v_=0,this.F_=new Wi(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.v_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Di.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}async close(e,t){this.q_(),this.K_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===m.RESOURCE_EXHAUSTED?(W(t.toString()),W("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===m.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.e_(t)}U_(){}auth(){this.state=1;const e=this.W_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.b_===t&&this.Q_(n,s)}),(n=>{e((()=>{const s=new g(m.UNKNOWN,"Fetching auth token failed: "+n.message);return this.G_(s)}))}))}Q_(e,t){const n=this.W_(this.b_);this.stream=this.z_(e,t),this.stream.Ho((()=>{n((()=>this.listener.Ho()))})),this.stream.Xo((()=>{n((()=>(this.state=2,this.C_=this.Di.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.Xo())))})),this.stream.e_((s=>{n((()=>this.G_(s)))})),this.stream.onMessage((s=>{n((()=>++this.v_==1?this.j_(s):this.onNext(s)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return p(xa,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Di.enqueueAndForget((()=>this.b_===e?t():(p(xa,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class Rf extends Zc{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=xd(this.serializer,e),n=(function(i){if(!("targetChange"in i))return R.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?R.min():o.readTime?H(o.readTime):R.min()})(e);return this.listener.J_(t,n)}H_(e){const t={};t.database=ii(this.serializer),t.addTarget=(function(i,o){let a;const u=o.target;if(a=Qr(u)?{documents:yc(i,u)}:{query:ys(i,u).dt},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=fc(i,o.resumeToken);const c=ri(i,o.expectedCount);c!==null&&(a.expectedCount=c)}else if(o.snapshotVersion.compareTo(R.min())>0){a.readTime=fn(i,o.snapshotVersion.toTimestamp());const c=ri(i,o.expectedCount);c!==null&&(a.expectedCount=c)}return a})(this.serializer,e);const n=kd(this.serializer,e);n&&(t.labels=n),this.k_(t)}Z_(e){const t={};t.database=ii(this.serializer),t.removeTarget=e,this.k_(t)}}class Vf extends Zc{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get X_(){return this.v_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.X_&&this.Y_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return v(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,v(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){v(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=Nd(e.writeResults,e.commitTime),n=H(e.commitTime);return this.listener.ta(n,t)}na(){const e={};e.database=ii(this.serializer),this.k_(e)}Y_(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>ur(this.serializer,n)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pf{}class bf extends Pf{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.ra=!1}ia(){if(this.ra)throw new g(m.FAILED_PRECONDITION,"The client has already been terminated.")}$o(e,t,n,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.$o(e,si(t,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===m.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new g(m.UNKNOWN,i.toString())}))}zo(e,t,n,s,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,a])=>this.connection.zo(e,si(t,n),s,o,a,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===m.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new g(m.UNKNOWN,o.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}function Sf(r,e,t,n){return new bf(r,e,t,n)}class Cf{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(W(t),this._a=!1):p("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ke="RemoteStore";class Df{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Map,this.Ea=new Map,this.Ra=new Le(1e3),this.Aa=new Le(1001),this.Va=new Set,this.da=[],this.ma=i,this.ma.Fo((o=>{n.enqueueAndForget((async()=>{lt(this)&&(p(ke,"Restarting streams for network reachability change."),await(async function(u){const c=E(u);c.Va.add(4),await Rn(c),c.fa.set("Unknown"),c.Va.delete(4),await yr(c)})(this))}))})),this.fa=new Cf(n,s)}}async function yr(r){if(lt(r))for(const e of r.da)await e(!0)}async function Rn(r){for(const e of r.da)await e(!1)}function di(r,e){return r.Ia.get(e)||void 0}function As(r,e){const t=E(r),n=di(t,e.targetId);if(n!==void 0&&t.Ta.has(n))return;const s=(function(a,u){const c=di(a,u);c!==void 0&&a.Ea.delete(c);const l=(function(d,_){return _%2!=0?d.Aa.next():d.Ra.next()})(a,u);return a.Ia.set(u,l),a.Ea.set(l,u),l})(t,e.targetId);p(ke,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new be(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.Ta.set(s,i),Yi(t)?Ji(t):Pn(t).x_()&&Hi(t,i)}function gn(r,e){const t=E(r),n=Pn(t),s=di(t,e);p(ke,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.Ta.delete(s),t.Ia.delete(e),t.Ea.delete(s),n.x_()&&el(t,s),t.Ta.size===0&&(n.x_()?n.B_():lt(t)&&t.fa.set("Unknown"))}function Hi(r,e){if(r.ga.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(R.min())>0){const t=r.Ea.get(e.targetId);if(t===void 0)return void p(ke,"SDK target ID not found for remote ID: "+e.targetId);const n=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(n)}Pn(r).H_(e)}function el(r,e){r.ga.$e(e),Pn(r).Z_(e)}function Ji(r){r.ga=new Rd({getRemoteKeysForTarget:e=>{const t=r.Ea.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):b()},Rt:e=>r.Ta.get(e)||null,lt:()=>r.datastore.serializer.databaseId}),Pn(r).start(),r.fa.aa()}function Yi(r){return lt(r)&&!Pn(r).M_()&&r.Ta.size>0}function lt(r){return E(r).Va.size===0}function tl(r){r.ga=void 0}async function xf(r){r.fa.set("Online")}async function Nf(r){r.Ta.forEach(((e,t)=>{Hi(r,e)}))}async function kf(r,e){tl(r),Yi(r)?(r.fa.la(e),Ji(r)):r.fa.set("Unknown")}async function Ff(r,e,t){if(r.fa.set("Online"),e instanceof dc&&e.state===2&&e.cause)try{await(async function(s,i){const o=i.cause;for(const a of i.targetIds){if(s.Ta.has(a)){const u=s.Ea.get(a);u!==void 0&&(await s.remoteSyncer.rejectListen(u,o),s.Ia.delete(u),s.Ea.delete(a)),s.Ta.delete(a)}s.ga.removeTarget(a)}})(r,e)}catch(n){p(ke,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await rs(r,n)}else if(e instanceof Lr?r.ga.Xe(e):e instanceof hc?r.ga.it(e):r.ga.tt(e),!t.isEqual(R.min()))try{const n=await Gc(r.localStore);t.compareTo(n)>=0&&await(function(i,o){const a=i.ga.Pt(o);a.targetChanges.forEach(((c,l)=>{if(c.resumeToken.approximateByteSize()>0){const h=i.Ta.get(l);h&&i.Ta.set(l,h.withResumeToken(c.resumeToken,o))}})),a.targetMismatches.forEach(((c,l)=>{const h=i.Ta.get(c);if(!h)return;i.Ta.set(c,h.withResumeToken(j.EMPTY_BYTE_STRING,h.snapshotVersion)),el(i,c);const d=new be(h.target,c,l,h.sequenceNumber);Hi(i,d)}));const u=(function(l,h){const d=new Map;h.targetChanges.forEach(((I,y)=>{const w=l.Ea.get(y);w!==void 0&&d.set(w,I)}));let _=new q(P);return h.targetMismatches.forEach(((I,y)=>{const w=l.Ea.get(I);w!==void 0&&(_=_.insert(w,y))})),new vn(h.snapshotVersion,d,_,h.documentUpdates,h.resolvedLimboDocuments)})(i,a);return i.remoteSyncer.applyRemoteEvent(u)})(r,t)}catch(n){p(ke,"Failed to raise snapshot:",n),await rs(r,n)}}async function rs(r,e,t){if(!ut(e))throw e;r.Va.add(1),await Rn(r),r.fa.set("Offline"),t||(t=()=>Gc(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{p(ke,"Retrying IndexedDB access"),await t(),r.Va.delete(1),await yr(r)}))}function nl(r,e){return e().catch((t=>rs(r,t,e)))}async function Vn(r){const e=E(r),t=st(e);let n=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Ze;for(;Mf(e);)try{const s=await pf(e.localStore,n);if(s===null){e.Pa.length===0&&t.B_();break}n=s.batchId,Of(e,s)}catch(s){await rs(e,s)}rl(e)&&sl(e)}function Mf(r){return lt(r)&&r.Pa.length<10}function Of(r,e){r.Pa.push(e);const t=st(r);t.x_()&&t.X_&&t.Y_(e.mutations)}function rl(r){return lt(r)&&!st(r).M_()&&r.Pa.length>0}function sl(r){st(r).start()}async function Lf(r){st(r).na()}async function qf(r){const e=st(r);for(const t of r.Pa)e.Y_(t.mutations)}async function Uf(r,e,t){const n=r.Pa.shift(),s=Fi.from(n,e,t);await nl(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await Vn(r)}async function Bf(r,e){e&&st(r).X_&&await(async function(n,s){if((function(o){return uc(o)&&o!==m.ABORTED})(s.code)){const i=n.Pa.shift();st(n).N_(),await nl(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await Vn(n)}})(r,e),rl(r)&&sl(r)}async function Na(r,e){const t=E(r);t.asyncQueue.verifyOperationInProgress(),p(ke,"RemoteStore received new credentials");const n=lt(t);t.Va.add(3),await Rn(t),n&&t.fa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Va.delete(3),await yr(t)}async function fi(r,e){const t=E(r);e?(t.Va.delete(2),await yr(t)):e||(t.Va.add(2),await Rn(t),t.fa.set("Unknown"))}function Pn(r){return r.pa||(r.pa=(function(t,n,s){const i=E(t);return i.ia(),new Rf(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Ho:xf.bind(null,r),Xo:Nf.bind(null,r),e_:kf.bind(null,r),J_:Ff.bind(null,r)}),r.da.push((async e=>{e?(r.pa.N_(),Yi(r)?Ji(r):r.fa.set("Unknown")):(await r.pa.stop(),tl(r))}))),r.pa}function st(r){return r.ya||(r.ya=(function(t,n,s){const i=E(t);return i.ia(),new Vf(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Ho:()=>Promise.resolve(),Xo:Lf.bind(null,r),e_:Bf.bind(null,r),ea:qf.bind(null,r),ta:Uf.bind(null,r)}),r.da.push((async e=>{e?(r.ya.N_(),await Vn(r)):(await r.ya.stop(),r.Pa.length>0&&(p(ke,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))}))),r.ya}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xi{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new ie,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,a=new Xi(e,t,o,s,i);return a.start(n),a}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new g(m.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function bn(r,e){if(W("AsyncQueue",`${e}: ${r}`),ut(r))return new g(m.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{static emptySet(e){return new vt(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||T.comparator(t.key,n.key):(t,n)=>T.comparator(t.key,n.key),this.keyedMap=Un(),this.sortedSet=new q(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof vt)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new vt;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ka{constructor(){this.wa=new q(T.comparator)}track(e){const t=e.doc.key,n=this.wa.get(t);n?e.type!==0&&n.type===3?this.wa=this.wa.insert(t,e):e.type===3&&n.type!==1?this.wa=this.wa.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.wa=this.wa.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.wa=this.wa.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.wa=this.wa.remove(t):e.type===1&&n.type===2?this.wa=this.wa.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.wa=this.wa.insert(t,{type:2,doc:e.doc}):A(63341,{At:e,Sa:n}):this.wa=this.wa.insert(t,e)}ba(){const e=[];return this.wa.inorderTraversal(((t,n)=>{e.push(n)})),e}}class Nt{constructor(e,t,n,s,i,o,a,u,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach((a=>{o.push({type:0,doc:a})})),new Nt(e,t,vt.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&_r(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zf{constructor(){this.Da=void 0,this.Ca=[]}va(){return this.Ca.some((e=>e.Fa()))}}class Gf{constructor(){this.queries=Fa(),this.onlineState="Unknown",this.Ma=new Set}terminate(){(function(t,n){const s=E(t),i=s.queries;s.queries=Fa(),i.forEach(((o,a)=>{for(const u of a.Ca)u.onError(n)}))})(this,new g(m.ABORTED,"Firestore shutting down"))}}function Fa(){return new Be((r=>Hu(r)),_r)}async function Zi(r,e){const t=E(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.va()&&e.Fa()&&(n=2):(i=new zf,n=e.Fa()?0:1);try{switch(n){case 0:i.Da=await t.onListen(s,!0);break;case 1:i.Da=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const a=bn(o,`Initialization of query '${Qt(e.query)}' failed`);return void e.onError(a)}t.queries.set(s,i),i.Ca.push(e),e.xa(t.onlineState),i.Da&&e.Oa(i.Da)&&to(t)}async function eo(r,e){const t=E(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.Ca.indexOf(e);o>=0&&(i.Ca.splice(o,1),i.Ca.length===0?s=e.Fa()?0:1:!i.va()&&e.Fa()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function $f(r,e){const t=E(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const a of o.Ca)a.Oa(s)&&(n=!0);o.Da=s}}n&&to(t)}function Kf(r,e,t){const n=E(r),s=n.queries.get(e);if(s)for(const i of s.Ca)i.onError(t);n.queries.delete(e)}function to(r){r.Ma.forEach((e=>{e.next()}))}var mi,Ma;(Ma=mi||(mi={})).Na="default",Ma.Cache="cache";class no{constructor(e,t,n){this.query=e,this.Ba=t,this.La=!1,this.ka=null,this.onlineState="Unknown",this.options=n||{}}Oa(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new Nt(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.La?this.qa(e)&&(this.Ba.next(e),t=!0):this.Ka(e,this.onlineState)&&(this.Ua(e),t=!0),this.ka=e,t}onError(e){this.Ba.error(e)}xa(e){this.onlineState=e;let t=!1;return this.ka&&!this.La&&this.Ka(this.ka,e)&&(this.Ua(this.ka),t=!0),t}Ka(e,t){if(!e.fromCache||!this.Fa())return!0;const n=t!=="Offline";return(!this.options.$a||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}qa(e){if(e.docChanges.length>0)return!0;const t=this.ka&&this.ka.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Ua(e){e=Nt.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.La=!0,this.Ba.next(e)}Fa(){return this.options.source!==mi.Cache}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class il{constructor(e,t){this.Wa=e,this.byteLength=t}Qa(){return"metadata"in this.Wa}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oa{constructor(e){this.serializer=e}ks(e){return Ce(this.serializer,e)}qs(e){return e.metadata.exists?ps(this.serializer,e.document,!1):B.newNoDocument(this.ks(e.metadata.name),this.Ks(e.metadata.readTime))}Ks(e){return H(e)}}class ro{constructor(e,t){this.Ga=e,this.serializer=t,this.za=[],this.ja=[],this.collectionGroups=new Set,this.progress=ol(e)}get queries(){return this.za}get documents(){return this.ja}Ja(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.Wa.namedQuery)this.za.push(e.Wa.namedQuery);else if(e.Wa.documentMetadata){this.ja.push({metadata:e.Wa.documentMetadata}),e.Wa.documentMetadata.exists||++t;const n=D.fromString(e.Wa.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e.Wa.document&&(this.ja[this.ja.length-1].document=e.Wa.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,{...this.progress}):null}Ha(e){const t=new Map,n=new Oa(this.serializer);for(const s of e)if(s.metadata.queries){const i=n.ks(s.metadata.name);for(const o of s.metadata.queries){const a=(t.get(o)||b()).add(i);t.set(o,a)}}return t}async Za(e){const t=await yf(e,new Oa(this.serializer),this.ja,this.Ga.id),n=this.Ha(this.documents);for(const s of this.za)await If(e,s,n.get(s.name));return this.progress.taskState="Success",{progress:this.progress,Xa:this.collectionGroups,Ya:t}}}function ol(r){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class al{constructor(e){this.key=e}}class ul{constructor(e){this.key=e}}class cl{constructor(e,t){this.query=e,this.eu=t,this.tu=null,this.hasCachedResults=!1,this.current=!1,this.nu=b(),this.mutatedKeys=b(),this.ru=Yu(e),this.iu=new vt(this.ru)}get su(){return this.eu}ou(e,t){const n=t?t._u:new ka,s=t?t.iu:this.iu;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,a=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,c=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal(((l,h)=>{const d=s.get(l),_=gr(this.query,h)?h:null,I=!!d&&this.mutatedKeys.has(d.key),y=!!_&&(_.hasLocalMutations||this.mutatedKeys.has(_.key)&&_.hasCommittedMutations);let w=!1;d&&_?d.data.isEqual(_.data)?I!==y&&(n.track({type:3,doc:_}),w=!0):this.au(d,_)||(n.track({type:2,doc:_}),w=!0,(u&&this.ru(_,u)>0||c&&this.ru(_,c)<0)&&(a=!0)):!d&&_?(n.track({type:0,doc:_}),w=!0):d&&!_&&(n.track({type:1,doc:d}),w=!0,(u||c)&&(a=!0)),w&&(_?(o=o.add(_),i=y?i.add(l):i.delete(l)):(o=o.delete(l),i=i.delete(l)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const l=this.query.limitType==="F"?o.last():o.first();o=o.delete(l.key),i=i.delete(l.key),n.track({type:1,doc:l})}return{iu:o,_u:n,Ss:a,mutatedKeys:i}}au(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.iu;this.iu=e.iu,this.mutatedKeys=e.mutatedKeys;const o=e._u.ba();o.sort(((l,h)=>(function(_,I){const y=w=>{switch(w){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return A(20277,{At:w})}};return y(_)-y(I)})(l.type,h.type)||this.ru(l.doc,h.doc))),this.uu(n),s=s??!1;const a=t&&!s?this.cu():[],u=this.nu.size===0&&this.current&&!s?1:0,c=u!==this.tu;return this.tu=u,o.length!==0||c?{snapshot:new Nt(this.query,e.iu,i,o,e.mutatedKeys,u===0,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),lu:a}:{lu:a}}xa(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({iu:this.iu,_u:new ka,mutatedKeys:this.mutatedKeys,Ss:!1},!1)):{lu:[]}}hu(e){return!this.eu.has(e)&&!!this.iu.has(e)&&!this.iu.get(e).hasLocalMutations}uu(e){e&&(e.addedDocuments.forEach((t=>this.eu=this.eu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.eu=this.eu.delete(t))),this.current=e.current)}cu(){if(!this.current)return[];const e=this.nu;this.nu=b(),this.iu.forEach((n=>{this.hu(n.key)&&(this.nu=this.nu.add(n.key))}));const t=[];return e.forEach((n=>{this.nu.has(n)||t.push(new ul(n))})),this.nu.forEach((n=>{e.has(n)||t.push(new al(n))})),t}Pu(e){this.eu=e.Ls,this.nu=b();const t=this.ou(e.documents);return this.applyChanges(t,!0)}Tu(){return Nt.fromInitialDocuments(this.query,this.iu,this.mutatedKeys,this.tu===0,this.hasCachedResults)}}const ht="SyncEngine";class Qf{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class jf{constructor(e){this.key=e,this.Iu=!1}}class Wf{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Eu={},this.Ru=new Be((a=>Hu(a)),_r),this.Au=new Map,this.Vu=new Set,this.du=new q(T.comparator),this.mu=new Map,this.fu=new Bi,this.gu={},this.pu=new Map,this.yu=Le._r(),this.onlineState="Unknown",this.wu=void 0}get isPrimaryClient(){return this.wu===!0}}async function Hf(r,e,t=!0){const n=vs(r);let s;const i=n.Ru.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Tu()):s=await ll(n,e,t,!0),s}async function Jf(r,e){const t=vs(r);await ll(t,e,!0,!1)}async function ll(r,e,t,n){const s=await mn(r.localStore,de(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let a;return n&&(a=await so(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&As(r.remoteStore,s),a}async function so(r,e,t,n,s){r.Su=(h,d,_)=>(async function(y,w,V,C){let S=w.view.ou(V);S.Ss&&(S=await es(y.localStore,w.query,!1).then((({documents:ue})=>w.view.ou(ue,S))));const K=C&&C.targetChanges.get(w.targetId),Z=C&&C.targetMismatches.get(w.targetId)!=null,J=w.view.applyChanges(S,y.isPrimaryClient,K,Z);return _i(y,w.targetId,J.lu),J.snapshot})(r,h,d,_);const i=await es(r.localStore,e,!0),o=new cl(e,i.Ls),a=o.ou(i.documents),u=pr.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),c=o.applyChanges(a,r.isPrimaryClient,u);_i(r,t,c.lu);const l=new Qf(e,t,o);return r.Ru.set(e,l),r.Au.has(t)?r.Au.get(t).push(e):r.Au.set(t,[e]),c.snapshot}async function Yf(r,e,t){const n=E(r),s=n.Ru.get(e),i=n.Au.get(s.targetId);if(i.length>1)return n.Au.set(s.targetId,i.filter((o=>!_r(o,e)))),void n.Ru.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await _n(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),t&&gn(n.remoteStore,s.targetId),pn(n,s.targetId)})).catch(at)):(pn(n,s.targetId),await _n(n.localStore,s.targetId,!0))}async function Xf(r,e){const t=E(r),n=t.Ru.get(e),s=t.Au.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),gn(t.remoteStore,n.targetId))}async function Zf(r,e,t){const n=uo(r);try{const s=await(function(o,a){const u=E(o),c=F.now(),l=a.reduce(((_,I)=>_.add(I.key)),b());let h,d;return u.persistence.runTransaction("Locally write mutations","readwrite",(_=>{let I=_e(),y=b();return u.Ms.getEntries(_,l).next((w=>{I=w,I.forEach(((V,C)=>{C.isValidDocument()||(y=y.add(V))}))})).next((()=>u.localDocuments.getOverlayedDocuments(_,I))).next((w=>{h=w;const V=[];for(const C of a){const S=Ed(C,h.get(C.key).overlayedDocument);S!=null&&V.push(new ze(C.key,S,Lu(S.value.mapValue),$.exists(!0)))}return u.mutationQueue.addMutationBatch(_,c,V,a)})).next((w=>{d=w;const V=w.applyToLocalDocumentSet(h,y);return u.documentOverlayCache.saveOverlays(_,w.batchId,V)}))})).then((()=>({batchId:d.batchId,changes:Zu(h)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),(function(o,a,u){let c=o.gu[o.currentUser.toKey()];c||(c=new q(P)),c=c.insert(a,u),o.gu[o.currentUser.toKey()]=c})(n,s.batchId,t),await Ge(n,s.changes),await Vn(n.remoteStore)}catch(s){const i=bn(s,"Failed to persist write");t.reject(i)}}async function hl(r,e){const t=E(r);try{const n=await gf(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const o=t.mu.get(i);o&&(v(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Iu=!0:s.modifiedDocuments.size>0?v(o.Iu,14607):s.removedDocuments.size>0&&(v(o.Iu,42227),o.Iu=!1))})),await Ge(t,n,e)}catch(n){await at(n)}}function La(r,e,t){const n=E(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.Ru.forEach(((i,o)=>{const a=o.view.xa(e);a.snapshot&&s.push(a.snapshot)})),(function(o,a){const u=E(o);u.onlineState=a;let c=!1;u.queries.forEach(((l,h)=>{for(const d of h.Ca)d.xa(a)&&(c=!0)})),c&&to(u)})(n.eventManager,e),s.length&&n.Eu.J_(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function em(r,e,t){const n=E(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.mu.get(e),i=s&&s.key;if(i){let o=new q(T.comparator);o=o.insert(i,B.newNoDocument(i,R.min()));const a=b().add(i),u=new vn(R.min(),new Map,new q(P),o,a);await hl(n,u),n.du=n.du.remove(i),n.mu.delete(e),ao(n)}else await _n(n.localStore,e,!1).then((()=>pn(n,e,t))).catch(at)}async function tm(r,e){const t=E(r),n=e.batch.batchId;try{const s=await _f(t.localStore,e);oo(t,n,null),io(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Ge(t,s)}catch(s){await at(s)}}async function nm(r,e,t){const n=E(r);try{const s=await(function(o,a){const u=E(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(c=>{let l;return u.mutationQueue.lookupMutationBatch(c,a).next((h=>(v(h!==null,37113),l=h.keys(),u.mutationQueue.removeMutationBatch(c,h)))).next((()=>u.mutationQueue.performConsistencyCheck(c))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(c,l,a))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,l))).next((()=>u.localDocuments.getDocuments(c,l)))}))})(n.localStore,e);oo(n,e,t),io(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Ge(n,s)}catch(s){await at(s)}}async function rm(r,e){const t=E(r);lt(t.remoteStore)||p(ht,"The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const n=await(function(o){const a=E(o);return a.persistence.runTransaction("Get highest unacknowledged batch id","readonly",(u=>a.mutationQueue.getHighestUnacknowledgedBatchId(u)))})(t.localStore);if(n===Ze)return void e.resolve();const s=t.pu.get(n)||[];s.push(e),t.pu.set(n,s)}catch(n){const s=bn(n,"Initialization of waitForPendingWrites() operation failed");e.reject(s)}}function io(r,e){(r.pu.get(e)||[]).forEach((t=>{t.resolve()})),r.pu.delete(e)}function oo(r,e,t){const n=E(r);let s=n.gu[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.gu[n.currentUser.toKey()]=s}}function pn(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Au.get(e))r.Ru.delete(n),t&&r.Eu.bu(n,t);r.Au.delete(e),r.isPrimaryClient&&r.fu.Qr(e).forEach((n=>{r.fu.containsKey(n)||dl(r,n)}))}function dl(r,e){r.Vu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(gn(r.remoteStore,t),r.du=r.du.remove(e),r.mu.delete(t),ao(r))}function _i(r,e,t){for(const n of t)n instanceof al?(r.fu.addReference(n.key,e),sm(r,n)):n instanceof ul?(p(ht,"Document no longer in limbo: "+n.key),r.fu.removeReference(n.key,e),r.fu.containsKey(n.key)||dl(r,n.key)):A(19791,{Du:n})}function sm(r,e){const t=e.key,n=t.path.canonicalString();r.du.get(t)||r.Vu.has(n)||(p(ht,"New document in limbo: "+t),r.Vu.add(n),ao(r))}function ao(r){for(;r.Vu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Vu.values().next().value;r.Vu.delete(e);const t=new T(D.fromString(e)),n=r.yu.next();r.mu.set(n,new jf(t)),r.du=r.du.insert(t,n),As(r.remoteStore,new be(de(En(t.path)),n,"TargetPurposeLimboResolution",fe.ce))}}async function Ge(r,e,t){const n=E(r),s=[],i=[],o=[];n.Ru.isEmpty()||(n.Ru.forEach(((a,u)=>{o.push(n.Su(u,e,t).then((c=>{if((c||t)&&n.isPrimaryClient){const l=c?!c.fromCache:t?.targetChanges.get(u.targetId)?.current;n.sharedClientState.updateQueryState(u.targetId,l?"current":"not-current")}if(c){s.push(c);const l=Ki.Is(u.targetId,c);i.push(l)}})))})),await Promise.all(o),n.Eu.J_(s),await(async function(u,c){const l=E(u);try{await l.persistence.runTransaction("notifyLocalViewChanges","readwrite",(h=>f.forEach(c,(d=>f.forEach(d.Ps,(_=>l.persistence.referenceDelegate.addReference(h,d.targetId,_))).next((()=>f.forEach(d.Ts,(_=>l.persistence.referenceDelegate.removeReference(h,d.targetId,_)))))))))}catch(h){if(!ut(h))throw h;p(Qi,"Failed to update sequence numbers: "+h)}for(const h of c){const d=h.targetId;if(!h.fromCache){const _=l.Cs.get(d),I=_.snapshotVersion,y=_.withLastLimboFreeSnapshotVersion(I);l.Cs=l.Cs.insert(d,y)}}})(n.localStore,i))}async function im(r,e){const t=E(r);if(!t.currentUser.isEqual(e)){p(ht,"User change. New user:",e.toKey());const n=await zc(t.localStore,e);t.currentUser=e,(function(i,o){i.pu.forEach((a=>{a.forEach((u=>{u.reject(new g(m.CANCELLED,o))}))})),i.pu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Ge(t,n.Os)}}function om(r,e){const t=E(r),n=t.mu.get(e);if(n&&n.Iu)return b().add(n.key);{let s=b();const i=t.Au.get(e);if(!i)return s;for(const o of i){const a=t.Ru.get(o);s=s.unionWith(a.view.su)}return s}}async function am(r,e){const t=E(r),n=await es(t.localStore,e.query,!0),s=e.view.Pu(n);return t.isPrimaryClient&&_i(t,e.targetId,s.lu),s}async function um(r,e){const t=E(r);return Qc(t.localStore,e).then((n=>Ge(t,n)))}async function cm(r,e,t,n){const s=E(r),i=await(function(a,u){const c=E(a),l=E(c.mutationQueue);return c.persistence.runTransaction("Lookup mutation documents","readonly",(h=>l.Zn(h,u).next((d=>d?c.localDocuments.getDocuments(h,d):f.resolve(null)))))})(s.localStore,e);i!==null?(t==="pending"?await Vn(s.remoteStore):t==="acknowledged"||t==="rejected"?(oo(s,e,n||null),io(s,e),(function(a,u){E(E(a).mutationQueue).tr(u)})(s.localStore,e)):A(6720,"Unknown batchState",{Cu:t}),await Ge(s,i)):p(ht,"Cannot apply mutation batch with id: "+e)}async function lm(r,e){const t=E(r);if(vs(t),uo(t),e===!0&&t.wu!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),s=await qa(t,n.toArray());t.wu=!0,await fi(t.remoteStore,!0);for(const i of s)As(t.remoteStore,i)}else if(e===!1&&t.wu!==!1){const n=[];let s=Promise.resolve();t.Au.forEach(((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then((()=>(pn(t,o),_n(t.localStore,o,!0)))),gn(t.remoteStore,o)})),await s,await qa(t,n),(function(o){const a=E(o);a.mu.forEach(((u,c)=>{gn(a.remoteStore,c)})),a.fu.Gr(),a.mu=new Map,a.du=new q(T.comparator)})(t),t.wu=!1,await fi(t.remoteStore,!1)}}async function qa(r,e,t){const n=E(r),s=[],i=[];for(const o of e){let a;const u=n.Au.get(o);if(u&&u.length!==0){a=await mn(n.localStore,de(u[0]));for(const c of u){const l=n.Ru.get(c),h=await am(n,l);h.snapshot&&i.push(h.snapshot)}}else{const c=await Kc(n.localStore,o);a=await mn(n.localStore,c),await so(n,fl(c),o,!1,a.resumeToken)}s.push(a)}return n.Eu.J_(i),s}function fl(r){return Qu(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function hm(r){return(function(t){return E(E(t).persistence).ls()})(E(r).localStore)}async function dm(r,e,t,n){const s=E(r);if(s.wu)return void p(ht,"Ignoring unexpected query state notification.");const i=s.Au.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{const o=await Qc(s.localStore,Ju(i[0])),a=vn.createSynthesizedRemoteEventForCurrentChange(e,t==="current",j.EMPTY_BYTE_STRING);await Ge(s,o,a);break}case"rejected":await _n(s.localStore,e,!0),pn(s,e,n);break;default:A(64155,t)}}async function fm(r,e,t){const n=vs(r);if(n.wu){for(const s of e){if(n.Au.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){p(ht,"Adding an already active target "+s);continue}const i=await Kc(n.localStore,s),o=await mn(n.localStore,i);await so(n,fl(i),o.targetId,!1,o.resumeToken),As(n.remoteStore,o)}for(const s of t)n.Au.has(s)&&await _n(n.localStore,s,!1).then((()=>{gn(n.remoteStore,s),pn(n,s)})).catch(at)}}function vs(r){const e=E(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=hl.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=om.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=em.bind(null,e),e.Eu.J_=$f.bind(null,e.eventManager),e.Eu.bu=Kf.bind(null,e.eventManager),e}function uo(r){const e=E(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=tm.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=nm.bind(null,e),e}function mm(r,e,t){const n=E(r);(async function(i,o,a){try{const u=await o.getMetadata();if(await(function(_,I){const y=E(_),w=H(I.createTime);return y.persistence.runTransaction("hasNewerBundle","readonly",(V=>y.hi.getBundleMetadata(V,I.id))).then((V=>!!V&&V.createTime.compareTo(w)>=0))})(i.localStore,u))return await o.close(),a._completeWith((function(_){return{taskState:"Success",documentsLoaded:_.totalDocuments,bytesLoaded:_.totalBytes,totalDocuments:_.totalDocuments,totalBytes:_.totalBytes}})(u)),Promise.resolve(new Set);a._updateProgress(ol(u));const c=new ro(u,o.serializer);let l=await o.vu();for(;l;){const d=await c.Ja(l);d&&a._updateProgress(d),l=await o.vu()}const h=await c.Za(i.localStore);return await Ge(i,h.Ya,void 0),await(function(_,I){const y=E(_);return y.persistence.runTransaction("Save bundle","readwrite",(w=>y.hi.saveBundleMetadata(w,I)))})(i.localStore,u),a._completeWith(h.progress),Promise.resolve(h.Xa)}catch(u){return Te(ht,`Loading bundle failed with ${u}`),a._failWith(u),Promise.resolve(new Set)}})(n,e,t).then((s=>{n.sharedClientState.notifyBundleLoaded(s)}))}class yn{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Mt(e.databaseInfo.databaseId),this.sharedClientState=this.Fu(e),this.persistence=this.Mu(e),await this.persistence.start(),this.localStore=this.xu(e),this.gcScheduler=this.Ou(e,this.localStore),this.indexBackfillerScheduler=this.Nu(e,this.localStore)}Ou(e,t){return null}Nu(e,t){return null}xu(e){return Bc(this.persistence,new Uc,e.initialUser,this.serializer)}Mu(e){return new zi(ws.Ai,this.serializer)}Fu(e){return new Yc}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}yn.provider={build:()=>new yn};class co extends yn{constructor(e){super(),this.cacheSizeBytes=e}Ou(e,t){v(this.persistence.referenceDelegate instanceof Zr,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new kc(n,e.asyncQueue,t)}Mu(e){const t=this.cacheSizeBytes!==void 0?le.withCacheSize(this.cacheSizeBytes):le.DEFAULT;return new zi((n=>Zr.Ai(n,t)),this.serializer)}}class lo extends yn{constructor(e,t,n){super(),this.Bu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Bu.initialize(this,e),await uo(this.Bu.syncEngine),await Vn(this.Bu.remoteStore),await this.persistence.Gi((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}xu(e){return Bc(this.persistence,new Uc,e.initialUser,this.serializer)}Ou(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new kc(n,e.asyncQueue,t)}Nu(e,t){const n=new Eh(t,this.persistence);return new Th(e.asyncQueue,n)}Mu(e){const t=$i(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?le.withCacheSize(this.cacheSizeBytes):le.DEFAULT;return new Gi(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,Xc(),Ur(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Fu(e){return new Yc}}class ml extends lo{constructor(e,t){super(e,t,!1),this.Bu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Bu.syncEngine;this.sharedClientState instanceof Us&&(this.sharedClientState.syncEngine={So:cm.bind(null,t),bo:dm.bind(null,t),Do:fm.bind(null,t),ls:hm.bind(null,t),wo:um.bind(null,t)},await this.sharedClientState.start()),await this.persistence.Gi((async n=>{await lm(this.Bu.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())}))}Fu(e){const t=Xc();if(!Us.v(t))throw new g(m.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=$i(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Us(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class it{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>La(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=im.bind(null,this.syncEngine),await fi(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Gf})()}createDatastore(e){const t=Mt(e.databaseInfo.databaseId),n=vf(e.databaseInfo);return Sf(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,s,i,o,a){return new Df(n,s,i,o,a)})(this.localStore,this.datastore,e.asyncQueue,(t=>La(this.syncEngine,t,0)),(function(){return Da.v()?new Da:new Tf})())}createSyncEngine(e,t){return(function(s,i,o,a,u,c,l){const h=new Wf(s,i,o,a,u,c);return l&&(h.wu=!0),h})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await(async function(t){const n=E(t);p(ke,"RemoteStore shutting down."),n.Va.add(5),await Rn(n),n.ma.shutdown(),n.fa.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}it.provider={build:()=>new it};function Ua(r,e=10240){let t=0;return{async read(){if(t<r.byteLength){const n={value:r.slice(t,t+e),done:!1};return t+=e,n}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rs{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Lu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Lu(this.observer.error,e):W("Uncaught Error in snapshot listener:",e.toString()))}ku(){this.muted=!0}Lu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _m{constructor(e,t){this.qu=e,this.serializer=t,this.metadata=new ie,this.buffer=new Uint8Array,this.Ku=(function(){return new TextDecoder("utf-8")})(),this.Uu().then((n=>{n&&n.Qa()?this.metadata.resolve(n.Wa.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(n?.Wa)}`))}),(n=>this.metadata.reject(n)))}close(){return this.qu.cancel()}async getMetadata(){return this.metadata.promise}async vu(){return await this.getMetadata(),this.Uu()}async Uu(){const e=await this.$u();if(e===null)return null;const t=this.Ku.decode(e),n=Number(t);isNaN(n)&&this.Wu(`length string (${t}) is not valid number`);const s=await this.Qu(n);return new il(JSON.parse(s),e.length+n)}Gu(){return this.buffer.findIndex((e=>e===123))}async $u(){for(;this.Gu()<0&&!await this.zu(););if(this.buffer.length===0)return null;const e=this.Gu();e<0&&this.Wu("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async Qu(e){for(;this.buffer.length<e;)await this.zu()&&this.Wu("Reached the end of bundle when more is expected.");const t=this.Ku.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}Wu(e){throw this.qu.cancel(),new Error(`Invalid bundle format: ${e}`)}async zu(){const e=await this.qu.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gm{constructor(e,t){this.bundleData=e,this.serializer=t,this.cursor=0,this.elements=[];let n=this.vu();if(!n||!n.Qa())throw new Error(`The first element of the bundle is not a metadata object, it is
         ${JSON.stringify(n?.Wa)}`);this.metadata=n;do n=this.vu(),n!==null&&this.elements.push(n);while(n!==null)}getMetadata(){return this.metadata}ju(){return this.elements}vu(){if(this.cursor===this.bundleData.length)return null;const e=this.$u(),t=this.Qu(e);return new il(JSON.parse(t),e)}Qu(e){if(this.cursor+e>this.bundleData.length)throw new g(m.INTERNAL,"Reached the end of bundle when more is expected.");return this.bundleData.slice(this.cursor,this.cursor+=e)}$u(){const e=this.cursor;let t=this.cursor;for(;t<this.bundleData.length;){if(this.bundleData[t]==="{"){if(t===e)throw new Error("First character is a bracket and not a number");return this.cursor=t,Number(this.bundleData.slice(e,t))}t++}throw new Error("Reached the end of bundle when more is expected.")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pm=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new g(m.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await(async function(s,i){const o=E(s),a={documents:i.map((h=>ar(o.serializer,h)))},u=await o.zo("BatchGetDocuments",o.serializer.databaseId,D.emptyPath(),a,i.length),c=new Map;u.forEach((h=>{const d=Dd(o.serializer,h);c.set(d.key.toString(),d)}));const l=[];return i.forEach((h=>{const d=c.get(h.toString());v(!!d,55234,{key:h}),l.push(d)})),l})(this.datastore,e);return t.forEach((n=>this.recordVersion(n))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new An(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,n)=>{const s=T.fromPath(n);this.mutations.push(new Ni(s,this.precondition(s)))})),await(async function(n,s){const i=E(n),o={writes:s.map((a=>ur(i.serializer,a)))};await i.$o("Commit",i.serializer.databaseId,D.emptyPath(),o)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw A(50498,{Ju:e.constructor.name});t=R.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new g(m.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(R.min())?$.exists(!1):$.updateTime(t):$.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(R.min()))throw new g(m.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return $.updateTime(t)}return $.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ym{constructor(e,t,n,s,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=s,this.deferred=i,this.Hu=n.maxAttempts,this.F_=new Wi(this.asyncQueue,"transaction_retry")}Zu(){this.Hu-=1,this.Xu()}Xu(){this.F_.g_((async()=>{const e=new pm(this.datastore),t=this.Yu(e);t&&t.then((n=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(n)})).catch((s=>{this.ec(s)}))))})).catch((n=>{this.ec(n)}))}))}Yu(e){try{const t=this.updateFunction(e);return!dr(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}ec(e){this.Hu>0&&this.tc(e)?(this.Hu-=1,this.asyncQueue.enqueueAndForget((()=>(this.Xu(),Promise.resolve())))):this.deferred.reject(e)}tc(e){if(e?.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!uc(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ot="FirestoreClient";class Im{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=s,this.user=re.UNAUTHENTICATED,this.clientId=yi.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{p(ot,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(p(ot,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new ie;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=bn(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function zs(r,e){r.asyncQueue.verifyOperationInProgress(),p(ot,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await zc(e.localStore,s),n=s)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function Ba(r,e){r.asyncQueue.verifyOperationInProgress();const t=await ho(r);p(ot,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>Na(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>Na(e.remoteStore,s))),r._onlineComponents=e}async function ho(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){p(ot,"Using user provided OfflineComponentProvider");try{await zs(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===m.FAILED_PRECONDITION||s.code===m.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;Te("Error using user provided cache. Falling back to memory cache: "+t),await zs(r,new yn)}}else p(ot,"Using default OfflineComponentProvider"),await zs(r,new co(void 0));return r._offlineComponents}async function Vs(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(p(ot,"Using user provided OnlineComponentProvider"),await Ba(r,r._uninitializedComponentsProvider._online)):(p(ot,"Using default OnlineComponentProvider"),await Ba(r,new it))),r._onlineComponents}function _l(r){return ho(r).then((e=>e.persistence))}function Sn(r){return ho(r).then((e=>e.localStore))}function gl(r){return Vs(r).then((e=>e.remoteStore))}function fo(r){return Vs(r).then((e=>e.syncEngine))}function pl(r){return Vs(r).then((e=>e.datastore))}async function In(r){const e=await Vs(r),t=e.eventManager;return t.onListen=Hf.bind(null,e.syncEngine),t.onUnlisten=Yf.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Jf.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Xf.bind(null,e.syncEngine),t}function Tm(r){return r.asyncQueue.enqueue((async()=>{const e=await _l(r),t=await gl(r);return e.setNetworkEnabled(!0),(function(s){const i=E(s);return i.Va.delete(0),yr(i)})(t)}))}function Em(r){return r.asyncQueue.enqueue((async()=>{const e=await _l(r),t=await gl(r);return e.setNetworkEnabled(!1),(async function(s){const i=E(s);i.Va.add(0),await Rn(i),i.fa.set("Offline")})(t)}))}function wm(r,e,t,n){const s=new Rs(n),i=new no(e,s,t);return r.asyncQueue.enqueueAndForget((async()=>Zi(await In(r),i))),()=>{s.ku(),r.asyncQueue.enqueueAndForget((async()=>eo(await In(r),i)))}}function Am(r,e){const t=new ie;return r.asyncQueue.enqueueAndForget((async()=>(async function(s,i,o){try{const a=await(function(c,l){const h=E(c);return h.persistence.runTransaction("read document","readonly",(d=>h.localDocuments.getDocument(d,l)))})(s,i);a.isFoundDocument()?o.resolve(a):a.isNoDocument()?o.resolve(null):o.reject(new g(m.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(a){const u=bn(a,`Failed to get document '${i} from cache`);o.reject(u)}})(await Sn(r),e,t))),t.promise}function yl(r,e,t={}){const n=new ie;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,u,c){const l=new Rs({next:d=>{l.ku(),o.enqueueAndForget((()=>eo(i,h)));const _=d.docs.has(a);!_&&d.fromCache?c.reject(new g(m.UNAVAILABLE,"Failed to get document because the client is offline.")):_&&d.fromCache&&u&&u.source==="server"?c.reject(new g(m.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(d)},error:d=>c.reject(d)}),h=new no(En(a.path),l,{includeMetadataChanges:!0,$a:!0});return Zi(i,h)})(await In(r),r.asyncQueue,e,t,n))),n.promise}function vm(r,e){const t=new ie;return r.asyncQueue.enqueueAndForget((async()=>(async function(s,i,o){try{const a=await es(s,i,!0),u=new cl(i,a.Ls),c=u.ou(a.documents),l=u.applyChanges(c,!1);o.resolve(l.snapshot)}catch(a){const u=bn(a,`Failed to execute query '${i} against cache`);o.reject(u)}})(await Sn(r),e,t))),t.promise}function Il(r,e,t={}){const n=new ie;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,u,c){const l=new Rs({next:d=>{l.ku(),o.enqueueAndForget((()=>eo(i,h))),d.fromCache&&u.source==="server"?c.reject(new g(m.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(d)},error:d=>c.reject(d)}),h=new no(a,l,{includeMetadataChanges:!0,$a:!0});return Zi(i,h)})(await In(r),r.asyncQueue,e,t,n))),n.promise}function Rm(r,e,t){const n=new ie;return r.asyncQueue.enqueueAndForget((async()=>{try{const s=await pl(r);n.resolve((async function(o,a,u){const c=E(o),{request:l,ft:h,parent:d}=Ic(c.serializer,ju(a),u);c.connection.ko||delete l.parent;const _=(await c.zo("RunAggregationQuery",c.serializer.databaseId,d,l,1)).filter((y=>!!y.result));v(_.length===1,64727);const I=_[0].result?.aggregateFields;return Object.keys(I).reduce(((y,w)=>(y[h[w]]=I[w],y)),{})})(s,e,t))}catch(s){n.reject(s)}})),n.promise}function Vm(r,e){const t=new ie;return r.asyncQueue.enqueueAndForget((async()=>Zf(await fo(r),e,t))),t.promise}function Pm(r,e){const t=new Rs(e);return r.asyncQueue.enqueueAndForget((async()=>(function(s,i){E(s).Ma.add(i),i.next()})(await In(r),t))),()=>{t.ku(),r.asyncQueue.enqueueAndForget((async()=>(function(s,i){E(s).Ma.delete(i)})(await In(r),t)))}}function bm(r,e,t){const n=new ie;return r.asyncQueue.enqueueAndForget((async()=>{const s=await pl(r);new ym(r.asyncQueue,s,t,e,n).Zu()})),n.promise}function Sm(r,e,t,n){const s=(function(o,a){let u;return u=typeof o=="string"?lc().encode(o):o,(function(l,h){return new _m(l,h)})((function(l,h){if(l instanceof Uint8Array)return Ua(l,h);if(l instanceof ArrayBuffer)return Ua(new Uint8Array(l),h);if(l instanceof ReadableStream)return l.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")})(u),a)})(t,Mt(e));r.asyncQueue.enqueueAndForget((async()=>{mm(await fo(r),s,n)}))}function Cm(r,e){return r.asyncQueue.enqueue((async()=>(function(n,s){const i=E(n);return i.persistence.runTransaction("Get named query","readonly",(o=>i.hi.getNamedQuery(o,s)))})(await Sn(r),e)))}function Tl(r,e){return(function(n,s){return new gm(n,s)})(r,e)}function Dm(r,e){return r.asyncQueue.enqueue((async()=>(async function(n,s){const i=E(n),o=i.indexManager,a=[];return i.persistence.runTransaction("Configure indexes","readwrite",(u=>o.getFieldIndexes(u).next((c=>(function(h,d,_,I,y){h=[...h],d=[...d],h.sort(_),d.sort(_);const w=h.length,V=d.length;let C=0,S=0;for(;C<V&&S<w;){const K=_(h[S],d[C]);K<0?y(h[S++]):K>0?I(d[C++]):(C++,S++)}for(;C<V;)I(d[C++]);for(;S<w;)y(h[S++])})(c,s,gh,(l=>{a.push(o.addFieldIndex(u,l))}),(l=>{a.push(o.deleteFieldIndex(u,l))})))).next((()=>f.waitFor(a)))))})(await Sn(r),e)))}function xm(r,e){return r.asyncQueue.enqueue((async()=>(function(n,s){E(n).Ds.Rs=s})(await Sn(r),e)))}function Nm(r){return r.asyncQueue.enqueue((async()=>(function(t){const n=E(t),s=n.indexManager;return n.persistence.runTransaction("Delete All Indexes","readwrite",(i=>s.deleteAllFieldIndexes(i)))})(await Sn(r))))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function El(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const km="ComponentProvider",za=new Map;function Fm(r,e,t,n,s){return new Hh(r,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,El(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wl="firestore.googleapis.com",Ga=!0;class $a{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new g(m.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=wl,this.ssl=Ga}else this.host=e.host,this.ssl=e.ssl??Ga;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Sc;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Nc)throw new g(m.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}_h("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=El(e.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new g(m.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new g(m.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new g(m.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ir{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new $a({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new g(m.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new g(m.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new $a(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new ih;switch(n.type){case"firstParty":return new ch(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new g(m.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=za.get(t);n&&(p(km,"Removing Datastore"),za.delete(t),n.terminate())})(this),Promise.resolve()}}function Mm(r,e,t,n={}){r=x(r,Ir);const s=gi(e),i=r._getSettings(),o={...i,emulatorOptions:r._getEmulatorOptions()},a=`${e}:${t}`;s&&nu(`https://${a}`),i.host!==wl&&i.host!==a&&Te("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u={...i,host:a,ssl:s,emulatorOptions:n};if(!hr(u,o)&&(r._setSettings(u),n.mockUserToken)){let c,l;if(typeof n.mockUserToken=="string")c=n.mockUserToken,l=re.MOCK_USER;else{c=zl(n.mockUserToken,r._app?.options.projectId);const h=n.mockUserToken.sub||n.mockUserToken.user_id;if(!h)throw new g(m.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");l=new re(h)}r._authCredentials=new oh(new au(c,l))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new oe(this.firestore,e,this._query)}}class L{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new De(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new L(this.firestore,e,this._key)}toJSON(){return{type:L._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(kt(t,L._jsonSchema))return new L(e,n||null,new T(D.fromString(t.referencePath)))}}L._jsonSchemaVersion="firestore/documentReference/1.0",L._jsonSchema={type:X("string",L._jsonSchemaVersion),referencePath:X("string")};class De extends oe{constructor(e,t,n){super(e,t,En(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new L(this.firestore,null,new T(e))}withConverter(e){return new De(this.firestore,e,this._path)}}function g_(r,e,...t){if(r=ee(r),Ii("collection","path",e),r instanceof Ir){const n=D.fromString(e,...t);return xo(n),new De(r,null,n)}{if(!(r instanceof L||r instanceof De))throw new g(m.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(D.fromString(e,...t));return xo(n),new De(r.firestore,null,n)}}function p_(r,e){if(r=x(r,Ir),Ii("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new g(m.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new oe(r,null,(function(n){return new Ue(D.emptyPath(),n)})(e))}function Om(r,e,...t){if(r=ee(r),arguments.length===1&&(e=yi.newId()),Ii("doc","path",e),r instanceof Ir){const n=D.fromString(e,...t);return Do(n),new L(r,null,new T(n))}{if(!(r instanceof L||r instanceof De))throw new g(m.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(D.fromString(e,...t));return Do(n),new L(r.firestore,r instanceof De?r.converter:null,new T(n))}}function y_(r,e){return r=ee(r),e=ee(e),(r instanceof L||r instanceof De)&&(e instanceof L||e instanceof De)&&r.firestore===e.firestore&&r.path===e.path&&r.converter===e.converter}function Al(r,e){return r=ee(r),e=ee(e),r instanceof oe&&e instanceof oe&&r.firestore===e.firestore&&_r(r._query,e._query)&&r.converter===e.converter}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ka="AsyncQueue";class Qa{constructor(e=Promise.resolve()){this.nc=[],this.rc=!1,this.sc=[],this.oc=null,this._c=!1,this.ac=!1,this.uc=[],this.F_=new Wi(this,"async_queue_retry"),this.cc=()=>{const n=Ur();n&&p(Ka,"Visibility state changed to "+n.visibilityState),this.F_.y_()},this.lc=e;const t=Ur();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.cc)}get isShuttingDown(){return this.rc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.hc(),this.Pc(e)}enterRestrictedMode(e){if(!this.rc){this.rc=!0,this.ac=e||!1;const t=Ur();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.cc)}}enqueue(e){if(this.hc(),this.rc)return new Promise((()=>{}));const t=new ie;return this.Pc((()=>this.rc&&this.ac?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.nc.push(e),this.Tc())))}async Tc(){if(this.nc.length!==0){try{await this.nc[0](),this.nc.shift(),this.F_.reset()}catch(e){if(!ut(e))throw e;p(Ka,"Operation failed with retryable error: "+e)}this.nc.length>0&&this.F_.g_((()=>this.Tc()))}}Pc(e){const t=this.lc.then((()=>(this._c=!0,e().catch((n=>{throw this.oc=n,this._c=!1,W("INTERNAL UNHANDLED ERROR: ",ja(n)),n})).then((n=>(this._c=!1,n))))));return this.lc=t,t}enqueueAfterDelay(e,t,n){this.hc(),this.uc.indexOf(e)>-1&&(t=0);const s=Xi.createAndSchedule(this,e,t,n,(i=>this.Ic(i)));return this.sc.push(s),s}hc(){this.oc&&A(47125,{Ec:ja(this.oc)})}verifyOperationInProgress(){}async Rc(){let e;do e=this.lc,await e;while(e!==this.lc)}Ac(e){for(const t of this.sc)if(t.timerId===e)return!0;return!1}Vc(e){return this.Rc().then((()=>{this.sc.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.sc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Rc()}))}dc(e){this.uc.push(e)}Ic(e){const t=this.sc.indexOf(e);this.sc.splice(t,1)}}function ja(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(){this._progressObserver={},this._taskCompletionResolver=new ie,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I_=-1;class U extends Ir{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new Qa,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Qa(e),this._firestoreClient=void 0,await e}}}function T_(r,e,t){t||(t=nr);const n=ru(r,"firestore");if(n.isInitialized(t)){const s=n.getImmediate({identifier:t}),i=n.getOptions(t);if(hr(i,e))return s;throw new g(m.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new g(m.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Nc)throw new g(m.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&gi(e.host)&&nu(e.host),n.initialize({options:e,instanceIdentifier:t})}function E_(r,e){const t=typeof r=="object"?r:Gl(),n=typeof r=="string"?r:e||nr,s=ru(t,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=$l("firestore");i&&Mm(s,...i)}return s}function Q(r){if(r._terminated)throw new g(m.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||vl(r),r._firestoreClient}function vl(r){const e=r._freezeSettings(),t=Fm(r._databaseId,r._app?.options.appId||"",r._persistenceKey,r._app?.options.apiKey,e);r._componentsProvider||e.localCache?._offlineComponentProvider&&e.localCache?._onlineComponentProvider&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new Im(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(s){const i=s?._online.build();return{_offline:s?._offline.build(i),_online:i}})(r._componentsProvider))}function w_(r,e){Te("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=r._freezeSettings();return Rl(r,it.provider,{build:n=>new lo(n,t.cacheSizeBytes,e?.forceOwnership)}),Promise.resolve()}async function A_(r){Te("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const e=r._freezeSettings();Rl(r,it.provider,{build:t=>new ml(t,e.cacheSizeBytes)})}function Rl(r,e,t){if((r=x(r,U))._firestoreClient||r._terminated)throw new g(m.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(r._componentsProvider||r._getSettings().localCache)throw new g(m.FAILED_PRECONDITION,"SDK cache is already specified.");r._componentsProvider={_online:e,_offline:t},vl(r)}function v_(r){if(r._initialized&&!r._terminated)throw new g(m.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const e=new ie;return r._queue.enqueueAndForgetEvenWhileRestricted((async()=>{try{await(async function(n){if(!Se.v())return Promise.resolve();const s=n+qc;await Se.delete(s)})($i(r._databaseId,r._persistenceKey)),e.resolve()}catch(t){e.reject(t)}})),e.promise}function R_(r){return(function(t){const n=new ie;return t.asyncQueue.enqueueAndForget((async()=>rm(await fo(t),n))),n.promise})(Q(r=x(r,U)))}function V_(r){return Tm(Q(r=x(r,U)))}function P_(r){return Em(Q(r=x(r,U)))}function b_(r){return Kl(r.app,"firestore",r._databaseId.database),r._delete()}function Wa(r,e){const t=Q(r=x(r,U)),n=new Lm;return Sm(t,r._databaseId,e,n),n}function qm(r,e){return Cm(Q(r=x(r,U)),e).then((t=>t?new oe(r,null,t.query):null))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(e){this._byteString=e}static fromBase64String(e){try{return new pe(j.fromBase64String(e))}catch(t){throw new g(m.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new pe(j.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:pe._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(kt(e,pe._jsonSchema))return pe.fromBase64String(e.bytes)}}pe._jsonSchemaVersion="firestore/bytes/1.0",pe._jsonSchema={type:X("string",pe._jsonSchemaVersion),bytes:X("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cn{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new g(m.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new G(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function S_(){return new Cn(Ks)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new g(m.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new g(m.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return P(this._lat,e._lat)||P(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:xe._jsonSchemaVersion}}static fromJSON(e){if(kt(e,xe._jsonSchema))return new xe(e.latitude,e.longitude)}}xe._jsonSchemaVersion="firestore/geoPoint/1.0",xe._jsonSchema={type:X("string",xe._jsonSchemaVersion),latitude:X("number"),longitude:X("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:we._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(kt(e,we._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new we(e.vectorValues);throw new g(m.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}we._jsonSchemaVersion="firestore/vectorValue/1.0",we._jsonSchema={type:X("string",we._jsonSchemaVersion),vectorValues:X("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Um=/^__.*__$/;class Bm{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new ze(e,this.data,this.fieldMask,t,this.fieldTransforms):new wn(e,this.data,t,this.fieldTransforms)}}class Vl{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new ze(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Pl(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw A(40011,{dataSource:r})}}class Ps{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.mc(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new Ps({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}gc(e){const t=this.path?.child(e),n=this.i({path:t,arrayElement:!1});return n.yc(e),n}wc(e){const t=this.path?.child(e),n=this.i({path:t,arrayElement:!1});return n.mc(),n}Sc(e){return this.i({path:void 0,arrayElement:!0})}bc(e){return ss(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}mc(){if(this.path)for(let e=0;e<this.path.length;e++)this.yc(this.path.get(e))}yc(e){if(e.length===0)throw this.bc("Document fields must not be empty");if(Pl(this.dataSource)&&Um.test(e))throw this.bc('Document fields cannot begin and end with "__"')}}class zm{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||Mt(e)}V(e,t,n,s=!1){return new Ps({dataSource:e,methodName:t,targetDoc:n,path:G.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ot(r){const e=r._freezeSettings(),t=Mt(r._databaseId);return new zm(r._databaseId,!!e.ignoreUndefinedProperties,t)}function bs(r,e,t,n,s,i={}){const o=r.V(i.merge||i.mergeFields?2:0,e,t,s);wo("Data must be an object, but it was:",o,n);const a=Cl(n,o);let u,c;if(i.merge)u=new me(o.fieldMask),c=o.fieldTransforms;else if(i.mergeFields){const l=[];for(const h of i.mergeFields){const d=qe(e,h,t);if(!o.contains(d))throw new g(m.INVALID_ARGUMENT,`Field '${d}' is specified in your field mask but missing from your input data.`);xl(l,d)||l.push(d)}u=new me(l),c=o.fieldTransforms.filter((h=>u.covers(h.field)))}else u=null,c=o.fieldTransforms;return new Bm(new se(a),u,c)}class Tr extends $e{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.bc(`${this._methodName}() can only appear at the top level of your update data`):e.bc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Tr}}function bl(r,e,t){return new Ps({dataSource:3,targetDoc:e.settings.targetDoc,methodName:r._methodName,arrayElement:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class mo extends $e{_toFieldTransform(e){return new Ft(e.path,new ln)}isEqual(e){return e instanceof mo}}class _o extends $e{constructor(e,t){super(e),this.Cc=t}_toFieldTransform(e){const t=bl(this,e,!0),n=this.Cc.map((i=>Lt(i,t))),s=new bt(n);return new Ft(e.path,s)}isEqual(e){return e instanceof _o&&hr(this.Cc,e.Cc)}}class go extends $e{constructor(e,t){super(e),this.Cc=t}_toFieldTransform(e){const t=bl(this,e,!0),n=this.Cc.map((i=>Lt(i,t))),s=new St(n);return new Ft(e.path,s)}isEqual(e){return e instanceof go&&hr(this.Cc,e.Cc)}}class po extends $e{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=new Ct(e.serializer,ms(e.serializer,this.vc));return new Ft(e.path,t)}isEqual(e){return e instanceof po&&(this.vc===e.vc||Number.isNaN(this.vc)&&Number.isNaN(e.vc))}}class yo extends $e{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=new hn(e.serializer,ms(e.serializer,this.vc));return new Ft(e.path,t)}isEqual(e){return e instanceof yo&&(this.vc===e.vc||Number.isNaN(this.vc)&&Number.isNaN(e.vc))}}class Io extends $e{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=new dn(e.serializer,ms(e.serializer,this.vc));return new Ft(e.path,t)}isEqual(e){return e instanceof Io&&(this.vc===e.vc||Number.isNaN(this.vc)&&Number.isNaN(e.vc))}}function To(r,e,t,n){const s=r.V(1,e,t);wo("Data must be an object, but it was:",s,n);const i=[],o=se.empty();ct(n,((u,c)=>{const l=Ao(e,u,t);c=ee(c);const h=s.wc(l);if(c instanceof Tr)i.push(l);else{const d=Lt(c,h);d!=null&&(i.push(l),o.set(l,d))}}));const a=new me(i);return new Vl(o,a,s.fieldTransforms)}function Eo(r,e,t,n,s,i){const o=r.V(1,e,t),a=[qe(e,n,t)],u=[s];if(i.length%2!=0)throw new g(m.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<i.length;d+=2)a.push(qe(e,i[d])),u.push(i[d+1]);const c=[],l=se.empty();for(let d=a.length-1;d>=0;--d)if(!xl(c,a[d])){const _=a[d];let I=u[d];I=ee(I);const y=o.wc(_);if(I instanceof Tr)c.push(_);else{const w=Lt(I,y);w!=null&&(c.push(_),l.set(_,w))}}const h=new me(c);return new Vl(l,h,o.fieldTransforms)}function Sl(r,e,t,n=!1){return Lt(t,r.V(n?4:3,e))}function Lt(r,e){if(Dl(r=ee(r)))return wo("Unsupported field value:",e,r),Cl(r,e);if(r instanceof $e)return(function(n,s){if(!Pl(s.dataSource))throw s.bc(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.bc(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.bc("Nested arrays are not supported");return(function(n,s){const i=[];let o=0;for(const a of n){let u=Lt(a,s.Sc(o));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),o++}return{arrayValue:{values:i}}})(r,e)}return(function(n,s){if((n=ee(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return ms(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=F.fromDate(n);return{timestampValue:fn(s.serializer,i)}}if(n instanceof F){const i=new F(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:fn(s.serializer,i)}}if(n instanceof xe)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof pe)return{bytesValue:fc(s.serializer,n._byteString)};if(n instanceof L){const i=s.databaseId,o=n.firestore._databaseId;if(!o.isEqual(i))throw s.bc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Li(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof we)return(function(o,a){const u=o instanceof we?o.toArray():o;return{mapValue:{fields:{[Vi]:{stringValue:Pi},[an]:{arrayValue:{values:u.map((l=>{if(typeof l!="number")throw a.bc("VectorValues must only contain numeric values.");return fs(a.serializer,l)}))}}}}}})(n,s);if(vc(n))return n._toProto(s.serializer);throw s.bc(`Unsupported field value: ${is(n)}`)})(r,e)}function Cl(r,e){const t={};return bu(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ct(r,((n,s)=>{const i=Lt(s,e.gc(n));i!=null&&(t[n]=i)})),{mapValue:{fields:t}}}function Dl(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof F||r instanceof xe||r instanceof pe||r instanceof L||r instanceof $e||r instanceof we||vc(r))}function wo(r,e,t){if(!Dl(t)||!cu(t)){const n=is(t);throw n==="an object"?e.bc(r+" a custom object"):e.bc(r+" "+n)}}function qe(r,e,t){if((e=ee(e))instanceof Cn)return e._internalPath;if(typeof e=="string")return Ao(r,e);throw ss("Field path arguments must be of type string or ",r,!1,void 0,t)}const Gm=new RegExp("[~\\*/\\[\\]]");function Ao(r,e,t){if(e.search(Gm)>=0)throw ss(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Cn(...e.split("."))._internalPath}catch{throw ss(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function ss(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${n}`),o&&(u+=` in document ${s}`),u+=")"),new g(m.INVALID_ARGUMENT,a+r+u)}function xl(r,e){return r.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nl{convertValue(e,t="none"){switch(tt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return z(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Oe(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw A(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return ct(e,((s,i)=>{n[s]=this.convertValue(i,t)})),n}convertVectorValue(e){const t=e.fields?.[an].arrayValue?.values?.map((n=>z(n.doubleValue)));return new we(t)}convertGeoPoint(e){return new xe(z(e.latitude),z(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=hs(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(tr(e));default:return null}}convertTimestamp(e){const t=Me(e);return new F(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=D.fromString(e);v(Ac(n),9688,{name:e});const s=new Rt(n.get(1),n.get(3)),i=new T(n.popFirst(5));return s.isEqual(t)||W(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt extends Nl{constructor(e){super(),this.firestore=e}convertBytes(e){return new pe(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new L(this.firestore,null,t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function C_(){return new Tr("deleteField")}function D_(){return new mo("serverTimestamp")}function x_(...r){return new _o("arrayUnion",r)}function N_(...r){return new go("arrayRemove",r)}function k_(r){return new po("increment",r)}function F_(r){return new yo("minimum",r)}function M_(r){return new Io("maximum",r)}function O_(r){return new we(r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L_(r){const e=Q(x(r.firestore,U)),t=e._onlineComponents?.datastore.serializer;return t===void 0?null:ys(t,de(r._query)).dt}function q_(r,e){const t=Pu(e,((i,o)=>new ac(o,i.aggregateType,i._internalFieldPath))),n=Q(x(r.firestore,U)),s=n._onlineComponents?.datastore.serializer;return s===void 0?null:Ic(s,ju(r._query),t,!0).request}const Ha="@firebase/firestore",Ja="4.15.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yt(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1})(r,["next","error","complete"])}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class $m{constructor(e,t,n){this._userDataWriter=t,this._data=n,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}_fieldsProto(){return new se({mapValue:{fields:this._data}}).clone().value.mapValue.fields}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new L(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Km(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){return this._document?.data.clone().value.mapValue.fields??void 0}get(e){if(this._document){const t=this._document.data.field(qe("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Km extends lr{data(){return super.data()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kl(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new g(m.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class vo{}class Er extends vo{}function U_(r,e,...t){let n=[];e instanceof vo&&n.push(e),n=n.concat(t),(function(i){const o=i.filter((u=>u instanceof Dn)).length,a=i.filter((u=>u instanceof wr)).length;if(o>1||o>0&&a>0)throw new g(m.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const s of n)r=s._apply(r);return r}class wr extends Er{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new wr(e,t,n)}_apply(e){const t=this._parse(e);return Ml(e._query,t),new oe(e.firestore,e.converter,ti(e._query,t))}_parse(e){const t=Ot(e.firestore);return(function(i,o,a,u,c,l,h){let d;if(c.isKeyField()){if(l==="array-contains"||l==="array-contains-any")throw new g(m.INVALID_ARGUMENT,`Invalid Query. You can't perform '${l}' queries on documentId().`);if(l==="in"||l==="not-in"){Xa(h,l);const I=[];for(const y of h)I.push(Ya(u,i,y));d={arrayValue:{values:I}}}else d=Ya(u,i,h)}else l!=="in"&&l!=="not-in"&&l!=="array-contains-any"||Xa(h,l),d=Sl(a,o,h,l==="in"||l==="not-in");return N.create(c,l,d)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function B_(r,e,t){const n=e,s=qe("where",r);return wr._create(s,n,t)}class Dn extends vo{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Dn(e,t)}_parse(e){const t=this._queryConstraints.map((n=>n._parse(e))).filter((n=>n.getFilters().length>0));return t.length===1?t[0]:M.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s;const a=i.getFlattenedFilters();for(const u of a)Ml(o,u),o=ti(o,u)})(e._query,t),new oe(e.firestore,e.converter,ti(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function z_(...r){return r.forEach((e=>Ol("or",e))),Dn._create("or",r)}function G_(...r){return r.forEach((e=>Ol("and",e))),Dn._create("and",r)}class Ro extends Er{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Ro(e,t)}_apply(e){const t=(function(s,i,o){if(s.startAt!==null)throw new g(m.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new g(m.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new or(i,o)})(e._query,this._field,this._direction);return new oe(e.firestore,e.converter,ud(e._query,t))}}function $_(r,e="asc"){const t=e,n=qe("orderBy",r);return Ro._create(n,t)}class Ss extends Er{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new Ss(e,t,n)}_apply(e){return new oe(e.firestore,e.converter,Wr(e._query,this._limit,this._limitType))}}function K_(r){return lu("limit",r),Ss._create("limit",r,"F")}function Q_(r){return lu("limitToLast",r),Ss._create("limitToLast",r,"L")}class Cs extends Er{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Cs(e,t,n)}_apply(e){const t=Fl(e,this.type,this._docOrFields,this._inclusive);return new oe(e.firestore,e.converter,cd(e._query,t))}}function j_(...r){return Cs._create("startAt",r,!0)}function W_(...r){return Cs._create("startAfter",r,!1)}class Ds extends Er{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Ds(e,t,n)}_apply(e){const t=Fl(e,this.type,this._docOrFields,this._inclusive);return new oe(e.firestore,e.converter,ld(e._query,t))}}function H_(...r){return Ds._create("endBefore",r,!1)}function J_(...r){return Ds._create("endAt",r,!0)}function Fl(r,e,t,n){if(t[0]=ee(t[0]),t[0]instanceof lr)return(function(i,o,a,u,c){if(!u)throw new g(m.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${a}().`);const l=[];for(const h of Ht(i))if(h.field.isKeyField())l.push(Vt(o,u.key));else{const d=u.data.field(h.field);if(ls(d))throw new g(m.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+h.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(d===null){const _=h.field.canonicalString();throw new g(m.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${_}' (used as the orderBy) does not exist.`)}l.push(d)}return new rt(l,c)})(r._query,r.firestore._databaseId,e,t[0]._document,n);{const s=Ot(r.firestore);return(function(o,a,u,c,l,h){const d=o.explicitOrderBy;if(l.length>d.length)throw new g(m.INVALID_ARGUMENT,`Too many arguments provided to ${c}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const _=[];for(let I=0;I<l.length;I++){const y=l[I];if(d[I].field.isKeyField()){if(typeof y!="string")throw new g(m.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${c}(), but got a ${typeof y}`);if(!Si(o)&&y.indexOf("/")!==-1)throw new g(m.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${c}() must be a plain document ID, but '${y}' contains a slash.`);const w=o.path.child(D.fromString(y));if(!T.isDocumentKey(w))throw new g(m.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${c}() must result in a valid document path, but '${w}' is not because it contains an odd number of segments.`);const V=new T(w);_.push(Vt(a,V))}else{const w=Sl(u,c,y);_.push(w)}}return new rt(_,h)})(r._query,r.firestore._databaseId,s,e,t,n)}}function Ya(r,e,t){if(typeof(t=ee(t))=="string"){if(t==="")throw new g(m.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Si(e)&&t.indexOf("/")!==-1)throw new g(m.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(D.fromString(t));if(!T.isDocumentKey(n))throw new g(m.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return Vt(r,new T(n))}if(t instanceof L)return Vt(r,t._key);throw new g(m.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${is(t)}.`)}function Xa(r,e){if(!Array.isArray(r)||r.length===0)throw new g(m.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Ml(r,e){const t=(function(s,i){for(const o of s)for(const a of o.getFlattenedFilters())if(i.indexOf(a.op)>=0)return a.op;return null})(r.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new g(m.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new g(m.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function Ol(r,e){if(!(e instanceof wr||e instanceof Dn))throw new g(m.INVALID_ARGUMENT,`Function ${r}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}function xs(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}class Vo extends Nl{constructor(e){super(),this.firestore=e}convertBytes(e){return new pe(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new L(this.firestore,null,t)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y_(r){return new cr("sum",qe("sum",r))}function X_(r){return new cr("avg",qe("average",r))}function Qm(){return new cr("count")}function Z_(r,e){return r instanceof cr&&e instanceof cr&&r.aggregateType===e.aggregateType&&r._internalFieldPath?.canonicalString()===e._internalFieldPath?.canonicalString()}function eg(r,e){return Al(r.query,e.query)&&hr(r.data(),e.data())}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tg(r){return jm(r,{count:Qm()})}function jm(r,e){const t=x(r.firestore,U),n=Q(t),s=Pu(e,((i,o)=>new ac(o,i.aggregateType,i._internalFieldPath)));return Rm(n,r._query,s).then((i=>(function(a,u,c){const l=new dt(a);return new $m(u,l,c)})(t,r,i)))}class Wm{constructor(e){this.kind="memory",this._onlineComponentProvider=it.provider,this._offlineComponentProvider=e?.garbageCollector?e.garbageCollector._offlineComponentProvider:{build:()=>new co(void 0)}}toJSON(){return{kind:this.kind}}}class Hm{constructor(e){let t;this.kind="persistent",e?.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=e_(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class Jm{constructor(){this.kind="memoryEager",this._offlineComponentProvider=yn.provider}toJSON(){return{kind:this.kind}}}class Ym{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new co(e)}}toJSON(){return{kind:this.kind}}}function ng(){return new Jm}function rg(r){return new Ym(r?.cacheSizeBytes)}function sg(r){return new Wm(r)}function ig(r){return new Hm(r)}class Xm{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=it.provider,this._offlineComponentProvider={build:t=>new lo(t,e?.cacheSizeBytes,this.forceOwnership)}}}class Zm{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=it.provider,this._offlineComponentProvider={build:t=>new ml(t,e?.cacheSizeBytes)}}}function e_(r){return new Xm(r?.forceOwnership)}function og(){return new Zm}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ll="NOT SUPPORTED";class Ye{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ye extends lr{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Br(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(qe("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new g(m.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=ye._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}function ag(r,e,t){if(kt(e,ye._jsonSchema)){if(e.bundle===Ll)throw new g(m.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const n=Mt(r._databaseId),s=Tl(e.bundle,n),i=s.ju(),o=new ro(s.getMetadata(),n);for(const l of i)o.Ja(l);const a=o.documents;if(a.length!==1)throw new g(m.INVALID_ARGUMENT,`Expected bundle data to contain 1 document, but it contains ${a.length} documents.`);const u=ps(n,a[0].document),c=new T(D.fromString(e.bundleName));return new ye(r,new Vo(r),c,u,new Ye(!1,!1),t||null)}}ye._jsonSchemaVersion="firestore/documentSnapshot/1.0",ye._jsonSchema={type:X("string",ye._jsonSchemaVersion),bundleSource:X("string","DocumentSnapshot"),bundleName:X("string"),bundle:X("string")};class Br extends ye{data(e={}){return super.data(e)}}class Ie{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Ye(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new Br(this._firestore,this._userDataWriter,n.key,n,new Ye(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new g(m.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((a=>{const u=new Br(s._firestore,s._userDataWriter,a.doc.key,a.doc,new Ye(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);return a.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((a=>i||a.type!==3)).map((a=>{const u=new Br(s._firestore,s._userDataWriter,a.doc.key,a.doc,new Ye(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);let c=-1,l=-1;return a.type!==0&&(c=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),l=o.indexOf(a.doc.key)),{type:t_(a.type),doc:u,oldIndex:c,newIndex:l}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new g(m.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Ie._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=yi.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function ug(r,e,t){if(kt(e,Ie._jsonSchema)){if(e.bundle===Ll)throw new g(m.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const n=Mt(r._databaseId),s=Tl(e.bundle,n),i=s.ju(),o=new ro(s.getMetadata(),n);for(const d of i)o.Ja(d);if(o.queries.length!==1)throw new g(m.INVALID_ARGUMENT,`Snapshot data expected 1 query but found ${o.queries.length} queries.`);const a=Is(o.queries[0].bundledQuery),u=o.documents;let c=new vt;u.map((d=>{const _=ps(n,d.document);c=c.add(_)}));const l=Nt.fromInitialDocuments(a,c,b(),!1,!1),h=new oe(r,t||null,a);return new Ie(r,new Vo(r),h,l)}}function t_(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return A(61501,{type:r})}}function cg(r,e){return r instanceof ye&&e instanceof ye?r._firestore===e._firestore&&r._key.isEqual(e._key)&&(r._document===null?e._document===null:r._document.isEqual(e._document))&&r._converter===e._converter:r instanceof Ie&&e instanceof Ie&&r._firestore===e._firestore&&Al(r.query,e.query)&&r.metadata.isEqual(e.metadata)&&r._snapshot.isEqual(e._snapshot)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ie._jsonSchemaVersion="firestore/querySnapshot/1.0",Ie._jsonSchema={type:X("string",Ie._jsonSchemaVersion),bundleSource:X("string","QuerySnapshot"),bundleName:X("string"),bundle:X("string")};const n_={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r_{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Ot(e)}set(e,t,n){this._verifyNotCommitted();const s=Xe(e,this._firestore),i=xs(s.converter,t,n),o=bs(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(o.toMutation(s._key,$.none())),this}update(e,t,n,...s){this._verifyNotCommitted();const i=Xe(e,this._firestore);let o;return o=typeof(t=ee(t))=="string"||t instanceof Cn?Eo(this._dataReader,"WriteBatch.update",i._key,t,n,s):To(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(o.toMutation(i._key,$.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Xe(e,this._firestore);return this._mutations=this._mutations.concat(new An(t._key,$.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new g(m.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Xe(r,e){if((r=ee(r)).firestore!==e)throw new g(m.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s_{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=Ot(e)}get(e){const t=Xe(e,this._firestore),n=new Vo(this._firestore);return this._transaction.lookup([t._key]).then((s=>{if(!s||s.length!==1)return A(24041);const i=s[0];if(i.isFoundDocument())return new lr(this._firestore,n,i.key,i,t.converter);if(i.isNoDocument())return new lr(this._firestore,n,t._key,null,t.converter);throw A(18433,{doc:i})}))}set(e,t,n){const s=Xe(e,this._firestore),i=xs(s.converter,t,n),o=bs(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,n);return this._transaction.set(s._key,o),this}update(e,t,n,...s){const i=Xe(e,this._firestore);let o;return o=typeof(t=ee(t))=="string"||t instanceof Cn?Eo(this._dataReader,"Transaction.update",i._key,t,n,s):To(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,o),this}delete(e){const t=Xe(e,this._firestore);return this._transaction.delete(t._key),this}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i_ extends s_{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Xe(e,this._firestore),n=new dt(this._firestore);return super.get(e).then((s=>new ye(this._firestore,n,t._key,s._document,new Ye(!1,!1),t.converter)))}}function lg(r,e,t){r=x(r,U);const n={...n_,...t};(function(o){if(o.maxAttempts<1)throw new g(m.INVALID_ARGUMENT,"Max attempts must be at least 1")})(n);const s=Q(r);return bm(s,(i=>e(new i_(r,i))),n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hg(r){r=x(r,L);const e=x(r.firestore,U),t=Q(e);return yl(t,r._key).then((n=>Po(e,r,n)))}function dg(r){r=x(r,L);const e=x(r.firestore,U),t=Q(e),n=new dt(e);return Am(t,r._key).then((s=>new ye(e,n,r._key,s,new Ye(s!==null&&s.hasLocalMutations,!0),r.converter)))}function fg(r){r=x(r,L);const e=x(r.firestore,U),t=Q(e);return yl(t,r._key,{source:"server"}).then((n=>Po(e,r,n)))}function mg(r){r=x(r,oe);const e=x(r.firestore,U),t=Q(e),n=new dt(e);return kl(r._query),Il(t,r._query).then((s=>new Ie(e,n,r,s)))}function _g(r){r=x(r,oe);const e=x(r.firestore,U),t=Q(e),n=new dt(e);return vm(t,r._query).then((s=>new Ie(e,n,r,s)))}function gg(r){r=x(r,oe);const e=x(r.firestore,U),t=Q(e),n=new dt(e);return Il(t,r._query,{source:"server"}).then((s=>new Ie(e,n,r,s)))}function pg(r,e,t){r=x(r,L);const n=x(r.firestore,U),s=xs(r.converter,e,t),i=Ot(n);return Ar(n,[bs(i,"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,$.none())])}function yg(r,e,t,...n){r=x(r,L);const s=x(r.firestore,U),i=Ot(s);let o;return o=typeof(e=ee(e))=="string"||e instanceof Cn?Eo(i,"updateDoc",r._key,e,t,n):To(i,"updateDoc",r._key,e),Ar(s,[o.toMutation(r._key,$.exists(!0))])}function Ig(r){return Ar(x(r.firestore,U),[new An(r._key,$.none())])}function Tg(r,e){const t=x(r.firestore,U),n=Om(r),s=xs(r.converter,e),i=Ot(r.firestore);return Ar(t,[bs(i,"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,$.exists(!1))]).then((()=>n))}function Za(r,...e){r=ee(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||Yt(e[n])||(t=e[n++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Yt(e[n])){const c=e[n];e[n]=c.next?.bind(c),e[n+1]=c.error?.bind(c),e[n+2]=c.complete?.bind(c)}let i,o,a;if(r instanceof L)o=x(r.firestore,U),a=En(r._key.path),i={next:c=>{e[n]&&e[n](Po(o,r,c))},error:e[n+1],complete:e[n+2]};else{const c=x(r,oe);o=x(c.firestore,U),a=c._query;const l=new dt(o);i={next:h=>{e[n]&&e[n](new Ie(o,l,c,h))},error:e[n+1],complete:e[n+2]},kl(r._query)}const u=Q(o);return wm(u,a,s,i)}function Eg(r,e,...t){const n=ee(r),s=(function(u){const c={bundle:"",bundleName:"",bundleSource:""},l=["bundle","bundleName","bundleSource"];for(const h of l){if(!(h in u)){c.error=`snapshotJson missing required field: ${h}`;break}const d=u[h];if(typeof d!="string"){c.error=`snapshotJson field '${h}' must be a string.`;break}if(d.length===0){c.error=`snapshotJson field '${h}' cannot be an empty string.`;break}h==="bundle"?c.bundle=d:h==="bundleName"?c.bundleName=d:h==="bundleSource"&&(c.bundleSource=d)}return c})(e);if(s.error)throw new g(m.INVALID_ARGUMENT,s.error);let i,o=0;if(typeof t[o]!="object"||Yt(t[o])||(i=t[o++]),s.bundleSource==="QuerySnapshot"){let a=null;if(typeof t[o]=="object"&&Yt(t[o])){const u=t[o++];a={next:u.next,error:u.error,complete:u.complete}}else a={next:t[o++],error:t[o++],complete:t[o++]};return(function(c,l,h,d,_){let I,y=!1;return Wa(c,l.bundle).then((()=>qm(c,l.bundleName))).then((V=>{V&&!y&&(_&&V.withConverter(_),I=Za(V,h||{},d))})).catch((V=>(d.error&&d.error(V),()=>{}))),()=>{y||(y=!0,I&&I())}})(n,s,i,a,t[o])}if(s.bundleSource==="DocumentSnapshot"){let a=null;if(typeof t[o]=="object"&&Yt(t[o])){const u=t[o++];a={next:u.next,error:u.error,complete:u.complete}}else a={next:t[o++],error:t[o++],complete:t[o++]};return(function(c,l,h,d,_){let I,y=!1;return Wa(c,l.bundle).then((()=>{if(!y){const V=new L(c,_||null,T.fromPath(l.bundleName));I=Za(V,h||{},d)}})).catch((V=>(d.error&&d.error(V),()=>{}))),()=>{y||(y=!0,I&&I())}})(n,s,i,a,t[o])}throw new g(m.INVALID_ARGUMENT,`unsupported bundle source: ${s.bundleSource}`)}function wg(r,e){r=x(r,U);const t=Q(r),n=Yt(e)?e:{next:e};return Pm(t,n)}function Ar(r,e){const t=Q(r);return Vm(t,e)}function Po(r,e,t){const n=t.docs.get(e._key),s=new dt(r);return new ye(r,s,e._key,n,new Ye(t.hasPendingWrites,t.fromCache),e.converter)}function Ag(r){return r=x(r,U),Q(r),new r_(r,(e=>Ar(r,e)))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vg(r,e){r=x(r,U);const t=Q(r);if(!t._uninitializedComponentsProvider||t._uninitializedComponentsProvider._offline.kind==="memory")return Te("Cannot enable indexes when persistence is disabled"),Promise.resolve();const n=(function(i){const o=typeof i=="string"?(function(c){try{return JSON.parse(c)}catch(l){throw new g(m.INVALID_ARGUMENT,"Failed to parse JSON: "+l?.message)}})(i):i,a=[];if(Array.isArray(o.indexes))for(const u of o.indexes){const c=eu(u,"collectionGroup"),l=[];if(Array.isArray(u.fields))for(const h of u.fields){const d=eu(h,"fieldPath"),_=Ao("setIndexConfiguration",d);h.arrayConfig==="CONTAINS"?l.push(new wt(_,2)):h.order==="ASCENDING"?l.push(new wt(_,0)):h.order==="DESCENDING"&&l.push(new wt(_,1))}a.push(new en(en.UNKNOWN_ID,c,l,tn.empty()))}return a})(e);return Dm(t,n)}function eu(r,e){if(typeof r[e]!="string")throw new g(m.INVALID_ARGUMENT,"Missing string value for: "+e);return r[e]}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o_{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function Rg(r){r=x(r,U);const e=tu.get(r);if(e)return e;if(Q(r)._uninitializedComponentsProvider?._offline.kind!=="persistent")return null;const n=new o_(r);return tu.set(r,n),n}function Vg(r){ql(r,!0)}function Pg(r){ql(r,!1)}function bg(r){const e=Q(r._firestore);Nm(e).then((t=>p("deleting all persistent cache indexes succeeded"))).catch((t=>Te("deleting all persistent cache indexes failed",t)))}function ql(r,e){const t=Q(r._firestore);xm(t,e).then((n=>p(`setting persistent cache index auto creation isEnabled=${e} succeeded`))).catch((n=>Te(`setting persistent cache index auto creation isEnabled=${e} failed`,n)))}const tu=new WeakMap;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sg{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return bo.instance.onExistenceFilterMismatch(e)}}class bo{constructor(){this.t=new Map}static get instance(){return Dr||(Dr=new bo,Ad(Dr)),Dr}o(e){this.t.forEach((t=>t(e)))}onExistenceFilterMismatch(e){const t=Symbol(),n=this.t;return n.set(t,e),()=>n.delete(t)}}let Dr=null;(function(e,t=!0){sh(rh),th(new nh("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),a=new U(new ah(n.getProvider("auth-internal")),new lh(o,n.getProvider("app-check-internal")),Jh(o,s),o);return i={useFetchStreams:t,...i},a._setSettings(i),a}),"PUBLIC").setMultipleInstances(!0)),Co(Ha,Ja,e),Co(Ha,Ja,"esm2020")})();export{Nl as AbstractUserDataWriter,cr as AggregateField,$m as AggregateQuerySnapshot,pe as Bytes,I_ as CACHE_SIZE_UNLIMITED,De as CollectionReference,L as DocumentReference,ye as DocumentSnapshot,Cn as FieldPath,$e as FieldValue,U as Firestore,g as FirestoreError,xe as GeoPoint,Lm as LoadBundleTask,o_ as PersistentCacheIndexManager,oe as Query,Dn as QueryCompositeFilterConstraint,Er as QueryConstraint,Br as QueryDocumentSnapshot,Ds as QueryEndAtConstraint,wr as QueryFieldFilterConstraint,Ss as QueryLimitConstraint,Ro as QueryOrderByConstraint,Ie as QuerySnapshot,Cs as QueryStartAtConstraint,Ye as SnapshotMetadata,F as Timestamp,i_ as Transaction,we as VectorValue,r_ as WriteBatch,yi as _AutoId,j as _ByteString,Rt as _DatabaseId,T as _DocumentKey,d_ as _EmptyAppCheckTokenProvider,ih as _EmptyAuthCredentialsProvider,G as _FieldPath,Sg as _TestingHooks,x as _cast,h_ as _debugAssert,q_ as _internalAggregationQueryToProtoRunAggregationQueryRequest,L_ as _internalQueryToProtoQueryTarget,m_ as _isBase64Available,Te as _logWarn,_h as _validateIsNotUsedTogether,Tg as addDoc,Z_ as aggregateFieldEqual,eg as aggregateQuerySnapshotEqual,G_ as and,N_ as arrayRemove,x_ as arrayUnion,X_ as average,v_ as clearIndexedDbPersistence,g_ as collection,p_ as collectionGroup,Mm as connectFirestoreEmulator,Qm as count,bg as deleteAllPersistentCacheIndexes,Ig as deleteDoc,C_ as deleteField,P_ as disableNetwork,Pg as disablePersistentCacheIndexAutoCreation,Om as doc,S_ as documentId,ag as documentSnapshotFromJSON,w_ as enableIndexedDbPersistence,A_ as enableMultiTabIndexedDbPersistence,V_ as enableNetwork,Vg as enablePersistentCacheIndexAutoCreation,J_ as endAt,H_ as endBefore,Q as ensureFirestoreConfigured,Ar as executeWrite,jm as getAggregateFromServer,tg as getCountFromServer,hg as getDoc,dg as getDocFromCache,fg as getDocFromServer,mg as getDocs,_g as getDocsFromCache,gg as getDocsFromServer,E_ as getFirestore,Rg as getPersistentCacheIndexManager,k_ as increment,T_ as initializeFirestore,K_ as limit,Q_ as limitToLast,Wa as loadBundle,M_ as maximum,ng as memoryEagerGarbageCollector,sg as memoryLocalCache,rg as memoryLruGarbageCollector,F_ as minimum,qm as namedQuery,Za as onSnapshot,Eg as onSnapshotResume,wg as onSnapshotsInSync,z_ as or,$_ as orderBy,ig as persistentLocalCache,og as persistentMultipleTabManager,e_ as persistentSingleTabManager,U_ as query,Al as queryEqual,ug as querySnapshotFromJSON,y_ as refEqual,lg as runTransaction,D_ as serverTimestamp,pg as setDoc,vg as setIndexConfiguration,l_ as setLogLevel,cg as snapshotEqual,W_ as startAfter,j_ as startAt,Y_ as sum,b_ as terminate,yg as updateDoc,O_ as vector,R_ as waitForPendingWrites,B_ as where,Ag as writeBatch};
