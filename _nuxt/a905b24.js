(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{235:function(t,r){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},236:function(t,r,e){var content=e(242);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(27).default)("4c91ffca",content,!0,{sourceMap:!1})},237:function(t,r,e){"use strict";e.r(r);var n={props:{tag:{type:String,required:!0}}},o=(e(241),e(18)),component=Object(o.a)(n,(function(){var t=this.$createElement;return(this._self._c||t)("nuxt-link",{class:this.tag,attrs:{to:{name:"index",query:{tag:this.tag}}}},[this._v(this._s(this.tag))])}),[],!1,null,"bd9c730a",null);r.default=component.exports},238:function(t,r,e){"use strict";var n=e(2),o=e(239).trim;n({target:"String",proto:!0,forced:e(240)("trim")},{trim:function(){return o(this)}})},239:function(t,r,e){var n=e(15),o="["+e(235)+"]",c=RegExp("^"+o+o+"*"),l=RegExp(o+o+"*$"),f=function(t){return function(r){var e=String(n(r));return 1&t&&(e=e.replace(c,"")),2&t&&(e=e.replace(l,"")),e}};t.exports={start:f(1),end:f(2),trim:f(3)}},240:function(t,r,e){var n=e(6),o=e(235);t.exports=function(t){return n((function(){return!!o[t]()||"​᠎"!="​᠎"[t]()||o[t].name!==t}))}},241:function(t,r,e){"use strict";e(236)},242:function(t,r,e){(r=e(26)(!1)).push([t.i,'a[data-v-bd9c730a]{padding:.25rem;margin:.25rem;border-width:2px;border-radius:.5rem;border-color:currentColor;font-family:Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}a[data-v-bd9c730a]:before{content:"#"}.vue[data-v-bd9c730a]{color:#35495e;background-color:#41b883}.github[data-v-bd9c730a]{color:#000;background-color:#fff}.react[data-v-bd9c730a]{color:#61dafb;background-color:#282c34}.javascript[data-v-bd9c730a]{color:#000;background-color:#fcdc00}.typescript[data-v-bd9c730a]{color:#fff;background-color:#007acc}.redux[data-v-bd9c730a]{color:#fff;background-color:#764abc;border-color:#000}.opensource[data-v-bd9c730a]{color:#fff;background-color:green}',""]),t.exports=r},266:function(t,r,e){"use strict";e.r(r);e(28),e(33),e(76),e(238),e(23);var n=e(5),o={asyncData:function(t){return Object(n.a)(regeneratorRuntime.mark((function r(){var e,n,article;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return e=t.$content,n=t.params,r.next=3,e("articles",n.slug).fetch();case 3:return article=r.sent,r.abrupt("return",{article:article});case 5:case"end":return r.stop()}}),r)})))()},computed:{tags:function(){return this.article.tags.split(",").map((function(t){return t.trim()}))}},methods:{formatDate:function(t){return new Date(t).toLocaleDateString("en",{year:"numeric",month:"long",day:"numeric"})}}},c=e(18),component=Object(c.a)(o,(function(){var t=this,r=t.$createElement,e=t._self._c||r;return e("div",[e("img",{staticClass:"border-2 rounded-lg",attrs:{src:t.article.cover_image}}),t._v(" "),e("h1",{staticClass:"color-primary text-3xl font-extrabold my-1"},[t._v("\n    "+t._s(t.article.title)+"\n  ")]),t._v(" "),e("div",{staticClass:"m-2 flex flex-wrap"},t._l(t.tags,(function(t){return e("ArticleTag",{key:t,attrs:{tag:t}})})),1),t._v(" "),e("nuxt-content",{staticClass:"my-2",attrs:{document:t.article}})],1)}),[],!1,null,null,null);r.default=component.exports;installComponents(component,{ArticleTag:e(237).default})}}]);